import {
    ActionButton,
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TableAction,
    TableActionOption,
    TruncatedTextWithTooltip,
    Typography,
    UserCreatedAt,
} from '@components'
import { PageHeading } from '@components/headings'
import { ColumnDef } from '@tanstack/react-table'
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa'

import { UserRoles } from '@constants'
import { useActionModal } from '@hooks'
import { Industry, UserStatus } from '@types'
import { getUserCredentials } from '@utils'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import { CgUnblock } from 'react-icons/cg'
import { MdBlock } from 'react-icons/md'
import { RiLockPasswordFill } from 'react-icons/ri'
import { ProgressIndustryCell, SectorCell } from './components'
import {
    AcceptModal,
    ArchiveModal,
    BlockModal,
    DeleteModal,
    RejectModal,
    UnblockModal,
} from './modals'

export interface StatusTableActionOption<T> extends TableActionOption<T> {
    status: string[]
}

export const FilteredIndustry = ({
    industry,
    setPage,
    itemPerPage,
    setItemPerPage,
}: {
    industry: any
    setPage: any
    itemPerPage: any
    setItemPerPage: any
}) => {
    const router = useRouter()
    const [modal, setModal] = useState<ReactElement | null>(null)
    const role = getUserCredentials()?.role
    // hooks
    const { passwordModal, onViewPassword } = useActionModal()

    const onModalCancelClicked = () => {
        setModal(null)
    }
    const onBlockClicked = (industry: Industry) => {
        setModal(
            <BlockModal industry={industry} onCancel={onModalCancelClicked} />
        )
    }

    const onUnblockClicked = (industry: Industry) => {
        setModal(
            <UnblockModal
                industry={industry}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }
    const onAcceptClicked = (industry: Industry) => {
        setModal(
            <AcceptModal
                industry={industry}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }
    const onRejectClicked = (industry: Industry) => {
        setModal(
            <RejectModal
                industry={industry}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }
    const onArchivedClicked = (item: Industry) => {
        setModal(
            <ArchiveModal item={item} onCancel={() => onModalCancelClicked()} />
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

    const tableActionOptions: TableActionOption<Industry>[] = [
        {
            text: 'View',
            onClick: (industry) => {
                router.push(`/portals/admin/industry/${industry?.id}`)
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
            onClick: (row) => {
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
    ]

    const statusBaseActions: StatusTableActionOption<Industry>[] = [
        {
            status: [UserStatus.Approved],
            text: 'Block',
            onClick: (industry) => onBlockClicked(industry),
            Icon: MdBlock,
            color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
        },
        {
            status: [UserStatus.Approved],
            text: 'Archive',
            onClick: (industry) => onArchivedClicked(industry),
            Icon: MdBlock,
            color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
        },
        {
            status: [UserStatus.Blocked],
            text: 'Unblock',
            onClick: (industry) => onUnblockClicked(industry),
            Icon: CgUnblock,
            color: 'text-orange-500 hover:bg-orange-100 hover:border-orange-200',
        },
        {
            ...(role === UserRoles.ADMIN
                ? {
                      status: [
                          UserStatus.Blocked,
                          UserStatus.Rejected,
                          UserStatus.Archived,
                      ],
                      text: 'Delete',
                      onClick: (industry) => onDeleteClicked(industry),
                      Icon: FaTrash,
                      color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
                  }
                : { status: [] }),
        },
        // {
        //     status: [
        //         UserStatus.Blocked,
        //         UserStatus.Rejected,
        //         UserStatus.Archived,
        //     ],
        //     text: 'Delete',
        //     onClick: (industry) => onDeleteClicked(industry),
        //     Icon: FaTrash,
        //     color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
        // },
        {
            status: [UserStatus.Pending, UserStatus.Rejected],
            text: 'Accept',
            onClick: (industry) => onAcceptClicked(industry),
            Icon: CgUnblock,
            color: 'text-orange-500 hover:bg-orange-100 hover:border-orange-200',
        },
        {
            status: [UserStatus.Archived],
            text: 'Un Archive',
            onClick: (industry) => onAcceptClicked(industry),
            Icon: CgUnblock,
            color: 'text-orange-500 hover:bg-orange-100 hover:border-orange-200',
        },
        {
            status: [UserStatus.Pending],
            text: 'Reject',
            onClick: (industry) => onRejectClicked(industry),
            Icon: FaTrash,
            color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
        },
    ]

    const columns: ColumnDef<Industry>[] = [
        {
            accessorKey: 'user.name',
            cell: (info) => (
                <ProgressIndustryCell industry={info?.row?.original} />
            ),
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
            accessorKey: 'studentCount',
            header: () => <span>Students</span>,
        },
        // {
        //     accessorKey: 'sectors',
        //     header: () => <span>Sectors</span>,
        //     cell: (info) => {
        //         return <SectorCell industry={info.row.original} />
        //     },
        // },
        {
            accessorKey: 'user.status',
            header: () => <span>Status</span>,
            cell: (info) => (
                <Typography uppercase variant={'badge'}>
                    <span className="font-bold">
                        {info.row.original?.user?.status}
                    </span>
                </Typography>
            ),
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
                <UserCreatedAt createdAt={info.row.original?.createdAt} />
            ),
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: (info: any) => {
                return (
                    <div className="flex gap-x-1 items-center">
                        <TableAction
                            options={[
                                ...tableActionOptions,
                                ...statusBaseActions.filter((action) =>
                                    action.status?.includes(
                                        info.row.original?.user?.status
                                    )
                                ),
                            ]}
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
                <ActionButton>Sub Admins</ActionButton>
                <ActionButton Icon={MdBlock} variant="error">
                    Block
                </ActionButton>
            </div>
        ),
        common: (ids: Industry[]) => (
            <ActionButton Icon={MdBlock} variant="error">
                Block
            </ActionButton>
        ),
    }

    return (
        <>
            {modal && modal}
            {passwordModal && passwordModal}
            <div className="flex flex-col gap-y-4 p-4">
                <PageHeading
                    title={'Filtered Industries'}
                    subtitle={'List of Filtered Industries'}
                />

                <Card noPadding>
                    {industry?.isLoading || industry?.isFetching ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : industry?.data && industry?.data?.data?.length ? (
                        <Table
                            columns={columns}
                            data={industry?.data?.data}
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
                                                industry.data?.data?.length
                                            )}
                                            <div className="flex gap-x-2">
                                                {quickActions}
                                                {pagination(
                                                    industry?.data?.pagination,
                                                    setPage
                                                )}
                                            </div>
                                        </div>
                                        <div className="px-6">{table}</div>
                                        {industry.data?.data?.length > 10 && (
                                            <div className="p-6 mb-2 flex justify-between">
                                                {pageSize(
                                                    itemPerPage,
                                                    setItemPerPage,
                                                    industry.data?.data?.length
                                                )}
                                                <div className="flex gap-x-2">
                                                    {quickActions}
                                                    {pagination(
                                                        industry?.data
                                                            ?.pagination,
                                                        setPage
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            }}
                        </Table>
                    ) : (
                        <EmptyData
                            title={'No Industries in your Search!'}
                            description={'No Industries in your Search yet'}
                            height={'50vh'}
                        />
                    )}
                </Card>
            </div>
        </>
    )
}
