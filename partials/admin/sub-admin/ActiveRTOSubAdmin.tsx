import {
    ActionButton,
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TableAction,
    TechnicalError,
    Typography,
} from '@components'
import { PageHeading } from '@components/headings'
import { ColumnDef } from '@tanstack/react-table'
import { FaEdit, FaEye } from 'react-icons/fa'

import { UserRoles } from '@constants'
import { useActionModal, useContextBar } from '@hooks'
import { AllowAllStudentsAccessModal } from '@partials/rto/coordinators/modal'
import { AdminApi, commonApi } from '@queries'
import { Rto, SubAdmin, User, UserStatus } from '@types'
import { checkListLength, getUserCredentials } from '@utils'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { BsArchiveFill } from 'react-icons/bs'
import { MdAdminPanelSettings, MdOutlineAssignmentReturn } from 'react-icons/md'
import { RiLockPasswordFill } from 'react-icons/ri'
import { SiOpenaccess } from 'react-icons/si'
import { RtoCellInfo } from '../rto/components'
import { RtoCell, SectorCell, SubAdminCell } from './components'
import { AddSubAdminCB, ViewRtosCB, ViewSectorsCB } from './contextBar'
import {
    AllowAsAdminModal,
    AllowLoginAfterHoursModal,
    AllowRtoWpRequestModal,
    ArchiveModal,
    AssignAutoWorkplaceModal,
    BlockModal,
    RemoveFromAssociatedRTOModal,
} from './modals'
import { CiCircleList } from 'react-icons/ci'

