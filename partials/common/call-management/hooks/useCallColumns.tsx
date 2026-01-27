import { ColumnDef } from '@tanstack/react-table'
import { PlacementCall } from '@types'
import { Calendar, CheckCircle, Clock, Eye, TicketPlus, Headphones } from 'lucide-react'
import { StatusBadge } from '../components/StatusBadge'
import { formatDate, formatTime } from '../utils'
import React, { useState } from 'react'
import moment from 'moment'
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui/tooltip'

export const useCallColumns = () => {
    const [selectedCall, setSelectedCall] = useState<PlacementCall | null>(null)
    const [ticketModalCall, setTicketModalCall] = useState<PlacementCall | null>(null)
    const [audioModalCall, setAudioModalCall] = useState<PlacementCall | null>(null)
    const [completeModalCall, setCompleteModalCall] = useState<PlacementCall | null>(null)

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
        action: 'completed' | 'ticket' | 'audio',
        call: PlacementCall
    ) => {
        e.stopPropagation()

        if (action === 'completed') {
            handleMarkCompleted(call)
        } else if (action === 'ticket') {
            handleCreateTicket(String(call.id), call)
        } else if (action === 'audio') {
            handleListenAudio(call)
        }
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
                            className={`w-1 h-8 rounded-full flex-shrink-0 ${call.priority === 'high' && !isCompleted
                                ? 'bg-red-500'
                                : call.priority === 'medium' && !isCompleted
                                    ? 'bg-yellow-500'
                                    : 'bg-gray-200'
                                }`}
                        />
                        <div className="relative flex-shrink-0">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#044866] to-[#0D5468] flex items-center justify-center shadow-sm">
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
            header: 'Date',
            accessorKey: 'createdAt',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-700">
                        {moment(row.original.createdAt).format('MMM D, YYYY')}
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
                const isCompleted = call?.status === 'completed'
                const hasTicket = call?.hasTicket
                return (
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => setSelectedCall(call)}
                                    className="cursor-pointer p-1.5 hover:bg-[#044866] hover:text-white text-[#044866] rounded-lg transition-all"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>View Details</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={(e) => handleActionClick(e, 'audio', call)}
                                    className="p-1.5 rounded-lg transition-all bg-blue-100 text-blue-600 hover:bg-blue-200"
                                >
                                    <Headphones className="w-4 h-4" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Listen to Recording</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={(e) => handleActionClick(e, 'completed', call)}
                                    className={`p-1.5 rounded-lg transition-all ${isCompleted
                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                        }`}
                                >
                                    {isCompleted ? (
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    ) : (
                                        <Clock className="w-4 h-4" />
                                    )}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{isCompleted ? 'Completed' : 'Mark as Completed'}</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={(e) => handleActionClick(e, 'ticket', call)}
                                    className={`p-1.5 rounded-lg transition-all ${hasTicket
                                        ? 'bg-purple-500 text-white hover:bg-purple-600'
                                        : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                                        }`}
                                >
                                    <TicketPlus className="w-4 h-4" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{hasTicket ? 'Ticket Created' : 'Create Ticket'}</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
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
        handleCreateTicket,
        handleActionClick
    }
}
