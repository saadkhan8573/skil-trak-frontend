import React from 'react'
import {
    Calendar,
    CheckCircle,
    Circle,
    Clock,
    Eye,
    TicketPlus,
} from 'lucide-react'
import { StatusBadge } from '../StatusBadge'
import { formatDate, formatTime } from '../../utils'

export const MobileViewCallCard = ({
    call,
    onCallSelect,
    onMarkCompleted,
    onCreateTicket,
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
        <div className="lg:hidden divide-y divide-gray-100">
            <div
                key={call.id}
                className={`p-4 transition-all ${isCompleted ? 'bg-green-50/50' : 'hover:bg-gray-50'
                    }`}
            >
                {/* Priority Bar */}
                <div
                    className={`h-1 rounded-full mb-3 ${call.priority === 'high' && !isCompleted
                            ? 'bg-red-500'
                            : call.priority === 'medium' && !isCompleted
                                ? 'bg-yellow-500'
                                : 'bg-gray-200'
                        }`}
                />

                {/* Main Content */}
                <div
                    className="flex items-start gap-3 mb-3"
                    onClick={() => onCallSelect(call)}
                >
                    <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#044866] to-[#0D5468] flex items-center justify-center shadow-sm">
                            <span className="text-white font-medium">
                                {call.studentName
                                    .split(' ')
                                    .map((n: any) => n[0])
                                    .join('')}
                            </span>
                        </div>
                        {isCompleted && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                                <CheckCircle className="w-3 h-3 text-white fill-current" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3
                            className={`text-gray-900 mb-1 ${isCompleted ? 'opacity-60' : ''
                                }`}
                        >
                            {call.studentName}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                            {call.phoneNumber}
                        </p>
                        <StatusBadge status={call.status} size="sm" />
                    </div>
                </div>

                {/* Info Row */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-900 font-medium">
                            {formatDate(call.date)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="text-sm text-gray-900 font-medium">
                            {formatTime(call.date)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-orange-600" />
                        </div>
                        <span className="text-sm text-gray-900 font-medium">
                            {call.duration}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onCallSelect(call)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#044866] text-white rounded-lg hover:bg-[#0D5468] transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">Open</span>
                    </button>

                    <button
                        onClick={(e) =>
                            handleActionClick(e, call.id, 'completed')
                        }
                        className={`p-2 rounded-lg transition-all ${isCompleted
                                ? 'bg-green-500 text-white'
                                : 'bg-green-100 text-green-600'
                            }`}
                    >
                        <CheckCircle
                            className={`w-5 h-5 ${isCompleted ? 'fill-current' : ''
                                }`}
                        />
                    </button>

                    <button
                        onClick={(e) => handleActionClick(e, call.id, 'ticket')}
                        className={`p-2 rounded-lg transition-all ${hasTicket
                                ? 'bg-purple-500 text-white'
                                : 'bg-purple-100 text-purple-600'
                            }`}
                    >
                        <TicketPlus className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
