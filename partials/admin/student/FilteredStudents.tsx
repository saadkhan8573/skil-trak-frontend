import {
    ActionButton,
    Card,
    CaseOfficerAssignedStudent,
    EmptyData,
    LoadingAnimation,
    StudentExpiryDaysLeft,
    StudentJobId,
    Table,
    TableAction,
    TableActionOption,
    Typography,
} from '@components'
import { PageHeading } from '@components/headings'
import { ColumnDef } from '@tanstack/react-table'
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa'

import { UserRoles } from '@constants'
import { useActionModal } from '@hooks'
import { RtoCellInfo } from '@partials/admin/rto/components'
import { Student, UserStatus } from '@types'
import { getUserCredentials } from '@utils'
import moment from 'moment'
import { useRouter } from 'next/router'
import { ReactElement, ReactNode, useState } from 'react'
import { CgUnblock } from 'react-icons/cg'
import { MdBlock } from 'react-icons/md'
import { RiLockPasswordFill } from 'react-icons/ri'
import { isWorkplaceValid } from 'utils/workplaceRowBlinking'
import { SectorCell, StudentCellInfo, StudentIndustries } from './components'
import {
    AcceptModal,
    ArchiveModal,
    BlockModal,
    BlockMultiStudentsModal,
    ChangeStatusModal,
    DeleteModal,
    RejectModal,
    UnblockModal,
    AdminStudentModalType,
    getAdminStudentsModal,
} from './modals'

import { Phone } from 'lucide-react'

interface StatusTableActionOption<T> extends TableActionOption<T> {
    status: UserStatus[]
}

