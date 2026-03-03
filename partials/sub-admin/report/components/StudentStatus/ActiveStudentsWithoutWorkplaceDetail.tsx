import {
    EmptyData,
    InitialAvatar,
    LoadingAnimation,
    Table,
    TechnicalError,
    Typography,
} from '@components'
import { SubAdminApi } from '@queries'
import { ColumnDef } from '@tanstack/react-table'
import { ellipsisText } from '@utils'

type Props = {}

export const ActiveStudentsWithoutWorkplaceDetail = (props: Props) => {
    const { data, isLoading, isError } =
        SubAdminApi.Reports.useStudentWithNoWorkplaceReport({})
    const columns: ColumnDef<any>[] = [
        {
            header: () => <span>Name</span>,
            accessorKey: 'user',
            cell: (info: any) => {
                return (
                    <a className="flex items-center gap-x-2">
                        <InitialAvatar
                            name={info?.row?.original?.user?.name || 'N/A'}
                            imageUrl={info?.row?.original?.user?.avatar || ''}
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
                //   <CourseDot key={c?.id} course={c} />
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
                        Students Without Workplace
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
                        title={'No Without Workplace Students Found'}
                        description={
                            'There is no Without Workplace Students yet'
                        }
                        height={'50vh'}
                    />
                )
            )}
        </>
    )
}
