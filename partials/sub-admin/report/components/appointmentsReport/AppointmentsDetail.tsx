import {
    EmptyData,
    InitialAvatar,
    LoadingAnimation,
    Table,
    TechnicalError,
    Typography,
} from '@components'
import { UserRoles } from '@constants'

import { SubAdminApi } from '@queries'
import { ColumnDef } from '@tanstack/react-table'
import { ellipsisText } from '@utils'

type Props = {}

export const AppointmentsDetail = (props: Props) => {
    const { data, isLoading, isError } =
        SubAdminApi.Reports.useBookAppointmentsReport({})
    const columns: ColumnDef<any>[] = [
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
            </div>
            {isError && <TechnicalError />}
            {isLoading ? (
                <LoadingAnimation height="h-[60vh]" />
            ) : data?.data && data?.data?.length ? (
                <Table columns={columns} data={data?.data}>
                    {({ table, pagination, pageSize, quickActions }: any) => {
                        return (
                            <div>
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
