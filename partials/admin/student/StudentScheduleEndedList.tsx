import {
    ActionButton,
    Button,
    Card,
    CaseOfficerAssignedStudent,
    EmptyData,
    LoadingAnimation,
    StudentJobId,
    Table,
    TableAction,
    TableChildrenProps,
    TechnicalError,
    Typography,
} from '@components'
import { PageHeading } from '@components/headings'
import { ColumnDef } from '@tanstack/react-table'
import { FaEdit, FaEye, FaFileExport } from 'react-icons/fa'

import { RtoCellInfo } from '@partials/admin/rto/components'
import { AdminApi } from '@queries'
import { Student, UserStatus } from '@types'
import { checkListLength, isBrowser, setLink } from '@utils'
import { useRouter } from 'next/router'
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { MdBlock } from 'react-icons/md'
import { SectorCell, StudentCellInfo, StudentIndustries } from './components'
import { BlockModal, BlockMultiStudentsModal } from './modals'

// hooks

import moment from 'moment'
import { isWorkplaceValid } from 'utils/workplaceRowBlinking'

export const StudentScheduleEndedList = () => {
    const router = useRouter()
    const [modal, setModal] = useState<ReactElement | null>(null)
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const listingRef = useRef<any>(null)

    const savedScrollPosition =
        isBrowser() && localStorage.getItem('lastScroll')
    useEffect(() => {
        if (listingRef.current && savedScrollPosition) {
            listingRef.current.scrollTop = parseInt(savedScrollPosition, 10)
        }
    }, [savedScrollPosition, listingRef])

    // Function to handle scrolling
    const handleScroll = () => {
        if (listingRef.current) {
            isBrowser() &&
                localStorage.setItem('lastScroll', listingRef.current.scrollTop)
        }
    }

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 50))
    }, [router])

    // hooks

    const { isLoading, isFetching, data, isError } =
        AdminApi.Students.useListQuery(
            {
                search: `schedule:${true}`,
                skip: itemPerPage * page - itemPerPage,
                limit: itemPerPage,
            },
            { refetchOnMountOrArgChange: 30 }
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

    const onModalCancelClicked = useCallback(() => {
        setModal(null)
    }, [])
    const onBlockClicked = (student: Student) => {
        setModal(<BlockModal item={student} onCancel={onModalCancelClicked} />)
    }

    const onBlockMultiStudents = (student: Student[]) => {
        setModal(
            <BlockMultiStudentsModal
                onCancel={onModalCancelClicked}
                student={student}
            />
        )
    }

    const tableActionOptions = [
        {
            text: 'View',
            onClick: (student: Student) => {
                router.push(`/portals/admin/student/${student?.id}/detail`)
                setLink('student', router)
            },
            Icon: FaEye,
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
            cell: (info) => (
                <StudentCellInfo student={info?.row?.original} call />
            ),
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
                    industries={info.row.original?.industries}
                    workplace={info.row.original?.workplace}
                />
            ),
        },
        {
            accessorKey: 'user.schedules',
            header: () => <span>Total Hours</span>,
            cell: ({ row }) => (
                <div>
                    <ol>
                        {row.original?.user?.schedules?.map(
                            (schedule: any, index: number) => (
                                <li key={index}>{schedule?.hours ?? 'NA'}</li>
                            )
                        )}
                    </ol>
                </div>
            ),
        },
        {
            accessorKey: 'scheduleStartDate',
            header: () => <span>Schedule End Date</span>,
            cell: ({ row }) => (
                <div>
                    <div>
                        <ol>
                            {row.original?.user?.schedules?.map(
                                (schedule: any, index: number) => (
                                    <li
                                        className="whitespace-nowrap"
                                        key={index}
                                    >
                                        {schedule?.endDate?.slice(0, 10) ??
                                            'NA'}
                                    </li>
                                )
                            )}
                        </ol>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'sectors',
            header: () => <span>Sectors</span>,
            cell: (info) => <SectorCell student={info.row.original} />,
        },

        {
            accessorKey: 'progress',
            header: () => <span>Progress</span>,
            cell: ({ row }) => (
                <CaseOfficerAssignedStudent student={row.original} />
            ),
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: (info) => {
                const length = checkListLength<Student>(data?.data as Student[])

                return (
                    <div className="flex gap-x-1 items-center">
                        <TableAction
                            options={tableActionOptions}
                            rowItem={info?.row?.original}
                            lastIndex={length.includes(info?.row?.index)}
                        />
                    </div>
                )
            },
        },
    ]

    const quickActionsElements = {
        id: 'id',
        individual: (student: Student) => {
            return (
                <div className="flex gap-x-2">
                    <ActionButton
                        onClick={() => {
                            router.push(
                                `/portals/admin/student/${student?.id}/detail`
                            )
                        }}
                    >
                        View
                    </ActionButton>
                    <ActionButton
                        Icon={FaEdit}
                        onClick={() => {
                            router.push(
                                `/portals/admin/student/edit-student/${student?.id}`
                            )
                        }}
                    >
                        Edit
                    </ActionButton>
                    <ActionButton
                        Icon={MdBlock}
                        variant="error"
                        onClick={() => {
                            onBlockClicked(student)
                        }}
                    >
                        Block
                    </ActionButton>
                </div>
            )
        },
        common: (student: Student[]) => (
            <ActionButton
                onClick={() => {
                    onBlockMultiStudents(student)
                }}
                Icon={MdBlock}
                variant="error"
            >
                Block
            </ActionButton>
        ),
    }

    return (
        <>
            {modal}
            <div className="flex flex-col gap-y-4">
                <div className="flex">
                    <PageHeading
                        title={'Student Schedule Ended Students'}
                        subtitle={'List of Student Schedule Ended Students'}
                    />
                    {data && data?.data.length ? (
                        <div className="">
                            <a
                                href={`${process.env.NEXT_PUBLIC_END_POINT}/admin/students/list/download
                        `}
                                target="_blank"
                                rel="noreferrer"
                                className=""
                            >
                                {' '}
                                <Button
                                    text={'Export'}
                                    variant={'action'}
                                    Icon={FaFileExport}
                                />
                            </a>
                        </div>
                    ) : null}
                </div>
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
                            }: TableChildrenProps) => {
                                return (
                                    <div>
                                        <div
                                            ref={listingRef}
                                            onScroll={handleScroll}
                                            className="p-6 mb-2 flex justify-between"
                                        >
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
                                title={'No Approved Student!'}
                                description={
                                    'You have not approved any Student request yet'
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
