import { Badge } from '@components'
import {
    IWorkplaceIndustries,
    WorkplaceWorkIndustriesType,
} from 'redux/queryTypes'
import { useStatusInfo } from '../hooks/useStatusInfo'
import { Check, Clock, Sparkles, TrendingUp } from 'lucide-react'

export function CurrentStatus({
    workplace,
}: {
    workplace: IWorkplaceIndustries
}) {
    const workIndustry = workplace?.industries?.[0]

    const { statuses, progressPercent, completedCount, totalCount } =
        useStatusInfo({
            workplace,
            workIndustry: workIndustry as WorkplaceWorkIndustriesType,
        })

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-secondary shadow-xl shadow-slate-200/50 p-5 hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-slate-900 mb-0.5 flex items-center gap-2">
                        Current Status
                        <Sparkles className="w-4 h-4 text-[#F7A619]" />
                    </h2>
                    <p className="text-sm text-slate-600">
                        Placement workflow progress
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <div className="flex items-center gap-2 mb-0.5">
                            <TrendingUp className="w-3.5 h-3.5 text-primaryNew" />
                            <span className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primaryNew to-primaryNew">
                                {progressPercent}%
                            </span>
                        </div>
                        <p className="text-xs text-slate-600">
                            {completedCount} of {totalCount} steps
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary to-slate-100" />
                <div
                    className="absolute left-3.5 top-0 w-0.5 bg-gradient-to-b from-primaryNew via-primaryNew to-primaryNew transition-all duration-500 shadow-lg"
                    style={{
                        height: `${(statuses.filter((s) => s.completed).length /
                                (statuses.length - 1)) *
                            100
                            }%`,
                    }}
                />

                <div className="space-y-4">
                    {statuses.map((status, index) => (
                        <div
                            key={index}
                            className={`relative flex items-center gap-3.5 transition-all duration-300 ${status.current ? 'scale-105' : ''
                                }`}
                        >
                            {/* Status Icon */}
                            <div
                                className={`relative z-10 w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg ${status.completed
                                        ? 'bg-gradient-to-br from-primaryNew to-primaryNew text-white shadow-primaryNew/40 scale-100'
                                        : status.current
                                            ? 'bg-gradient-to-br from-[#F7A619] to-[#F7A619]/80 text-white shadow-[#F7A619]/40 ring-4 ring-[#F7A619]/20 animate-pulse'
                                            : 'bg-white border-2 border-secondary text-slate-400'
                                    }`}
                            >
                                {status.completed ? (
                                    <Check className="w-3.5 h-3.5" />
                                ) : status.current ? (
                                    <Clock className="w-3.5 h-3.5" />
                                ) : (
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                )}
                            </div>

                            {/* Status Label */}
                            <div
                                className={`flex-1 py-1.5 px-2.5 rounded-xl transition-all duration-300 ${status.current
                                        ? 'bg-gradient-to-r from-[#F7A619]/10 to-transparent border border-[#F7A619]/20'
                                        : status.completed
                                            ? 'hover:bg-slate-50/50'
                                            : ''
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p
                                            className={`text-sm transition-all duration-300 ${status.completed
                                                    ? 'text-slate-700'
                                                    : status.current
                                                        ? 'text-[#F7A619]'
                                                        : 'text-slate-400'
                                                } ${status.current
                                                    ? 'font-medium'
                                                    : ''
                                                }`}
                                        >
                                            {status.label}
                                        </p>

                                        {/* Date Stamp */}
                                        {status.date && (
                                            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                                                <Clock className="w-3 h-3" />
                                                {status.date}
                                            </p>
                                        )}

                                        {/* Expected Date for Current */}
                                        {/* {status.current && !status.date && (
                                            <p className="text-xs text-amber-600 mt-0.5 flex items-center gap-1.5">
                                                <Clock className="w-3 h-3" />
                                                Expected: Dec 10, 2025
                                            </p>
                                        )} */}
                                    </div>

                                    {/* Current Badge */}
                                    {status.current && (
                                        <Badge
                                            variant="info"
                                            text="In Progress"
                                            Icon={Clock}
                                            size="xs"
                                        />
                                    )}

                                    {status.completed && (
                                        <Check className="w-3.5 h-3.5 text-primaryNew" />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary Footer */}
            <div className="mt-5 pt-4 border-t border-secondary">
                <div className="grid grid-cols-3 gap-2.5">
                    <div className="text-center p-2 bg-primaryNew/10 rounded-xl border border-primaryNew/20">
                        <p className="text-xl text-primaryNew mb-0.5">
                            {completedCount}
                        </p>
                        <p className="text-xs text-slate-600">Completed</p>
                    </div>
                    <div className="text-center p-2 bg-[#F7A619]/10 rounded-xl border border-[#F7A619]/20">
                        <p className="text-xl text-[#F7A619] mb-0.5">1</p>
                        <p className="text-xs text-slate-600">In Progress</p>
                    </div>
                    <div className="text-center p-2 bg-secondary rounded-xl border border-secondary">
                        <p className="text-xl text-slate-700 mb-0.5">
                            {totalCount - completedCount - 1}
                        </p>
                        <p className="text-xs text-slate-600">Remaining</p>
                    </div>
                </div>
            </div>

            {/* Status Legend */}
            {/* <div className="mt-4 p-3 bg-gradient-to-r from-secondary to-transparent rounded-xl border border-secondary">
                <p className="text-xs text-slate-600 mb-2">
                    Quick Actions Available:
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="warning" outline text="On Hold" size="xs" />
                    <Badge variant="error" outline text="Cancelled" size="xs" />
                    <Badge
                        variant="error"
                        outline
                        text="Terminated"
                        size="xs"
                    />
                    <Badge
                        variant="secondary"
                        outline
                        text="Extension"
                        size="xs"
                    />
                </div>
            </div> */}
        </div>
    )
}
