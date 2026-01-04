import {
    ActionButton,
    Card,
    CaseOfficerAssignedStudent,
    EmptyData,
    Table,
    TableAction,
    TableSkeleton,
    TechnicalError,
    Typography,
    UserCreatedAt,
} from '@components'
import { ColumnDef } from '@tanstack/react-table'
import { FaEdit, FaEye } from 'react-icons/fa'

import { CreateStudentNote } from '@partials/common/Notes/forms'
import { SectorCell, StudentCellInfo } from '@partials/rto/student/components'
import { SubadminStudentIndustries } from '@partials/sub-admin/students'
import { ChangeStudentStatusModal } from '@partials/sub-admin/students/modals'
import { RtoApi, RtoV2Api } from '@queries'
import { Student } from '@types'
import { studentsListWorkplace } from '@utils'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import { LuMessageSquare } from 'react-icons/lu'
import { MdBlock } from 'react-icons/md'
import { statusConfig } from '../components/placementHelpers'
import { Badge } from '@components/ui/badge'
import { BookOpen } from 'lucide-react'

export const StudentProvidedWorkplaceTab = () => {
    const router = useRouter()
    const [modal, setModal] = useState<ReactElement | null>(null)

    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    // RtoV2Api.PlacementRequests.useStudentPlacementRequestList()
    const { isLoading, data, isError, refetch } =
        RtoV2Api.PlacementRequests.useStudentPlacementRequestList({
            search: `studentProvidedWorkplace:${true}`,
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
    const onAddNote = (student: Student) => {
        setModal(
            <div
                className={`bg-[#00000050]  w-[calc(100%-80%)]
                     h-full flex items-center justify-center gap-x-2 fixed top-[4.4rem] right-0 z-40`}
            >
                <CreateStudentNote
                    studentId={student?.id}
                    onCancel={onModalCancelClicked}
                    receiverId={student?.user?.id}
                />
            </div>
        )
    }

    const tableActionOptions = (student: any) => [
        {
            text: 'View',
            onClick: (student: Student) => {
                router.push(
                    `/portals/rto/students-and-placements/placement-requests/${student?.id}/detail`
                )
            },
            Icon: FaEye,
        },
        // {
        //     text: 'Edit',
        //     onClick: (student: Student) =>
        //         router.push(`/portals/rto/students/${student.id}/edit-student`),
        //     Icon: FaEye,
        // },
        // {
        //     text: student?.rtoCoordinator
        //         ? 'Change Coordinator'
        //         : 'Assign Coordinator',
        //     onClick: (student: Student) => onAssignCoordinatorClicked(student),
        //     Icon: FaUserPlus,
        // },
        // {
        //     text: 'Block',
        //     onClick: (student: Student) => onBlockClicked(student),
        //     Icon: MdBlock,
        //     color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
        // },
        {
            text: 'Change Status',
            onClick: (student: Student) => onChangeStatus(student),
            Icon: FaEdit,
        },
        {
            text: 'Add Note',
            onClick: (student: Student) => onAddNote(student),
            Icon: LuMessageSquare,
        },
    ]

    const columns: ColumnDef<any>[] = [
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
            accessorKey: 'progress',
            header: () => <span>Status</span>,
            cell: ({ row }) => {
                const status = row?.original?.currentStatus
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
            accessorKey: 'createdAt',
            header: () => <span>Created At</span>,
            cell: ({ row }: any) => (
                <UserCreatedAt createdAt={row.original?.createdAt} />
            ),
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: (info) => {
                const tableActionOption = tableActionOptions(info.row.original)
                return (
                    <div className="flex gap-x-1 items-center">
                        <TableAction
                            options={tableActionOption}
                            rowItem={info.row.original}
                        />
                    </div>
                )
            },
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
