import {
    ActionButton,
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
import React, { useState } from 'react'
import { FilterReport } from '../../FilterReport'

import { Course, ReportOptionsEnum } from '@types'
import { useRouter } from 'next/router'
import { SubAdminReports } from 'types/sub-admin-reports.type'
import { ellipsisText } from '@utils'

type Props = {
    startDate: Date
    setStartDate: (startDate: Date) => void
    endDate: Date
    setEndDate: (endDate: Date) => void
    subadmin?: number
}

export const PlacementStartedReport = ({
    setStartDate,
    setEndDate,
    startDate,
    endDate,
    subadmin,
}: Props) => {
    let end = new Date(endDate)
    end.setDate(end.getDate() + 1)
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const router = useRouter()
    const { data, isLoading, isError } =
        SubAdminApi.Reports.useStudentWorkplaceStartedReport({
            startDate: startDate.toISOString().slice(0, 10),
            endDate: end.toISOString().slice(0, 10),
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
            userId: subadmin,
        })

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
                            {' '}
                            {ellipsisText(
                                info?.row?.original?.student?.studentId,
                                8
                            )}
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
            cell: (info) => (
                <span>
                    {info?.row?.original?.workplace?.[0]?.courses?.[0]?.title ||
                        'N/A'}
                </span>
            ),
        },
    ]
    const count = data?.pagination?.totalResult
    return (
        <>
            <div className="flex justify-between">
                <div className="">
                    <Typography variant="title" color="text-gray-400">
                        Placement Started For Students
                    </Typography>
                    <Typography variant="h3">{count || 0}</Typography>
                </div>

                <div className="flex items-center gap-x-4">
                    <FilterReport
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                    />
                    <ActionButton
                        onClick={() => {
                            router.push(
                                `/portals/sub-admin/report/${SubAdminReports.PLACEMENT_STARTED}`
                            )
                        }}
                    >
                        View Full List
                    </ActionButton>
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
                                <div className="p-6 mb-2 flex justify-between">
                                    {pageSize(itemPerPage, setItemPerPage)}
                                    <div className="flex gap-x-2">
                                        {/* {quickActions} */}
                                        {pagination(data?.pagination, setPage)}
                                    </div>
                                </div>
                                <div className="px-6">{table}</div>
                            </div>
                        )
                    }}
                </Table>
            ) : (
                !isError && (
                    <EmptyData
                        title={'No Placement Started Found'}
                        description={'There is no Placement Started yet'}
                        height={'50vh'}
                    />
                )
            )}
        </>
    )
}
