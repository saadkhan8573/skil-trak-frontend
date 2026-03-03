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
import { ReportOptionsEnum } from '@types'
import { ellipsisText } from '@utils'
import { useRouter } from 'next/router'
import { useState } from 'react'
type Props = {}

export const ArchivedStudentsWithoutWorkplacesReport = (props: Props) => {
    const router = useRouter()
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)

    const { data, isLoading, isError } =
        RtoApi.Students.useArchivedStudentsReport({
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        })

    const columns: ColumnDef<any>[] = [
        {
            header: () => <span>Name</span>,
            accessorKey: 'user',
            cell: (info: any) => {
                return (
                    <a className="flex items-center gap-x-2">
                        <InitialAvatar
                            name={info?.row?.original?.user?.name}
                            imageUrl={info?.row?.original?.user?.avatar}
                        />
                        <div className="flex flex-col">
                            <span>
                                {ellipsisText(
                                    info?.row?.original?.studentId,
                                    8
                                )}
                            </span>
                            <span>{info?.row?.original?.user?.name}</span>
                        </div>
                    </a>
                )
            },
        },
        {
            accessorKey: 'email',
            header: () => <span>Email</span>,
            cell: (info) => {
                return <span>{info?.row?.original?.user?.email}</span>
            },
        },
        {
            accessorKey: 'phone',
            header: () => <span>Phone</span>,
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
            <div className="flex justify-between items-center">
                <div className="">
                    <Typography variant="title" color="text-gray-400">
                        Archived Students With No Requested Workplace
                    </Typography>
                    <Typography variant="h3">{count || 0}</Typography>
                </div>
                <ActionButton
                    onClick={() => {
                        router.push(
                            `/portals/rto/report/${ReportOptionsEnum.ARCHIVED_STUDENTS}`
                        )
                    }}
                >
                    View Full List
                </ActionButton>
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
                        title={
                            'No Archived Students With No Requested Workplace Found'
                        }
                        description={
                            'There is no any Archived Students With No Requested Workplace yet'
                        }
                        height={'50vh'}
                    />
                )
            )}
        </>
    )
}
