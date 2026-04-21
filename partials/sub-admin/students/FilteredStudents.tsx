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
    TableChildrenProps,
    Typography,
    UserCreatedAt,
} from '@components'
import { PageHeading } from '@components/headings'
import { SectorCell } from '@partials/admin/student/components'
import { ColumnDef } from '@tanstack/react-table'
import { Student, UserStatus } from '@types'
import { getStudentWorkplaceAppliedIndustry, setLink } from '@utils'
import moment from 'moment'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import { FaEdit, FaEye, FaUsers } from 'react-icons/fa'
import { MdBlock } from 'react-icons/md'
import { WorkplaceWorkIndustriesType } from '@redux/queryTypes'
import { isWorkplaceValid } from 'utils/workplaceRowBlinking'
import { RTOCellInfo } from '../rto/components'
import { InterviewModal } from '../workplace/modals'
import {
    AssignCoordinator,
    StudentCellInfo,
    SubadminStudentIndustries,
} from './components'
import {
    AddToNonContactableStudents,
    AssignStudentModal,
    BlockModal,
    ChangeStudentStatusModal,
} from './modals'
import { useSubadminProfile } from '@hooks'

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
    const [modal, setModal] = useState<ReactElement | null>(null)
    const coordinatorProfile = useSubadminProfile()
    const checkIsHod = coordinatorProfile?.departmentMember?.isHod
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
    const onAssignStudentClicked = (student: Student) => {
        setModal(
            <AssignStudentModal
                student={student}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }

    const onNonContactableStudents = (student: Student) => {
        setModal(
            <AddToNonContactableStudents
                student={student}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }

    const onBlockClicked = (student: Student) => {
        setModal(<BlockModal item={student} onCancel={onModalCancelClicked} />)
    }

    const onChangeStatus = (student: Student) => {
        setModal(
            <ChangeStudentStatusModal
                student={student}
                onCancel={onModalCancelClicked}
            />
        )
    }

    const onInterviewClicked = (student: Student) => {
        setModal(
            <InterviewModal
                student={student}
                onCancel={onModalCancelClicked}
                workplace={Number(student?.workplace[0]?.id)}
                workIndustry={Number(
                    getStudentWorkplaceAppliedIndustry(
                        student?.workplace[0]
                            ?.industries as WorkplaceWorkIndustriesType[]
                    )?.id
                )}
            />
        )
    }

    const tableActionOptions = (
        student: Student
    ): TableActionOption<Student>[] => {
        return [
            {
                text: 'View',
                onClick: (student) => {
                    router.push(
                        `/portals/sub-admin/students/${student?.id}/detail`
                    )

                    setLink('subadmin-student', router)
                },
                Icon: FaEye,
            },
            // {
            //     text: 'View Old Profile',
            //     onClick: (student) => {
            //         router.push(
            //             `/portals/sub-admin/students/${student?.id}/old-updated-profile`
            //         )

            //         setLink('subadmin-student', router)
            //     },
            //     Icon: FaEye,
            // },
            {
                text: student?.subadmin ? 'Un Assign' : 'Assign to me',
                onClick: (student) => onAssignStudentClicked(student),
                Icon: MdBlock,
            },
            {
                text: student?.nonContactable
                    ? 'Add to Contactable'
                    : 'Add to Not Contactable',
                onClick: (student) => onNonContactableStudents(student),
                Icon: MdBlock,
            },
            {
                text: 'Interview',
                onClick: (student) => onInterviewClicked(student),
                Icon: FaUsers,
            },
            {
                text: 'Change Status',
                onClick: (student) => onChangeStatus(student),
                Icon: FaEdit,
            },
            {
                text: 'Block',
                onClick: (student) => onBlockClicked(student),
                Icon: MdBlock,
                color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
            },
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
            header: () => 'Name',
            accessorKey: 'user',
            cell: ({ row }) => {
                return row.original?.user ? (
                    <StudentCellInfo student={row.original} call />
                ) : (
                    ''
                )
            },
        },
        {
            header: () => 'RTO',
            accessorKey: 'rto',
            cell: ({ row }: any) => <RTOCellInfo rto={row.original?.rto} />,
        },
        {
            accessorKey: 'industry',
            header: () => <span>Industry</span>,
            cell: (info) => (
                <SubadminStudentIndustries
                    workplace={info.row.original?.workplace}
                    industries={info.row.original?.industries}
                />
            ),
        },
        {
            accessorKey: 'sectors',
            header: () => <span>Sectors</span>,
            cell: ({ row }) => {
                return <SectorCell student={row.original} />
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
                <CaseOfficerAssignedStudent
                    student={row.original}
                    workplaceFilter={filter?.currentStatus}
                />
            ),
        },
        {
            accessorKey: 'assignCoordinator',
            header: () => <span>Assign Coordinator</span>,
            cell: ({ row }) => {
                // if is not hod then don;t show this column
                if (!checkIsHod) return <p>---</p>
                return <AssignCoordinator student={row?.original} />
            },
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
            cell: ({ row }) => (
                <UserCreatedAt createdAt={row.original?.createdAt} />
            ),
        },
        {
            header: () => 'Action',
            accessorKey: 'Action',
            cell: ({ row }) => {
                const tableActionOption = tableActionOptions(row.original)
                return (
                    <TableAction
                        options={tableActionOption}
                        rowItem={row.original}
                    />
                )
            },
        },
    ]

    const quickActionsElements = {
        id: 'id',
        individual: (id: Student) => (
            <div className="flex gap-x-2">
                <ActionButton Icon={FaEdit}>Edit</ActionButton>
                <ActionButton>Sub Admins</ActionButton>
                <ActionButton Icon={MdBlock} variant="error">
                    Block
                </ActionButton>
            </div>
        ),
        common: (ids: Student[]) => (
            <ActionButton Icon={MdBlock} variant="error">
                Block
            </ActionButton>
        ),
    }

    const ind = student?.data?.data?.map((s: any) => s?.industries?.[0]?.id)
    const abc = student?.data?.data?.filter((s: any) =>
        ind?.includes(Number(filter?.industryId))
    )
    const wp = student?.data?.data
        ?.map((s: any) => s?.workplace)
        ?.flat()
        ?.map((s: any) => s?.industries?.filter((s: any) => s?.applied))
        ?.flat()

    return (
        <>
            {modal}
            <div className="flex flex-col gap-y-4 p-4">
                <PageHeading
                    title={'Filtered Students'}
                    subtitle={'List of Filtered Students'}
                />

                <Card noPadding>
                    {student?.isLoading || student.isFetching ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : student?.data?.data && student?.data?.data?.length ? (
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
                            }: TableChildrenProps) => {
                                return (
                                    <div>
                                        <div className="p-6 mb-2 flex justify-between">
                                            {pageSize
                                                ? pageSize(
                                                      itemPerPage,
                                                      setItemPerPage,
                                                      student?.data?.data
                                                          ?.length
                                                  )
                                                : null}
                                            <div className="flex gap-x-2">
                                                {quickActions}
                                                {pagination
                                                    ? pagination(
                                                          student?.data
                                                              ?.pagination,
                                                          setPage
                                                      )
                                                    : null}
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
                                        {student?.data?.data?.length > 10 && (
                                            <div className="p-6 mb-2 flex justify-between">
                                                {pageSize
                                                    ? pageSize(
                                                          itemPerPage,
                                                          setItemPerPage,
                                                          student?.data?.data
                                                              ?.length
                                                      )
                                                    : null}
                                                <div className="flex gap-x-2">
                                                    {quickActions}
                                                    {pagination
                                                        ? pagination(
                                                              student?.data
                                                                  ?.pagination,
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
