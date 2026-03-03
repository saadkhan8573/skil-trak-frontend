import {
    ActionButton,
    AuthorizedUserComponent,
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
import { ReportOptionsEnum } from '@types'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Waypoint } from 'react-waypoint'
import { FilterReport } from '../../FilterReport'
import { ellipsisText } from '@utils'
type Props = {
    startDate: Date
    setStartDate: (startDate: Date) => void
    endDate: Date
    setEndDate: (endDate: Date) => void
    user?: number
}

export const StudentResultsReport = ({
    setStartDate,
    setEndDate,
    startDate,
    endDate,
    user,
}: Props) => {
    const monthEnd = new Date()
    monthEnd.setDate(monthEnd.getDate() - 30)
    // const [startDate, setStartDate] = useState<Date>(monthEnd)
    // const [endDate, setEndDate] = useState<Date>(new Date())
    const [renderComponent, setRenderComponent] = useState(false)
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const router = useRouter()

    // let end = new Date(endDate)
    // end.setDate(end.getDate() + 1)

    const { data, isLoading, isError, isFetching } =
        RtoApi.Students.useStudentsResultsReport(
            {
                user,
                startDate: startDate.toISOString().slice(0, 10),
                endDate: endDate.toISOString().slice(0, 10),
                skip: itemPerPage * page - itemPerPage,
                limit: itemPerPage,
            },
            { skip: !renderComponent }
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
    const handleEnter = () => {
        setRenderComponent(true)
    }
    const handleLeave = () => {
        setRenderComponent(false)
    }
    return (
        <Waypoint onLeave={handleLeave} onEnter={handleEnter}>
            <div>
                <div className="flex justify-between items-start">
                    <div className="">
                        <Typography variant="title" color="text-gray-400">
                            Results
                        </Typography>
                        <Typography variant="h3">{count || 0}</Typography>
                    </div>
                    {/* <ViewFullListReport data={data} columns={columns} /> */}
                    <div className="flex items-center gap-x-4">
                        {/* <FilterReport
                            startDate={startDate}
                            setStartDate={setStartDate}
                            endDate={endDate}
                            setEndDate={setEndDate}
                        /> */}

                        {/* Only Show in Admin */}
                        <AuthorizedUserComponent roles={[UserRoles.ADMIN]}>
                            <ActionButton
                                onClick={() => {
                                    router.push(
                                        `/portals/admin/rto/${router.query?.id}/${ReportOptionsEnum.STUDENT_RESULTS}`
                                    )
                                }}
                            >
                                View Full List
                            </ActionButton>
                        </AuthorizedUserComponent>

                        {/* Only Show in SubAdmin */}
                        <AuthorizedUserComponent roles={[UserRoles.SUBADMIN]}>
                            <ActionButton
                                onClick={() => {
                                    router.push(
                                        `/portals/sub-admin/users/rtos/${router.query?.id}/${ReportOptionsEnum.STUDENT_RESULTS}`
                                    )
                                }}
                            >
                                View Full List
                            </ActionButton>
                        </AuthorizedUserComponent>

                        {/* Only Show in RTO */}
                        <AuthorizedUserComponent roles={[UserRoles.RTO]}>
                            <ActionButton
                                onClick={() => {
                                    router.push(
                                        `/portals/rto/report/${ReportOptionsEnum.STUDENT_RESULTS}`
                                    )
                                }}
                            >
                                View Full List
                            </ActionButton>
                        </AuthorizedUserComponent>
                    </div>
                </div>

                {isError && <TechnicalError />}
                {isLoading || isFetching ? (
                    <LoadingAnimation height="h-[60vh]" />
                ) : data?.data && data?.data?.length ? (
                    <Table columns={columns} data={data?.data}>
                        {({
                            table,
                            pagination,
                            pageSize,
                            quickActions,
                        }: any) => {
                            return (
                                <div>
                                    <div className="p-6 mb-2 flex justify-between">
                                        {pageSize(itemPerPage, setItemPerPage)}
                                        <div className="flex gap-x-2">
                                            {pagination(
                                                data?.pagination,
                                                setPage
                                            )}
                                        </div>
                                    </div>
                                    <div className="px-6">{table}</div>
                                </div>
                            )
                        }}
                    </Table>
                ) : (
                    !isError && <NoData text="No Results Found" />
                )}
            </div>
        </Waypoint>
    )
}
