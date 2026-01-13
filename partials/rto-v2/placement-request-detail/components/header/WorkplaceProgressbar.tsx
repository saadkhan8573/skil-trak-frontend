import { useState } from 'react'

// components
import { Badge } from '@components'
// shadcn ui
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@components/ui/tooltip'
import { motion } from 'framer-motion'
import { Briefcase, CheckCircle2 } from 'lucide-react'
import {
    needsWorkplaceStages,
    providedWorkplaceStages,
} from '../workplaceStages'

export const WorkplaceProgressbar = ({ currentStatus, workplaceType }: any) => {
    const workflowStages =
        workplaceType === 'provided'
            ? providedWorkplaceStages
            : needsWorkplaceStages
    const getCurrentStageIndex = () => {
        const stage = workflowStages.find(
            (s) => s.name === currentStatus?.stage
        )
        return stage ? stage.id - 1 : 0
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Badge
                        Icon={Briefcase}
                        text={
                            workplaceType === 'provided'
                                ? 'Provided Workplace'
                                : 'Needs Workplace'
                        }
                        className={`${
                            workplaceType === 'provided'
                                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 shadow-purple-500/30'
                                : 'bg-gradient-to-r from-[#044866] to-[#0D5468] shadow-[#044866]/30'
                        } text-white border-0 shadow-lg px-3 py-1.5`}
                    ></Badge>
                    <span className="text-sm text-slate-600">
                        Stage {getCurrentStageIndex() + 1} of{' '}
                        {workflowStages.length}
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{
                        width: `${
                            ((getCurrentStageIndex() + 1) /
                                workflowStages.length) *
                            100
                        }%`,
                    }}
                    transition={{
                        duration: 0.8,
                        ease: 'easeOut',
                    }}
                    className={`absolute inset-y-0 left-0 ${
                        workplaceType === 'provided'
                            ? 'bg-gradient-to-r from-purple-500 to-indigo-500'
                            : 'bg-gradient-to-r from-[#044866] to-[#0D5468]'
                    } rounded-full`}
                />
            </div>

            {/* Stages */}
            <div
                className={`${
                    workplaceType === 'provided'
                        ? 'grid-cols-6 lg:grid-cols-9'
                        : 'grid-cols-6 lg:grid-cols-11'
                } grid  gap-2 mt-4`}
            >
                {workflowStages?.map((stage, index) => {
                    const isActive = index === getCurrentStageIndex()
                    const isCompleted = index < getCurrentStageIndex()

                    return (
                        <TooltipProvider key={index}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div
                                        className={`flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all cursor-pointer ${
                                            isActive
                                                ? workplaceType === 'provided'
                                                    ? 'bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300'
                                                    : 'bg-gradient-to-br from-[#044866]/5 to-[#0D5468]/5 border-2 border-[#044866]/30'
                                                : isCompleted
                                                ? 'bg-emerald-50 border border-emerald-200'
                                                : 'bg-slate-50 border border-slate-200'
                                        }`}
                                    >
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                isActive
                                                    ? workplaceType ===
                                                      'provided'
                                                        ? 'bg-gradient-to-br from-purple-500 to-indigo-500 text-white'
                                                        : 'bg-gradient-to-br from-[#044866] to-[#0D5468] text-white'
                                                    : isCompleted
                                                    ? 'bg-emerald-500 text-white'
                                                    : 'bg-slate-300 text-white'
                                            }`}
                                        >
                                            {isCompleted ? (
                                                <CheckCircle2 className="h-4 w-4" />
                                            ) : (
                                                <span className="text-xs font-bold">
                                                    {index + 1}
                                                </span>
                                            )}
                                        </div>
                                        <span
                                            className={`text-xs text-center font-medium hidden lg:block ${
                                                isActive
                                                    ? workplaceType ===
                                                      'provided'
                                                        ? 'text-purple-700'
                                                        : 'text-[#044866]'
                                                    : isCompleted
                                                    ? 'text-emerald-700'
                                                    : 'text-slate-500'
                                            }`}
                                        >
                                            {stage?.name}
                                        </span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="font-semibold">
                                        {stage?.name}
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )
                })}
            </div>
        </motion.div>
    )
}
