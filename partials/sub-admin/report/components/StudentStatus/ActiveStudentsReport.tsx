import {
    ActionButton,
    EmptyData,
    InitialAvatar,
    LoadingAnimation,
    ShowErrorNotifications,
    Table,
    TechnicalError,
    Typography,
} from '@components'
import { SubAdminApi } from '@queries'
import { ColumnDef } from '@tanstack/react-table'
import { CoordinatorActiveStudentReport } from '@types'
import { ellipsisText } from '@utils'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { SubAdminReports } from 'types/sub-admin-reports.type'
type Props = {
    subadmin?: number
}

export const ActiveStudentsReport = ({ subadmin }: Props) => {
    const router = useRouter()
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)

    const activeStudentsReport = SubAdminApi.Reports.useActiveStudentsReport({
        userId: subadmin,
        skip: itemPerPage * page - itemPerPage,
        limit: itemPerPage,
    })

    const columns: ColumnDef<CoordinatorActiveStudentReport>[] = [
        {
            header: () => <span>Name</span>,
            accessorKey: 'user',
            cell: (info) => {
                return (
                    <a className="flex items-center gap-x-2">
                        <InitialAvatar
                            name={info?.row?.original?.user?.name}
                            imageUrl={info?.row?.original?.user?.avatar}
                        />
                        <div className="flex flex-col">
                            <span>
                                {ellipsisText(
                                    info?.row?.original?.studentId,
                                    8
                                )}
                            </span>
                            <span>{info?.row?.original?.user?.name}</span>
                        </div>
                    </a>
                )
            },
        },
        {
            accessorKey: 'email',
            header: () => <span>Email</span>,
            cell: (info) => {
                return <span>{info?.row?.original?.user?.email}</span>
            },
        },
        {
            accessorKey: 'phone',
            header: () => <span>Phone</span>,
        },
        {
            accessorKey: 'courses',
            header: () => <span>Courses</span>,
            cell: (info) => {
                // return info?.row?.original?.courses?.map((c: Course) => (
                //     <CourseDot key={c?.id} course={c} />
                // ))
                return (
                    <span>
                        {info?.row?.original?.courses[0]?.title || 'N/A'}
                    </span>
                )
            },
        },
    ]
    const count = activeStudentsReport?.data?.pagination?.totalResult
    return (
        <>
            <ShowErrorNotifications result={activeStudentsReport} />
            <div className="flex justify-between items-center">
                <div className="">
                    <Typography variant="title" color="text-gray-400">
                        Active Students
                    </Typography>
                    <Typography variant="h3">{count || 0}</Typography>
                </div>
                <ActionButton
                    onClick={() => {
                        router.push(
                            `/portals/sub-admin/report/${SubAdminReports.ACTIVE_STUDENTS}`
                        )
                    }}
                >
                    View Full List
                </ActionButton>
            </div>

            {activeStudentsReport?.isError && <TechnicalError />}
            {activeStudentsReport?.isLoading ? (
                <LoadingAnimation height="h-[60vh]" />
            ) : activeStudentsReport?.data?.data &&
              activeStudentsReport?.data?.data?.length ? (
                <Table
                    columns={columns}
                    data={activeStudentsReport?.data?.data}
                >
                    {({ table, pagination, pageSize, quickActions }: any) => {
                        return (
                            <div>
                                <div className="p-6 mb-2 flex justify-between">
                                    {pageSize(itemPerPage, setItemPerPage)}
                                    <div className="flex gap-x-2">
                                        {/* {quickActions} */}
                                        {pagination(
                                            activeStudentsReport?.data
                                                ?.pagination,
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
                !activeStudentsReport?.isError && (
                    <EmptyData
                        title={'No Active Students Found'}
                        description={'There is no any Active Students yet'}
                        height={'50vh'}
                    />
                )
            )}
        </>
    )
}
