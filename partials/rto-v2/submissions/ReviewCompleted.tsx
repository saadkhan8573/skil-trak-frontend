import {
    Card,
    EmptyData,
    InitialAvatar,
    LoadingAnimation,
    ShowErrorNotifications,
    Table,
    TechnicalError,
    Typography,
    UserCreatedAt
} from '@components'
import { Result } from '@constants'
import { RtoApi } from '@queries'
import { ColumnDef } from '@tanstack/react-table'
import { ellipsisText } from '@utils'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'

export const ReviewCompleted = () => {
    const router = useRouter()

    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const [modal, setModal] = useState<ReactElement | null>(null)

    const { isLoading, isError, data } = RtoApi.Submissions.getRtoSubmissions(
        {
            search: `result:${Result.Competent}`,
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        },
        {
            refetchOnMountOrArgChange: true,
        }
    )

    const [changeStatus, changeStatusResult] =
        RtoApi.Submissions.changeSubmissionStatus()

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 50))
    }, [router])

    const columns: ColumnDef<any>[] = [
        // {
        //     header: () => 'Job Id',
        //     accessorKey: 'studentMaskedId',
        //     cell: ({ row }) => (
        //         <StudentJobId
        //             studentJobId={
        //                 row.original?.student?.studentMaskedId || '---'
        //             }
        //         />
        //     ),
        // },
        {
            header: () => 'Name',
            accessorKey: 'user',
            cell: ({ row }: any) => (
                <div className="flex items-center gap-x-2">
                    {row?.original?.student?.user?.name && (
                        <div>
                            <InitialAvatar
                                name={row?.original?.student?.user?.name}
                                imageUrl={row?.original?.student?.user?.avatar}
                            />
                        </div>
                    )}

                    <div>
                        <Typography variant="small" color="text-gray-700">
                            ID:
                            {ellipsisText(row?.original?.student?.studentId, 8)}
                        </Typography>
                        <Typography semibold>
                            {row?.original?.student?.user?.name}
                        </Typography>
                    </div>
                </div>
            ),
        },
        {
            header: () => 'Course',
            accessorKey: 'course',
            cell: ({ row }: any) => {
                const course = row.original?.course
                return (
                    <div className="flex flex-col justify-center">
                        <Typography variant={'small'} color={'text-gray-500'}>
                            {course?.sector?.name}
                        </Typography>
                        <Typography variant={'label'}>
                            {course?.title}
                        </Typography>
                    </div>
                )
            },
        },
        {
            header: () => 'Submitted',
            accessorKey: 'submitted',
            cell: ({ row }: any) => (
                <UserCreatedAt createdAt={row.original?.createdAt} />
            ),
        },
        {
            header: () => 'Result',
            accessorKey: 'result',
            cell: ({ row }: any) => (
                <Typography variant={'label'} capitalize>
                    {row.original?.result}
                </Typography>
            ),
        },
    ]

    return (
        <>
            {modal}
            <Card noPadding>
                <ShowErrorNotifications result={changeStatusResult} />
                {isError && <TechnicalError />}
                {isLoading ? (
                    <LoadingAnimation height="h-[60vh]" />
                ) : data && data?.data.length ? (
                    <Table
                        columns={columns}
                        data={data.data}
                        // quickActions={quickActionsElements}
                        enableRowSelection
                    >
                        {({
                            table,
                            pagination,
                            pageSize,
                            quickActions,
                        }: any) => (
                            <div>
                                <div className="p-6 mb-2 flex justify-between">
                                    {pageSize(
                                        itemPerPage,
                                        setItemPerPage,
                                        data?.data?.length
                                    )}
                                    <div className="flex gap-x-2">
                                        {quickActions}
                                        {pagination(data?.pagination, setPage)}
                                    </div>
                                </div>
                                <div
                                    id="assessment-submission"
                                    className="px-6"
                                >
                                    {table}
                                </div>
                            </div>
                        )}
                    </Table>
                ) : (
                    !isError && (
                        <EmptyData
                            title={'No Pending Assessment Evidence!'}
                            description={
                                'There is no Pending Assessment were found'
                            }
                            height={'50vh'}
                        />
                    )
                )}
            </Card>
        </>
    )
}
