import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import {
    AddToTodo,
    IndustryDetail,
    RtoCellInfo,
    StudentWPCellInfo,
    UpdatedWorkplaceRequest,
} from '../updatedworkplaces'
import { StudentJobId, Typography, UserCreatedAt } from '@components'
import { ellipsisText } from '@utils'
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
                        createdAt={info?.row?.original?.createdAt + ''}
                        workplace={info?.row?.original}
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
                <div className="flex items-center gap-x-2">
                    <AddToTodo
                        workplaceId={row?.original?.id}
                        coordinatorUserId={row?.original?.assignedTo?.user?.id}
                    />
                    <UpdatedWorkplaceRequest
                        workplace={row?.original}
                        cancelRequest={true}
                    />
                </div>
            ),
        },
    ]
    return { Columns }
}
