import { StudentJobId, UserCreatedAt } from '@components'
import { ColumnDef } from '@tanstack/react-table'
import {
    CourseWorkplaceCell,
    IndustryDetail,
    RtoWorkplaceCell,
    StudentTicketsCell,
    StudentWorkplaceCellInfo,
    UpdatedWorkplaceRequest,
    AdminCancelCell,
} from '../components'
import { IWorkplaceIndustries } from '@redux/queryTypes'

export const useColumns = () => {
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
            cell: (info) => {
                return (
                    <StudentWorkplaceCellInfo
                        student={info?.row?.original?.student!}
                        wpId={info?.row?.original?.id}
                    />
                )
            },
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
            cell: (info) => <IndustryDetail workplace={info?.row?.original} />,
        },
        {
            header: () => 'RTO',
            accessorKey: 'rto',
            cell: ({ row }: any) => (
                <RtoWorkplaceCell rto={row.original?.student?.rto} />
            ),
        },
        {
            header: () => 'Course',
            accessorKey: 'course',
            cell: ({ row }: any) => (
                <CourseWorkplaceCell course={row?.original?.courses?.[0]} />
            ),
        },
        {
            header: () => 'Tickets',
            accessorKey: 'tickets',
            cell: (info) => {
                return (
                    <StudentTicketsCell
                        wpId={info?.row?.original?.id!}
                        ticketsCount={
                            info?.row?.original?.student?.tickets?.length || 0
                        }
                    />
                )
            },
        },
        {
            accessorKey: 'createdAt',
            header: () => <span>WP Created At</span>,
            cell: ({ row }: any) => (
                <UserCreatedAt createdAt={row.original?.createdAt} />
            ),
        },
        {
            accessorKey: 'createdAt',
            header: () => <span>Student Created At</span>,
            cell: ({ row }: any) => (
                <UserCreatedAt createdAt={row.original?.student?.createdAt} />
            ),
        },
        {
            header: () => 'Admin Cancel',
            accessorKey: 'cancel',
            cell: (info) => {
                return <AdminCancelCell wpId={info?.row?.original?.id!} />
            },
        },
    ]
    return Columns
}
