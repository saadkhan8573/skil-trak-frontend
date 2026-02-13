import {
    Card,
    EmptyData,
    InitialAvatar,
    LoadingAnimation,
    Table,
    TableAction,
    TableActionOption,
    TechnicalError,
    Typography,
} from '@components'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import React, { useState } from 'react'
import { CoursesCell } from '@partials/rto/coordinators'
import { RtoApi } from '@queries'
import { useRouter } from 'next/router'
import { UserRoles } from '@constants'
import { Course } from '@types'
import { CourseDot } from '@partials/rto/student/components'

export const AssignedCoordinators = () => {
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)

    const router = useRouter()

    const { isLoading, data, isError } =
        RtoApi.Coordinator.useRtoAssignedCoordinators({
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        })

    const tableActionOptions = (coordinator: any) => [
        {
            text: 'View',
            onClick: (coordinator: any) => {
                router.push(`/portals/rto/coordinators/${coordinator?.id}`)
            },
            Icon: '',
        },
    ]

    const Columns: ColumnDef<any>[] = [
        {
            header: () => 'Coordinator',
            accessorKey: 'title',
            cell: ({ row }: any) => {
                const {
                    user: { name, email, avatar },
                } = row.original
                return (
                    <Link
                        href={`/portals/rto/coordinators/${row.original.id}`}
                        className="flex items-center gap-x-2 relative">

                        <InitialAvatar name={name} imageUrl={avatar} />
                        <div>
                            <Typography color={'black'}>
                                {' '}
                                {name}{' '}
                            </Typography>
                            <Typography variant={'muted'} color={'gray'}>
                                {email}
                            </Typography>
                        </div>

                    </Link>
                );
            },
        },
        {
            header: () => 'Phone',
            accessorKey: 'phone',
        },
        {
            header: () => 'Courses',
            accessorKey: 'course',
            cell: (info) => {
                return (
                    <div className="flex gap-x-1">
                        {info.row.original?.courses.map((c: Course) => (
                            <CourseDot key={c?.id} course={c} />
                        ))}
                    </div>
                )
            },
        },
        {
            header: () => 'Address',
            accessorKey: 'addressLine1',
        },
        {
            header: () => 'Created By',
            accessorKey: 'createdBy.role',
            cell: (info) => (
                <Typography variant="small" semibold uppercase>
                    {info.row.original?.createdBy?.role}
                </Typography>
            ),
        },

        {
            header: () => 'Action',
            accessorKey: 'Action',
            cell: ({ row }: any) => {
                const tableActionOption =
                    tableActionOptions(row?.original)
                return (
                    <TableAction
                        rowItem={row?.original}
                        options={tableActionOption?.filter(
                            (action) => action?.text
                        )}
                    />
                )
            },
        },
    ]
    return (
        <div>
            <Card noPadding>
                {isError && <TechnicalError />}
                {isLoading ? (
                    <LoadingAnimation height="h-[60vh]" />
                ) : data?.data && data?.data?.length ? (
                    <Table
                        columns={Columns}
                        data={data?.data}
                        // quickActions={quickActionsElements}
                        enableRowSelection
                    >
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
                                    <div className="px-6">{table}</div>
                                </div>
                            )
                        }}
                    </Table>
                ) : (
                    !isError && (
                        <EmptyData
                            title={'No Coordinator!'}
                            description={'You have not any Coordinator yet'}
                            height={'50vh'}
                        />
                    )
                )}
            </Card>
        </div>
    )
}
