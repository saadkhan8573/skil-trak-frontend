import {
    Calendar,
    CheckCircle,
    Circle,
    Clock,
    Eye,
    TicketPlus,
} from 'lucide-react'
import React from 'react'
import { StatusBadge } from '../StatusBadge'
import { formatDate, formatTime } from '../../utils'

export const CallCard = ({
    call,
    onCallSelect,
    onMarkCompleted,
    onCreateTicket,
    index,
    isCompleted,
    hasTicket,
}: any) => {
    const handleActionClick = (
        e: React.MouseEvent,
        callId: string,
        action: 'completed' | 'ticket'
    ) => {
        e.stopPropagation()

        if (action === 'completed' && onMarkCompleted) {
            onMarkCompleted(callId)
        } else if (action === 'ticket' && onCreateTicket) {
            onCreateTicket(callId)
        }
    }
    return (
        <div
            key={call?.id}
            className={`flex items-center gap-5 px-6 py-4 transition-all group cursor-pointer ${index !== 0 ? 'border-t border-gray-100' : ''
                } ${isCompleted
                    ? 'bg-green-50/50 hover:bg-green-50'
                    : 'hover:bg-blue-50/50'
                }`}
            onClick={() => onCallSelect(call)}
        >
            {/* Priority Indicator */}
            <div
                className={`w-1 h-12 rounded-full flex-shrink-0 ${call.priority === 'high' && !isCompleted
                        ? 'bg-red-500'
                        : call.priority === 'medium' && !isCompleted
                            ? 'bg-yellow-500'
                            : 'bg-gray-200'
                    }`}
            />

            {/* Student Info */}
            <div className="flex items-center gap-3 flex-shrink-0 w-64">
                <div className="relative">
                    <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#044866] to-[#0D5468] flex items-center justify-center shadow-sm">
                        <span className="text-white font-medium text-sm">
                            {call?.student?.user?.name
                                .split(' ')
                                .map((n: any) => n[0])
                                .join('')}
                        </span>
                    </div>
                    {isCompleted && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <p
                        className={`text-gray-900 font-medium truncate ${isCompleted ? 'opacity-60' : ''
                            }`}
                    >
                        {call?.student?.user?.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                        {call.phoneNumber}
                    </p>
                </div>
            </div>

            {/* Status Badge */}
            <div className="flex-shrink-0 min-w-[200px]">
                <StatusBadge status={call?.status} size="sm" />
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 flex-shrink-0 w-32">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-sm text-gray-900 font-medium">
                    {formatDate(call.createdAt)}
                    {/* {call?.createdAt} */}
                </p>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2 flex-shrink-0 w-28">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-sm text-gray-900 font-medium">
                    {formatTime(call?.createdAt)}
                </p>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2 flex-shrink-0 w-24">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-sm text-gray-900 font-medium">
                    {call.duration}
                </span>
            </div>

            {/* Actions */}
            <div
                className="flex items-center gap-2 ml-auto flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={() => onCallSelect(call)}
                    className="p-2 hover:bg-[#044866] hover:text-white text-[#044866] rounded-lg transition-all"
                    title="View Details"
                >
                    <Eye className="w-5 h-5" />
                </button>

                <button
                    onClick={(e) => handleActionClick(e, call.id, 'completed')}
                    className={`p-2 rounded-lg transition-all ${isCompleted
                            ? 'bg-green-500 hover:bg-green-600 '
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                    title={
                        isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'
                    }
                >
                    {isCompleted ? (
                        <CheckCircle
                            className={`w-5 h-5 ${isCompleted ? 'text-white cursor-pointer' : ''
                                }`}
                        />
                    ) : (
                        <Circle className="size-5 cursor-pointer" />
                    )}
                    {/* <CheckCircle
                                            className={`w-5 h-5 ${
                                                isCompleted ? 'text-white' : ''
                                            }`}
                                        /> */}
                </button>

                <button
                    onClick={(e) => handleActionClick(e, call.id, 'ticket')}
                    className={`p-2 rounded-lg transition-all ${hasTicket
                            ? 'bg-purple-500 text-white hover:bg-purple-600'
                            : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                        }`}
                    title={hasTicket ? 'Ticket Created' : 'Create Ticket'}
                >
                    <TicketPlus className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}
