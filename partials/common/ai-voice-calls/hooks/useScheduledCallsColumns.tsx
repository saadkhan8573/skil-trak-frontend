import { ColumnDef } from '@tanstack/react-table'
import { Calendar, Phone, Clock, FileText, CheckCircle2, AlertCircle } from 'lucide-react'
import React from 'react'
import { PlacementCall } from 'types/placement-call.type'
import { InitialAvatar, Badge } from '@components'
import moment from 'moment'
import { cn } from '@utils'

export const useScheduledCallsColumns = () => {
    const columns: ColumnDef<PlacementCall>[] = [
        {
            header: 'Student',
            accessorKey: 'student.user.name',
            cell: ({ row }) => {
                const student = row.original.student
                return (
                    <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                            {student?.user?.name && <InitialAvatar name={student?.user?.name} imageUrl={student?.user?.avatar} />}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {student?.user?.name} {student?.familyName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {student?.phone}
                            </p>
                        </div>
                    </div>
                )
            }
        },
        {
            header: 'Scheduled Date',
            accessorKey: 'updatedAt', // Assuming scheduled time is stored or updatedAt is used for now if no specific field
            cell: ({ row }) => {
                const date = row.original.updatedAt
                return (
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">
                            {date ? moment(date).format('MMM DD, YYYY') : 'N/A'}
                        </span>
                    </div>
                )
            }
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: ({ row }) => {
                const status = row.original.status
                return (
                    <div className="flex items-center gap-2">
                        {status === 'completed' ? (
                            <Badge variant="success" className="flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Completed
                            </Badge>
                        ) : (
                            <Badge variant="warning" className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Pending
                            </Badge>
                        )}
                    </div>
                )
            }
        },
        {
            header: 'Summary',
            accessorKey: 'summary',
            cell: ({ row }) => (
                <div className="max-w-[300px]">
                    <p className="text-xs text-gray-600 line-clamp-2" title={row.original.summary || 'No summary available'}>
                        {row.original.summary || <span className="italic text-gray-400">No summary available</span>}
                    </p>
                </div>
            )
        }
    ]

    return {
        columns
    }
}
