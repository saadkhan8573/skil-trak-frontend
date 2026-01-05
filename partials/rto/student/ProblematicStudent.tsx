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

import { PriorityBadge, ResolveIssuesCompletedModal } from '@partials/rto-v2'
import { CountCard } from '@partials/rto-v2/cards/CountCard'
import { RtoApi } from '@queries'
import { StudentIssue } from '@types'
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
import { ReactElement, useState } from 'react'
import { FaRegCheckCircle } from 'react-icons/fa'
import { MdBlock } from 'react-icons/md'
import { StudentCellInfo } from './components'

export const ProblematicStudent = () => {
    const [modal, setModal] = useState<ReactElement | null>(null)

    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const { isLoading, data, isError, refetch } =
        RtoApi.Students.useRtoResolveIssuesStudents({
            search: 'status:open',
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        })
    const count = RtoApi.Students.useRtoResolveIssuesStudentsCount()
    const onModalCancelClicked = () => setModal(null)

    const onClickCompleted = (student: any) => {
        setModal(
            <ResolveIssuesCompletedModal
                onCancel={onModalCancelClicked}
                student={student}
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
                                info.row.original?.workplaceRequest?.courses[0]
                                    ?.code ?? '————'
                            } - ${
                                info.row.original?.workplaceRequest?.courses[0]
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
            accessorKey: 'createdAt',
            header: () => <span>Created At</span>,
            cell: ({ row }) => (
                <Button
                    text="resolve"
                    className="!bg-gradient-to-r from-successNew to-emerald-600"
                    variant="secondary"
                    Icon={FaRegCheckCircle}
                    onClick={() => onClickCompleted(row.original)}
                />
            ),
        },
        // {
        //     accessorKey: 'action',
        //     header: () => <span>Action</span>,
        //     cell: (info) => (
        //         <div className="flex gap-x-1 items-center">
        //             <TableAction
        //                 options={tableActionOptions}
        //                 rowItem={info.row.original}
        //             />
        //         </div>
        //     ),
        // },
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
            <div className="flex flex-col gap-y-4 mb-32">
                {/* <PageHeading
                    title={'Problematic Students'}
                    subtitle={'List of Problematic Students'}
                ></PageHeading> */}
                <div className="mt-5 grid grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <CountCard stat={stat} />
                    ))}
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
