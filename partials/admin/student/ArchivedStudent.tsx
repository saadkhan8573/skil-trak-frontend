import {
    ActionButton,
    Button, // Added for potential usage if needed, but primarily added Phone and modals
    Card,
    CaseOfficerAssignedStudent,
    EmptyData,
    LoadingAnimation,
    StudentJobId,
    Table,
    TableAction,
    TableActionOption,
    TableChildrenProps,
    TechnicalError,
    Typography,
} from '@components'
import { PageHeading } from '@components/headings'
import { ColumnDef } from '@tanstack/react-table'
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa'

import { EditTimer } from '@components/StudentTimer/EditTimer'
import { useActionModal } from '@hooks'
import { BulkDeleteModal } from '@modals'
import { AdminApi } from '@queries'
import { Student, UserStatus } from '@types'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { CgUnblock } from 'react-icons/cg'
import { MdBlock } from 'react-icons/md'
import { RiLockPasswordFill } from 'react-icons/ri'
import { RtoCellInfo } from '../rto/components'
import { SectorCell, StudentCellInfo, StudentIndustries } from './components'
import { Phone } from 'lucide-react'
import {
    AdminStudentModalType,
    AcceptModal,
    BlockModal,
    ChangeStatusModal,
    DeleteModal,
    getAdminStudentsModal,
} from './modals'

