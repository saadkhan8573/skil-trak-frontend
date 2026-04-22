import {
    ActionButton,
    Card,
    EmptyData,
    StudentJobId,
    Table,
    TableAction,
    TableSkeleton,
    TechnicalError,
    Typography,
    UserCreatedAt,
} from '@components'
import { ColumnDef } from '@tanstack/react-table'
import { FaEdit, FaEye } from 'react-icons/fa'

import { Badge } from '@components/ui/badge'
import { StudentCellInfo } from '@partials/rto/student/components'
import { RtoV2Api } from '@queries'
import { Student } from '@types'
import { BookOpen } from 'lucide-react'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import { MdBlock } from 'react-icons/md'
import { statusConfig } from '../components/placementHelpers'
import { WorkplaceCurrentStatus } from '@utils'

export const StudentProvidedWorkplaceTab = () => {
    const router = useRouter()
    const [modal, setModal] = useState<ReactElement | null>(null)

    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)

    const { isLoading, data, isError, refetch } =
        RtoV2Api.PlacementRequests.useStudentPlacementRequestList({
            search: `studentProvidedWorkplace:${true}`,
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        })

    const tableActionOptions = [
        {
            text: 'View',
            onClick: (student: Student) => {
                router.push(
                    `/portals/rto/students-and-placements/placement-requests/${student?.id}/detail`
                )
            },
            Icon: FaEye,
        },
    ]

    const columns: ColumnDef<any>[] = [
        {
            header: () => 'Job Id',
            accessorKey: 'studentMaskedId',
            cell: ({ row }) => (
                <StudentJobId
                    studentJobId={
                        row.original?.student?.studentMaskedId || '---'
                    }
                />
            ),
        },
        {
            accessorKey: 'user.name',
            cell: (info) => (
                <StudentCellInfo
                    link={`/portals/rto/students-and-placements/placement-requests/${info?.row?.original?.id}/${info?.row?.original?.student?.id}`}
                    student={info?.row?.original?.student}
                    call
                />
            ),
            header: () => <span>Student</span>,
        },

        {
            accessorKey: 'industry',
            header: () => <span>Industry</span>,
            cell: (info: any) => {
                const industries = info?.row?.original?.industries
                const studentApproval =
                    info?.row?.original?.studentProvidedWorkplaceRequestApproval

                const industryUserName =
                    industries?.length > 0
                        ? industries[0]?.industry?.user?.name
                        : studentApproval?.industry?.user?.name

                return (
                    <>
                        {industryUserName ? (
                            <>{industryUserName}</>
                        ) : (
                            <Typography center>---</Typography>
                        )}
                    </>
                )
            },
        },
        {
            accessorKey: 'Course',
            header: () => (
                <div className="flex items-center gap-x-2">
                    <BookOpen className="h-3.5 w-3.5 text-primaryNew/60" />
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                        Course
                    </span>
                </div>
            ),
            cell: ({ row }: any) => (
                <div className="flex flex-col gap-1.5 min-w-0 col-span-1 sm:col-span-1 lg:col-span-1">
                    <span
                        className="text-sm font-semibold text-foreground/90 leading-tight truncate"
                        title={row?.original?.courses?.[0]?.title}
                    >
                        {row?.original?.courses?.[0]?.title}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'progress',
            header: () => <span>Status</span>,
            cell: ({ row }) => {
                const getStatus = () => {
                    if (
                        [
                            WorkplaceCurrentStatus.CaseOfficerAssigned,
                            WorkplaceCurrentStatus.Applied,
                            WorkplaceCurrentStatus.Interview,
                        ].includes(row?.original?.currentStatus)
                    ) {
                        return WorkplaceCurrentStatus.IndustryEligibility
                    }
                    return row?.original?.currentStatus
                }

                const status = getStatus()
                const config = statusConfig[status]

                if (!config) {
                    return (
                        <Badge className="bg-muted text-muted-foreground border px-2.5 py-1 text-xs">
                            --
                        </Badge>
                    )
                }
                const StatusIcon = config.icon

                return (
                    <Badge
                        className={`${config.bgColor} ${config.color} ${config.borderColor} border-2 whitespace-nowrap px-2.5 py-1 shadow-sm font-semibold text-xs w-fit`}
                    >
                        {StatusIcon && (
                            <StatusIcon className="h-3.5 w-3.5 mr-1.5" />
                        )}
                        {config?.label}
                    </Badge>
                )
            },
        },
        {
            accessorKey: 'createdAt',
            header: () => <span>Created At</span>,
            cell: ({ row }: any) => (
                <UserCreatedAt createdAt={row.original?.createdAt} />
            ),
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: (info) => (
                <div className="flex gap-x-1 items-center">
                    <TableAction
                        options={tableActionOptions}
                        rowItem={info.row.original}
                    />
                </div>
            ),
        },
    ]

    const quickActionsElements = {
        id: 'id',
        individual: (id: any) => (
            <div className="flex gap-x-2">
                <ActionButton Icon={FaEdit}>Edit</ActionButton>
                <ActionButton>Sub Admins</ActionButton>
                <ActionButton Icon={MdBlock} variant="error">
                    Block
                </ActionButton>
            </div>
        ),
        common: (ids: any[]) => (
            <ActionButton Icon={MdBlock} variant="error">
                Block
            </ActionButton>
        ),
    }

    return (
        <>
            {modal && modal}
            <div className="flex flex-col gap-y-4 mb-32">
                <Card noPadding>
                    {isError && <TechnicalError />}
                    {isLoading ? (
                        <TableSkeleton arrayLength={8} />
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
