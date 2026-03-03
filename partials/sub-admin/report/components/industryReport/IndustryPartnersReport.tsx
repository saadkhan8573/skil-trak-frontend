import {
    ActionButton,
    EmptyData,
    InitialAvatar,
    LoadingAnimation,
    Table,
    TechnicalError,
    Typography,
} from '@components'
import { RtoApi } from '@queries'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { FilterReport } from '../../FilterReport'

import { ReportOptionsEnum } from '@types'
import { useRouter } from 'next/router'
import { ellipsisText } from '@utils'

type Props = {
    startDate: Date
    setStartDate: (startDate: Date) => void
    endDate: Date
    setEndDate: (endDate: Date) => void
}

export const IndustryPartnersReport = ({
    setStartDate,
    setEndDate,
    startDate,
    endDate,
}: Props) => {
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const router = useRouter()
    const { data, isLoading, isError } =
        RtoApi.Students.useWorkplaceRequestReport({
            startDate: startDate.toISOString().slice(0, 10),
            endDate: endDate.toISOString().slice(0, 10),
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        })

    const columns: ColumnDef<any>[] = [
        {
            header: () => <span>Name</span>,
            accessorKey: 'user',
            cell: (info: any) => {
                const {
                    id,
                    student: {
                        user: { name, avatar },
                    },
                } = info.row.original || {}

                return (
                    <a className="flex items-center gap-x-2">
                        <InitialAvatar name={name} imageUrl={avatar} />
                        <div className="flex flex-col">
                            <span>
                                {ellipsisText(
                                    info?.row?.original?.student?.studentId,
                                    8
                                )}
                            </span>
                            <span>{name}</span>
                        </div>
                    </a>
                )
            },
        },
        {
            accessorKey: 'email',
            header: () => <span>Email</span>,
            cell: (info) => {
                const {
                    student: {
                        user: { email },
                    },
                } = info.row.original || {}
                return <span>{email}</span>
            },
        },
        {
            accessorKey: 'phone',
            header: () => <span>Phone</span>,
            cell: (info) => {
                const {
                    student: { phone },
                } = info.row.original || {}
                return <span>{phone}</span>
            },
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
    const count = data?.pagination?.totalResult
    return (
        <>
            <div className="flex justify-between">
                <div className="">
                    <Typography variant="title" color="text-gray-400">
                        Industry Partners
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
                                `/portals/sub-admin/report/${ReportOptionsEnum.WORKPLACE_REQUEST}`
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
                        title={'No Industry Partners Found'}
                        description={'There is no Industry Partners yet'}
                        height={'50vh'}
                    />
                )
            )}
        </>
    )
}
