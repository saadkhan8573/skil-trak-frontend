import { ColumnDef } from '@tanstack/react-table'
import { PlacementCall } from '@types'
import {
    Bot,
    CheckCircle,
    Clock,
    Eye,
    Flag,
    Headphones,
    TicketPlus,
    Trash2,
    AlertCircle,
} from 'lucide-react'
import moment from 'moment'
import React, { useState } from 'react'
import { StatusBadge } from '../components/StatusBadge'
import { cn } from '@utils'

import { TableAction, UserCreatedAt, Badge } from '@components'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui'
import Link from 'next/link'

export const useCallColumns = () => {
    const [selectedCall, setSelectedCall] = useState<PlacementCall | null>(null)
    const [ticketModalCall, setTicketModalCall] =
        useState<PlacementCall | null>(null)
    const [audioModalCall, setAudioModalCall] = useState<PlacementCall | null>(
        null
    )
    const [completeModalCall, setCompleteModalCall] =
        useState<PlacementCall | null>(null)
    const [deleteModalCall, setDeleteModalCall] =
        useState<PlacementCall | null>(null)

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
                onClick: () => setSelectedCall(call),
            },
            {
                text: 'Recording',
                Icon: Headphones,
                onClick: () => handleListenAudio(call),
                hidden: isScheduled,
            },
            {
                text: isCompleted ? 'Completed' : 'Mark Completed',
                Icon: isCompleted ? CheckCircle : Clock,
                onClick: () => handleMarkCompleted(call),
                hidden: isScheduled,
                color: isCompleted ? 'text-green-600' : '',
            },
            {
                text: hasTicket ? 'Ticket Created' : 'Create Ticket',
                Icon: TicketPlus,
                onClick: () => handleCreateTicket(String(call.id), call),
                hidden: isScheduled,
                color: hasTicket ? 'text-purple-600' : '',
            },
            {
                text: 'Delete',
                Icon: Trash2,
                onClick: () => setDeleteModalCall(call),
                color: 'text-red-500',
            },
        ]
    }

    const getActionColor = (action: string) => {
        switch (action) {
            case 'Collect Workplace Information':
                return 'bg-green-50 border-green-200 text-green-700'
            case 'Request Missing Documents':
                return 'bg-green-50 border-green-300 text-green-600'
            case 'Create Workplace Request':
                return 'bg-blue-50 border-blue-200 text-blue-700'
            case 'Provide App Guidance':
                return 'bg-blue-50 border-blue-300 text-blue-600'
            case 'Schedule Follow-up Call':
                return 'bg-purple-50 border-purple-200 text-purple-700'
            case 'Leave Voicemail':
                return 'bg-orange-50 border-orange-200 text-orange-700'
            case 'Update Contact Information':
                return 'bg-slate-50 border-slate-200 text-slate-600'
            default:
                return 'bg-gray-50 border-gray-200 text-gray-600'
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
                    <Link
                        href={`/portals/admin/student/${call?.student?.id}/detail`}
                        className="flex items-center gap-3"
                    >
                        <div
                            className={`w-1 h-8 rounded-full shrink-0 ${
                                call.priority === 'high' && !isCompleted
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
                            <p
                                className={`text-sm font-medium text-gray-900 truncate ${isCompleted ? 'opacity-60' : ''}`}
                            >
                                {call?.student?.user?.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {call?.student?.phone}
                            </p>
                        </div>
                    </Link>
                )
            },
        },

        // {
        //     header: 'Call Reason',
        //     accessorKey: 'callReason',
        //     cell: ({ row }) => (
        //         <span className="px-2.5 py-1 rounded bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium whitespace-nowrap">
        //             {row.original.callReason || '-'}
        //         </span>
        //     ),
        //     size: 180
        // },
        // {
        //     header: 'Action',
        //     accessorKey: 'agentAction',
        //     cell: ({ row }) => (
        //         <span className="px-2.5 py-1 rounded bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium whitespace-nowrap">
        //             {row.original.agentAction || '-'}
        //         </span>
        //     ),
        //     size: 180
        // },
        // {
        //     header: 'Agent',
        //     accessorKey: 'agentType',
        //     cell: ({ row }) => (
        //         <div className="flex items-center gap-2">
        //             <div className={`w-6 h-6 rounded flex items-center justify-center ${row.original.agentType === 'AI (Maria)' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
        //                 }`}>
        //                 <Bot className="w-3.5 h-3.5" />
        //             </div>
        //             <span className="text-xs font-medium text-gray-700">{row.original.agentType || '-'}</span>
        //         </div>
        //     ),
        //     size: 120
        // },
        {
            header: 'Agent',
            accessorKey: 'agent.name',
            cell: ({ row }) => {
                const agent = row.original.agent
                if (!agent) return <span className="text-gray-400">-</span>
                return (
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded flex items-center justify-center bg-purple-100 text-purple-600">
                            <Bot className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-medium text-gray-700">
                            {agent.name}
                        </span>
                    </div>
                )
            },
            size: 140,
        },
        {
            header: 'Call Reason',
            accessorKey: 'callReason',
            cell: ({ row }) => (
                <span className="px-2.5 py-1 rounded bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium whitespace-nowrap">
                    {row.original.callOutcome || '-'}
                </span>
            ),
            size: 140,
        },
        {
            header: 'Action',
            accessorKey: 'responsibility',
            cell: ({ row }) => {
                const action = row.original?.agent?.responsibility || ''
                return (
                    <span
                        className={cn(
                            'px-2.5 py-1 rounded border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap',
                            getActionColor(action)
                        )}
                    >
                        {action || '-'}
                    </span>
                )
            },
            size: 140,
        },
        {
            header: 'Call Type',
            accessorKey: 'callType',
            cell: ({ row }) => {
                const callType = row.original.callType
                return (
                    <Badge
                        variant={callType === 'inbound' ? 'info' : 'success'}
                        text={callType}
                        size="xs"
                        shape="pill"
                    />
                )
            },
            size: 100,
        },
        {
            header: 'Answered',
            accessorKey: 'isAnswered',
            cell: ({ row }) => {
                const isAnswered = row.original.isAnswered
                const errorMessage = row.original.errorMessage

                if (errorMessage) {
                    const isLarge = errorMessage.length > 20
                    return (
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 max-w-[150px]">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span className="text-[10px] font-semibold leading-tight truncate">
                                    {errorMessage}
                                </span>
                            </div>
                            {isLarge && (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="text-[10px] text-[#044866] hover:text-[#0D5468] font-medium underline cursor-pointer text-left w-fit transition-colors">
                                            View All
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80">
                                        <div className="space-y-2">
                                            <h4 className="font-medium leading-none text-red-600 flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4" />
                                                Call Error
                                            </h4>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                {errorMessage}
                                            </p>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            )}
                        </div>
                    )
                }

                if (isAnswered === null)
                    return <span className="text-gray-400">-</span>

                return (
                    <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isAnswered
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : 'bg-red-100 text-red-700 border border-red-200'
                        }`}
                    >
                        {isAnswered ? 'Yes' : 'No'}
                    </span>
                )
            },
        },
        {
            header: 'Course',
            accessorKey: 'course.title',
            cell: ({ row }) => (
                <span className="text-sm text-gray-700">
                    {row.original.course?.title}
                </span>
            ),
        },

        {
            header: 'Date',
            accessorKey: 'createdAt',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <UserCreatedAt createdAt={row.original?.createdAt} />
                </div>
            ),
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
            ),
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
            },
        },
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
        handleActionClick,
    }
}
