import {
    ActionButton,
    EmptyData,
    InitialAvatar,
    LoadingAnimation,
    NoData,
    Table,
    TechnicalError,
    Typography,
} from '@components'
import { CourseDot } from '@partials/rto/student/components'
import { RtoApi } from '@queries'
import { ColumnDef } from '@tanstack/react-table'
import React, { useState } from 'react'
import { FilterReport } from '../../FilterReport'
import { ViewFullListReport } from '../../ViewFullListReport'
import { Course, ReportOptionsEnum } from '@types'
import { ellipsisText, getUserCredentials } from '@utils'
import { UserRoles } from '@constants'

type Props = {
    rtoUser?: number
}

export const WorkplaceRequestDetail = ({ rtoUser }: Props) => {
    const { data, isLoading, isError } =
        RtoApi.Students.useWorkplaceRequestReport(
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
                    {info.row.original?.user?.name && (
                        <InitialAvatar
                            name={info.row.original?.user?.name}
                            imageUrl={info.row.original?.user?.avatar}
                        />
                    )}
                    <div className="flex flex-col">
                        <span>
                            {ellipsisText(info.row.original?.studentId, 8)}
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
                <span>{info?.row?.original?.courses[0]?.title || 'N/A'}</span>
            ),
        },
    ]
    const count = data?.pagination?.totalResult
    return (
        <>
            <div className="flex justify-between">
                <div className="">
                    <Typography variant="title" color="text-gray-400">
                        Workplace Requests
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
                !isError && <NoData text={'No Workplace Requests Found'} />
            )}
        </>
    )
}
