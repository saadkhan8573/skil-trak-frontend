import {
    ActionButton,
    Button,
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TableAction,
    TableActionOption,
    TechnicalError,
    TruncatedTextWithTooltip,
    UserCreatedAt,
} from '@components'
import { PageHeading } from '@components/headings'
import { ColumnDef } from '@tanstack/react-table'
import { FaEdit, FaEye, FaFileExport, FaTrash } from 'react-icons/fa'

import { useActionModal } from '@hooks'
import { AdminApi } from '@queries'
import { Industry } from '@types'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { RiLockPasswordFill } from 'react-icons/ri'
import { IndustryCell, SectorCell } from './components'
import { AcceptModal, DeleteModal, MultiAcceptModal } from './modals'
import { getUserCredentials } from '@utils'
import { UserRoles } from '@constants'

export const RejectedIndustry = () => {
    const router = useRouter()
    const [modal, setModal] = useState<ReactElement | null>(null)

    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const role = getUserCredentials()?.role
    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 50))
    }, [router])

    // hooks
    const { passwordModal, onViewPassword } = useActionModal()

    const { isLoading, data, isError } = AdminApi.Industries.useListQuery({
        search: `status:rejected`,
        skip: itemPerPage * page - itemPerPage,
        limit: itemPerPage,
    })

    const onModalCancelClicked = () => {
        setModal(null)
    }
    const onAcceptClicked = (industry: Industry) => {
        setModal(
            <AcceptModal
                industry={industry}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }
    const onDeleteClicked = (industry: Industry) => {
        setModal(
            <DeleteModal
                industry={industry}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }

    const onMultiAcceptClicked = (industries: Industry[]) => {
        setModal(
            <MultiAcceptModal
                industries={industries}
                onCancel={() => {
                    onModalCancelClicked()
                }}
            />
        )
    }

    const tableActionOptions: TableActionOption<any>[] = [
        {
            text: 'View',
            onClick: (industry: any) => {
                router.push(`/portals/admin/industry/${industry.id}`)
            },
            Icon: FaEye,
        },
        {
            text: 'View Old Profile',
            onClick: (industry: any) =>
                router.push(
                    `/portals/admin/industry/${industry?.id}/old-detail`
                ),
            Icon: FaEye,
        },
        {
            text: 'Edit',
            onClick: (row: any) => {
                router.push(`/portals/admin/industry/edit-industry/${row.id}`)
            },
            Icon: FaEdit,
        },
        {
            ...(role === UserRoles.ADMIN
                ? {
                      text: 'View Password',
                      onClick: (industry: Industry) => onViewPassword(industry),
                      Icon: RiLockPasswordFill,
                  }
                : {}),
        },
        {
            text: 'Accept',
            onClick: (student: Industry) => {
                onAcceptClicked(student)
            },
            color: 'text-green-500 hover:bg-green-100 hover:border-green-200',
        },

        {
            text: 'Delete',
            onClick: (student: Industry) => {
                onDeleteClicked(student)
            },
            Icon: FaTrash,
            color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
        },
    ]

    const columns: ColumnDef<Industry>[] = [
        {
            accessorKey: 'user.name',
            cell: (info) => {
                return <IndustryCell industry={info.row.original} />
            },
            header: () => <span>Industry</span>,
        },
        {
            accessorKey: 'abn',
            header: () => <span>ABN</span>,
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: 'contactPerson',
            header: () => <span>Contact Person</span>,
            cell: (info) => {
                return (
                    <div>
                        <p>{info.row.original.contactPerson}</p>
                        <p className="text-xs text-gray-500">
                            {info.row.original.contactPersonNumber}
                        </p>
                    </div>
                )
            },
        },

        {
            accessorKey: 'addressLine1',
            header: () => <span>Address</span>,
            cell: (info) => (
                <TruncatedTextWithTooltip
                    text={info?.row?.original?.addressLine1}
                />
            ),
        },
        // {
        //     accessorKey: 'sectors',
        //     header: () => <span>Sectors</span>,
        //     cell: (info) => {
        //         return <SectorCell industry={info.row.original} />
        //     },
        // },
        {
            accessorKey: 'channel',
            header: () => <span>Created By</span>,
            cell: (info) => (
                <div>
                    {info?.row?.original?.createdBy !== null ? (
                        <p>{info?.row?.original?.createdBy?.name}</p>
                    ) : (
                        <p>{info?.row?.original?.channel}</p>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: () => <span>Created At</span>,
            cell: (info) => (
                <UserCreatedAt createdAt={info.row.original?.createdAt} />
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
        individual: (id: Industry) => (
            <div className="flex gap-x-2">
                <ActionButton Icon={FaEdit}>Edit</ActionButton>
                <ActionButton variant="success">Accept</ActionButton>
                <ActionButton Icon={FaTrash} variant="error">
                    Delete
                </ActionButton>
            </div>
        ),
        common: (industries: Industry[]) => (
            <div className="flex gap-x-2">
                <ActionButton
                    variant="success"
                    onClick={() => {
                        onMultiAcceptClicked(industries)
                    }}
                >
                    Accept
                </ActionButton>
                <ActionButton Icon={FaTrash} variant="error">
                    Delete
                </ActionButton>
            </div>
        ),
    }

    return (
        <>
            {modal && modal}
            {passwordModal && passwordModal}
            <div className="flex flex-col gap-y-4 mb-32">
                <PageHeading
                    title={'Rejected Industries'}
                    subtitle={'List of Rejected Industries'}
                >
                    {data && data?.data.length ? (
                        <>
                            <Button
                                text="Export"
                                variant="action"
                                Icon={FaFileExport}
                            />
                        </>
                    ) : null}
                </PageHeading>

                <Card noPadding>
                    {isError && <TechnicalError />}
                    {isLoading ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : data && data?.data.length ? (
                        <Table
                            columns={columns}
                            data={data.data}
                            quickActions={quickActionsElements}
                            enableRowSelection
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
                                title={'No Rejected Industry!'}
                                description={
                                    'You have not rejected any Industry request yet'
                                }
                                height={'50vh'}
                            />
                        )
                    )}
                </Card>
            </div>
        </>
    )
}
