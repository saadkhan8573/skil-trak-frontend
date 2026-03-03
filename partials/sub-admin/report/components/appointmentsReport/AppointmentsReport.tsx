import {
    ActionButton,
    EmptyData,
    InitialAvatar,
    LoadingAnimation,
    Table,
    TechnicalError,
    Typography,
} from '@components'

import { SubAdminApi } from '@queries'
import { ColumnDef } from '@tanstack/react-table'
import React, { useState } from 'react'
import { FilterReport } from '../../FilterReport'
import { CourseDot } from '@partials/rto/student/components'
import { CoordinatorAppointmentReport, Course, ReportOptionsEnum } from '@types'
import { ViewFullListReport } from '../../ViewFullListReport'
import { useRouter } from 'next/router'
import { SubAdminReports } from 'types/sub-admin-reports.type'
import { UserRoles } from '@constants'
import { ellipsisText } from '@utils'

type Props = {
    startDate: Date
    setStartDate: (startDate: Date) => void
    endDate: Date
    setEndDate: (endDate: Date) => void
    subadmin?: number
}

export const AppointmentsReport = ({
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
        SubAdminApi.Reports.useBookAppointmentsReport({
            startDate: startDate.toISOString().slice(0, 10),
            endDate: end.toISOString().slice(0, 10),
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
            userId: subadmin,
        })

    const columns: ColumnDef<CoordinatorAppointmentReport>[] = [
        {
            header: () => <span>Appointment By</span>,
            accessorKey: 'appointmentBy',
            cell: (info: any) => {
                return (
                    <a className="flex items-center gap-x-2">
                        {info?.row?.original?.appointmentBy?.name && (
                            <InitialAvatar
                                name={info?.row?.original?.appointmentBy?.name}
                                imageUrl={
                                    info?.row?.original?.appointmentBy?.avatar
                                }
                            />
                        )}
                        <div className="flex flex-col">
                            {info.row.original?.appointmentBy?.role ===
                                UserRoles.STUDENT && (
                                <span>
                                    {ellipsisText(
                                        info.row.original?.appointmentBy
                                            ?.student?.studentId,
                                        8
                                    )}
                                </span>
                            )}
                            <span>
                                {info.row.original?.appointmentBy?.name ||
                                    'N/A'}
                            </span>
                            <span>
                                {info.row.original.appointmentBy?.email}
                            </span>
                        </div>
                    </a>
                )
            },
        },
        {
            accessorKey: 'appointmentFor',
            header: () => <span>Appointment For</span>,
            cell: (info) => (
                <a className="flex items-center gap-x-2">
                    <InitialAvatar
                        name={
                            info?.row?.original?.appointmentFor?.name || 'N/A'
                        }
                        imageUrl={info.row.original?.appointmentFor?.avatar}
                    />
                    <div className="flex flex-col">
                        {info.row.original?.appointmentFor?.role ===
                            UserRoles.STUDENT && (
                            <span>
                                {
                                    info.row.original?.appointmentFor?.student
                                        ?.studentId
                                }
                            </span>
                        )}
                        <span>
                            {info.row.original.appointmentFor?.name || 'N/A'}
                        </span>
                        <span>
                            {info.row.original.appointmentFor?.email || 'N/A'}
                        </span>
                    </div>
                </a>
            ),
        },
        {
            accessorKey: 'courses',
            header: () => <span>Course</span>,
            cell: (info) => (
                <span>{info.row.original.course?.title || 'N/A'}</span>
            ),
        },
        {
            accessorKey: 'startTime',
            header: () => <span>Start Time</span>,
        },
        {
            accessorKey: 'endTime',
            header: () => <span>End Time</span>,
        },
        {
            accessorKey: 'date',
            header: () => <span>Date</span>,
        },
    ]
    const count = data?.pagination?.totalResult
    return (
        <>
            <div className="flex justify-between">
                <div className="">
                    <Typography variant="title" color="text-gray-400">
                        Appointments
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
                    {/* <ViewFullListReport data={data} columns={columns} /> */}
                    <ActionButton
                        onClick={() => {
                            router.push(
                                `/portals/sub-admin/report/${SubAdminReports.BOOK_APPOINTMENTS}`
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
                        title={'No Appointments Found'}
                        description={'There is no Appointments yet'}
                        height={'50vh'}
                    />
                )
            )}
        </>
    )
}
