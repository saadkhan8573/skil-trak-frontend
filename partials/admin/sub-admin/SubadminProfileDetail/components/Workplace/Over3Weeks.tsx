import { useEffect, useState } from 'react'

// components
import {
    Card,
    EmptyData,
    LoadingAnimation,
    NoData,
    Table,
    TechnicalError,
    Typography,
    UserCreatedAt,
} from '@components'

// query
import { AdminApi } from '@queries'
import { ColumnDef } from '@tanstack/react-table'
import { ellipsisText } from '@utils'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const Over3Weeks = () => {
    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(30)

    const router = useRouter()

    const subAdminWorkplace = AdminApi.SubAdmins.useSubadminWorkplaceList(
        {
            id: Number(router?.query?.id),
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
            status: 'over',
        },
        { refetchOnMountOrArgChange: true, skip: !router?.query?.id }
    )

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 30))
    }, [router])

    const Columns: ColumnDef<any>[] = [
        {
            header: () => 'Student',
            accessorKey: 'student',
            cell: (info) => (
                <div>
                    <Typography variant="muted" color="text-gray-700">
                        {ellipsisText(
                            info?.row?.original?.student?.studentId,
                            8
                        ) ?? 'N/A'}
                    </Typography>
                    <Typography variant="small" semibold>
                        {info?.row?.original?.student?.user?.name ?? 'N/A'}
                    </Typography>
                    <Typography variant="small" color="text-gray-500">
                        {info?.row?.original?.student?.addressLine1 ?? 'N/A'}
                    </Typography>
                    <Link
                        href={`/portals/admin/student/${info?.row?.original?.student?.id}/detail`}
                        className="text-blue-500 text-xs"
                    >
                        View Details
                    </Link>
                </div>
            ),
        },

        {
            accessorKey: 'industry',
            header: () => <span>Workplace Name</span>,
            cell: (info) => {
                const appliedIndustry = info?.row?.original?.industries.find(
                    (industry: any) => industry?.applied
                )
                return (
                    <>
                        {appliedIndustry ? (
                            <>
                                <Typography variant="small" bold>
                                    {ellipsisText(
                                        appliedIndustry?.industry?.user?.name,
                                        20
                                    )}
                                </Typography>
                                <Link
                                    href={`/portals/admin/industry/${appliedIndustry?.industry?.id}`}
                                    className="text-blue-500 text-xs"
                                >
                                    View Details
                                </Link>
                            </>
                        ) : (
                            <Typography variant="small" semibold>
                                N/A
                            </Typography>
                        )}
                    </>
                )
            },
        },
        {
            accessorKey: 'currentStatus',
            header: () => <span>Current Status</span>,
            cell: ({ row }: any) => (
                <div className="px-2 py-1 rounded-md">
                    <Typography variant="small" capitalize semibold>
                        {row?.original?.currentStatus}
                    </Typography>
                </div>
            ),
        },
        {
            header: () => 'RTO',
            accessorKey: 'rto',
            cell: ({ row }: any) => (
                <>
                    <Typography variant="small" semibold>
                        {row?.original?.student?.rto?.user?.name ?? 'N/A'}
                    </Typography>
                    <Typography variant="small" color="text-gray-500">
                        {row?.original?.student?.rto?.user?.email ?? 'N/A'}
                    </Typography>
                </>
            ),
        },
        {
            header: () => 'Course',
            accessorKey: 'course',
            cell: ({ row }: any) => (
                <div className="flex items-center gap-x-2">
                    <Typography variant="small" medium>
                        {row?.original?.courses[0]?.code ?? 'N/A'}
                    </Typography>
                    -
                    <Typography variant="small" medium>
                        {ellipsisText(row?.original?.courses[0]?.title, 15) ??
                            'N/A'}
                    </Typography>
                </div>
            ),
        },

        {
            accessorKey: 'createdAt',
            header: () => <span>Created At</span>,
            cell: ({ row }: any) => (
                <UserCreatedAt createdAt={row.original?.createdAt} />
            ),
        },
    ]

    return (
        <div>
            {subAdminWorkplace.isError && <TechnicalError />}
            {subAdminWorkplace.isLoading || subAdminWorkplace.isFetching ? (
                <LoadingAnimation height="h-[60vh]" />
            ) : subAdminWorkplace?.data?.data &&
              subAdminWorkplace?.data?.data?.length &&
              !subAdminWorkplace?.isError ? (
                <Table
                    columns={Columns}
                    data={subAdminWorkplace?.data?.data}
                    enableRowSelection
                >
                    {({ table, pagination, pageSize, quickActions }: any) => {
                        return (
                            <div>
                                <div className="p-6 mb-2 flex justify-between">
                                    {pageSize(
                                        itemPerPage,
                                        setItemPerPage,
                                        subAdminWorkplace?.data?.data.length
                                    )}
                                    <div className="flex gap-x-2">
                                        {quickActions}
                                        {pagination(
                                            subAdminWorkplace?.data?.pagination,
                                            setPage
                                        )}
                                    </div>
                                </div>

                                <div className="overflow-x-auto remove-scrollbar">
                                    <div
                                        className="px-6 w-full"
                                        id={'studentScrollId'}
                                    >
                                        {table}
                                    </div>
                                </div>
                                {subAdminWorkplace?.data?.data?.length > 10 && (
                                    <div className="p-6 mb-2 flex justify-between">
                                        {pageSize(
                                            itemPerPage,
                                            setItemPerPage,
                                            subAdminWorkplace?.data?.data
                                                ?.length
                                        )}
                                        <div className="flex gap-x-2">
                                            {quickActions}
                                            {pagination(
                                                subAdminWorkplace?.data
                                                    ?.pagination,
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
                !subAdminWorkplace?.isError && (
                    <NoData text="No workplace request were found" />
                )
            )}
        </div>
    )
}
