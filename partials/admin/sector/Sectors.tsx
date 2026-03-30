import {
    ActionButton,
    Button,
    Card,
    EmptyData,
    Filter,
    LoadingAnimation,
    SectorFilters,
    Table,
    TableAction,
    TableActionOption,
    TechnicalError,
} from '@components'
import { PageHeading } from '@components/headings'
import { ColumnDef } from '@tanstack/react-table'
import { FaBook, FaEdit, FaFileExport, FaTrash } from 'react-icons/fa'

import { useContextBar, useNavbar } from '@hooks'
import { AdminApi } from '@queries'
import { Sector, SectorFilterTypes } from '@types'
import { getFilterQuery } from '@utils'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { SectorViewCB } from './contextBar'
import { AddNoteModal, DeleteModal, ViewNoteModal } from './modals'
import { AiOutlineCluster } from 'react-icons/ai'

const filterKeys = ['code', 'name']

export const Sectors = () => {
    const router = useRouter()
    const contextBar = useContextBar()
    const [modal, setModal] = useState<ReactElement | null>(null)
    const navBar = useNavbar()

    useEffect(() => {
        navBar.setTitle('Sectors')

        return () => {
            navBar.setTitle('')
        }
    }, [])

    const [filterAction, setFilterAction] = useState(null)
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const [filter, setFilter] = useState<SectorFilterTypes>(
        {} as SectorFilterTypes
    )

    useEffect(() => {
        const query = getFilterQuery<SectorFilterTypes>({ router, filterKeys })
        setFilter(query as SectorFilterTypes)
    }, [router])

    const { isLoading, data, isError } = AdminApi.Sectors.useListQuery({
        search: `${JSON.stringify(filter)
            .replaceAll('{', '')
            .replaceAll('}', '')
            .replaceAll('"', '')
            .trim()}`,
        skip: itemPerPage * page - itemPerPage,
        limit: itemPerPage,
    })

    const onModalCancelClicked = () => {
        setModal(null)
    }

    const onDeleteClicked = (sector: Sector) => {
        setModal(
            <DeleteModal
                sector={sector}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }

    useEffect(() => {
        contextBar.hide()
    }, [])

    const tableActionOptions: TableActionOption<any>[] = [
        {
            text: 'Edit',
            onClick: (item: any) => {
                router.push(`/portals/admin/sectors/form/${item.id}`)
            },
            Icon: FaEdit,
        },
        {
            text: 'Cluster',
            onClick: (item: any) => {
                router.push(`/portals/admin/sectors/cluster/${item.id}`)
            },
            Icon: AiOutlineCluster,
        },
        {
            text: 'Delete',
            onClick: (item: Sector) => onDeleteClicked(item),
            Icon: FaTrash,
            color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
        },
    ]

    const onSectorView = (sector: Sector) => {
        contextBar.show()
        contextBar.setTitle('Sevtor View')
        contextBar.setContent(<SectorViewCB sector={sector} />)
    }

    const onAddNote = (sector: Sector) => {
        setModal(
            <AddNoteModal
                sector={sector}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }
    const onViewNote = (sector: Sector) => {
        setModal(
            <ViewNoteModal
                sector={sector}
                onAddNote={onAddNote}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }

    const columns: ColumnDef<Sector>[] = [
        {
            accessorKey: 'name',
            cell: (info) => {
                return (
                    <div
                        className="cursor-pointer"
                        onClick={() => {
                            onSectorView(info?.row?.original)
                        }}
                    >
                        <p className="text-xs font-medium text-gray-500">
                            {info.row.original.code}
                        </p>
                        <p className="font-semibold">
                            {info.row.original.name}
                        </p>
                    </div>
                )
            },
            header: () => <span>Name</span>,
        },
        {
            accessorKey: 'courses',
            header: () => <span>Courses</span>,
            cell: (info) => {
                return (
                    <div className="relative group w-fit">
                        <span className="font-semibold text-gray-400 cursor-pointer">
                            {info.row.original.courses.length}
                        </span>
                        {info.row.original.courses.length ? (
                            <ul className="bg-white p-2 rounded-xl shadow-xl absolute left-0 z-10 hidden group-hover:block">
                                {info.row.original.courses.map((c) => (
                                    <li className="font-medium flex gap-x-2">
                                        <div className="flex flex-col items-center justify-start">
                                            <div className="w-6 h-6 flex-shrink-0 bg-indigo-500 text-indigo-100 rounded-full flex items-center justify-center">
                                                <FaBook />
                                            </div>
                                            <div className="h-full w-px bg-gray-400"></div>
                                        </div>
                                        <div className="pb-3">
                                            <div className="text-gray-400 text-xs">
                                                {c.code}
                                            </div>
                                            <div className="text-sm whitespace-nowrap">
                                                {c.title}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                )
            },
        },
        {
            accessorKey: 'status',
            header: () => <span>Status</span>,
            cell: (info) => {
                return info.row.original.isActive ? (
                    <span className="text-[11px] uppercase bg-green-200 text-green-700 px-2 font-medium rounded-full">
                        Published
                    </span>
                ) : (
                    <span>Unpublished</span>
                )
            },
        },
        {
            accessorKey: 'note',
            header: () => <span>Non eligible workplace</span>,
            cell: (info) => (
                <div className="flex items-center gap-x-2">
                    {info?.row?.original?.keywords &&
                    info?.row?.original?.keywords?.length > 0 ? (
                        <ActionButton
                            text="View"
                            variant="info"
                            onClick={() => {
                                onViewNote(info?.row?.original)
                            }}
                        />
                    ) : (
                        <ActionButton
                            text="Add"
                            variant="info"
                            onClick={() => {
                                onAddNote(info?.row?.original)
                            }}
                        />
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: (info) => {
                return (
                    <div className="flex gap-x-1 items-center">
                        <TableAction
                            options={tableActionOptions}
                            rowItem={info.row.original}
                        />
                    </div>
                )
            },
        },
    ]

    const quickActionsElements = {
        id: 'id',
        individual: (id: Sector) => (
            <div className="flex gap-x-2">
                <ActionButton variant="success" onClick={() => {}}>
                    Accept
                </ActionButton>
                <ActionButton variant="error" onClick={() => {}}>
                    Reject
                </ActionButton>
            </div>
        ),
        common: (ids: Sector[]) => (
            <ActionButton variant="error" onClick={() => {}}>
                Reject
            </ActionButton>
        ),
    }

    return (
        <>
            {modal && modal}
            <div className="flex flex-col gap-y-4 mb-32">
                <PageHeading title={'Sectors'} subtitle={'List of All Sectors'}>
                    <>
                        <Button
                            text="Add Sector"
                            onClick={() => {
                                router.push('sectors/form')
                            }}
                        />
                        {filterAction}
                        {data && data?.data.length ? (
                            <Button
                                text="Export"
                                variant="action"
                                Icon={FaFileExport}
                            />
                        ) : null}
                    </>
                </PageHeading>

                <Filter<SectorFilterTypes>
                    component={SectorFilters}
                    initialValues={filter}
                    setFilterAction={setFilterAction}
                    setFilter={setFilter}
                    filterKeys={filterKeys}
                />

                <Card noPadding>
                    {isError && <TechnicalError />}
                    {isLoading ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : data && data?.data?.length ? (
                        <Table
                            columns={columns}
                            data={data.data}
                            quickActions={quickActionsElements}
                            // enableRowSelection
                        >
                            {({
                                table,
                                pagination,
                                pageSize,
                                quickActions,
                            }: any) => {
                                return (
                                    <div>
                                        <div className="p-6 mb-2 flex justify-between">
                                            {pageSize(
                                                itemPerPage,
                                                setItemPerPage,
                                                data?.data?.length
                                            )}
                                            <div className="flex gap-x-2">
                                                {quickActions}
                                                {pagination(
                                                    data?.pagination,
                                                    setPage
                                                )}
                                            </div>
                                        </div>
                                        <div className="px-6">{table}</div>
                                    </div>
                                )
                            }}
                        </Table>
                    ) : (
                        !isError && (
                            <EmptyData
                                title={'No Sector!'}
                                description={'You have no sectors yet'}
                                height={'50vh'}
                            />
                        )
                    )}
                </Card>
            </div>
        </>
    )
}
