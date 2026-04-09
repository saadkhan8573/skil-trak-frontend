import React from 'react'
import { History, User as UserIcon, ArrowRightLeft } from 'lucide-react'
import moment from 'moment'
import { TicketHistory } from '@types'

export const TicketHistoryCard = ({
    history,
}: {
    history?: TicketHistory[]
}) => {
    const renderContent = () => {
        if (!history || history.length === 0) {
            return (
                <div className="text-center py-8 text-[#0D5468]/50 text-sm bg-slate-50 rounded-lg border border-slate-100">
                    No history found for this ticket.
                </div>
            )
        }

        return (
            <div className="max-h-127 overflow-y-auto pr-2">
                <div className="relative pl-4 border-l-2 border-[#0D5468]/10 space-y-6">
                    {history.map((item, index) => (
                        <div key={index} className="relative">
                            {/* Timeline dot */}
                            <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#F7A619] border-2 border-white ring-2 ring-[#F7A619]/20" />

                            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 bg-[#044866]/10 rounded-full flex items-center justify-center">
                                            <UserIcon className="w-3 h-3 text-[#044866]" />
                                        </div>
                                        <span className="text-xs font-medium text-[#044866]">
                                            {item.updatedBy || 'Unknown User'}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-medium">
                                        {moment(item.updatedAt).format(
                                            'MMM DD, YYYY - h:mm:ss A'
                                        )}
                                    </span>
                                </div>

                                <div className="mt-2 text-xs text-slate-600 bg-white p-2 rounded border border-slate-100">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-gray-500">
                                            Reassigned from
                                        </span>
                                        <span className="font-medium text-[#044866]">
                                            {item.previouslyAssigned ||
                                                'Unassigned'}
                                        </span>
                                        <ArrowRightLeft className="w-3 h-3 text-gray-400 mx-1" />
                                        <span className="text-gray-500">
                                            to
                                        </span>
                                        <span className="font-medium text-[#044866]">
                                            {item.assignedTo || 'Unassigned'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
                <History className="w-4 h-4 text-[#F7A619]" />
                <h3 className="text-[#044866] text-sm font-semibold">
                    Assignment Timeline
                </h3>
            </div>
            {renderContent()}
        </div>
    )
}
