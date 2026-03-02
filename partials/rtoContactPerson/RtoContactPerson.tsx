import {
    Card,
    EmptyData,
    Filter,
    LoadingAnimation,
    ObserverStudentFilters,
    SetDetaultQueryFilteres,
    StudentExpiryDaysLeft,
    Table,
    TechnicalError,
    Typography,
} from '@components'
import { PageHeading } from '@components/headings'
import { ColumnDef } from '@tanstack/react-table'

import { ObserverApi } from '@queries'
import { Student, StudentsFilterType, UserStatus } from '@types'
import {
    activeWorkplace,
    getStudentWorkplaceAppliedIndustry,
    WorkplaceCurrentStatus,
} from '@utils'
import moment from 'moment'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import {
    IWorkplaceIndustries,
    WorkplaceWorkIndustriesType,
} from '@redux/queryTypes'
import { IndustryCellInfo, SectorCell, StudentCellInfo } from './components'

const filterKeys = [
    'name',
    'email',
    'phone',
    'studentId',
    'status',
    'industryId',
    'courseId',
    'currentStatus',
]

export const RtoContactPerson = () => {
    const router = useRouter()
    const [modal, setModal] = useState<ReactElement | null>(null)

    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const [filter, setFilter] = useState({} as StudentsFilterType)
    const [filterAction, setFilterAction] = useState(null)

    useEffect(() => {
        setPage(Number(router.query.page) || 1)
        setItemPerPage(Number(router.query.pageSize) || 50)
    }, [router])

    // hooks

    const { isLoading, isFetching, data, isError, isSuccess } =
        ObserverApi.Students.useStudents({
            search: `${JSON.stringify(filter)
                .replaceAll('{', '')
                .replaceAll('}', '')
                .replaceAll('"', '')
                .trim()}`,
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        })

    const columns: ColumnDef<Student>[] = [
        {
            accessorKey: 'user.name',
            cell: (info) => <StudentCellInfo student={info.row.original} />,
            header: () => <span>Student Name</span>,
        },
        {
            accessorKey: 'industry',
            header: () => <span>Industry</span>,
            cell: (info) => {
                const workplace = info.row.original?.workplace
                const industries = info.row.original?.industries

                const olderWorkplace = (workplace: IWorkplaceIndustries[]) => {
                    return workplace?.reduce(
                        (a: IWorkplaceIndustries, b: IWorkplaceIndustries) =>
                            (a?.createdAt ?? 0) < (b?.createdAt ?? 0) ? a : b,
                        {
                            currentStatus: WorkplaceCurrentStatus.NotRequested,
                        }
                    )
                }
                const studentsListWorkplace = (
                    workplace: IWorkplaceIndustries[]
                ) => {
                    const activeWP = activeWorkplace(workplace)

                    const latestWP = olderWorkplace(activeWP)

                    const appliedIndustry = getStudentWorkplaceAppliedIndustry(
                        latestWP?.industries as WorkplaceWorkIndustriesType[]
                    )?.industry

                    return appliedIndustry
                }

                const appliedIndustry = studentsListWorkplace(workplace)

                return workplace && workplace?.length > 0 && appliedIndustry ? (
                    <IndustryCellInfo industry={appliedIndustry} />
                ) : industries && industries?.length > 0 ? (
                    <IndustryCellInfo
                        industry={info.row.original?.industries?.[0]}
                    />
                ) : (
                    <Typography center>N/A</Typography>
                )
            },
        },
        {
            accessorKey: 'courses',
            header: () => <span>Courses</span>,
            cell: (info) => <SectorCell courses={info.row.original?.courses} />,
        },
        {
            accessorKey: 'progress',
            header: () => <span>Progress</span>,
            cell: (info) => {
                const student = info?.row?.original

                // const status = {
                //     'Not Requested': WorkplaceCurrentStatus.NotRequested,
                //     Applied = 'applied',
                //     CaseOfficerAssigned = 'caseOfficerAssigned',
                //     Interview = 'interview',
                //     AwaitingWorkplaceResponse = 'awaitingWorkplaceResponse',
                //     AppointmentBooked = 'appointmentBooked',
                //     AwaitingAgreementSigned = 'awaitingAgreementSigned',
                //     AgreementSigned = 'AgreementSigned',
                //     PlacementStarted = 'placementStarted',
                //     Cancelled = 'cancelled',
                //     Completed = 'completed',
                //     NoResponse = 'noResponse',
                //     Rejected = 'rejected',
                //     Terminated = 'terminated',
                // }
                const workplace = student?.workplace
                    ?.filter(
                        (w: any) =>
                            w?.currentStatus !==
                            WorkplaceCurrentStatus.Cancelled
                    )
                    ?.reduce(
                        (a: any, b: any) =>
                            b?.createdAt > a?.createdAt ? a : b,
                        {
                            currentStatus: WorkplaceCurrentStatus.NotRequested,
                        }
                    )

                return (
                    <div className="bg-gray-200 w-fit px-2 py-1 rounded-md">
                        <Typography variant="small" uppercase>
                            {workplace?.currentStatus}
                        </Typography>
                    </div>
                )
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
            accessorKey: 'user.status',
            header: () => <span>Status</span>,
            cell: (info) => (
                <Typography
                    uppercase
                    variant={'badge'}
                    color={
                        info.row.original?.user?.status === UserStatus.Blocked
                            ? 'text-error'
                            : 'text-black'
                    }
                >
                    <span className="font-bold">
                        {info.row.original?.user?.status}
                    </span>
                </Typography>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: () => <span>Created At</span>,
            cell: (info) => {
                return (
                    <>
                        <Typography variant={'small'} color={'text-gray-600'}>
                            <span className="font-semibold whitespace-pre">
                                {moment(info?.row?.original?.createdAt).format(
                                    'Do MMM YYYY'
                                )}
                            </span>
                        </Typography>
                        <Typography variant={'small'} color={'text-gray-600'}>
                            <span className="font-semibold whitespace-pre">
                                {moment(info?.row?.original?.createdAt).format(
                                    'hh:mm:ss a'
                                )}
                            </span>
                        </Typography>
                    </>
                )
            },
        },
    ]

    return (
        <>
            {modal && modal}
            <SetDetaultQueryFilteres<StudentsFilterType>
                filterKeys={filterKeys}
                setFilter={setFilter}
            />
            <div className="flex flex-col gap-y-4 mb-32">
                <PageHeading
                    title={'All Students'}
                    subtitle={'List of All Students'}
                >
                    {' '}
                    <div className="flex-shrink-0">{filterAction}</div>
                </PageHeading>
                <Filter<StudentsFilterType>
                    component={ObserverStudentFilters}
                    initialValues={filter}
                    setFilterAction={setFilterAction}
                    setFilter={setFilter}
                    filterKeys={filterKeys}
                />

                <Card noPadding>
                    {isError && <TechnicalError />}
                    {isLoading || isFetching ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : data && data?.data.length && isSuccess ? (
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
                                        <div
                                            className="px-6"
                                            id={'studentScrollId'}
                                        >
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
                                title={'No Pending Student!'}
                                description={
                                    'You have no pending Student request yet'
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
