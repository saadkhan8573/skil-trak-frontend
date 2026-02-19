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
import { ellipsisText } from '@utils'
import { ColumnDef } from '@tanstack/react-table'
import {
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

    const onClickResolve = (student: any) => {
        setModal(
            <ResolveIssuesCompletedModal
                onCancel={onModalCancelClicked}
                student={student}
            />
        )
    }

    const onClickViewDetails = (student: any) => {
        setModal(
            <ResolveIssuesCompletedModal
                onCancel={onModalCancelClicked}
                student={student}
                view
            />
        )
    }

    const columns: ColumnDef<StudentIssue>[] = [
        {
            accessorKey: 'student.title',
            cell: (info) => (
                <span title={info.row?.original?.title}>
                    {ellipsisText(info.row?.original?.title, 15)}
                </span>
            ),
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
            cell: (info) => (
                <div className="">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-3 w-3 text-gray-500" />
                        <p className="text-xs truncate">
                            {`${info.row.original?.workplaceRequest?.courses?.[0]
                                ?.code ?? '————'
                                } - ${info.row.original?.workplaceRequest?.courses?.[0]
                                    ?.title ?? '————'
                                }`}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Building2 className="h-3 w-3 text-gray-500" />
                        <p className="text-xs text-[#64748b] truncate">
                            {info.row.original?.workplaceRequest
                                ?.industries?.[0]?.industry?.user?.name ??
                                '————'}
                        </p>
                    </div>
                </div>
            ),
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
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status === 'resolved'
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
                            {moment(info.row.original?.resolutionDate + "").format('Do MMM YYYY')}
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
                const resolved = moment(info.row.original?.resolutionDate + "")
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
            cell: ({ row }) => (
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
                )
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
                    <Table
                        columns={columns}
                        data={data.data}
                    >
                        {({
                            table,
                            pagination,
                            pageSize,
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
                            description={
                                'No issues match your current filters'
                            }
                            height={'50vh'}
                        />
                    )
                )}
            </Card>
        </>
    )
}
