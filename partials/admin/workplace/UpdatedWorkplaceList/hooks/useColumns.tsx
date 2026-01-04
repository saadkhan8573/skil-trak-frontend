import { UserCreatedAt } from '@components'
import { ColumnDef } from '@tanstack/react-table'
import {
    CourseWorkplaceCell,
    IndustryDetail,
    RtoWorkplaceCell,
    StudentWorkplaceCellInfo,
    UpdatedWorkplaceRequest,
} from '../components'

export const useColumns = () => {
    const Columns: ColumnDef<any>[] = [
        {
            header: () => 'Student',
            accessorKey: 'student',
            cell: (info) => {
                console.log('info', info.row?.original)
                return (
                    <StudentWorkplaceCellInfo
                        student={info?.row?.original?.student}
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
            cell: (info) => (
                <IndustryDetail
                    createdAt={info?.row?.original?.createdAt}
                    industries={info?.row?.original?.industries}
                    workplaceApprovaleRequest={
                        info?.row?.original?.workplaceApprovaleRequest
                    }
                />
            ),
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
    ]
    return Columns
}
