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

export const PlacementStartedReport = ({
    user,
    isViewd,
    endDate,
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

    const { data, isLoading, isError, isFetching } =
        RtoApi.Students.usePlacementStartedReport(
            {
                user,
                startDate: startDate.toISOString().slice(0, 10),
                endDate: endDate.toISOString().slice(0, 10),
                skip: itemPerPage * page - itemPerPage,
                limit: itemPerPage,
            },
            { skip: !isViewd }
        )

    const columns: ColumnDef<any>[] = [
        {
            header: () => <span>Name</span>,
            accessorKey: 'user.name',
            cell: (info: any) => (
                <Typography medium variant="small">
                    {info?.row?.original?.user?.name}
                </Typography>
            ),
        },
        {
            accessorKey: 'email',
            header: () => <span>Email</span>,
            cell: (info: any) => (
                <Typography variant="small">
                    {info?.row?.original?.user?.email}
                </Typography>
            ),
        },
        {
            accessorKey: 'phone',
            header: () => <span>Phone</span>,
            cell: (info: any) => (
                <Typography variant="small">
                    {info?.row?.original?.phone}
                </Typography>
            ),
        },
        {
            accessorKey: 'courses',
            header: () => <span>Courses</span>,
            cell: (info) => {
                // return info?.row?.original?.courses?.map((c: Course) => (
                //     <CourseDot key={c?.id} course={c} />
                // ))
                return (
                    <Typography variant="small">
                        {info?.row?.original?.courses?.[0]?.title || 'N/A'}
                    </Typography>
                )
            },
        },
    ]
    return (
        <div>
            {isError && <TechnicalError />}
            {isLoading || isFetching ? (
                <LoadingAnimation height="h-[30vh]" />
            ) : data?.data && data?.data?.length ? (
                <div className="h-52 overflow-auto custom-scrollbar">
                    <RtoProfileTable columns={columns} data={data?.data}>
                        {({ table }: TableChildrenProps) => table}
                    </RtoProfileTable>
                </div>
            ) : (
                !isError && <NoData text="No Not Contactable Students Found" />
            )}
        </div>
    )
}
