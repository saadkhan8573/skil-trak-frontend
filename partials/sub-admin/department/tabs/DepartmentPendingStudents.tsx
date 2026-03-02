import {
    Card,
    CaseOfficerAssignedStudent,
    EmptyData,
    LoadingAnimation,
    Select,
    StudentExpiryDaysLeft,
    Table,
    TableAction,
    TechnicalError,
    UserCreatedAt,
} from '@components'
import { StudentRtoCellInfo } from '@components/Appointment/AppointmentModal'
import { EditTimer } from '@components/StudentTimer/EditTimer'
import { SectorCell } from '@partials/admin/student/components'
import {
    StudentCellInfo,
    SubadminStudentIndustries,
} from '@partials/sub-admin/students'
import {
    AddToNonContactableStudents,
    AssignStudentModal,
    BlockModal,
    ChangeStudentStatusModal,
    HighPriorityModal,
} from '@partials/sub-admin/students/modals'
import { InterviewModal } from '@partials/sub-admin/workplace/modals'
import { SubAdminApi } from '@queries'
import { ColumnDef } from '@tanstack/react-table'
import { Student } from '@types'
import {
    getStudentWorkplaceAppliedIndustry,
    getUserCredentials,
    setLink,
} from '@utils'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import { FaEdit, FaEye } from 'react-icons/fa'
import { MdBlock, MdPriorityHigh } from 'react-icons/md'
import { WorkplaceWorkIndustriesType } from '@redux/queryTypes'

// useDepartmentStudents
export const DepartmentPendingStudents = () => {
    const router = useRouter()
    const userId = getUserCredentials()?.id
    const [modal, setModal] = useState<ReactElement | null>(null)
    const [coordinatorId, setCoordinatorId] = useState<string | null>(null)
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)

    const { data, isLoading, isError, isFetching, isSuccess } =
        SubAdminApi.SubAdmin.useDepartmentStudents(
            {
                skip: itemPerPage * page - itemPerPage,
                limit: itemPerPage,
                search: `status: 'pending'`,
                // search: `${JSON.stringify(
                //     removeEmptyValues({
                //         status: 'pending',
                //         subadminId: coordinatorId,
                //     })
                // )
                //     .replaceAll('{', '')
                //     .replaceAll('}', '')
                //     .replaceAll('"', '')
                //     .trim()}`,
            },
            {
                refetchOnMountOrArgChange: true,
            }
        )

    const { data: departmentCoordinators } =
        SubAdminApi.SubAdmin.useCoordinatorsDropDown()

    const coordinatorsOptions = departmentCoordinators?.map(
        (coordinator: any) => ({
            label: coordinator?.user?.name,
            value: coordinator?.id,
        })
    )

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

    const tableActionOptions = (student: any) => {
        return [
            {
                text: 'View',
                onClick: (student: Student) => {
                    router.push(
                        `/portals/sub-admin/students/${student?.id}/detail`
                    )
                    setLink('subadmin-student', router)
                },
                Icon: FaEye,
            },
            {
                text: student?.nonContactable
                    ? 'Add to Contactable'
                    : 'Add to Not Contactable',
                onClick: (student: Student) =>
                    onNonContactableStudents(student),
                Icon: MdBlock,
            },
            {
                text: 'Change Status',
                onClick: (student: Student) => onChangeStatus(student),
                Icon: FaEdit,
            },
            {
                text: 'Block',
                onClick: (student: Student) => onBlockClicked(student),
                Icon: MdBlock,
                color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
            },
            {
                text: student?.isHighPriority
                    ? 'Remove Mark High Priority'
                    : 'Mark High Priority',
                onClick: (student: Student) =>
                    onMarkAsHighPriorityClicked(student),
                Icon: MdPriorityHigh,
                color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
            },
            {
                text: 'Change Expiry',
                onClick: (student: Student) => onDateClick(student),
                Icon: FaEdit,
            },
        ]
    }

    const Columns: ColumnDef<Student>[] = [
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
                <StudentRtoCellInfo rto={row.original?.rto} />
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

    const onFilterByCoordinator = (value: string) => {
        setCoordinatorId(value)
    }

    return (
        <div>
            {modal}
            {isError && <TechnicalError />}
            <div className="w-full flex justify-end">
                <div className="min-w-64">
                    <Select
                        label={'Filter by Coordinator'}
                        name={'coordinator'}
                        placeholder={'Filter by Coordinator...'}
                        options={coordinatorsOptions}
                        onlyValue
                        onChange={(e: any) => {
                            onFilterByCoordinator(e)
                        }}
                    />
                </div>
            </div>
            <Card noPadding>
                {isLoading || isFetching ? (
                    <LoadingAnimation height="h-[60vh]" />
                ) : data && data?.data.length && !isError ? (
                    <>
                        <Table
                            columns={Columns}
                            data={data.data}
                            enableRowSelection
                            // awaitingAgreementBeyondSevenDays={
                            //     filterAwaitingAgreementBeyondSevenDays
                            // }
                            // findCallLogsUnanswered={findCallLogsUnanswered}
                            // findExpiringInNext45Days={findExpiringInNext45Days}
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
                    </>
                ) : (
                    !isError && (
                        <EmptyData
                            title={'No Pending Students'}
                            description={'You have not pending Students yet'}
                            height={'50vh'}
                        />
                    )
                )}
            </Card>
        </div>
    )
}
