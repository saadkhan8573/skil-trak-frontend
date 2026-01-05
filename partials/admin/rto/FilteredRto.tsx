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
} from '@components'
import { PageHeading } from '@components/headings'
import { ColumnDef } from '@tanstack/react-table'
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa'

import { useActionModal, useContextBar } from '@hooks'
import { RtoCellInfo } from '@partials/admin/rto/components'
import { Rto, Student, UserStatus } from '@types'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import { MdBlock } from 'react-icons/md'
import { SectorCell } from './components'
import { ViewSubAdminsCB } from './contextBar'
import {
    AcceptModal,
    ArchiveModal,
    BlockModal,
    DeleteModal,
    RejectModal,
    UnblockModal,
} from './modals'
import { CgUnblock } from 'react-icons/cg'
import { UserRoles } from '@constants'
import { getUserCredentials } from '@utils'

export const FilteredRto = ({
    rto,
    setPage,
    itemPerPage,
    setItemPerPage,
}: {
    rto: any
    setPage: any
    itemPerPage: any
    setItemPerPage: any
}) => {
    const router = useRouter()
    const [modal, setModal] = useState<ReactElement | null>(null)

    const contextBar = useContextBar()
    const onViewSubAdminsClicked = (rto: Rto) => {
        contextBar.setTitle('Sub Admins')
        contextBar.setContent(<ViewSubAdminsCB rto={rto} />)
        contextBar.show()
    }

    const { passwordModal, onViewPassword } = useActionModal()

    const onModalCancelClicked = () => {
        setModal(null)
    }
    const onBlockClicked = (rto: Rto) => {
        setModal(
            <BlockModal rto={rto} onCancel={() => onModalCancelClicked()} />
        )
    }

    const onUnblockClicked = (rto: Rto) => {
        setModal(
            <UnblockModal rto={rto} onCancel={() => onModalCancelClicked()} />
        )
    }
    const onAcceptClicked = (rto: Rto) => {
        setModal(
            <AcceptModal rto={rto} onCancel={() => onModalCancelClicked()} />
        )
    }
    const onRejectClicked = (rto: Rto) => {
        setModal(
            <RejectModal rto={rto} onCancel={() => onModalCancelClicked()} />
        )
    }
    const onArchivedClicked = (rto: Rto) => {
        setModal(
            <ArchiveModal item={rto} onCancel={() => onModalCancelClicked()} />
        )
    }
    const onDeleteClicked = (rto: Rto) => {
        setModal(
            <DeleteModal rto={rto} onCancel={() => onModalCancelClicked()} />
        )
    }

    const role = getUserCredentials()?.role

    const tableActionOptions: TableActionOption<any>[] = [
        {
            text: 'View',
            onClick: (rto: Rto) => {
                router.push(`/portals/admin/rto/${rto.id}?tab=sectors`)
            },
            Icon: FaEye,
        },
        {
            text: 'New Profile',
            onClick: (rto: any) => {
                router.push(`/portals/admin/rto/${rto.id}/detail`)
            },
            Icon: FaEye,
        },
        {
            text: 'Edit',
            onClick: (rto: Rto) => {
                router.push(`/portals/admin/rto/${rto.id}/edit-profile`)
            },
            Icon: FaEdit,
        },
        {
            ...(role === UserRoles.ADMIN
                ? {
                      text: 'View Password',
                      onClick: (rto: Rto) => onViewPassword(rto),
                      Icon: FaEdit,
                  }
                : {}),
        },
        {
            text: 'Sub Admins',
            onClick: (item: Rto) => onViewSubAdminsClicked(item),
            Icon: FaEdit,
        },
    ]
    interface StatusTableActionOption<T> extends TableActionOption<T> {
        status: UserStatus[]
    }
    const statusBaseActions: StatusTableActionOption<Rto>[] = [
        {
            status: [UserStatus.Approved],
            text: 'Block',
            onClick: (rto: Rto) => onBlockClicked(rto),
            Icon: MdBlock,
            color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
        },
        {
            status: [UserStatus.Approved],
            text: 'Archive',
            onClick: (rto: Rto) => onArchivedClicked(rto),
            Icon: MdBlock,
            color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
        },
        {
            status: [UserStatus.Blocked],
            text: 'Unblock',
            onClick: (rto: Rto) => onUnblockClicked(rto),
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
                      onClick: (rto: Rto) => onDeleteClicked(rto),
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
        //     onClick: (rto: Rto) => onDeleteClicked(rto),
        //     Icon: FaTrash,
        //     color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
        // },
        {
            status: [UserStatus.Pending, UserStatus.Rejected],
            text: 'Accept',
            onClick: (rto: Rto) => onAcceptClicked(rto),
            Icon: CgUnblock,
            color: 'text-orange-500 hover:bg-orange-100 hover:border-orange-200',
        },
        {
            status: [UserStatus.Archived],
            text: 'Un Archive',
            onClick: (rto: Rto) => onAcceptClicked(rto),
            Icon: CgUnblock,
            color: 'text-orange-500 hover:bg-orange-100 hover:border-orange-200',
        },
        {
            status: [UserStatus.Pending],
            text: 'Reject',
            onClick: (rto: Rto) => onRejectClicked(rto),
            Icon: FaTrash,
            color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
        },
    ]

    const columns: ColumnDef<Rto>[] = [
        {
            accessorKey: 'user.name',
            cell: (info) => <RtoCellInfo rto={info.row.original} />,
            header: () => <span>Name</span>,
        },
        {
            accessorKey: 'rtoCode',
            header: () => <span>Code</span>,
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: 'students',
            header: () => <span>Students</span>,
            cell: (info) => info?.row?.original?.students.length,
        },
        {
            accessorKey: 'sectors',
            header: () => <span>Sectors</span>,
            cell: (info) => <SectorCell rto={info.row.original} />,
        },
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
            accessorKey: 'suburb',
            header: () => <span>Address</span>,
            cell: (info) => (
                <TruncatedTextWithTooltip
                    text={info?.row?.original?.addressLine1}
                />
            ),
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: ({ row }: any) => (
                <div className="flex gap-x-1 items-center">
                    <TableAction
                        options={[
                            ...tableActionOptions,
                            ...statusBaseActions.filter((action) =>
                                action.status?.includes(
                                    row.original?.user?.status
                                )
                            ),
                        ]}
                        rowItem={row.original}
                    />
                </div>
            ),
        },
    ]

    const quickActionsElements = {
        id: 'id',
        individual: (id: Rto) => (
            <div className="flex gap-x-2">
                <ActionButton Icon={FaEdit}>Edit</ActionButton>
                <ActionButton>Sub Admins</ActionButton>
                <ActionButton Icon={MdBlock} variant="error">
                    Block
                </ActionButton>
            </div>
        ),
        common: (ids: Rto[]) => (
            <ActionButton Icon={MdBlock} variant="error">
                Block
            </ActionButton>
        ),
    }

    return (
        <>
            {modal}
            {passwordModal}
            <div className="flex flex-col gap-y-4 p-4">
                <PageHeading
                    title={'Filtered RTOS'}
                    subtitle={'List of Filtered RTOS'}
                />

                <Card noPadding>
                    {rto?.isLoading || rto?.isFetching ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : rto?.data && rto?.data?.data.length ? (
                        <Table
                            columns={columns}
                            data={rto?.data.data}
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
                                                rto.data?.data?.length
                                            )}
                                            <div className="flex gap-x-2">
                                                {quickActions}
                                                {pagination(
                                                    rto?.data?.pagination,
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
                        <EmptyData
                            title={'No RTOS in your Search!'}
                            description={'No RTOS in your Search yet'}
                            height={'50vh'}
                        />
                    )}
                </Card>
            </div>
        </>
    )
}
