import { Button } from '@components'
import { CommonApi } from '@redux'
import { renderStudentJourneyResponse } from '@utils'
import { Sparkles, TrendingUp, Loader2 } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const ChatResponses = () => {
    const router = useRouter()
    const { id } = router.query // adjust param name to match your route

    const [fetchStudentJourney, getStudentJourney] =
        CommonApi.AiAssistant.getStudentJourneyLazy()

    // Auto-fetch on mount
    useEffect(() => {
        if (id) {
            fetchStudentJourney({ studentId: Number(id) }) // adjust payload to match your API args
        }
    }, [id])

    const handleRegenerate = () => {
        if (id) {
            fetchStudentJourney({ studentId: Number(id) }) // re-triggers the lazy query
        }
    }

    const isLoading =
        getStudentJourney?.isLoading || getStudentJourney?.isFetching
    const response = getStudentJourney?.data?.response

    return (
        <div className="mt-3.5 relative overflow-hidden bg-gradient-to-r from-[#044866]/5 via-[#0D5468]/5 to-transparent border-l-4 border-[#044866] rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all">
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-[#044866]/10 to-transparent rounded-full blur-3xl"></div>
            <div className="relative">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#044866] to-[#0D5468] flex items-center justify-center shadow-lg shadow-[#044866]/30">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-slate-900">
                                    AI Progress Summary
                                </h3>
                                <span className="text-xs bg-gradient-to-r from-[#044866] to-[#0D5468] text-white px-2 py-0.5 rounded-full">
                                    Auto-Generated
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5">
                                Intelligent analysis of placement journey and
                                engagement metrics
                            </p>
                        </div>
                    </div>

                    {/*  */}
                    <Button
                        variant="primaryNew"
                        outline
                        disabled={isLoading}
                        loading={isLoading}
                        onClick={handleRegenerate}
                        className={isLoading ? 'bg-gray-400' : ''}
                    >
                        Regenerate Summary
                    </Button>
                </div>

                {/* AI Summary Sections */}
                <div className="space-y-3">
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-slate-200/60">
                        <div className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <TrendingUp className="w-3 h-3 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-emerald-700 uppercase tracking-wide mb-1.5">
                                    Progress Summary
                                </p>

                                {/* Loading State */}
                                {isLoading && (
                                    <div className="flex items-center gap-2 text-slate-500 py-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-[#044866]" />
                                        <span className="text-xs">
                                            Generating summary...
                                        </span>
                                    </div>
                                )}

                                {/* Error State */}
                                {getStudentJourney?.isError && !isLoading && (
                                    <p className="text-xs text-red-500">
                                        Failed to load summary. Please try
                                        regenerating.
                                    </p>
                                )}

                                {/* Response */}
                                {!isLoading && response && (
                                    <div className="text-sm text-slate-700 leading-relaxed space-y-1">
                                        {renderStudentJourneyResponse(response)}
                                    </div>
                                )}

                                {/* Empty State */}
                                {!isLoading &&
                                    !response &&
                                    !getStudentJourney?.isError && (
                                        <p className="text-xs text-slate-400 italic">
                                            No summary available yet.
                                        </p>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
