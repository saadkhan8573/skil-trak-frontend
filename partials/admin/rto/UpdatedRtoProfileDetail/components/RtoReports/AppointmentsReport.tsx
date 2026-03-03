import {
    LoadingAnimation,
    NoData,
    TableChildrenProps,
    TechnicalError,
    Typography,
} from '@components'
import { RtoApi } from '@queries'
import { ColumnDef } from '@tanstack/react-table'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { RtoProfileTable } from './components'
import { UserRoles } from '@constants'
import { Appointment } from '@types'

export const AppointmentsReport = ({
    user,
    endDate,
    isViewd,
    startDate,
}: {
    user?: number
    endDate: Date
    startDate: Date
    isViewd?: boolean
}) => {
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
        RtoApi.Students.useAppointmentsReport(
            {
                user,
                startDate: startDate.toISOString().slice(0, 10),
                endDate: endDate.toISOString().slice(0, 10),
                skip: itemPerPage * page - itemPerPage,
                limit: itemPerPage,
            },
            { skip: !isViewd }
        )

    const studentData = (appointment: Appointment) =>
        appointment?.appointmentFor?.role === UserRoles.STUDENT
            ? appointment?.appointmentFor
            : appointment?.appointmentBy

    const columns: ColumnDef<any>[] = [
        {
            header: () => <span>Name</span>,
            accessorKey: 'user.name',
            cell: (info: any) => {
                const student = studentData(info.row.original)
                return (
                    <Typography medium variant="small">
                        {student?.name}
                    </Typography>
                )
            },
        },
        {
            accessorKey: 'email',
            header: () => <span>Email</span>,
            cell: (info: any) => {
                const student = studentData(info.row.original)
                return (
                    <Typography medium variant="small">
                        {student?.email}
                    </Typography>
                )
            },
        },
        {
            accessorKey: 'phone',
            header: () => <span>Phone</span>,
            cell: (info: any) => {
                const student = studentData(info.row.original)
                return (
                    <Typography medium variant="small">
                        {student?.student?.phone}
                    </Typography>
                )
            },
        },
        {
            accessorKey: 'courses',
            header: () => <span>Courses</span>,
            cell: (info) => (
                <Typography variant="small">
                    {info?.row?.original?.course?.title || 'N/A'}
                </Typography>
            ),
        },
    ]
    return (
        <div>
            {isError && <TechnicalError />}
            {isLoading || isFetching ? (
                <LoadingAnimation height="h-[30vh]" />
            ) : data && data?.length ? (
                <div className="h-52 overflow-auto custom-scrollbar">
                    <RtoProfileTable columns={columns} data={data}>
                        {({ table }: TableChildrenProps) => table}
                    </RtoProfileTable>
                </div>
            ) : (
                !isError && <NoData text="No Appointments Found" />
            )}
        </div>
    )
}
