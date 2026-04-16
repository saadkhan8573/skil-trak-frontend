import {
    ActionButton,
    Button,
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TechnicalError,
} from '@components'
import { ColumnDef } from '@tanstack/react-table'
import { FaEdit } from 'react-icons/fa'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@components/ui'

import { PriorityBadge, ResolveIssuesCompletedModal } from '@partials/rto-v2'
import { CountCard } from '@partials/rto-v2/cards/CountCard'
import { RtoApi, RtoV2Api } from '@queries'
import { StudentIssue } from '@types'
import { ellipsisText } from '@utils'
import {
    AlertTriangle,
    Building2,
    Calendar,
    Clock,
    Download,
    Flag,
    GraduationCap,
    User,
} from 'lucide-react'
import moment from 'moment'
import { ReactElement, useState } from 'react'
import { FaRegCheckCircle } from 'react-icons/fa'
import { MdBlock } from 'react-icons/md'
import { StudentCellInfo } from './components'
import { DownloadListModal } from './modals'

export const ProblematicStudent = () => {
    const [modal, setModal] = useState<ReactElement | null>(null)

    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const [downloadReport, downloadState] =
        RtoV2Api.Students.useDownloadReportedStudent()
    const { isLoading, data, isError, refetch } =
        RtoApi.Students.useRtoResolveIssuesStudents({
            search: 'status:open',
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        })
    const count = RtoApi.Students.useRtoResolveIssuesStudentsCount()
    const onModalCancelClicked = () => setModal(null)
    const onClickDownload = () => {
        setModal(
            <DownloadListModal
                onClose={onModalCancelClicked}
                downloadReport={downloadReport}
            />
        )
    }
    const onClickCompleted = (reportedIssue: any) => {
        setModal(
            <ResolveIssuesCompletedModal
                onCancel={onModalCancelClicked}
                reportedIssue={reportedIssue}
            />
        )
    }

    const columns: ColumnDef<StudentIssue>[] = [
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
                                    ?.workplaceApprovaleRequest?.[0]?.industry
                                    ?.user?.name ?? '————'}
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
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: ({ row }) => (
                <Button
                    text="resolve"
                    variant="error"
                    className="bg-red-600"
                    Icon={FaRegCheckCircle}
                    onClick={() => onClickCompleted(row.original)}
                />
            ),
        },
    ]

    const quickActionsElements = {
        id: 'id',
        individual: (id: StudentIssue) => (
            <div className="flex gap-x-2">
                <ActionButton Icon={FaEdit}>Edit</ActionButton>
                <ActionButton>Sub Admins</ActionButton>
                <ActionButton Icon={MdBlock} variant="error">
                    Block
                </ActionButton>
            </div>
        ),
        common: (ids: StudentIssue[]) => (
            <ActionButton Icon={MdBlock} variant="error">
                Block
            </ActionButton>
        ),
    }
    const stats = [
        {
            label: 'Open Issues',
            value: count?.data?.openIssues || 0,
            icon: Flag,
            iconColor: 'text-[#ef4444]',
            iconBgColor: 'bg-gradient-to-br from-[#ef4444]/10 to-[#ef4444]/5',
            valueColor: 'text-[#ef4444]',
            highlight: true,
        },
        {
            label: 'Critical Priority',
            value: count?.data?.criticalPriority || 0,
            icon: AlertTriangle,
            iconColor: 'text-[#ef4444]',
            iconBgColor: 'bg-gradient-to-br from-[#ef4444]/10 to-[#ef4444]/5',
            valueColor: 'text-[#ef4444]',
            highlight: true,
        },
        {
            label: 'Avg Days Open',
            value: count?.data?.averageResolutionDays || 0,
            subValue: 'days',
            icon: Clock,
            iconColor: 'text-[#F7A619]',
            iconBgColor: 'bg-gradient-to-br from-[#F7A619]/10 to-[#F7A619]/5',
        },
        {
            label: 'Students Affected',
            value: count?.data?.studentsEffected || 0,
            icon: User,
            iconColor: 'text-[#044866]',
            iconBgColor: 'bg-gradient-to-br from-[#044866]/10 to-[#044866]/5',
        },
    ]

    return (
        <>
            {modal && modal}
            <div className="flex flex-col gap-y-2 mb-32">
                {/* <div className="grid grid-cols-4 gap-3">
                    {stats.map((stat) => (
                        <CountCard stat={stat} />
                    ))}
                </div> */}
                <div className="flex justify-end pr-4">
                    <Button
                        text="Download"
                        variant="secondary"
                        Icon={Download}
                        onClick={onClickDownload}
                    />
                </div>
                <Card noPadding>
                    {isError && <TechnicalError />}
                    {isLoading ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : data && data?.data.length ? (
                        <Table
                            columns={columns}
                            data={data.data}
                            quickActions={quickActionsElements}
                            // enableRowSelection
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
                                title={'No Open Issue!'}
                                description={'There is no issue request yet'}
                                height={'50vh'}
                            />
                        )
                    )}
                </Card>
            </div>
        </>
    )
}
