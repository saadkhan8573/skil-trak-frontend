import {
    Card,
    EmptyData,
    LoadingAnimation,
    StudentJobId,
    Table,
    TechnicalError,
    Typography,
    UserCreatedAt,
} from '@components'

// query
import { SubAdminApi, useGetAddedByStudentsWorkplacesQuery } from '@queries'
import { ColumnDef } from '@tanstack/react-table'
import { ellipsisText } from '@utils'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
    IndustryDetail,
    RtoCellInfo,
    StudentWPCellInfo,
    UpdatedWorkplaceRequest,
} from './components'
import { IWorkplaceIndustries } from '@redux/queryTypes'

export const UpdatedBlockedStudentWorkplaces = () => {
    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(30)

    const router = useRouter()

    const subAdminWorkplace = SubAdminApi.Workplace.blockedStudentsWpList(
        {
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        },
        { refetchOnMountOrArgChange: true }
    )
    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 30))
    }, [router])

    const Columns: ColumnDef<IWorkplaceIndustries>[] = [
        {
            header: () => 'Job Id',
            accessorKey: 'studentMaskedId',
            cell: ({ row }) => (
                <StudentJobId
                    studentJobId={row.original?.student?.studentMaskedId}
                />
            ),
        },
        {
            header: () => 'Student',
            accessorKey: 'student',
            cell: (info) => (
                <StudentWPCellInfo
                    wpId={info.row.original?.id!}
                    student={info.row.original?.student!}
                />
            ),
        },
        {
            header: () => 'Industry Status',
            accessorKey: 'status',
            cell: ({ row }: any) => (
                <UpdatedWorkplaceRequest workplace={row?.original} />
            ),
        },
        {
            accessorKey: 'industry',
            header: () => <span>Workplace Name</span>,
            cell: (info) => {
                return (
                    <IndustryDetail
                        workplace={info?.row?.original}
                        createdAt={info?.row?.original?.createdAt + ''}
                    />
                )
            },
        },
        {
            header: () => 'RTO',
            accessorKey: 'rto',
            cell: ({ row }: any) => (
                <RtoCellInfo rto={row?.original?.student?.rto} />
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
            header: () => 'Coordinator',
            accessorKey: 'coordinator',
            cell: ({ row }: any) => (
                <UpdatedWorkplaceRequest
                    workplace={row?.original}
                    assignToMe={true}
                />
            ),
        },

        {
            accessorKey: 'createdAt',
            header: () => <span>Created At</span>,
            cell: ({ row }: any) => (
                <UserCreatedAt createdAt={row.original?.createdAt} />
            ),
        },
        {
            accessorKey: 'cancel',
            header: () => <span>Action</span>,
            cell: ({ row }: any) => (
                <UpdatedWorkplaceRequest
                    workplace={row?.original}
                    cancelRequest={true}
                />
            ),
        },
        // {
        //     header: () => 'Action',
        //     accessorKey: 'Action',
        //     cell: ({ row }) => {
        //         const tableActionOption = tableActionOptions(row.original)
        //         return (
        //             <TableAction
        //                 options={tableActionOption}
        //                 rowItem={row.original}
        //             />
        //         )
        //     },
        // },
    ]

    return (
        <div>
            <Card noPadding>
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
                                            subAdminWorkplace?.data?.data.length
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

                                    <div className="overflow-x-auto remove-scrollbar">
                                        <div
                                            className="px-6 w-full"
                                            id={'studentScrollId'}
                                        >
                                            {table}
                                        </div>
                                    </div>
                                    {subAdminWorkplace?.data?.data?.length >
                                        10 && (
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
                        <EmptyData
                            title={'No Workplace request yet'}
                            description={'No workplace request were found'}
                            height={'50vh'}
                        />
                    )
                )}
            </Card>
        </div>
    )
}