export const FilteredStudents = ({
    filter,
    student,
    setPage,
    itemPerPage,
    setItemPerPage,
}: {
    filter: any
    student: any
    setPage: any
    itemPerPage: any
    setItemPerPage: any
}) => {
    const router = useRouter()
    const [modal, setModal] = useState<ReactNode | null>(null)
    const role = getUserCredentials()?.role
    // hooks
    const { passwordModal, onViewPassword } = useActionModal()

    // ================= Blinking/Flashing rows of students ================
    const findCallLogsUnanswered = student?.data?.data?.filter(
        (student: any) => {
            const unansweredCalls = student?.callLog?.filter((call: any) => {
                if (call?.isAnswered === null) {
                    const isMoreThanSevenDays =
                        moment().diff(moment(call?.createdAt), 'days') >= 7
                    return isMoreThanSevenDays
                }
                return false
            })

            const checkPlacementStarted =
                student?.workplace?.length &&
                student?.workplace?.some(
                    (placement: any) =>
                        placement?.currentStatus === 'completed' ||
                        placement?.currentStatus === 'placementStarted'
                )

            return (
                !student?.hasIssue &&
                !student?.isSnoozed &&
                !student?.nonContactable &&
                !checkPlacementStarted &&
                unansweredCalls?.length > 0
            )
        }
    )
    const findExpiringInNext45Days = student?.data?.data?.filter(
        (student: any) => {
            const expiryDate = new Date(student?.expiryDate)
            const currentDate = new Date()
            const timeDiff = expiryDate.getTime() - currentDate.getTime()
            const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
            const checkPlacementStarted =
                student?.workplace?.length &&
                student?.workplace?.some(
                    (placement: any) =>
                        placement?.currentStatus === 'completed' ||
                        placement?.currentStatus === 'placementStarted'
                )
            return (
                !student?.hasIssue &&
                !student?.isSnoozed &&
                !student?.nonContactable &&
                !checkPlacementStarted &&
                // student?.workplace?.length === 0 &&
                daysDiff <= 45 &&
                daysDiff >= 0
            )
        }
    )

    const filterAwaitingAgreementBeyondSevenDays = student?.data?.data?.filter(
        (student: any) => {
            return (
                !student?.hasIssue &&
                !student?.isSnoozed &&
                !student?.nonContactable &&
                student?.workplace?.some((workplace: any) =>
                    isWorkplaceValid(workplace)
                )
            )
        }
    )
    // ============================= END ====================================

    const onModalCancelClicked = () => {
        setModal(null)
    }

    const handleOpenModal = (type: AdminStudentModalType, student: any) => {
        setModal(getAdminStudentsModal(type, student, onModalCancelClicked))
    }
    const onBlockClicked = (student: Student) => {
        setModal(
            <BlockModal
                item={student}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }

    const onUnblockClicked = (student: Student) => {
        setModal(
            <UnblockModal
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
    const onRejectClicked = (item: Student) => {
        setModal(
            <RejectModal item={item} onCancel={() => onModalCancelClicked()} />
        )
    }
    const onArchivedClicked = (item: Student) => {
        setModal(
            <ArchiveModal item={item} onCancel={() => onModalCancelClicked()} />
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

    const onChangeStatus = (student: Student) => {
        setModal(
            <ChangeStatusModal
                student={student}
                onCancel={onModalCancelClicked}
            />
        )
    }

    const onBlockMultiStudents = (student: Student[]) => {
        setModal(
            <BlockMultiStudentsModal
                onCancel={onModalCancelClicked}
                student={student}
            />
        )
    }

    const onBulkCallClicked = (students: Student[]) => {
        handleOpenModal(AdminStudentModalType.BULK_AI_CALL, students)
    }

    const tableActionOptions: TableActionOption<any>[] = [
        {
            text: 'View',
            onClick: (student: any) => {
                router.push(`/portals/admin/student/${student?.id}/detail`)
            },
            Icon: FaEye,
        },
        {
            text: 'Edit',
            onClick: (row: any) => {
                router.push(`/portals/admin/student/edit-student/${row?.id}`)
            },
            Icon: FaEdit,
        },
        {
            text: 'AI Voice Call',
            onClick: (student: any) => {
                handleOpenModal(AdminStudentModalType.AI_CALL, student)
            },
            Icon: () => <Phone className="w-3 h-3" />,
        },
        {
            text: 'View Password',
            onClick: (student: Student) => onViewPassword(student),
            Icon: RiLockPasswordFill,
        },
    ]
    const statusBaseActions: StatusTableActionOption<Student>[] = [
        {
            status: [UserStatus.Approved, UserStatus.Archived],
            text: 'Change Status',
            onClick: (student) => onChangeStatus(student),
            Icon: FaEdit,
        },
        {
            status: [UserStatus.Approved, UserStatus.Archived],
            text: 'Block',
            onClick: (student) => onBlockClicked(student),
            Icon: MdBlock,
            color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
        },
        {
            status: [UserStatus.Approved],
            text: 'Archive',
            onClick: (student) => onArchivedClicked(student),
            Icon: MdBlock,
            color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
        },
        {
            status: [UserStatus.Blocked],
            text: 'Unblock',
            onClick: (student) => onUnblockClicked(student),
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
                      onClick: (student) => onDeleteClicked(student),
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
        //     onClick: (student) => onDeleteClicked(student),
        //     Icon: FaTrash,
        //     color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
        // },
        {
            status: [UserStatus.Pending, UserStatus.Rejected],
            text: 'Accept',
            onClick: (student) => onAcceptClicked(student),
            Icon: CgUnblock,
            color: 'text-orange-500 hover:bg-orange-100 hover:border-orange-200',
        },
        {
            status: [UserStatus.Archived],
            text: 'Un Archive',
            onClick: (student) => onAcceptClicked(student),
            Icon: CgUnblock,
            color: 'text-orange-500 hover:bg-orange-100 hover:border-orange-200',
        },
        {
            status: [UserStatus.Pending],
            text: 'Reject',
            onClick: (student) => onRejectClicked(student),
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
            // cell: (info) => 'Saad',
            cell: (info) => {
                return info.row.original?.user ? (
                    <StudentCellInfo student={info.row.original} call />
                ) : (
                    ''
                )
            },
            header: () => <span>Student</span>,
        },
        {
            accessorKey: 'rto',
            header: () => <span>RTO</span>,
            cell: (info) => (
                <RtoCellInfo rto={info?.row?.original?.rto} short />
            ),
        },
        {
            accessorKey: 'industry',
            header: () => <span>Industry</span>,
            cell: (info) => (
                <StudentIndustries
                    workplace={info.row.original?.workplace}
                    industries={info.row.original?.industries}
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
                <StudentExpiryDaysLeft
                    expiryDate={info.row.original?.expiryDate}
                />
            ),
        },
        {
            accessorKey: 'progress',
            header: () => <span>Progress</span>,
            cell: ({ row }) => (
                <CaseOfficerAssignedStudent
                    student={row.original}
                    workplaceFilter={filter?.currentStatus}
                />
            ),
        },
        {
            accessorKey: 'user.status',
            header: () => <span>Status</span>,
            cell: (info) => (
                <Typography
                    uppercase
                    variant={'badge'}
                    color={
                        info.row.original?.user?.status === UserStatus.Blocked
                            ? 'text-error'
                            : 'text-black'
                    }
                >
                    <span className="font-bold">
                        {info.row.original?.user?.status}
                    </span>
                </Typography>
            ),
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
            cell: (info) => (
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
            ),
        },
    ]

    const quickActionsElements = {
        id: 'id',
        individual: (student: Student) => (
            <div className="flex gap-x-2">
                <ActionButton Icon={FaEdit}>Edit</ActionButton>
                <ActionButton>Sub Admins</ActionButton>
                <ActionButton Icon={MdBlock} variant="error">
                    Block
                </ActionButton>
                {filter?.courseId && (
                    <ActionButton
                        onClick={() => {
                            handleOpenModal(
                                AdminStudentModalType.AI_CALL,
                                student
                            )
                        }}
                        Icon={Phone}
                    >
                        Call
                    </ActionButton>
                )}
            </div>
        ),
        common: (student: Student[]) => (
            <div className="flex gap-x-2">
                {filter?.courseId && (
                    <ActionButton
                        onClick={() => {
                            onBulkCallClicked(student)
                        }}
                        Icon={Phone}
                    >
                        Call
                    </ActionButton>
                )}
                <ActionButton
                    onClick={() => {
                        onBlockMultiStudents(student)
                    }}
                    Icon={MdBlock}
                    variant="error"
                >
                    Block
                </ActionButton>
            </div>
        ),
    }

    return (
        <>
            {modal && modal}
            {passwordModal && passwordModal}
            <div className="flex flex-col gap-y-4 p-4">
                <PageHeading
                    title={'Filtered Students'}
                    subtitle={'List of Filtered Students'}
                />

                <Card noPadding>
                    {student?.isLoading || student?.isFetching ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : student?.data && student?.data?.data.length ? (
                        <Table
                            columns={columns}
                            data={student?.data.data}
                            quickActions={quickActionsElements}
                            enableRowSelection
                            awaitingAgreementBeyondSevenDays={
                                filterAwaitingAgreementBeyondSevenDays
                            }
                            findCallLogsUnanswered={findCallLogsUnanswered}
                            findExpiringInNext45Days={findExpiringInNext45Days}
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
                                                student.data?.data?.length
                                            )}
                                            <div className="flex gap-x-2">
                                                {quickActions}
                                                {pagination(
                                                    student?.data?.pagination,
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
                                        {student.data?.data?.length > 10 && (
                                            <div className="p-6 mb-2 flex justify-between">
                                                {pageSize(
                                                    itemPerPage,
                                                    setItemPerPage,
                                                    student.data?.data?.length
                                                )}
                                                <div className="flex gap-x-2">
                                                    {quickActions}
                                                    {pagination(
                                                        student?.data
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
                            title={'No Students in your Search!'}
                            description={'No Students in your Search yet'}
                            height={'50vh'}
                        />
                    )}
                </Card>
            </div>
        </>
    )
}
