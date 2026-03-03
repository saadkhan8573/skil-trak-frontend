import { Badge } from '@components'
import { Calendar, ChevronRight, Info, MapPin } from 'lucide-react'
import { PlacementHistoryItem, statusConfigs } from '../types'
import { WorkplaceCurrentStatus } from '@utils'
import { useRouteInfo } from '../../../../hooks/useRouteInfo'
import { useAppSelector } from '@redux/hooks'

interface PlacementRequestItemProps {
    request: PlacementHistoryItem
    index: number
    groupLength: number
    onSelect: (request: any) => void
    onMouseEnter: (
        e: React.MouseEvent<HTMLDivElement>,
        requestId: string
    ) => void
    onMouseLeave: () => void
    hoveredCommentId: string | null
    tooltipPosition: { top: number; left: number } | null
}

export const PlacementRequestItem = ({
    request,
    index,
    groupLength,
    onSelect,
    onMouseEnter,
    onMouseLeave,
    hoveredCommentId,
    tooltipPosition,
}: PlacementRequestItemProps) => {
    const { studentDetail } = useAppSelector((state) => state.student)

    const { travelInfo } = useRouteInfo({
        studentLocation: studentDetail?.location?.split(',') || [],
        industryLocation: request.industry?.location?.split(',') || [],
        modes: ['driving'],
    })

    const drivingInfo = travelInfo.find((info) => info.mode === 'driving')
    const displayDistance = drivingInfo?.distance ?? null
    const drivingDuration = drivingInfo?.duration ?? null

    const statusConfig =
        statusConfigs[request.status] || statusConfigs.cancelled
    const StatusIcon = statusConfig.icon
    const isCancelled = request.status === 'cancelled'
    const isCompleted = request.status === 'completed'
    const isRejectedByStudent =
        request.status === WorkplaceCurrentStatus.RejectedByStudent
    const isRejectedByIndustry =
        request.status === WorkplaceCurrentStatus.RejectedByIndustry
    const isRejectedByRto =
        request.status === WorkplaceCurrentStatus.RejectedByRto

    let iconBg = 'bg-linear-to-br from-red-500 to-red-600'
    let badgeClass = 'bg-red-50 text-red-700 border-red-200'

    if (isCompleted) {
        iconBg = 'bg-linear-to-br from-emerald-500 to-emerald-600'
        badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200'
    } else if (isRejectedByStudent || request.status === 'rejected') {
        iconBg = 'bg-linear-to-br from-orange-500 to-orange-600'
        badgeClass = 'bg-orange-50 text-orange-700 border-orange-200'
    } else if (isRejectedByIndustry) {
        iconBg = 'bg-linear-to-br from-purple-500 to-purple-600'
        badgeClass = 'bg-purple-50 text-purple-700 border-purple-200'
    }

    return (
        <div
            key={request?.id}
            onClick={() => onSelect(request)}
            className="group relative bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer overflow-hidden"
        >
            <div className="flex items-center gap-2 p-2">
                <div className="w-6 h-6 rounded bg-slate-700 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                    {index + 1}
                </div>

                <div
                    className={`w-6 h-6 rounded ${iconBg} flex items-center justify-center text-white shrink-0`}
                >
                    <StatusIcon className="w-3.5 h-3.5" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[11px] text-slate-900 font-medium truncate">
                            {request.workplace}
                        </span>
                        {request.cancellationComment && (
                            <div className="relative shrink-0">
                                <div
                                    className="w-4 h-4 rounded-full bg-[#044866] hover:bg-[#0D5468] flex items-center justify-center cursor-help transition-all"
                                    onMouseEnter={(e) =>
                                        onMouseEnter(e, request.id)
                                    }
                                    onMouseLeave={onMouseLeave}
                                >
                                    <Info className="w-2.5 h-2.5 text-white" />
                                </div>
                                {hoveredCommentId === request.id &&
                                    tooltipPosition && (
                                        <div
                                            className="fixed z-9999"
                                            style={{
                                                left: `${tooltipPosition.left}px`,
                                                top: `${tooltipPosition.top}px`,
                                            }}
                                        >
                                            <div className="bg-slate-900 text-white text-xs rounded-lg p-3 shadow-2xl border border-slate-700 w-72">
                                                <div className="flex items-start gap-2">
                                                    <div className="w-6 h-6 rounded bg-[#F7A619] flex items-center justify-center shrink-0">
                                                        <Info className="w-3 h-3 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-semibold mb-1.5">
                                                            {isCancelled
                                                                ? 'Cancellation'
                                                                : 'Rejection'}{' '}
                                                            Reason
                                                        </p>
                                                        <p className="text-slate-300 leading-relaxed text-[11px]">
                                                            {
                                                                request.cancellationComment
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="absolute -top-1.5 left-3 w-3 h-3 bg-slate-900 border-l border-t border-slate-700 transform rotate-45"></div>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] text-slate-500">
                        <div className="flex items-center gap-1 shrink-0">
                            <Calendar className="w-2.5 h-2.5 text-slate-400" />
                            <span className="whitespace-nowrap">
                                Created: {request.createdDate}
                            </span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1 shrink-0">
                            <Calendar className="w-2.5 h-2.5 text-slate-400" />
                            <span className="whitespace-nowrap">
                                Last Action: {request.lastActionDate}
                            </span>
                        </div>
                        <span>•</span>
                        <Badge
                            outline
                            className="text-[9px] px-1 py-0 h-3.5 border-slate-300"
                        >
                            {request.id}
                        </Badge>
                        <Badge
                            className={`text-[8px] px-1 py-0 h-3.5 ${badgeClass}`}
                        >
                            {statusConfig.label}
                        </Badge>

                        <span>•</span>
                        <span className="truncate">{request.location}</span>

                        {displayDistance && (
                            <>
                                <span>•</span>
                                <span className="flex items-center gap-0.5 text-primary font-medium whitespace-nowrap">
                                    <MapPin className="w-2 h-2" />
                                    {displayDistance}
                                    {drivingDuration && (
                                        <span className="text-slate-400 font-normal ml-0.5">
                                            ({drivingDuration})
                                        </span>
                                    )}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <div className="shrink-0">
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#044866] group-hover:translate-x-0.5 transition-all" />
                </div>
            </div>
        </div>
    )
}
