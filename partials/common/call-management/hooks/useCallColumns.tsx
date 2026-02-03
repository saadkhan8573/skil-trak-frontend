import { ColumnDef } from '@tanstack/react-table'
import { PlacementCall } from '@types'
import { CheckCircle, Clock, Eye, Headphones, TicketPlus, Trash2 } from 'lucide-react'
import moment from 'moment'
import React, { useState } from 'react'
import { StatusBadge } from '../components/StatusBadge'

import { TableAction } from '@components'

export const useCallColumns = () => {
    const [selectedCall, setSelectedCall] = useState<PlacementCall | null>(null)
    const [ticketModalCall, setTicketModalCall] = useState<PlacementCall | null>(null)
    const [audioModalCall, setAudioModalCall] = useState<PlacementCall | null>(null)
    const [completeModalCall, setCompleteModalCall] = useState<PlacementCall | null>(null)
    const [deleteModalCall, setDeleteModalCall] = useState<PlacementCall | null>(null)

    const handleMarkCompleted = (call: PlacementCall) => {
        setCompleteModalCall(call)
    }

    const handleCreateTicket = (callId: string, call: PlacementCall) => {
        setTicketModalCall(call)
    }

    const handleListenAudio = (call: PlacementCall) => {
        setAudioModalCall(call)
    }

    const handleActionClick = (
        e: React.MouseEvent,
        action: 'completed' | 'ticket' | 'audio' | 'delete',
        call: PlacementCall
    ) => {
        e.stopPropagation()

        if (action === 'completed') {
            handleMarkCompleted(call)
        } else if (action === 'ticket') {
            handleCreateTicket(String(call.id), call)
        } else if (action === 'audio') {
            handleListenAudio(call)
        } else if (action === 'delete') {
            setDeleteModalCall(call)
        }
    }

    const getTableActions = (call: PlacementCall) => {
        const isCompleted = call?.status === 'completed'
        const isScheduled = call?.status === 'scheduled'
        const hasTicket = call?.hasTicket

        return [
            {
                text: 'View Details',
                Icon: Eye,
                onClick: () => setSelectedCall(call)
            },
            {
                text: 'Recording',
                Icon: Headphones,
                onClick: () => handleListenAudio(call),
                hidden: isScheduled
            },
            {
                text: isCompleted ? 'Completed' : 'Mark Completed',
                Icon: isCompleted ? CheckCircle : Clock,
                onClick: () => handleMarkCompleted(call),
                hidden: isScheduled,
                color: isCompleted ? 'text-green-600' : ''
            },
            {
                text: hasTicket ? 'Ticket Created' : 'Create Ticket',
                Icon: TicketPlus,
                onClick: () => handleCreateTicket(String(call.id), call),
                hidden: isScheduled,
                color: hasTicket ? 'text-purple-600' : ''
            },
            {
                text: 'Delete',
                Icon: Trash2,
                onClick: () => setDeleteModalCall(call),
                color: 'text-red-500'
            }
        ]
    }

    const columns: ColumnDef<PlacementCall>[] = [
        {
            header: 'Student',
            accessorKey: 'student.user.name',
            cell: ({ row }) => {
                const call = row.original
                const isCompleted = call?.status === 'completed'
                return (
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-1 h-8 rounded-full shrink-0 ${call.priority === 'high' && !isCompleted
                                ? 'bg-red-500'
                                : call.priority === 'medium' && !isCompleted
                                    ? 'bg-yellow-500'
                                    : 'bg-gray-200'
                                }`}
                        />
                        <div className="relative shrink-0">
                            <div className="w-9 h-9 rounded-lg bg-linear-to-br from-[#044866] to-[#0D5468] flex items-center justify-center shadow-sm">
                                <span className="text-white font-medium text-xs">
                                    {call?.student?.user?.name
                                        ?.split(' ')
                                        ?.map((n: any) => n[0])
                                        ?.join('')}
                                </span>
                            </div>
                            {isCompleted && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center border border-white">
                                    <CheckCircle className="w-2.5 h-2.5 text-white" />
                                </div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className={`text-sm font-medium text-gray-900 truncate ${isCompleted ? 'opacity-60' : ''}`}>
                                {call?.student?.user?.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {call?.student?.phone}
                            </p>
                        </div>
                    </div>
                )
            }
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: ({ row }) => <StatusBadge status={row.original.status} size="sm" />,
            size: 150
        },
        {
            header: 'Answered',
            accessorKey: 'isAnswered',
            cell: ({ row }) => {
                const isAnswered = row.original.isAnswered
                if (isAnswered === null) return <span className="text-gray-400">-</span>
                return (
                    <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${isAnswered
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-red-100 text-red-700 border border-red-200'
                            }`}
                    >
                        {isAnswered ? 'Yes' : 'No'}
                    </span>
                )
            }
        },
        {
            header: 'Course',
            accessorKey: 'course.title',
            cell: ({ row }) => <span className="text-sm text-gray-700">{row.original.course?.title}</span>
        },
        {
            header: 'Date',
            accessorKey: 'createdAt',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-700">
                        {moment(row.original.scheduledAt || row.original.createdAt).format('MMM D, YYYY')}
                    </p>
                </div>
            )
        },
        {
            header: 'Duration',
            accessorKey: 'callDuration',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">
                        {moment
                            .utc(row.original.callDuration * 1000)
                            .format('mm:ss')}
                    </span>
                </div>
            )
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => {
                const call = row.original

                return (
                    <TableAction
                        rowItem={call}
                        options={getTableActions(call)}
                    />
                )
            }
        }
    ]

    return {
        columns,
        selectedCall,
        setSelectedCall,
        ticketModalCall,
        setTicketModalCall,
        audioModalCall,
        setAudioModalCall,
        completeModalCall,
        setCompleteModalCall,
        deleteModalCall,
        setDeleteModalCall,
        handleCreateTicket,
        handleActionClick
    }
}
