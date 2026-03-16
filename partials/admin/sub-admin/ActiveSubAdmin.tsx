import {
    ActionButton,
    Card,
    EmptyData,
    Table,
    TableAction,
    TableActionOption,
    TableChildrenProps,
    TableSkeleton,
    TechnicalError,
    Typography,
} from '@components'
import { PageHeading } from '@components/headings'
import { ColumnDef } from '@tanstack/react-table'
import { FaEdit, FaEye } from 'react-icons/fa'

import { UserRoles } from '@constants'
import { useActionModal, useContextBar } from '@hooks'
import { AdminApi, commonApi } from '@queries'
import { Rto, SubAdmin, User, UserStatus } from '@types'
import { checkListLength, getUserCredentials } from '@utils'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { BsArchiveFill } from 'react-icons/bs'
import { PiCellSignalLowFill } from 'react-icons/pi'
import { RiLockPasswordFill } from 'react-icons/ri'
import { RtoCellInfo } from '../rto/components'
import { RtoCell, SectorCell, SubAdminCell } from './components'
import { AddSubAdminCB } from './contextBar'
import {
    AllowPermissionModal,
    ArchiveModal,
    AssociatedWithRTOModal,
    BlockModal,
} from './modals'

export const ActiveSubAdmin = () => {
    const [modal, setModal] = useState<ReactElement | null>(null)
    const router = useRouter()

    const contextBar = useContextBar()

    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const [isRouting, setIsRouting] = useState(true)

    useEffect(() => {
        if (!isRouting) return
        const newPage = Number(router.query.page)
        const newItemPerPage = Number(router.query.pageSize)
        if (router.query.page) {
            setPage(newPage)
        }
        if (router.query.pageSize) {
            setItemPerPage(newItemPerPage)
        }
    }, [router])

    // hooks
    const { passwordModal, onViewPassword } = useActionModal()
    const { isLoading, isFetching, data, isError, refetch } =
        AdminApi.SubAdmins.useListQuery(
            {
                search: `status:${
                    UserStatus.Approved
                },isAssociatedWithRto:${false}`,
                skip: itemPerPage * page - itemPerPage,
                limit: itemPerPage,
            },
            {
                refetchOnMountOrArgChange: true,
            }
        )
    const [bulkAction, resultBulkAction] = commonApi.useBulkStatusMutation()

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

    const onArchivedClicked = (subAdmin: SubAdmin) => {
        setModal(
            <ArchiveModal
                item={subAdmin}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }

    const onEditSubAdmin = (subAdmin: SubAdmin) => {
        contextBar.show()
        contextBar.setTitle('Edit SubAdmin')
        contextBar.setContent(<AddSubAdminCB edit subAdmin={subAdmin} />)
    }

    const onAssociatedWithRtoClicked = (subadminId: number) => {
        setModal(
            <AssociatedWithRTOModal
                subadminId={subadminId}
                onCancel={onModalCancelClicked}
            />
        )
    }
    const onAllowPermissionClicked = (subadmin: SubAdmin) => {
        setModal(
            <AllowPermissionModal
                subadmin={subadmin}
                onCancel={onModalCancelClicked}
            />
        )
    }
    const role = getUserCredentials()?.role

    const tableActionOptions: TableActionOption<SubAdmin>[] = [
        {
            text: 'View',
            onClick: (subAdmin) =>
                router.push(`/portals/admin/sub-admin/${subAdmin?.id}`),
            Icon: FaEye,
        },
        {
            text: 'Edit',
            onClick: (subadmin) => {
                onEditSubAdmin(subadmin)
            },
            Icon: FaEdit,
        },
        {
            text: 'Associated With Rto',
            onClick: (subadmin) => {
                onAssociatedWithRtoClicked(subadmin?.id)
            },
            Icon: FaEdit,
        },
        {
            ...(role === UserRoles.ADMIN
                ? {
                      text: 'Permissions',
                      onClick: (subAdmin) => onAllowPermissionClicked(subAdmin),
                      Icon: PiCellSignalLowFill,
                  }
                : {}),
        },
        {
            ...(role === UserRoles.ADMIN
                ? {
                      text: 'View Password',
                      onClick: (subAdmin) => onViewPassword(subAdmin),
                      Icon: RiLockPasswordFill,
                  }
                : {}),
        },
        {
            text: 'Block',
            onClick: (subAdmin) => onBlockedClicked(subAdmin),
            Icon: BsArchiveFill,
            color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
        },
        {
            text: 'Archive',
            onClick: (subAdmin) => onArchivedClicked(subAdmin),
            Icon: BsArchiveFill,
            color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
        },
    ]

    const columns: ColumnDef<SubAdmin>[] = [
        {
            accessorKey: 'user.name',
            cell: (info) => <SubAdminCell subAdmin={info.row.original} />,
            header: () => <span>Coordinator</span>,
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
            accessorKey: 'totalIndustries',
            header: () => <span>Total Industries</span>,
        },
        {
            accessorKey: 'placementReadyIndustries',
            header: () => <span>Placement Ready</span>,
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
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: (info) => {
                const length = checkListLength<SubAdmin>(
                    data?.data as SubAdmin[]
                )
                return (
                    <TableAction
                        options={tableActionOptions}
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
                <ActionButton variant="success" onClick={() => {}}>
                    Accept
                </ActionButton>
                <ActionButton variant="error" onClick={() => {}}>
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
            {modal}
            {passwordModal}
            <div className="flex flex-col gap-y-4 mb-32">
                <Card noPadding>
                    {isError && <TechnicalError />}
                    {isLoading || isFetching ? (
                        <TableSkeleton arrayLength={data?.data?.length || 1} />
                    ) : data?.data && data?.data?.length ? (
                        <Table
                            columns={columns}
                            data={data?.data}
                            quickActions={quickActionsElements}
                            enableRowSelection
                        >
                            {({
                                table,
                                pagination,
                                pageSize,
                                quickActions,
                            }: TableChildrenProps) => {
                                return (
                                    <div>
                                        <div className="p-6 mb-2 flex justify-between">
                                            {pageSize &&
                                                pageSize(
                                                    itemPerPage,
                                                    (e) => {
                                                        setItemPerPage(e)
                                                        setIsRouting(false)
                                                    },
                                                    data?.data?.length
                                                )}
                                            <div className="flex gap-x-2">
                                                {quickActions}
                                                {pagination &&
                                                    pagination(
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
                                        {data?.data?.length > 10 && (
                                            <div className="p-6 mb-2 flex justify-between">
                                                {pageSize
                                                    ? pageSize(
                                                          itemPerPage,
                                                          (e) => {
                                                              setItemPerPage(e)
                                                              setIsRouting(
                                                                  false
                                                              )
                                                          },
                                                          data?.data?.length
                                                      )
                                                    : null}
                                                <div className="flex gap-x-2">
                                                    {quickActions}
                                                    {pagination
                                                        ? pagination(
                                                              data?.pagination,
                                                              setPage
                                                          )
                                                        : null}
                                                </div>
                                            </div>
                                        )}
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
