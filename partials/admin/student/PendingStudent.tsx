import {
    ActionButton,
    Card,
    EmptyData,
    LoadingAnimation,
    ShowErrorNotifications,
    Table,
    TableAction,
    TableActionOption,
    TableChildrenProps,
    TechnicalError,
    Typography,
} from '@components'
import { PageHeading } from '@components/headings'
import { ColumnDef } from '@tanstack/react-table'
import { FaEdit, FaEye } from 'react-icons/fa'

import { useActionModal } from '@hooks'
import { RtoCellInfo } from '@partials/admin/rto/components'
import { AdminApi, commonApi } from '@queries'
import { Student, UserStatus } from '@types'
import moment from 'moment'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { RiLockPasswordFill } from 'react-icons/ri'
import { SectorCell, StudentCellInfo } from './components'
import { useChangeStatus } from './hooks'
import { AcceptModal, RejectModal } from './modals'
import { UpdateTransferredStudentCoursesModal } from '@partials/common/StudentProfileDetail/modals'

export const PendingStudent = () => {
    const router = useRouter()
    const [modal, setModal] = useState<ReactElement | null>(null)

    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)

    useEffect(() => {
        setPage(Number(router.query.page))
        setItemPerPage(Number(router.query.pageSize))
    }, [router])

    // hooks
    const { passwordModal, onViewPassword } = useActionModal()

    const { isLoading, isFetching, data, isError, isSuccess } =
        AdminApi.Students.useListQuery(
            {
                search: `status:${UserStatus.Pending}`,
                skip: itemPerPage * page - itemPerPage,
                limit: itemPerPage,
            },
            {
                refetchOnMountOrArgChange: 30,
            }
        )
    const [bulkAction, resultBulkAction] = commonApi.useBulkStatusMutation()

    const { changeStatusResult } = useChangeStatus()
    const onModalCancelClicked = () => {
        setModal(null)
    }
    const onAcceptClicked = (item: Student) => {
        setModal(
            <AcceptModal item={item} onCancel={() => onModalCancelClicked()} />
        )
    }
    const onAddTransferredStudentCourses = (student: Student) => {
        setModal(
            <UpdateTransferredStudentCoursesModal
                studentId={student?.id}
                onCancel={(isSuccess?: boolean) => {
                    if (
                        student?.user?.status === UserStatus.Pending &&
                        isSuccess
                    ) {
                        onAcceptClicked(student)
                    } else {
                        onModalCancelClicked()
                    }
                }}
            />
        )
    }
    const onRejectClicked = (item: Student) => {
        setModal(
            <RejectModal item={item} onCancel={() => onModalCancelClicked()} />
        )
    }

    const tableActionOptions: TableActionOption<Student>[] = [
        {
            text: 'View',
            onClick: (student) => {
                router.push(`/portals/admin/student/${student?.id}/detail`)
            },
            Icon: FaEye,
        },
        {
            text: 'Edit',
            onClick: (row) => {
                router.push(`/portals/admin/student/edit-student/${row.id}`)
            },
            Icon: FaEdit,
        },
        {
            text: 'View Password',
            onClick: (student) => onViewPassword(student),
            Icon: RiLockPasswordFill,
        },
    ]

    const columns: ColumnDef<Student>[] = [
        {
            accessorKey: 'user.name',
            cell: (info) => <StudentCellInfo student={info.row.original} />,
            header: () => <span>Student</span>,
        },
        {
            accessorKey: 'rto',
            header: () => <span>RTO</span>,
            cell: (info) => {
                return info.row.original.rto ? (
                    <RtoCellInfo rto={info.row.original.rto} short />
                ) : (
                    <span>{info.row?.original?.rtoInfo}</span>
                )
            },
        },
        {
            accessorKey: 'sectors',
            header: () => <span>Sectors</span>,
            cell: (info) => {
                return <SectorCell student={info.row.original} />
            },
        },
        {
            accessorKey: 'courseDescription',
            header: () => <span>Course Description</span>,
            cell: (info) => (
                <Typography variant={'small'} semibold color={'text-gray-600'}>
                    {info.row.original?.courseDescription || '---'}
                </Typography>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: () => <span>Created At</span>,
            cell: (info) => (
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
            ),
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: (info: any) => (
                <div className="flex gap-x-1 items-center">
                    <ActionButton
                        variant="success"
                        onClick={() =>
                            info.row.original?.isTransferred &&
                            !info.row.original?.courses?.length
                                ? onAddTransferredStudentCourses(
                                      info.row.original
                                  )
                                : onAcceptClicked(info.row.original)
                        }
                        loading={changeStatusResult.isLoading}
                        disabled={changeStatusResult.isLoading}
                    >
                        Accept
                    </ActionButton>
                    <ActionButton
                        variant="error"
                        onClick={() => onRejectClicked(info.row.original)}
                        loading={changeStatusResult.isLoading}
                        disabled={changeStatusResult.isLoading}
                    >
                        Reject
                    </ActionButton>

                    <TableAction
                        options={tableActionOptions}
                        rowItem={info.row.original}
                    />
                </div>
            ),
        },
    ]

    const quickActionsElements = {
        id: 'id',
        individual: (student: Student) => (
            <div className="flex gap-x-2">
                <ActionButton
                    variant="success"
                    onClick={() => {
                        onAcceptClicked(student)
                    }}
                >
                    Accept
                </ActionButton>
                <ActionButton
                    variant="error"
                    onClick={() => {
                        onRejectClicked(student)
                    }}
                >
                    Reject
                </ActionButton>
            </div>
        ),
        common: (ids: Student[]) => (
            <div className="flex gap-x-2">
                <ActionButton
                    onClick={() => {
                        const arrayOfIds = ids.map((id: any) => id?.user.id)
                        bulkAction({ ids: arrayOfIds, status: 'approved' })
                    }}
                    variant="success"
                >
                    Accept
                </ActionButton>
                <ActionButton
                    onClick={() => {
                        const arrayOfIds = ids.map((id: any) => id?.user.id)
                        bulkAction({ ids: arrayOfIds, status: 'rejected' })
                    }}
                    variant="error"
                >
                    Reject
                </ActionButton>
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
                    title={'Pending Students'}
                    subtitle={'List of Pending Students'}
                />

                <Card noPadding>
                    {isError && <TechnicalError />}
                    {isLoading || isFetching ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : data && data?.data.length && isSuccess ? (
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
                            }: TableChildrenProps) => (
                                <div>
                                    <div className="p-6 mb-2 flex justify-between">
                                        {pageSize &&
                                            pageSize(
                                                itemPerPage,
                                                setItemPerPage,
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
                                    <div
                                        className="px-6"
                                        id={'studentScrollId'}
                                    >
                                        {table}
                                    </div>
                                    {data?.data?.length > 10 && (
                                        <div className="p-6 mb-2 flex justify-between">
                                            {pageSize &&
                                                pageSize(
                                                    itemPerPage,
                                                    setItemPerPage,
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
                                    )}
                                </div>
                            )}
                        </Table>
                    ) : (
                        !isError && (
                            <EmptyData
                                title={'No Pending Student!'}
                                description={
                                    'You have no pending Student request yet'
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
