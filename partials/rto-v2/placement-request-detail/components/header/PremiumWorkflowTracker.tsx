import React from 'react'
import { WorkplaceProgressbar } from './WorkplaceProgressbar'
import { Clock } from 'lucide-react'

export const PremiumWorkflowTracker = ({
    workplaceType,
    workflowStages,
    currentStatus,
    placementRequest,
}: any) => {
    const getCurrentStageIndex = () => {
        const stage = workflowStages.find(
            (s: any) => s.name === currentStatus?.stage
        )
        return stage ? stage.id - 1 : 0
    }
    return (
        <div className="px-8 py-8 bg-gradient-to-b from-white/80 via-white/70 to-white/60 backdrop-blur-xl border-b border-slate-200/80 shadow-inner">
            <div className="max-w-[1900px] mx-auto">
                {/* Enhanced Header Section */}
                <div className="flex items-center justify-between">
                    {/* <div className="flex items-center gap-5">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#044866] via-[#0D5468] to-[#044866] flex items-center justify-center text-white shadow-lg ring-4 ring-white ring-offset-2 ring-offset-slate-100">
                                <span className="font-bold text-white">LR</span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="text-lg font-bold text-slate-900">
                                    Lena Rodriguez
                                </p>
                            </div>
                        </div>
                    </div> */}
                    {/* 
                    <div className="flex items-center gap-4">
                        {workplaceType && (
                            <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-[#044866]/5 to-[#0D5468]/5 rounded-xl border border-[#044866]/20">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#044866] to-[#0D5468] flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">
                                            {getCurrentStageIndex() + 1}/
                                            {workflowStages.length}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">
                                            Current Stage
                                        </p>
                                        <p className="font-semibold text-[#044866] text-sm">
                                            {currentStatus?.stage}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div> */}
                </div>

                {/* Workflow Progress Bar */}
                <WorkplaceProgressbar
                    currentStatus={currentStatus}
                    workplaceType={workplaceType}
                    createdAt={placementRequest?.createdAt}
                />
            </div>
        </div>
    )
}
