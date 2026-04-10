import {
    Button,
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TechnicalError,
} from '@components'
import { PriorityBadge, ResolveIssuesCompletedModal } from '@partials/rto-v2'
import { StudentCellInfo } from '@partials/rto/student/components'
import { StudentIssue } from '@types'
import { ColumnDef } from '@tanstack/react-table'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@components/ui'
import {
    AlertTriangle,
    Building2,
    Calendar,
    Clock,
    GraduationCap,
} from 'lucide-react'
import moment from 'moment'
import { ReactElement, useState } from 'react'
import { FaRegCheckCircle } from 'react-icons/fa'
import { LuFileCheck } from 'react-icons/lu'

interface FilteredIssuesProps {
    data: any
    isLoading: boolean
    isError: boolean
    isSuccess: boolean
    itemPerPage: number
    setItemPerPage: (value: number) => void
    page: number
    setPage: (value: number) => void
}

export const FilteredIssues = ({
    data,
    isLoading,
    isError,
    isSuccess,
    itemPerPage,
    setItemPerPage,
    page,
    setPage,
}: FilteredIssuesProps) => {
    const [modal, setModal] = useState<ReactElement | null>(null)
    const onModalCancelClicked = () => setModal(null)

    const onClickResolve = (reportedIssue: any) => {
        setModal(
            <ResolveIssuesCompletedModal
                onCancel={onModalCancelClicked}
                reportedIssue={reportedIssue}
            />
        )
    }

    const onClickViewDetails = (reportedIssue: any) => {
        setModal(
            <ResolveIssuesCompletedModal
                onCancel={onModalCancelClicked}
                reportedIssue={reportedIssue}
                view
            />
        )
    }

    const columns: ColumnDef<StudentIssue>[] = [
        {
            accessorKey: 'student.title',
            cell: (info) => {
                const title = info.row?.original?.title || ''
                const isLarge = title.length > 30

                return (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 max-w-[150px]">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-xs font-semibold leading-tight truncate">
                                {isLarge
                                    ? `${title.substring(0, 30)}...`
                                    : title}
                            </span>
                        </div>
                        {isLarge && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button className="text-[10px] text-[#044866] hover:text-[#0D5468] font-medium underline cursor-pointer text-left w-fit transition-colors">
                                        View All
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="space-y-2">
                                        <h4 className="font-medium leading-none text-red-600 flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4" />
                                            Issue
                                        </h4>
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            {title}
                                        </p>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>
                )
            },
            header: () => <span>Issue</span>,
        },
        {
            accessorKey: 'student.user.name',
            cell: (info) => (
                <>
                    {info.row?.original?.student && (
                        <StudentCellInfo
                            link={`/portals/rto/students-and-placements/all-students/${info?.row?.original?.student?.id}/detail`}
                            student={info.row?.original?.student}
                        />
                    )}
                </>
            ),
            header: () => <span>Student</span>,
        },
        {
            accessorKey: 'workplaceRequest',
            header: () => <span>Course & Industry</span>,
            cell: (info) => {
                const courses =
                    info.row.original?.workplaceRequest?.courses || []
                const primaryCourse = courses[0]
                const courseText = primaryCourse
                    ? `${primaryCourse.code ?? '————'} - ${primaryCourse.title ?? '————'}`
                    : '————'
                const isLarge = courseText.length > 25 || courses.length > 1

                return (
                    <div className="flex flex-col gap-1">
                        {isLarge ? (
                            <HoverCard openDelay={0}>
                                <HoverCardTrigger asChild>
                                    <div className="flex items-center gap-2 max-w-[150px] cursor-pointer">
                                        <GraduationCap className="h-3 w-3 shrink-0 text-gray-500" />
                                        <span className="text-xs font-semibold leading-tight truncate hover:text-[#0D5468] hover:underline underline-offset-2">
                                            {courseText}
                                        </span>
                                    </div>
                                </HoverCardTrigger>
                                <HoverCardContent
                                    className="w-80 border-none p-0 outline-none bg-transparent shadow-none"
                                    sideOffset={5}
                                    align="start"
                                >
                                    <div className="space-y-3 bg-white p-4 rounded-lg shadow-xl border border-gray-100">
                                        <h4 className="font-medium leading-none text-[#044866] flex items-center gap-2 mb-2 border-b pb-2">
                                            <GraduationCap className="w-4 h-4 text-[#F7A619]" />
                                            Enrolled Courses
                                        </h4>
                                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                                            {courses.map(
                                                (course: any, idx: number) => (
                                                    <div
                                                        key={idx}
                                                        className="bg-slate-50 p-2 rounded border border-slate-100"
                                                    >
                                                        <p className="text-xs font-medium text-[#044866]">
                                                            {course.code ||
                                                                'N/A'}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                                            {course.title ||
                                                                'Unknown Course'}
                                                        </p>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </HoverCardContent>
                            </HoverCard>
                        ) : (
                            <div className="flex items-center gap-2 max-w-[150px]">
                                <GraduationCap className="h-3 w-3 shrink-0 text-gray-500" />
                                <span className="text-xs font-semibold leading-tight truncate">
                                    {courseText}
                                </span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                            <Building2 className="h-3 w-3 shrink-0 text-gray-500" />
                            <p className="text-[10px] text-[#64748b] truncate max-w-[150px]">
                                {info.row.original?.workplaceRequest
                                    ?.industries?.[0]?.industry?.user?.name ??
                                    '————'}
                            </p>
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: 'requestedBy',
            header: () => <span>Reported</span>,
            cell: (info) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">
                            {moment(info?.row?.original?.createdAt).format(
                                'Do MMM YYYY'
                            )}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500">
                        By {info?.row?.original?.requestedBy?.name}
                    </p>
                </div>
            ),
        },
        {
            accessorKey: 'priority',
            header: () => <span>Priority</span>,
            cell: (info) => (
                <PriorityBadge priority={info?.row?.original?.priority} />
            ),
        },
        {
            accessorKey: 'resolutionStatus',
            header: () => <span>Status</span>,
            cell: (info) => {
                const status = info.row.original?.resolutionStatus
                return (
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            status === 'resolved'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                        }`}
                    >
                        {status === 'resolved' ? 'Resolved' : 'Open'}
                    </span>
                )
            },
        },
        {
            accessorKey: 'resolvedAt',
            header: () => <span>Resolution Date</span>,
            cell: (info) => {
                if (info.row.original?.resolutionStatus !== 'resolved') {
                    return <span className="text-xs text-gray-400">—</span>
                }
                return (
                    <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-green-500" />
                        <span className="text-xs">
                            {moment(
                                info.row.original?.resolutionDate + ''
                            ).format('Do MMM YYYY')}
                        </span>
                    </div>
                )
            },
        },
        {
            accessorKey: 'resolutionTime',
            header: () => <span>Resolution Time</span>,
            cell: (info) => {
                if (info.row.original?.resolutionStatus !== 'resolved') {
                    return <span className="text-xs text-gray-400">—</span>
                }
                const created = moment(info.row.original?.createdAt)
                const resolved = moment(info.row.original?.resolutionDate + '')
                const days = resolved.diff(created, 'days')
                const hours = resolved.diff(created, 'hours') % 24
                return (
                    <span className="inline-flex items-center px-2 py-1 text-xs border border-blue-200 text-blue-600 rounded-md bg-blue-50">
                        <Clock className="h-3 w-3 mr-1" />
                        {days > 0 ? `${days}d ${hours}h` : `${hours}h`}
                    </span>
                )
            },
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: ({ row }) =>
                row.original?.resolutionStatus === 'resolved' ? (
                    <Button
                        text="View Details"
                        variant="secondary"
                        Icon={LuFileCheck}
                        onClick={() => onClickViewDetails(row.original)}
                    />
                ) : (
                    <Button
                        text="resolve"
                        variant="error"
                        className="bg-red-600"
                        Icon={FaRegCheckCircle}
                        onClick={() => onClickResolve(row.original)}
                    />
                ),
        },
    ]

    return (
        <>
            {modal && modal}
            <Card noPadding>
                {isError && <TechnicalError />}
                {isLoading ? (
                    <LoadingAnimation height="h-[60vh]" />
                ) : data && data?.data?.length ? (
                    <Table columns={columns} data={data.data}>
                        {({ table, pagination, pageSize }: any) => {
                            return (
                                <div>
                                    <div className="p-6 mb-2 flex justify-between">
                                        {pageSize(
                                            itemPerPage,
                                            setItemPerPage,
                                            data?.data?.length
                                        )}
                                        <div className="flex gap-x-2">
                                            {pagination(
                                                data?.pagination,
                                                setPage
                                            )}
                                        </div>
                                    </div>
                                    <div className="px-6 overflow-auto">
                                        {table}
                                    </div>
                                    {data?.data?.length > 10 && (
                                        <div className="p-6 mb-2 flex justify-between">
                                            {pageSize(
                                                itemPerPage,
                                                setItemPerPage,
                                                data?.data?.length
                                            )}
                                            <div className="flex gap-x-2">
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
                            title={'No Results Found'}
                            description={'No issues match your current filters'}
                            height={'50vh'}
                        />
                    )
                )}
            </Card>
        </>
    )
}
