import {
    ActionButton,
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
import { FaEdit, FaEye } from 'react-icons/fa'

import { AdminApi } from '@queries'
import { Industry, UserStatus } from '@types'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { MdBlock } from 'react-icons/md'
import { BranchCell, IndustryCell, SectorCell } from './components'

// hooks
import { UserRoles } from '@constants'
import { useActionModal } from '@hooks'
import { getUserCredentials } from '@utils'
import { RiLockPasswordFill } from 'react-icons/ri'
import { useActionModals } from './hooks'

export const EmailVerifiedIndustries = () => {
    const router = useRouter()
    const [itemPerPage, setItemPerPage] = useState(30)
    const [page, setPage] = useState(1)
    const role = getUserCredentials()?.role
    // hooks
    const { passwordModal, onViewPassword } = useActionModal()

    const { modal, onArchiveClicked, onBlockClicked, onMultiBlockClicked } =
        useActionModals()

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 30))
    }, [router])

    const { isLoading, data, isError } = AdminApi.Industries.useListQuery({
        search: `isEmailVerified:${true}`,
        skip: itemPerPage * page - itemPerPage,
        limit: itemPerPage,
    })

    const tableActionOptions: TableActionOption<Industry>[] = [
        {
            text: 'View',
            onClick: (industry: any) => {
                router.push(`/portals/admin/industry/${industry?.id}`)
            },
            Icon: FaEye,
        },
        {
            text: 'Old Profile',
            onClick: (industry: any) =>
                router.push(
                    `/portals/admin/industry/${industry?.id}/detail?tab=students`
                ),
            Icon: FaEye,
        },
        {
            text: 'Edit',
            onClick: (row: any) => {
                router.push(`/portals/admin/industry/edit-industry/${row?.id}`)
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
            text: 'Archive',
            onClick: (industry: Industry) => onArchiveClicked(industry),
            Icon: MdBlock,
            color: 'text-primary',
        },
        {
            text: 'Block',
            onClick: (industry: Industry) => onBlockClicked(industry),
            Icon: MdBlock,
            color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
        },
    ]

    const columns: ColumnDef<Industry>[] = [
        {
            accessorKey: 'user.name',
            cell: (info) => <IndustryCell industry={info?.row?.original} />,
            header: () => <span>Industry</span>,
        },
        {
            accessorKey: 'branches',
            cell: (info) => {
                return (
                    <div className="flex justify-start">
                        {info?.row?.original?.branches?.length > 0 ? (
                            <BranchCell industry={info.row.original} />
                        ) : info?.row?.original?.headQuarter !== null ? (
                            <div className="flex flex-col gap-y-1 items-center">
                                <p className="text-xs font-semibold text-blue-400">
                                    Head Quarter
                                </p>
                                <p className="text-xs font-semibold text-gray-400">
                                    {
                                        info?.row?.original?.headQuarter?.user
                                            ?.name
                                    }
                                </p>
                            </div>
                        ) : (
                            'N/A'
                        )}
                    </div>
                )
            },
            header: () => <span>Branches</span>,
        },
        {
            accessorKey: 'abn',
            header: () => <span>ABN</span>,
        },
        {
            accessorKey: 'studentCount',
            header: () => <span>Students</span>,
        },
        {
            accessorKey: 'contactPerson',
            header: () => <span>Contact Person</span>,
            cell: (info) => {
                return (
                    <div>
                        <p>{info?.row?.original?.contactPerson}</p>
                        <p className="text-xs text-gray-500">
                            {info?.row?.original?.contactPersonNumber}
                        </p>
                    </div>
                )
            },
        },
        // {
        //     accessorKey: 'sectors',
        //     header: () => <span>Sectors</span>,
        //     cell: (info) => <SectorCell industry={info?.row?.original} />,
        // },
        {
            accessorKey: 'suburb',
            header: () => <span>Suburb</span>,
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
                <UserCreatedAt createdAt={info?.row?.original?.createdAt} />
            ),
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: (info: any) => {
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
                <ActionButton Icon={MdBlock} variant="error">
                    Block
                </ActionButton>
            </div>
        ),
        common: (industries: Industry[]) => (
            <>
                {/* <ActionButton
                    onClick={() => {
                        const arrayOfIds = industries.map(
                            (id: any) => id?.user.id
                        )
                        bulkAction({
                            ids: arrayOfIds,
                            status: UserStatus.Pending,
                        })
                    }}
                    Icon={MdBlock}
                    variant="success"
                >
                    Pending
                </ActionButton> */}
                <ActionButton
                    onClick={() => {
                        onMultiBlockClicked(industries)
                    }}
                    Icon={MdBlock}
                    variant="error"
                >
                    Block
                </ActionButton>
            </>
        ),
    }

    return (
        <>
            {modal && modal}
            {passwordModal && passwordModal}
            <div className="flex flex-col gap-y-4 mb-32">
                <PageHeading
                    title={'Approved Industries'}
                    // subtitle={'List of Approved Industries'}
                >
                    {/* {data && data?.data?.length ? (
                        <Button
                            text="Export"
                            variant="action"
                            Icon={FaFileExport}
                        />
                    ) : null} */}
                </PageHeading>

                <Card noPadding>
                    {isError && <TechnicalError />}
                    {isLoading ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : data && data?.data?.length ? (
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
                            }: any) => (
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
                                    <div className=" overflow-x-scroll remove-scrollbar">
                                        <div className="px-6 w-full">
                                            {table}
                                        </div>
                                    </div>
                                    {data?.data?.length > 10 && (
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
                                    )}
                                </div>
                            )}
                        </Table>
                    ) : (
                        !isError && (
                            <EmptyData
                                title={'No Approved Industry!'}
                                description={
                                    'You have not approved any Industry request yet'
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
