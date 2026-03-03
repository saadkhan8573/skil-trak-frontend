import {
    EmptyData,
    InitialAvatar,
    LoadingAnimation,
    Table,
    TechnicalError,
    Typography,
} from '@components'
import { CourseDot } from '@partials/rto/student/components'
import { SubAdminApi } from '@queries'
import { ColumnDef } from '@tanstack/react-table'

import { Course } from '@types'
import { ellipsisText } from '@utils'
import { useRouter } from 'next/router'

export const StudentHaveWorkplaceDetail = () => {
    const router = useRouter()
    const { data, isLoading, isError } =
        SubAdminApi.Reports.useStudentProvidedWorkplaceReport(undefined)

    const columns: ColumnDef<any>[] = [
        {
            header: () => <span>Name</span>,
            accessorKey: 'user',
            cell: (info: any) => (
                <a className="flex items-center gap-x-2">
                    {info.row.original?.user?.name && (
                        <InitialAvatar
                            name={info.row.original?.user?.name}
                            imageUrl={info.row.original?.user?.avatar}
                        />
                    )}
                    <div className="flex flex-col">
                        <span>
                            {ellipsisText(info?.row?.original?.studentId, 8)}
                        </span>
                        <span>{info.row.original?.user?.name}</span>
                    </div>
                </a>
            ),
        },
        {
            accessorKey: 'email',
            header: () => <span>Email</span>,
            cell: (info) => <span>{info.row.original?.user?.email}</span>,
        },
        {
            accessorKey: 'phone',
            header: () => <span>Phone</span>,
            cell: (info) => <span>{info.row.original?.phone}</span>,
        },
        {
            accessorKey: 'courses',
            header: () => <span>Courses</span>,
            cell: (info) =>
                info?.row?.original?.courses?.map((course: Course) => (
                    <CourseDot key={course?.id} course={course} />
                )),
        },
    ]
    const count = data?.pagination?.totalResult
    return (
        <>
            <div className="flex justify-between">
                <div className="">
                    <Typography variant="title" color="text-gray-400">
                        Student Workplace Requests Assigned to himself detail
                    </Typography>
                    <Typography variant="h3">{count || 0}</Typography>
                </div>

                <div className="flex items-center gap-x-4">
                    {/* <FilterReport
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                    /> */}
                    {/* <ViewFullListReport data={data} columns={columns} /> */}
                    {/* <ActionButton
                        onClick={() => {
                            router.push(
                                `/portals/sub-admin/report/${ReportOptionsEnum.WORKPLACE_REQUEST_TERMINATED}`
                            )
                        }}
                    >
                        View Full List
                    </ActionButton> */}
                </div>
            </div>
            {isError && <TechnicalError />}
            {isLoading ? (
                <LoadingAnimation height="h-[60vh]" />
            ) : data?.data && data?.data?.length ? (
                <Table columns={columns} data={data?.data}>
                    {({ table, pagination, pageSize, quickActions }: any) => {
                        return (
                            <div>
                                {/* <div className="p-6 mb-2 flex justify-between">
                                    {pageSize(itemPerPage, setItemPerPage)}
                                    <div className="flex gap-x-2">
                                        {quickActions}
                                        {pagination(data?.pagination, setPage)}
                                    </div>
                                </div> */}
                                <div className="px-6">{table}</div>
                            </div>
                        )
                    }}
                </Table>
            ) : (
                !isError && (
                    <EmptyData
                        title={
                            'No Student Workplace Requests Assigned to himself Found'
                        }
                        description={
                            'There is no Student Workplace Requests Assigned to himself yet'
                        }
                        height={'50vh'}
                    />
                )
            )}
        </>
    )
}
