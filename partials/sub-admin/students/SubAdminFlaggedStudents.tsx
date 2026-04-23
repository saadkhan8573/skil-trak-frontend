import { useRouter } from 'next/router'
import { ReactElement } from 'react'

// Icons
import { FaEye, FaFlag } from 'react-icons/fa'

// components
import {
    Button,
    Card,
    CaseOfficerAssignedStudent,
    EmptyData,
    LoadingAnimation,
    NoData,
    StudentExpiryDaysLeft,
    StudentJobId,
    Table,
    TableAction,
    TableActionOption,
    Typography,
    UserCreatedAt,
} from '@components'
import { StudentCellInfo } from './components'

import { TechnicalError } from '@components/ActionAnimations/TechnicalError'
import { useJoyRide } from '@hooks'
import { SubAdminApi } from '@queries'
import { Student, UserStatus } from '@types'
import { useEffect, useState } from 'react'

import Modal from '@modals/Modal'
import { SectorCell } from '@partials/admin/student/components'
import { SwitchOffFlagModal } from '@partials/common/StudentProfileDetail/modals'
import { ColumnDef } from '@tanstack/react-table'
import { setLink } from '@utils'
import moment from 'moment'
import { isWorkplaceValid } from 'utils/workplaceRowBlinking'
import { RTOCellInfo } from '../rto/components'

export const SubAdminFlaggedStudents = () => {
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

    const [modal, setModal] = useState<ReactElement | null>(null)

    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 50))
    }, [router])
    // in the below I want to pass

    // subadmin/students/reported/list
    // useSubAdminFlaggedStudents
    const { isLoading, data, isError, isFetching } =
        SubAdminApi.Student.useSubAdminFlaggedStudents(
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

    const onSwitchOffFlag = (student: Student) => {
        setModal(
            <SwitchOffFlagModal
                onCancel={onModalCancelClicked}
                studentId={student?.id}
            />
        )
    }

    const tableActionOptions: TableActionOption<Student>[] = [
        {
            text: 'View',
            onClick: (student) => {
                router.push(`/portals/sub-admin/students/${student?.id}/detail`)
                setLink('subadmin-student', router)
            },
            Icon: FaEye,
        },
        {
            text: 'Cancel',
            onClick: (student) => {
                onSwitchOffFlag(student)
            },
            Icon: FaFlag,
        },
    ]

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
        // {
        //     accessorKey: 'industry',
        //     header: () => <span>Industry</span>,
        //     cell: (info) => (
        //         <SubadminStudentIndustries
        //             workplace={info.row.original?.workplace}
        //             industries={info.row.original?.industries}
        //         />
        //     ),
        // },
        {
            accessorKey: 'sectors',
            header: () => <span>Sectors</span>,
            cell: ({ row }: any) => {
                return <SectorCell student={row.original} />
            },
        },
        {
            accessorKey: 'statusHistory',
            header: () => <span>Flag Comment</span>,
            cell: (info) => {
                return (
                    <Modal>
                        <Modal.Open>
                            <Button variant={'info'} text="View" outline />
                        </Modal.Open>
                        <Modal.Window name="reported-comment">
                            <div className="p-5 flex flex-col justify-center items-center gap-y-4">
                                <Typography variant="title">
                                    Reported Comment
                                </Typography>
                                {info.row?.original?.statusHistory &&
                                info.row?.original?.statusHistory?.length >
                                    0 ? (
                                    <div className="flex gap-x-4 w-full h-full">
                                        <div
                                            className={`flex flex-col gap-y-1 ${
                                                info.row?.original
                                                    ?.statusHistory?.[
                                                    info.row?.original
                                                        ?.statusHistory
                                                        ?.length - 1
                                                ]?.response
                                                    ? 'w-1/2'
                                                    : 'w-full'
                                            }`}
                                        >
                                            <Typography
                                                variant="label"
                                                semibold
                                            >
                                                Coordinator Comment
                                            </Typography>
                                            <Typography variant="body">
                                                {info.row?.original
                                                    ?.statusHistory?.[
                                                    info.row?.original
                                                        ?.statusHistory
                                                        ?.length - 1
                                                ]?.comment ?? 'NA'}
                                            </Typography>
                                        </div>
                                        {info.row?.original?.statusHistory?.[
                                            info.row?.original?.statusHistory
                                                ?.length - 1
                                        ]?.response && (
                                            <>
                                                <div className="w-[2px] bg-gray-200 h-auto min-h-full mx-4"></div>
                                                <div className="flex flex-col gap-y-1 w-1/2">
                                                    <Typography
                                                        variant="label"
                                                        semibold
                                                    >
                                                        RTO Comment
                                                    </Typography>
                                                    <Typography variant="body">
                                                        {info.row?.original
                                                            ?.statusHistory?.[
                                                            info.row?.original
                                                                ?.statusHistory
                                                                ?.length - 1
                                                        ]?.response ?? 'NA'}
                                                    </Typography>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <NoData text="No Data found" />
                                )}
                            </div>
                        </Modal.Window>
                    </Modal>
                )
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
            cell: ({ row }) => (
                <TableAction
                    options={tableActionOptions}
                    rowItem={row.original}
                />
            ),
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
