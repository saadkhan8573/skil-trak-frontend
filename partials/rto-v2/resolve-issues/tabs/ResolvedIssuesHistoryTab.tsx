import {
    ActionButton,
    Button,
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TableActionOption,
    TechnicalError,
} from '@components'
import { ColumnDef } from '@tanstack/react-table'
import { FaEdit, FaEye } from 'react-icons/fa'

import { EditTimer } from '@components/StudentTimer/EditTimer'
import { ResolveIssuesCompletedModal } from '@partials/rto-v2'
import { CountCard } from '@partials/rto-v2/cards/CountCard'
import { StudentCellInfo } from '@partials/rto/student/components'
import { ChangeStudentStatusModal } from '@partials/sub-admin/students/modals'
import { RtoApi } from '@queries'
import { Student, StudentIssue } from '@types'
import { ellipsisText } from '@utils'
import {
    AlertTriangle,
    Building2,
    Calendar,
    Clock,
    Flag,
    GraduationCap,
    User,
} from 'lucide-react'
import moment from 'moment'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import { LuFileCheck } from 'react-icons/lu'
import { MdBlock } from 'react-icons/md'
import { PriorityBadge } from '../components'

export const ResolvedIssuesHistoryTab = () => {
    const router = useRouter()
    const [modal, setModal] = useState<ReactElement | null>(null)

    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const { isLoading, data, isError } =
        RtoApi.Students.useRtoResolveIssuesStudents({
            search: 'status:resolved',
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        })
    const count = RtoApi.Students.useRtoResolveIssuesStudentsCount()
    const onModalCancelClicked = () => setModal(null)

    const onChangeStatus = (student: Student) => {
        setModal(
            <ChangeStudentStatusModal
                student={student}
                onCancel={onModalCancelClicked}
            />
        )
    }
    const onClickCompleted = (reportedIssue: any) => {
        setModal(
            <ResolveIssuesCompletedModal
                onCancel={onModalCancelClicked}
                reportedIssue={reportedIssue}
                view
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

    const tableActionOptions: TableActionOption<Student>[] = [
        {
            text: 'View',
            onClick: (student) =>
                router.push(`/portals/rto/students/${student.id}?tab=overview`),
            Icon: FaEye,
        },
        {
            text: 'Change Status',
            onClick: (student) => onChangeStatus(student),
            Icon: FaEdit,
        },
        {
            text: 'Change Expiry',
            onClick: (student) => onDateClick(student),
            Icon: FaEdit,
        },
        // {
        //     text: 'Completed',
        //     onClick: () => onClickCompleted(),
        //     Icon: FaCheckCircle,
        // },
    ]

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
                            {`${
                                info.row.original?.workplaceRequest?.courses![0]
                                    ?.code ?? '————'
                            } - ${
                                info.row.original?.workplaceRequest?.courses![0]
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
            header: () => <span>Reported By</span>,
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
            accessorKey: 'resolvedAt',
            header: () => <span>Resolution Date</span>,
            cell: (info) => (
                <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-green-500" />
                    <span className="text-xs">
                        {info.row.original?.resolutionDate
                            ? moment(
                                  String(info.row.original?.resolutionDate)
                              ).format('Do MMM YYYY')
                            : '—'}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'resolutionTime',
            header: () => <span>Resolution Time</span>,
            cell: (info) => {
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
            accessorKey: 'actions',
            header: () => <span>Actions</span>,
            cell: ({ row }) => (
                <Button
                    text="View Details"
                    variant="secondary"
                    Icon={LuFileCheck}
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
            label: 'Total Resolved',
            value: count?.data?.totalResolved || 0,
            icon: Flag,
            iconColor: 'text-[#ef4444]',
            iconBgColor: 'bg-gradient-to-br from-[#ef4444]/10 to-[#ef4444]/5',
            valueColor: 'text-[#ef4444]',
            highlight: true,
        },
        {
            label: 'This Month',
            value: count?.data?.thisMonth || 0,
            icon: AlertTriangle,
            iconColor: 'text-[#ef4444]',
            iconBgColor: 'bg-gradient-to-br from-[#ef4444]/10 to-[#ef4444]/5',
            valueColor: 'text-[#ef4444]',
            highlight: true,
        },
        {
            label: 'Avg Resolution Time',
            value: count?.data?.averageResolutionDays || 0,
            subValue: 'days',
            icon: Clock,
            iconColor: 'text-[#F7A619]',
            iconBgColor: 'bg-gradient-to-br from-[#F7A619]/10 to-[#F7A619]/5',
        },
        {
            label: 'Critical Resolved',
            value: count?.data?.criticalResolved || 0,
            icon: User,
            iconColor: 'text-[#044866]',
            iconBgColor: 'bg-gradient-to-br from-[#044866]/10 to-[#044866]/5',
        },
    ]

    return (
        <>
            {modal && modal}
            <div className="flex flex-col gap-y-4 mb-32">
                {/* <div className="grid grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <CountCard stat={stat} />
                    ))}
                </div> */}
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
                                title={'No Resolved Issue!'}
                                description={
                                    'There is no resolved issue request yet'
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
