import {
    ActionButton,
    Card,
    CaseOfficerAssignedStudent,
    EmptyData,
    LoadingAnimation,
    ShowErrorNotifications,
    StudentExpiryDaysLeft,
    StudentJobId,
    Table,
    TableAction,
    TechnicalError,
    Typography,
} from '@components'
import { PageHeading } from '@components/headings'
import { ColumnDef } from '@tanstack/react-table'
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa'

import { UserRoles } from '@constants'
import { useActionModal } from '@hooks'
import { BulkDeleteModal } from '@modals'
import { AdminApi, commonApi } from '@queries'
import { Student, UserStatus } from '@types'
import { getBlockedByStudent, getUserCredentials } from '@utils'
import moment from 'moment'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { CgUnblock } from 'react-icons/cg'
import { RiLockPasswordFill } from 'react-icons/ri'
import { RtoCellInfo } from '../rto/components'
import { SectorCell, StudentCellInfo, StudentIndustries } from './components'
import { DeleteModal, UnblockModal } from './modals'

export const BlockedStudent = () => {
    const router = useRouter()
    const [modal, setModal] = useState<ReactElement | null>(null)
    const [itemPerPage, setItemPerPage] = useState(20)
    const [page, setPage] = useState(1)
    const role = getUserCredentials()?.role
    useEffect(() => {
        setPage(Number(router.query.page))
        setItemPerPage(Number(router.query.pageSize))
    }, [router])

    // hooks
    const { passwordModal, onViewPassword } = useActionModal()

    const { isLoading, isFetching, data, isError } =
        AdminApi.Students.useListQuery(
            {
                search: `status:${UserStatus.Blocked}`,
                skip: itemPerPage * page - itemPerPage,
                limit: itemPerPage,
            },
            {
                refetchOnMountOrArgChange: 30,
            }
        )
    const [bulkAction, resultBulkAction] = commonApi.useBulkStatusMutation()

    const onModalCancelClicked = () => {
        setModal(null)
    }
    const onUnblockClicked = (student: Student) => {
        setModal(
            <UnblockModal
                item={student}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }
    const onDeleteClicked = (student: Student) => {
        setModal(
            <DeleteModal
                item={student}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }

    const onBulkDeleteClicked = (ids: number[]) => {
        setModal(
            <BulkDeleteModal onCancel={onModalCancelClicked} usersIds={ids} />
        )
    }

    const tableActionOptions = (student: any) => {
        return [
            {
                text: 'View',
                onClick: (student: any) => {
                    router.push(`/portals/admin/student/${student?.id}/detail`)
                },
                Icon: FaEye,
            },
            // {
            //     text: 'View Old Profile',
            //     onClick: (student: Student) => {
            //         router.push(
            //             `/portals/admin/student/${student?.id}/old-profile`
            //         )
            //     },
            //     Icon: FaEye,
            // },
            {
                text: 'Edit',
                onClick: (row: any) => {
                    router.push(
                        `/portals/admin/student/edit-student/${row?.id}`
                    )
                },
                Icon: FaEdit,
            },
            {
                text: 'View Password',
                onClick: (student: Student) => onViewPassword(student),
                Icon: RiLockPasswordFill,
            },
            {
                text: 'Unblock',
                onClick: (student: Student) => onUnblockClicked(student),
                Icon: CgUnblock,
                color: 'text-orange-500 hover:bg-orange-100 hover:border-orange-200',
            },
            {
                ...(role === UserRoles.ADMIN
                    ? {
                          text: `Delete`,
                          onClick: (student: any) => {
                              onDeleteClicked(student)
                          },
                          Icon: FaTrash,
                          color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
                      }
                    : {}),
            },
            // {
            //     text: 'Delete',
            //     onClick: (student: Student) => onDeleteClicked(student),
            //     Icon: FaTrash,
            //     color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
            // },
        ]
    }

    const columns: ColumnDef<Student>[] = [
        {
            header: () => 'Job Id',
            accessorKey: 'studentMaskedId',
            cell: ({ row }) => (
                <StudentJobId studentJobId={row.original?.studentMaskedId} />
            ),
        },
        {
            accessorKey: 'user.name',
            cell: (info) => {
                return <StudentCellInfo student={info.row.original} />
            },
            header: () => <span>Student</span>,
        },
        {
            accessorKey: 'rto',
            header: () => <span>RTO</span>,
            cell: (info) => {
                return <RtoCellInfo rto={info.row.original.rto} short />
            },
        },
        {
            accessorKey: 'industry',
            header: () => <span>Industry</span>,
            cell: (info) => (
                <StudentIndustries
                    industries={info.row.original?.industries}
                    workplace={info.row.original?.workplace}
                />
            ),
        },
        {
            accessorKey: 'batch',
            header: () => <span>Batch</span>,
            cell: ({ row }) => (
                <Typography whiteSpacePre variant="small" medium>
                    {row?.original?.batch}
                </Typography>
            ),
        },
        {
            accessorKey: 'sectors',
            header: () => <span>Sectors</span>,
            cell: (info) => {
                return <SectorCell student={info.row.original} />
            },
        },
        {
            accessorKey: 'expiry',
            header: () => <span>Expiry Countdown</span>,
            cell: (info) => (
                <StudentExpiryDaysLeft
                    expiryDate={info.row.original?.expiryDate}
                />
            ),
        },
        {
            accessorKey: 'progress',
            header: () => <span>Progress</span>,
            cell: ({ row }) => (
                <CaseOfficerAssignedStudent student={row.original} />
            ),
        },
        {
            accessorKey: 'blockedBy',
            header: () => <span>Blocked By</span>,
            cell: ({ row }) => {
                const blockedBy = getBlockedByStudent(
                    row.original?.user?.statusChangeHistory
                )
                return (
                    <Typography variant={'small'} capitalize>
                        <span className="font-bold">{blockedBy?.updateBy}</span>
                    </Typography>
                )
            },
        },
        {
            accessorKey: 'createdAt',
            header: () => <span>Created At</span>,
            cell: (info) => {
                return (
                    <>
                        <Typography variant={'small'} color={'text-gray-600'}>
                            <span className="font-semibold whitespace-pre">
                                {moment(info?.row?.original?.createdAt).format(
                                    'Do MMM YYYY'
                                )}
                            </span>
                        </Typography>
                        <Typography variant={'small'} color={'text-gray-600'}>
                            <span className="font-semibold whitespace-pre">
                                {moment(info?.row?.original?.createdAt).format(
                                    'hh:mm:ss a'
                                )}
                            </span>
                        </Typography>
                    </>
                )
            },
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: (info: any) => {
                const actions = tableActionOptions(info?.row?.original)
                return (
                    <div className="flex gap-x-1 items-center">
                        <TableAction
                            options={actions}
                            rowItem={info.row.original}
                        />
                    </div>
                )
            },
        },
    ]

    const quickActionsElements = {
        id: 'id',
        individual: (id: Student) => (
            <div className="flex gap-x-2">
                <ActionButton>Sub Admins</ActionButton>
                <ActionButton Icon={CgUnblock} variant="warning">
                    Unblock
                </ActionButton>
                {role === UserRoles.ADMIN && (
                    <ActionButton Icon={FaTrash} variant="error">
                        Delete
                    </ActionButton>
                )}
            </div>
        ),
        common: (ids: Student[]) => (
            <div className="flex gap-x-2">
                <ActionButton
                    onClick={() => {
                        const arrayOfIds = ids.map((id: any) => id?.user.id)
                        bulkAction({ ids: arrayOfIds, status: 'approved' })
                    }}
                    Icon={CgUnblock}
                    variant="warning"
                >
                    Unblock
                </ActionButton>
                {role === UserRoles.ADMIN && (
                    <ActionButton
                        Icon={FaTrash}
                        variant="error"
                        onClick={() => {
                            const arrayOfIds = ids.map((id: any) => id?.user.id)
                            onBulkDeleteClicked(arrayOfIds)
                        }}
                    >
                        Delete
                    </ActionButton>
                )}
            </div>
        ),
    }

    return (
        <>
            {modal && modal}
            {passwordModal && passwordModal}
            <ShowErrorNotifications result={resultBulkAction} />
            <div className="flex flex-col gap-y-4 mb-32">
                <PageHeading
                    title={'Blocked Students'}
                    subtitle={'List of Blocked Students'}
                />

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
                                        <div
                                            className="px-6 overflow-auto remove-scrollbar"
                                            id={'studentScrollId'}
                                        >
                                            {table}
                                        </div>
                                    </div>
                                )
                            }}
                        </Table>
                    ) : (
                        !isError && (
                            <EmptyData
                                title={'No Blocked Students!'}
                                description={'You have not blocked Student yet'}
                                height={'50vh'}
                            />
                        )
                    )}
                </Card>
            </div>
        </>
    )
}