export const ActiveRTOSubAdmin = () => {
    const [modal, setModal] = useState<ReactElement | null>(null)
    const [changeStatusResult, setChangeStatusResult] = useState<any>({})
    const router = useRouter()

    const contextBar = useContextBar()

    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)

    useEffect(() => {
        setPage(Number(router.query?.page || 1))
        setItemPerPage(Number(router.query?.pageSize || 50))
    }, [router])

    // hooks
    const { passwordModal, onViewPassword } = useActionModal()

    const { isLoading, isFetching, data, isError, refetch } =
        AdminApi.SubAdmins.useListQuery(
            {
                search: `status:${UserStatus.Approved
                    },isAssociatedWithRto:${true}`,
                skip: itemPerPage * page - itemPerPage,
                limit: itemPerPage,
            },
            {
                refetchOnMountOrArgChange: true,
            }
        )

    const [associatedWithRto, associatedWithRtoResult] =
        AdminApi.SubAdmins.useAssociatedWithRto()

    const [bulkAction, resultBulkAction] = commonApi.useBulkStatusMutation()

    useEffect(() => {
        if (changeStatusResult.isSuccess) {
            refetch()
        }
    }, [changeStatusResult])

    const onModalCancelClicked = () => {
        setModal(null)
    }
    const onBlockedClicked = (subAdmin: SubAdmin) => {
        setModal(
            <BlockModal
                subAdmin={subAdmin}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }
    const onHasAllowAllStudentsAccess = (subAdmin: any) => {
        setModal(
            <AllowAllStudentsAccessModal
                coordinator={subAdmin}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }

    const onAllowLoginAfterHoursModalClicked = (subAdmin: SubAdmin) => {
        setModal(
            <AllowLoginAfterHoursModal
                subAdmin={subAdmin}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }
    const onMakeAsAdminClicked = (subAdmin: SubAdmin) => {
        setModal(
            <AllowAsAdminModal
                subAdmin={subAdmin}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }
    // AllowRtoWpRequestModal
    const onAllowRtoWpApprovalReqClicked = (subAdmin: SubAdmin) => {
        setModal(
            <AllowRtoWpRequestModal
                subAdmin={subAdmin}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }
    const onAutoAssignWorkplace = (subAdmin: SubAdmin) => {
        setModal(
            <AssignAutoWorkplaceModal
                subAdmin={subAdmin}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }
    const onArchivedClicked = (subAdmin: SubAdmin) => {
        setModal(
            <ArchiveModal
                item={subAdmin}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }

    const onEditSubAdmin = (subAdmin: SubAdmin) => {
        contextBar.setContent(<AddSubAdminCB edit subAdmin={subAdmin} />)
        contextBar.setTitle('Edit SubAdmin')
        contextBar.show()
    }

    const onRemoveWithRtoClicked = (subadminId: number) => {
        setModal(
            <RemoveFromAssociatedRTOModal
                subadminId={subadminId}
                onCancel={onModalCancelClicked}
            />
        )
    }

    const role = getUserCredentials()?.role
    const tableActionOptions = (subAdmin: any) => {
        return [
            {
                text: 'View',
                onClick: (subAdmin: any) => {
                    router.push(
                        `/portals/admin/sub-admin/${subAdmin?.id}?tab=notes`
                    )
                },
                Icon: FaEye,
            },
            {
                text: 'New Profile',
                onClick: (subAdmin: any) => {
                    router.push(
                        `/portals/admin/sub-admin/${subAdmin?.id}/detail`
                    )
                },
                Icon: FaEye,
            },
            {
                text: 'Allow All Students Access',
                onClick: (subAdmin: any) => {
                    onHasAllowAllStudentsAccess(subAdmin)
                },
                Icon: SiOpenaccess,
            },
            {
                text: 'Assign Courses',
                onClick: (subAdmin: any) => {
                    contextBar.setTitle('Sectors & Courses')
                    contextBar.setContent(<ViewSectorsCB subAdmin={subAdmin} />)
                    contextBar.show()
                },
            },
            {
                text: 'Assign RTO',
                onClick: (subAdmin: any) => {
                    contextBar.setTitle('Assigned RTOs')
                    contextBar.setContent(<ViewRtosCB subAdmin={subAdmin} />)
                    contextBar.show()
                },
            },
            {
                text: 'Edit',
                onClick: (subadmin: SubAdmin) => {
                    onEditSubAdmin(subadmin)
                },
                Icon: FaEdit,
            },
            {
                ...(role === UserRoles.ADMIN
                    ? {
                        text: 'View Password',
                        onClick: (subAdmin: SubAdmin) =>
                            onViewPassword(subAdmin),
                        Icon: RiLockPasswordFill,
                    }
                    : {}),
            },
            {
                ...(role === UserRoles.ADMIN
                    ? {
                        text: `${!subAdmin?.canAdmin
                            ? 'Allow as Admin'
                            : 'Remove As Admin'
                            }`,
                        onClick: (subAdmin: SubAdmin) =>
                            onMakeAsAdminClicked(subAdmin),
                        Icon: MdAdminPanelSettings,
                    }
                    : {}),
            },
            {
                ...(role === UserRoles.ADMIN
                    ? {
                        text: `${!subAdmin?.hasRtoWorkplaceApprovalAccess
                            ? 'Allow WP Request'
                            : 'Revoke WP Request'
                            }`,
                        onClick: (subAdmin: SubAdmin) =>
                            onAllowRtoWpApprovalReqClicked(subAdmin),
                        Icon: CiCircleList,
                    }
                    : {}),
            },
            {
                ...(role === UserRoles.ADMIN
                    ? {
                        text: subAdmin?.user?.after_hours_access
                            ? 'Remove Login'
                            : 'Allow Login',
                        onClick: (subAdmin: SubAdmin) =>
                            onAllowLoginAfterHoursModalClicked(subAdmin),
                        Icon: MdAdminPanelSettings,
                    }
                    : {}),
            },
            {
                text: `${!subAdmin?.allowAutoAssignment
                    ? 'Allow Auto Assignment'
                    : 'Remove Auto Assignment'
                    }`,
                onClick: (subAdmin: SubAdmin) =>
                    onAutoAssignWorkplace(subAdmin),
                Icon: MdOutlineAssignmentReturn,
            },
            {
                text: 'Block',
                onClick: (subAdmin: SubAdmin) => onBlockedClicked(subAdmin),
                Icon: BsArchiveFill,
                color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
            },
            {
                text: 'Archive',
                onClick: (subAdmin: SubAdmin) => onArchivedClicked(subAdmin),
                Icon: BsArchiveFill,
                color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
            },
        ]
    }

    const columns: ColumnDef<SubAdmin>[] = [
        {
            accessorKey: 'user.name',
            cell: (info) => <SubAdminCell subAdmin={info.row.original} />,
            header: () => <span>Sub Admin</span>,
        },
        {
            accessorKey: 'sector',
            header: () => <span>Sectors</span>,
            cell: (info) => <SectorCell subAdmin={info.row.original} />,
        },
        {
            accessorKey: 'rto',
            header: () => <span>RTOs</span>,
            cell: (info) => <RtoCell subAdmin={info.row.original} />,
        },
        {
            accessorKey: 'assignedStudents',
            header: () => <span>Assigned Students</span>,
        },
        {
            accessorKey: 'addressLine1',
            header: () => <span>Address</span>,
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: 'createdBy.role',
            header: () => <span>Created By</span>,
            cell: (info) =>
                info.row.original?.createdBy?.role === UserRoles.RTO ? (
                    <>
                        <RtoCellInfo
                            rto={
                                {
                                    id: info.row.original?.createdBy?.rto?.id,
                                    user: info.row.original?.createdBy as User,
                                } as Rto
                            }
                            short
                        />
                        <Typography variant={'small'} uppercase>
                            <span className="font-semibold">
                                {info.row.original?.createdBy?.role}
                            </span>
                        </Typography>
                    </>
                ) : info.row.original?.createdBy?.role ===
                    UserRoles.SUBADMIN ? (
                    <>
                        <SubAdminCell
                            subAdmin={
                                {
                                    id: info.row.original?.createdBy
                                        ?.coordinator?.id,
                                    phone: info.row.original?.createdBy
                                        ?.coordinator?.phone,
                                    user: info.row.original?.createdBy as User,
                                } as SubAdmin
                            }
                        />
                        <Typography variant={'small'} uppercase>
                            <span className="font-semibold">
                                {info.row.original?.createdBy?.role}
                            </span>
                        </Typography>
                    </>
                ) : (
                    <Typography variant={'small'} uppercase>
                        <span className="font-semibold">
                            {info.row.original?.createdBy?.role}
                        </span>
                    </Typography>
                ),
            // cell: (info) => (
            //     <Typography variant={'small'} uppercase>
            //         <span className="font-semibold">
            //             {info.row.original?.createdBy?.role}
            //         </span>
            //     </Typography>
            // ),
        },
        {
            accessorKey: 'associated',
            header: () => <span>associated</span>,
            cell: (info: any) => {
                return (
                    <ActionButton
                        onClick={() => {
                            onRemoveWithRtoClicked(info?.row?.original?.id)
                        }}
                    >
                        Remove From Rto
                    </ActionButton>
                )
            },
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: (info: any) => {
                const actions = tableActionOptions(info?.row?.original)
                const length = checkListLength<SubAdmin>(
                    data?.data as SubAdmin[]
                )
                return (
                    <TableAction
                        options={actions}
                        rowItem={info.row.original}
                        lastIndex={length.includes(info?.row?.index)}
                    />
                )
            },
        },
    ]

    const quickActionsElements = {
        id: 'id',
        individual: (id: SubAdmin) => (
            <div className="flex gap-x-2">
                <ActionButton variant="success" onClick={() => { }}>
                    Accept
                </ActionButton>
                <ActionButton variant="error" onClick={() => { }}>
                    Reject
                </ActionButton>
            </div>
        ),
        common: (ids: SubAdmin[]) => (
            <ActionButton
                onClick={() => {
                    const arrayOfIds = ids.map((id: any) => id?.user.id)
                    bulkAction({ ids: arrayOfIds, status: 'archived' })
                }}
                variant="error"
            >
                Archive
            </ActionButton>
        ),
    }

    return (
        <>
            {modal && modal}
            {passwordModal && passwordModal}
            <div className="flex flex-col gap-y-4 mb-32">
                <Card noPadding>
                    {isError && <TechnicalError />}
                    {isLoading || isFetching ? (
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
                                                data?.data.length
                                            )}
                                            <div className="flex gap-x-2">
                                                {quickActions}
                                                {pagination(
                                                    data?.pagination,
                                                    setPage
                                                )}
                                            </div>
                                        </div>
                                        <div className="overflow-x-auto remove-scrollbar">
                                            <div
                                                className="px-6 w-full"
                                                id={'studentScrollId'}
                                            >
                                                {table}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }}
                        </Table>
                    ) : (
                        !isError && (
                            <EmptyData
                                title={'No Active SubAdmin!'}
                                description={'You have no Active SubAdmin'}
                                height={'50vh'}
                            />
                        )
                    )}
                </Card>
            </div>
        </>
    )
}