export const ArchivedStudent = () => {
    const router = useRouter()
    const [itemPerPage, setItemPerPage] = useState(30)
    const [page, setPage] = useState(1)
    const [modal, setModal] = useState<any | null>(null)

    useEffect(() => {
        setPage(Number(router.query.page))
        setItemPerPage(Number(router.query.pageSize))
    }, [router])

    // hooks
    const { passwordModal, onViewPassword } = useActionModal()

    const { isLoading, isFetching, data, isError, refetch } =
        AdminApi.Students.useListQuery(
            {
                search: `status:${UserStatus.Archived}`,
                skip: itemPerPage * page - itemPerPage,
                limit: itemPerPage,
            },
            {
                refetchOnMountOrArgChange: 30,
            }
        )

    const onModalCancelClicked = () => {
        setModal(null)
    }

    const handleOpenModal = (type: AdminStudentModalType, student: any) => {
        setModal(getAdminStudentsModal(type, student, onModalCancelClicked))
    }

    const onDeleteClicked = (item: Student) => {
        setModal(
            <DeleteModal item={item} onCancel={() => onModalCancelClicked()} />
        )
    }

    const onBlockClicked = (student: Student) => {
        setModal(
            <BlockModal
                item={student}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }

    const onAcceptClicked = (item: Student) => {
        setModal(
            <AcceptModal item={item} onCancel={() => onModalCancelClicked()} />
        )
    }

    const onChangeStatus = (student: Student) => {
        setModal(
            <ChangeStatusModal
                student={student}
                onCancel={onModalCancelClicked}
            />
        )
    }

    const onDateClick = (student: Student) => {
        setModal(
            <EditTimer
                studentId={student?.user?.id}
                date={student?.expiryDate}
                onCancel={onModalCancelClicked}
            />
        )
    }

    const onBulkDeleteClicked = (ids: number[]) => {
        setModal(
            <BulkDeleteModal onCancel={onModalCancelClicked} usersIds={ids} />
        )
    }

    const tableActionOptions: TableActionOption<any>[] = [
        {
            text: 'View',
            onClick: (student: any) => {
                router.push(`/portals/admin/student/${student?.id}/detail`)
            },
            Icon: FaEye,
        },
        // {
        //     text: 'View Old Profile',
        //     onClick: (student) => {
        //         router.push(`/portals/admin/student/${student?.id}/old-profile`)
        //     },
        //     Icon: FaEye,
        // },
        {
            text: 'Edit',
            onClick: (row: any) => {
                router.push(`/portals/admin/student/edit-student/${row?.id}`)
            },
            Icon: FaEdit,
        },
        {
            text: 'AI Voice Call',
            onClick: (student: Student) => {
                handleOpenModal(AdminStudentModalType.AI_CALL, student)
            },
            Icon: () => <Phone className="w-3 h-3" />,
        },
        {
            text: 'View Password',
            onClick: (student: Student) => onViewPassword(student),
            Icon: RiLockPasswordFill,
        },
        {
            text: 'Change Expiry',
            onClick: (student: Student) => onDateClick(student),
            Icon: FaEdit,
        },
        {
            text: 'Change Status',
            onClick: (student: Student) => {
                onChangeStatus(student)
            },
            Icon: FaEdit,
        },
        {
            text: 'Un Archive',
            onClick: (student: Student) => onAcceptClicked(student),
            Icon: CgUnblock,
            color: 'text-orange-500 hover:bg-orange-100 hover:border-orange-200',
        },
        {
            text: 'Block',
            onClick: (student: Student) => onBlockClicked(student),
            Icon: MdBlock,
            color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
        },
        {
            text: 'Delete',
            onClick: (student: Student) => onDeleteClicked(student),
            Icon: FaTrash,
            color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
        },
    ]

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
                return <StudentCellInfo student={info.row.original} call />
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
            cell: (info) => <SectorCell student={info.row.original} />,
        },
        {
            accessorKey: 'expiry',
            header: () => <span>Expiry Countdown</span>,
            cell: (info) => (
                <Typography variant={'small'} color={'text-primary'}>
                    <span className="font-semibold whitespace-pre">
                        {moment(
                            info?.row?.original?.oldExpiry ||
                                info?.row?.original?.expiryDate
                        ).format('Do MMM YYYY')}
                    </span>
                </Typography>
            ),
        },
        {
            accessorKey: 'expiry',
            header: () => <span>Days Expired</span>,
            cell: (info) => {
                var marchFirst = new Date(
                    info?.row?.original?.oldExpiry ||
                        info?.row?.original?.expiryDate
                )

                // Get today's date
                var today = new Date()

                // Calculate the difference in milliseconds between today and March 1st
                var timeDifference = today.getTime() - marchFirst.getTime()

                // Convert milliseconds to days
                var daysPassed = Math.ceil(timeDifference / (1000 * 3600 * 24))

                return info.row.original?.studentStatus === 'expired' &&
                    marchFirst < new Date() ? (
                    <Typography variant={'small'} color="text-red-400">
                        <span className="font-medium whitespace-pre">
                            Expired{' '}
                            <span className="font-bold text-red-600">
                                {daysPassed}
                            </span>{' '}
                            days ago
                        </span>
                    </Typography>
                ) : (
                    '---'
                )
            },
        },
        {
            accessorKey: 'progress',
            header: () => <span>Progress</span>,
            cell: ({ row }) => (
                <CaseOfficerAssignedStudent student={row?.original} />
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
            cell: (info) => (
                <div className="flex gap-x-1 items-center">
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
                    onClick={() => {
                        onDateClick(student)
                    }}
                >
                    Change Expiry
                </ActionButton>

                <ActionButton
                    Icon={FaTrash}
                    variant="error"
                    onClick={() => {
                        onDeleteClicked(student)
                    }}
                >
                    Delete
                </ActionButton>
            </div>
        ),
        common: (ids: Student[]) => (
            <div className="flex gap-x-2">
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
            </div>
        ),
    }

    return (
        <>
            {modal}
            {passwordModal && passwordModal}
            <div className="flex flex-col gap-y-4 mb-32">
                <PageHeading
                    title={'Archived Students'}
                    subtitle={'List of Archived Students'}
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
                            }: TableChildrenProps) => {
                                return (
                                    <div>
                                        <div className="p-6 mb-2 flex justify-between">
                                            {pageSize
                                                ? pageSize(
                                                      itemPerPage,
                                                      setItemPerPage,
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
                                        <div
                                            className="px-6 overflow-x-auto remove-scrollbar"
                                            id={'studentScrollId'}
                                        >
                                            {table}
                                        </div>
                                        {data?.data?.length > 10 && (
                                            <div className="p-6 mb-2 flex justify-between">
                                                {pageSize
                                                    ? pageSize(
                                                          itemPerPage,
                                                          setItemPerPage,
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
                                title={'No Archived RTO!'}
                                description={
                                    'You have not archived any RTO request yet'
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
