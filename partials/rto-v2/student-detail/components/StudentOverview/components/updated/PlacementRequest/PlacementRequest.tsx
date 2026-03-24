import { NoData } from '@components'
import { Skeleton } from '@components/ui/skeleton'
import { IWorkplaceIndustries } from '@redux/queryTypes'
import { AlertCircle, Building2, ChevronRight, FileText } from 'lucide-react'
import { PlacementRequestItem } from './components/PlacementRequestItem'
import { usePlacementRequest } from './hooks/usePlacementRequest'

interface PlacementRequestProps {
    nonActiveWorkplaces: IWorkplaceIndustries[]
}

export function PlacementRequest({
    nonActiveWorkplaces,
}: PlacementRequestProps) {
    const {
        isLoading,
        showCanceledCompleted,
        setShowCanceledCompleted,
        groupedRequests,
        canCreateNewRequest,
        onSelectWorkplace,
        canceledCompletedRequests,
    } = usePlacementRequest(nonActiveWorkplaces)

    if (isLoading) {
        return (
            <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-4 space-y-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <Skeleton className="w-48 h-6" />
                </div>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 p-3 border border-slate-100 rounded-lg"
                        >
                            <Skeleton className="w-10 h-10 rounded" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="w-1/3 h-4" />
                                <Skeleton className="w-1/2 h-3" />
                            </div>
                            <Skeleton className="w-4 h-4" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Compact Header */}
            <div className="bg-linear-to-r from-[#044866] to-[#0D5468] px-3 py-2.5">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white text-sm font-semibold">
                                Placement History
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Canceled/Completed Requests List */}
            {canceledCompletedRequests.length > 0 && (
                <div className="bg-white">
                    <button
                        onClick={() =>
                            setShowCanceledCompleted(!showCanceledCompleted)
                        }
                        className="w-full px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-all group border-b border-slate-100"
                    >
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-6 h-6 rounded ${showCanceledCompleted ? 'bg-linear-to-br from-[#044866] to-[#0D5468]' : 'bg-slate-100'} flex items-center justify-center transition-all`}
                            >
                                <FileText
                                    className={`w-4 h-4 ${showCanceledCompleted ? 'text-white' : 'text-slate-600'}`}
                                />
                            </div>
                            <span className="text-xs text-slate-900 font-medium">
                                View All ({canceledCompletedRequests.length})
                            </span>
                        </div>
                        <ChevronRight
                            className={`w-4 h-4 text-slate-400 group-hover:text-[#044866] transition-all ${showCanceledCompleted ? 'rotate-90' : ''}`}
                        />
                    </button>

                    {showCanceledCompleted && (
                        <div className="p-2.5 bg-slate-50/50 space-y-4">
                            {/* Group Section: Completed */}
                            {groupedRequests.completed.length > 0 && (
                                <div className="space-y-2">
                                    <h5 className="text-xs font-bold text-emerald-600 uppercase tracking-wider px-1">
                                        Completed
                                    </h5>
                                    <div className="space-y-1.5">
                                        {groupedRequests.completed.map(
                                            (request, index) => (
                                                <PlacementRequestItem
                                                    key={request.id}
                                                    request={request}
                                                    index={index}
                                                    groupLength={
                                                        groupedRequests
                                                            .completed.length
                                                    }
                                                    onSelect={onSelectWorkplace}
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Group Section: Cancelled */}
                            {groupedRequests.cancelled.length > 0 && (
                                <div className="space-y-2">
                                    <h5 className="text-xs font-bold text-red-600 uppercase tracking-wider px-1">
                                        Cancelled
                                    </h5>
                                    <div className="space-y-1.5">
                                        {groupedRequests.cancelled.map(
                                            (request, index) => (
                                                <PlacementRequestItem
                                                    key={request.id}
                                                    request={request}
                                                    index={index}
                                                    groupLength={
                                                        groupedRequests
                                                            .cancelled.length
                                                    }
                                                    onSelect={onSelectWorkplace}
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Group Section: Terminated */}
                            {groupedRequests.terminated.length > 0 && (
                                <div className="space-y-2">
                                    <h5 className="text-xs font-bold text-red-600 uppercase tracking-wider px-1">
                                        Terminated
                                    </h5>
                                    <div className="space-y-1.5">
                                        {groupedRequests.terminated.map(
                                            (request, index) => (
                                                <PlacementRequestItem
                                                    key={request.id}
                                                    request={request}
                                                    index={index}
                                                    groupLength={
                                                        groupedRequests
                                                            .terminated.length
                                                    }
                                                    onSelect={onSelectWorkplace}
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Group Section: Rejected */}
                            {groupedRequests.rejected.length > 0 && (
                                <div className="space-y-2">
                                    <h5 className="text-xs font-bold text-orange-600 uppercase tracking-wider px-1">
                                        Rejected
                                    </h5>
                                    <div className="space-y-1.5">
                                        {groupedRequests.rejected.map(
                                            (request, index) => (
                                                <PlacementRequestItem
                                                    key={request.id}
                                                    request={request}
                                                    index={index}
                                                    groupLength={
                                                        groupedRequests.rejected
                                                            .length
                                                    }
                                                    onSelect={onSelectWorkplace}
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {!canceledCompletedRequests?.length && (
                <NoData text="You have no placement history yet." />
            )}
        </div>
    )
}
