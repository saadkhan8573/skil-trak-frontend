import {
    Button,
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TableAction,
    TableActionOption,
    TechnicalError,
    Typography,
} from '@components'
import { ColumnDef } from '@tanstack/react-table'
import { FaEye } from 'react-icons/fa'

import { InitialAvatar, StudentStatusProgressCell } from '@components'
import { useGetIndustryWorkplaceQuery } from '@queries'
import { useRouter } from 'next/router'
import { MdEmail } from 'react-icons/md'

// query

import { ProgressCell } from '@partials/admin/student/components'

import {
    IndustryDetail,
    StudentCellInfo,
} from '@partials/industry/currentStudents/components'
import {
    WorkplaceCurrentStatus,
    checkStudentStatus,
    checkWorkplaceStatus,
    getStudentWorkplaceAppliedIndustry,
} from '@utils'

export const IndustryDashboardStudents = () => {
    const router = useRouter()

    const industryWorkplace = useGetIndustryWorkplaceQuery(
        {
            skip: 0,
            limit: 5,
        },
        { refetchOnMountOrArgChange: true }
    )

    const tableActionOptions: TableActionOption<any>[] = [
        {
            text: 'View',
            onClick: (workplace: any) => {
                router.push({
                    pathname: `/portals/industry/students/current-students/${workplace?.id}/detail`,
                    query: { tab: 'overview' },
                })
            },
            Icon: FaEye,
        },
        {
            text: 'New Profile',
            onClick: (workplace: any) => {
                router.push(
                    `/portals/industry/students/current-students/${workplace?.id}/detail`
                )
            },
            Icon: FaEye,
        },
    ]

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'user',
            cell: (info) => (
                <StudentCellInfo
                    id={info.row.original?.id}
                    student={info.row.original?.student}
                />
            ),
            header: () => <span>Student</span>,
        },
        {
            accessorKey: 'rto',
            header: () => <span>RTO</span>,
            cell: (info) => {
                const rto = info.row.original?.student?.rto
                return (
                    <div className="flex items-center gap-x-2">
                        <div className="shadow-inner-image rounded-full">
                            <InitialAvatar
                                name={rto?.user?.name || ''}
                                imageUrl={rto?.user?.avatar || ''}
                            />
                        </div>
                        <div>
                            <p className={`font-medium`}>{rto?.user?.name}</p>
                            <div className="font-medium text-xs text-gray-500">
                                <p className="flex items-center gap-x-1">
                                    <span>
                                        <MdEmail />
                                    </span>
                                    {rto?.user?.email}
                                </p>
                            </div>
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: 'sectors',
            header: () => <span>Course</span>,
            cell: (info) => (
                <div>
                    <Typography variant={'xs'} color={'text-gray-500'}>
                        {info.row.original?.courses[0]?.code || 'N/A'}
                    </Typography>
                    <Typography variant={'label'} color={'text-gray-700'}>
                        {info.row.original?.courses[0]?.title || 'N/A'}
                    </Typography>
                </div>
            ),
        },
        {
            accessorKey: 're',
            header: () => <span>Required Hours</span>,
            cell: (info) => (
                <div className="w-32">
                    <div className="border-2 border-[#bf0000] bg-[#bf000010] rounded-full p-2 w-fit">
                        <Typography variant="xs" medium>
                            {info.row.original?.courses[0]?.hours} hours
                        </Typography>
                    </div>
                </div>
            ),
        },

        {
            accessorKey: 'progress',
            header: () => <span>Progress</span>,
            cell: ({ row }) => {
                const workplace = row.original
                const studentStatus = checkStudentStatus(
                    row.original?.student?.studentStatus
                )
                const appliedIndustry = getStudentWorkplaceAppliedIndustry(
                    workplace?.industries
                )
                const steps = checkWorkplaceStatus(workplace?.currentStatus)

                const wpStatus = [
                    WorkplaceCurrentStatus.PlacementStarted,
                    WorkplaceCurrentStatus.Completed,
                    WorkplaceCurrentStatus.Terminated,
                ]

                return (
                    <div>
                        {row.original?.currentStatus ? (
                            <ProgressCell
                                appliedIndustry={appliedIndustry}
                                step={steps > 14 ? 14 : steps < 1 ? 1 : steps}
                            />
                        ) : wpStatus.includes(row.original?.currentStatus) ? (
                            <StudentStatusProgressCell
                                assigned={
                                    workplace?.assignedTo ||
                                    row.original?.student?.subadmin
                                }
                                studentId={row.original?.student?.id}
                                step={
                                    workplace?.currentStatus ===
                                    WorkplaceCurrentStatus.Cancelled
                                        ? 4
                                        : studentStatus
                                }
                                appliedIndustry={appliedIndustry}
                            />
                        ) : null}
                    </div>
                )
            },
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: (info) => {
                return (
                    <div className="flex gap-x-1 items-center">
                        <TableAction
                            options={tableActionOptions}
                            rowItem={info.row.original}
                        />
                    </div>
                )
            },
        },
    ]

    return (
        <>
            <Card fullHeight shadowType="profile" noPadding>
                <div className="px-4 py-3 flex justify-between items-center border-b border-secondary-dark">
                    <Typography semibold>
                        <span className="text-[15px]">Students</span>
                    </Typography>
                    <div className="flex items-center gap-x-14">
                        <Typography>
                            <span className="text-[15px] font-semibold">
                                Current Student :
                            </span>
                            <span className="font-bold">
                                {' '}
                                {industryWorkplace?.data?.data?.length}
                            </span>
                        </Typography>
                    </div>
                </div>
                <div className="relative">
                    <div
                        className={
                            'group flex justify-center items- absolute top-0 left-0 w-full h-full z-20 bg-gradient-black-to-white'
                        }
                    >
                        <div
                            className={
                                'transition-all mt-5 hidden group-hover:block'
                            }
                        >
                            <Button
                                text={'View All Students'}
                                onClick={() => {
                                    router.push(
                                        `/portals/industry/students/current-students?tab=pending`
                                    )
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-y-4">
                        <div>
                            {industryWorkplace?.isError && <TechnicalError />}
                            {industryWorkplace?.isLoading ? (
                                <LoadingAnimation height="h-[60vh]" />
                            ) : industryWorkplace?.data?.data &&
                              industryWorkplace?.data?.data.length > 0 &&
                              industryWorkplace?.isSuccess ? (
                                <Table
                                    columns={columns}
                                    data={industryWorkplace?.data.data}
                                >
                                    {({ table }: any) => {
                                        return (
                                            <div className="px-6 overflow-auto custom-scrollbar">
                                                {table}
                                            </div>
                                        )
                                    }}
                                </Table>
                            ) : (
                                industryWorkplace?.isSuccess && (
                                    <EmptyData
                                        title={'No Students Request!'}
                                        description={
                                            'You have not any Student request yet'
                                        }
                                        height={'50vh'}
                                    />
                                )
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </>
    )
}
