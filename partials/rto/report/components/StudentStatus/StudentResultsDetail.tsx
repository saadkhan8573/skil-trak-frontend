import {
    InitialAvatar,
    LoadingAnimation,
    NoData,
    Table,
    TechnicalError,
    Typography,
} from '@components'
import { UserRoles } from '@constants'
import { RtoApi } from '@queries'
import { ColumnDef } from '@tanstack/react-table'
import { ellipsisText, getUserCredentials } from '@utils'
type Props = {
    rtoUser?: number
}

export const StudentResultsDetail = ({ rtoUser }: Props) => {
    const { data, isLoading, isError } =
        RtoApi.Students.useStudentsResultsReport(
            {
                user: rtoUser,
            },
            {
                skip:
                    (getUserCredentials()?.role === UserRoles.ADMIN ||
                        getUserCredentials()?.role === UserRoles.SUBADMIN) &&
                    !rtoUser,
            }
        )

    const columns: ColumnDef<any>[] = [
        {
            header: () => <span>Name</span>,
            accessorKey: 'user',
            cell: (info: any) => (
                <a className="flex items-center gap-x-2">
                    <InitialAvatar
                        name={info?.row?.original?.student?.user?.name || 'N/A'}
                        imageUrl={info?.row?.original?.student?.user?.avatar}
                    />
                    <div className="flex flex-col">
                        <span>
                            {ellipsisText(
                                info?.row?.original?.student?.studentId,
                                8
                            )}
                        </span>
                        <span>{info?.row?.original?.student?.user?.name}</span>
                    </div>
                </a>
            ),
        },
        {
            accessorKey: 'email',
            header: () => <span>Email</span>,
            cell: (info) => (
                <span>{info?.row?.original?.student?.user?.email}</span>
            ),
        },
        {
            accessorKey: 'phone',
            header: () => <span>Phone</span>,
            cell: (info) => <span>{info?.row?.original?.student?.phone}</span>,
        },
        {
            accessorKey: 'courses',
            header: () => <span>Courses</span>,
            cell: (info) => {
                // return info?.row?.original?.courses?.map((c: Course) => (
                //     <CourseDot key={c?.id} course={c} />
                // ))
                return (
                    <span>{info?.row?.original?.course?.title || 'N/A'}</span>
                )
            },
        },
        {
            accessorKey: 'result',
            header: () => <span>Result</span>,
            cell: (info) => {
                // return info?.row?.original?.courses?.map((c: Course) => (
                //     <CourseDot key={c?.id} course={c} />
                // ))
                return <span> {info?.row?.original?.result || 'N/A'} </span>
            },
        },
    ]
    const count = data?.pagination?.totalResult
    return (
        <>
            <div className="flex justify-between items-start">
                <div className="">
                    <Typography variant="title" color="text-gray-400">
                        Results
                    </Typography>
                    <Typography variant="h3">{count || 0}</Typography>
                </div>
                {/* <ViewFullListReport data={data} columns={columns} /> */}
                {/* <ActionButton
                    onClick={() => {
                        router.push(
                            `/portals/rto/report/${ReportOptionsEnum.NON_CONTACTABLE}`
                        )
                    }}
                >
                    View Full List
                </ActionButton> */}
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
                !isError && <NoData text="No Results Found" />
            )}
        </>
    )
}
