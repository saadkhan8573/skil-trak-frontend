import {
    InitialAvatar,
    LoadingAnimation,
    NoData,
    Table,
    TechnicalError,
    Typography,
} from '@components'
import { UserRoles } from '@constants'
import { RtoApi } from '@queries'
import { ColumnDef } from '@tanstack/react-table'
import { ellipsisText, getUserCredentials } from '@utils'

type Props = {
    rtoUser?: number
}

export const CompletedWorkplaceDetail = ({ rtoUser }: Props) => {
    const { data, isLoading, isError } =
        RtoApi.Students.useCompletedWorkplaceReport(
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
            cell: (info) => (
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
    const count = data?.length
    return (
        <>
            <div className="flex justify-between">
                <div className="">
                    <Typography variant="title" color="text-gray-400">
                        Completed Students
                    </Typography>
                    <Typography variant="h3">{count || 0}</Typography>
                </div>
            </div>
            {isError && <TechnicalError />}
            {isLoading ? (
                <LoadingAnimation height="h-[60vh]" />
            ) : data && data?.length ? (
                <Table columns={columns} data={data}>
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
                    <NoData text="No Completed Workplace Requests Found" />
                )
            )}
        </>
    )
}
