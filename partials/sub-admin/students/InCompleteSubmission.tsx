import { useRouter } from 'next/router'
import { ReactElement } from 'react'

// Icons
import { FaEdit, FaEye, FaUsers } from 'react-icons/fa'

// components
import {
    Card,
    CaseOfficerAssignedStudent,
    EmptyData,
    LoadingAnimation,
    StudentExpiryDaysLeft,
    StudentJobId,
    Table,
    TableAction,
    TableActionOption,
    UserCreatedAt,
} from '@components'
import { StudentCellInfo, SubadminStudentIndustries } from './components'

import { TechnicalError } from '@components/ActionAnimations/TechnicalError'
import { useJoyRide } from '@hooks'
import { SubAdminApi } from '@queries'
import { Student, UserStatus } from '@types'
import { useEffect, useState } from 'react'
import { MdBlock, MdPriorityHigh } from 'react-icons/md'
import {
    AddToNonContactableStudents,
    AssignStudentModal,
    BlockModal,
    ChangeStudentStatusModal,
    HighPriorityModal,
} from './modals'

import { EditTimer } from '@components/StudentTimer/EditTimer'
import { SectorCell } from '@partials/admin/student/components'
import { ColumnDef } from '@tanstack/react-table'
import { getStudentWorkplaceAppliedIndustry, setLink } from '@utils'
import moment from 'moment'
import { WorkplaceWorkIndustriesType } from '@redux/queryTypes'
import { isWorkplaceValid } from 'utils/workplaceRowBlinking'
import { RTOCellInfo } from '../rto/components'
import { InterviewModal } from '../workplace/modals'

