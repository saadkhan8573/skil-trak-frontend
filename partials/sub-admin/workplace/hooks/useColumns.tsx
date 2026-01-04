import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import {
    AddToTodo,
    IndustryDetail,
    RtoCellInfo,
    StudentWPCellInfo,
    UpdatedWorkplaceRequest,
} from '../updatedworkplaces'
import { Typography, UserCreatedAt } from '@components'
import Link from 'next/link'
import { ellipsisText } from '@utils'

export const useColumns = () => {
    const Columns: ColumnDef<any>[] = [
        {
            header: () => 'Student',
            accessorKey: 'student',
            cell: (info) => (
                <StudentWPCellInfo
                    wpId={info.row.original?.id}
                    student={info.row.original?.student}
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
                const appliedIndustry = info?.row?.original?.industries.find(
                    (industry: any) => industry?.applied
                )
                return (
                    <IndustryDetail
                        createdAt={info?.row?.original?.createdAt}
                        industries={info?.row?.original?.industries}
                        workplaceApprovaleRequest={
                            info?.row?.original?.workplaceApprovaleRequest
                        }
                    />
                )
                return (
                    <>
                        {appliedIndustry ? (
                            <>
                                {appliedIndustry?.isAutomated && (
                                    <div className="bg-success rounded px-1 py-0.5 w-fit mb-0.5">
                                        <Typography
                                            variant="xs"
                                            color="text-white"
                                        >
                                            Auto
                                        </Typography>
                                    </div>
                                )}
                                <Typography variant="small" bold>
                                    {ellipsisText(
                                        appliedIndustry?.industry?.user?.name,
                                        20
                                    )}
                                </Typography>
                                <Link
                                    href={`/portals/sub-admin/users/industries/${appliedIndustry?.industry?.id}?tab=students`}
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
