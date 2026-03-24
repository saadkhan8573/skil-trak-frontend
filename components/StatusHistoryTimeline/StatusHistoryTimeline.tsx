import { Card } from '@components'
import { StatusChangeHistoryTypes } from '@types'
import { cn } from '@utils'
import { ArrowRight, Calendar, History, User } from 'lucide-react'
import moment from 'moment'

interface StatusChangeHistoryProps {
    history: StatusChangeHistoryTypes[]
    className?: string
}

export const StatusHistoryTimeline = ({
    history,
    className,
}: StatusChangeHistoryProps) => {
    if (!history || history.length === 0) {
        return (
            <Card
                border
                className={cn(
                    'p-8 text-center text-muted-foreground bg-slate-50/50 border-dashed border-2',
                    className
                )}
            >
                <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No status change history available</p>
            </Card>
        )
    }

    // Sort history by date descending (latest first)
    const sortedHistory = [...history].sort((a, b) =>
        moment(b.updateAt).diff(moment(a.updateAt))
    )

    return (
        <Card className={cn('space-y-4', className)}>
            <div className="flex items-center gap-2 mb-6 px-1">
                <History className="w-5 h-5 text-primaryNew" />
                <h3 className="text-lg font-bold text-slate-800">
                    Status Change History
                </h3>
            </div>

            <div className="relative border-l-2 border-slate-100 ml-4 pl-8 space-y-6 py-2">
                {sortedHistory.map((entry, index) => (
                    <div key={index} className="relative group">
                        {/* Timeline Connector Dot */}
                        <div className="absolute -left-[41px] top-1.5 h-[18px] w-[18px] rounded-full border-4 border-white bg-primaryNew shadow-sm group-hover:scale-110 transition-transform duration-200 z-10" />

                        <Card
                            border
                            className="p-4 border-slate-200 hover:border-primaryNew/20 transition-all duration-300 hover:shadow-lg hover:shadow-primaryNew/5 bg-white overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primaryNew/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-primaryNew/10 transition-colors" />

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <div
                                            className={cn(
                                                'px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider',
                                                entry.previous
                                                    ? 'bg-slate-100 text-slate-600'
                                                    : 'bg-blue-50 text-blue-600 border border-blue-100'
                                            )}
                                        >
                                            {entry.previous || 'Initial'}
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-slate-300" />
                                        <div className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-primaryNew/10 text-primaryNew border border-primaryNew/20">
                                            {entry.current}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5 text-slate-400" />
                                            <span className="font-medium text-slate-600">
                                                Admin: {entry.updateBy}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                            <span>
                                                {moment(entry.updateAt).format(
                                                    'MMM DD, YYYY • hh:mm A'
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded shrink-0 self-start md:self-center">
                                    {moment(entry.updateAt).fromNow()}
                                </div>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
        </Card>
    )
}