export const InCompleteSubmission = () => {
    const router = useRouter()

    const [mount, setMount] = useState(false)

    useEffect(() => {
        if (!mount) {
            setMount(true)
        }
    }, [])

    // WORKPLACE JOY RIDE - Start
    const joyride = useJoyRide()
    useEffect(() => {
        if (joyride.state.tourActive && mount) {
            setTimeout(() => {
                joyride.setState({ ...joyride.state, run: true, stepIndex: 1 })
            }, 1200)
        }
    }, [mount])

    // STUDENT JOY RIDE - END

    const [modal, setModal] = useState<ReactElement | null>(null)

    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 50))
    }, [router])

    const { isLoading, data, isError, isFetching } =
        SubAdminApi.Student.useIncompleteSubmissionStudents(
            {
                // search: `status:${UserStatus.Approved}`,
                skip: itemPerPage * page - itemPerPage,
                limit: itemPerPage,
            },
            {
                refetchOnMountOrArgChange: 30,
            }
        )

    // const hasMatchingIndustry = data?.data?.map((student: any) => {
    //     return (
    //         student &&
    //         student?.workplace?.filter((workplace: any) =>
    //             workplace?.industries?.filter((industry: any) => {
    //                 const awaitingAgreementSignedDate = new Date(
    //                     industry?.awaitingAgreementSignedDate
    //                 )
    //                 const isMoreThanSevenDays =
    //                     awaitingAgreementSignedDate <= sevenDaysAgo
    //                 const isAwaitingAgreementSigned =
    //                     industry?.awaitingAgreementSigned
    //                 const agreementSigned = !industry?.AgreementSigned
    //                 const isAgreementNotSigned =
    //                     industry?.AgreementSignedDate === null

    //                 return {
    //                     isMatching:
    //                         industry?.applied &&
    //                         isAwaitingAgreementSigned &&
    //                         isAgreementNotSigned &&
    //                         agreementSigned &&
    //                         isMoreThanSevenDays,
    //                     id: student?.id,
    //                 }
    //             })
    //         )
    //     )
    // })
    // const industryIds = hasMatchingIndustry?.flat(1).map((item: any) => item)

    const findWorkplaces = data?.data.filter(
        (student: any) => student?.workplace?.length
    )
    // .filter((workplace: any) => workplace?.industries?.length)
    const hasMatchingIndustry = findWorkplaces?.filter(
        (workplace: any) => workplace?.industries?.length
    )

    // ================= Blinking/Flashing rows of students ================
    const activeAndCompleted = data?.data?.filter((student: any) => {
        if (
            student?.user?.status !== UserStatus.Approved &&
            !student?.workplace?.length
        ) {
            // Skip if status is not Approved or no workplace

            return false
        }

        const workplaceCount = student?.workplace?.length

        if (
            workplaceCount === 1 &&
            student?.user?.status === UserStatus.Approved
        ) {
            // If only one workplace, check its status
            return student?.workplace[0]?.currentStatus === 'completed'
        } else if (
            workplaceCount > 1 &&
            student?.user?.status === UserStatus.Approved
        ) {
            // If multiple workplaces, all must have 'completed' status
            // student.workplace.some(
            //     (placement: any) => placement?.currentStatus === 'completed'
            // )
            return student?.workplace?.every(
                (placement: any) => placement?.currentStatus === 'completed'
            )
        }

        return false
    })

    const findCallLogsUnanswered = data?.data?.filter((student: any) => {
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
    })
    const findExpiringInNext45Days = data?.data?.filter((student: any) => {
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
    })

    const filterAwaitingAgreementBeyondSevenDays = data?.data?.filter(
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

    const onChangeStatus = (student: Student) => {
        setModal(
            <ChangeStudentStatusModal
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

    const onBlockClicked = (student: Student) => {
        setModal(<BlockModal item={student} onCancel={onModalCancelClicked} />)
    }
    const onMarkAsHighPriorityClicked = (studetnt: Student) => {
        setModal(
            <HighPriorityModal
                item={studetnt}
                onCancel={onModalCancelClicked}
                // setRefetchStudents={setRefetchStudents}
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
            {
                text: 'Edit',
                onClick: (student) => {
                    router.push(
                        `/portals/sub-admin/students/${student?.id}/edit-student`
                    )
                },
                Icon: FaEdit,
            },
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
            {
                text: student?.isHighPriority
                    ? 'Remove Mark High Priority'
                    : 'Mark High Priority',
                onClick: (student) => onMarkAsHighPriorityClicked(student),
                Icon: MdPriorityHigh,
                color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
            },
            {
                text: 'Change Expiry',
                onClick: (student) => onDateClick(student),
                Icon: FaEdit,
            },
        ]
    }

    const Columns: ColumnDef<Student>[] = [
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
            cell: (info) => (
                <StudentCellInfo student={info.row.original} call />
            ),
        },
        {
            header: () => 'RTO',
            accessorKey: 'rto',
            cell: ({ row }: any) => (
                <RTOCellInfo onlyName={false} rto={row.original?.rto} />
            ),
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
            cell: ({ row }: any) => {
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
                <CaseOfficerAssignedStudent student={row.original} />
            ),
        },
        {
            accessorKey: 'createdAt',
            header: () => <span>Created At</span>,
            cell: ({ row }: any) => (
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

    return (
        <div>
            {modal}
            {isError && <TechnicalError />}
            <Card noPadding>
                {isLoading || isFetching ? (
                    <LoadingAnimation height="h-[60vh]" />
                ) : data && data?.data.length && !isError ? (
                    <Table
                        columns={Columns}
                        data={data.data}
                        enableRowSelection
                        awaitingAgreementBeyondSevenDays={
                            filterAwaitingAgreementBeyondSevenDays
                        }
                        findCallLogsUnanswered={findCallLogsUnanswered}
                        findExpiringInNext45Days={findExpiringInNext45Days}
                        activeAndCompleted={activeAndCompleted}
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
                            )
                        }}
                    </Table>
                ) : (
                    !isError && (
                        <EmptyData
                            title={'No Students'}
                            description={'You have not approved Students yet'}
                            height={'50vh'}
                        />
                    )
                )}
            </Card>
        </div>
    )
}
