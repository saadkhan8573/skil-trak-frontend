import { motion } from 'framer-motion'
import { Briefcase, CheckCircle2, XCircle } from 'lucide-react' // Added XCircle
import { Badge } from '@components'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@components/ui/tooltip'
import moment from 'moment'
import {
    needsWorkplaceStages,
    providedWorkplaceStages,
} from '../workplaceStages'
import { WorkplaceCurrentStatus } from '@utils'

export const WorkplaceProgressbar = ({
    currentStatus,
    workplaceType,
    createdAt,
    placementRequest,
}: any) => {
    const workflowStages =
        workplaceType === 'provided'
            ? providedWorkplaceStages
            : needsWorkplaceStages

    // 1. Check if the status is cancelled
    const isCancelled =
        placementRequest?.currentStatus === WorkplaceCurrentStatus.Cancelled

    const getCurrentStageIndex = () => {
        const stage = workflowStages.find(
            (s) => s.name === currentStatus?.stage
        )
        // If not found or cancelled, we handle index carefully
        return stage ? stage.id - 1 : 0
    }

    const currentStageIndex = getCurrentStageIndex()

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-xl p-6 shadow-sm border ${
                isCancelled ? 'border-red-200 bg-red-50/10' : 'border-slate-200'
            }`}
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Badge
                        Icon={isCancelled ? XCircle : Briefcase}
                        text={
                            isCancelled
                                ? 'Cancelled'
                                : workplaceType === 'provided'
                                  ? 'Provided Workplace'
                                  : 'Needs Workplace'
                        }
                        className={`${
                            isCancelled
                                ? 'bg-red-500 shadow-red-500/30'
                                : workplaceType === 'provided'
                                  ? 'bg-linear-to-r from-purple-500 to-indigo-500 shadow-purple-500/30'
                                  : 'bg-linear-to-r from-[#044866] to-[#0D5468] shadow-[#044866]/30'
                        } text-white border-0 shadow-lg px-3 py-1.5`}
                    />
                    <span className="text-sm text-slate-600">
                        {isCancelled
                            ? 'Process Cancelled'
                            : `Stage ${currentStageIndex + 1} of ${
                                  workflowStages.length
                              }`}
                    </span>
                </div>
                <div className="text-sm text-slate-600">
                    <span className="font-bold">Workplace created date: </span>
                    {createdAt
                        ? moment(createdAt).format('DD MMM YYYY, hh:mm A')
                        : '---'}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{
                        width: isCancelled
                            ? '100%'
                            : `${
                                  ((currentStageIndex + 1) /
                                      workflowStages.length) *
                                  100
                              }%`,
                    }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`absolute inset-y-0 left-0 rounded-full ${
                        isCancelled
                            ? 'bg-red-500'
                            : workplaceType === 'provided'
                              ? 'bg-linear-to-r from-purple-500 to-indigo-500'
                              : 'bg-linear-to-r from-[#044866] to-[#0D5468]'
                    }`}
                />
            </div>

            {/* Stages */}
            <div
                className={`${
                    workplaceType === 'provided'
                        ? 'grid-cols-6 lg:grid-cols-10'
                        : 'grid-cols-6 lg:grid-cols-12'
                } grid gap-2 mt-4`}
            >
                {workflowStages?.map((stage, index) => {
                    const isThisStageCancelled =
                        isCancelled && stage.name === 'Cancelled'
                    const isActive = !isCancelled && index === currentStageIndex
                    const isCompleted =
                        !isCancelled && index < currentStageIndex

                    return (
                        <TooltipProvider key={index}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div
                                        className={`flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all cursor-pointer ${
                                            isThisStageCancelled
                                                ? 'bg-red-50 border-2 border-red-300'
                                                : isActive
                                                  ? workplaceType === 'provided'
                                                      ? 'bg-linear-to-br from-purple-50 to-indigo-50 border-2 border-purple-300'
                                                      : 'bg-linear-to-br from-[#044866]/5 to-[#0D5468]/5 border-2 border-[#044866]/30'
                                                  : isCompleted
                                                    ? 'bg-emerald-50 border border-emerald-200'
                                                    : 'bg-slate-50 border border-slate-200 opacity-50' // Muted if cancelled
                                        }`}
                                    >
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                isThisStageCancelled
                                                    ? 'bg-red-500 text-white'
                                                    : isActive
                                                      ? workplaceType ===
                                                        'provided'
                                                          ? 'bg-linear-to-br from-purple-500 to-indigo-500 text-white'
                                                          : 'bg-linear-to-br from-[#044866] to-[#0D5468] text-white'
                                                      : isCompleted
                                                        ? 'bg-emerald-500 text-white'
                                                        : 'bg-slate-300 text-white'
                                            }`}
                                        >
                                            {isThisStageCancelled ? (
                                                <XCircle className="h-4 w-4" />
                                            ) : isCompleted ? (
                                                <CheckCircle2 className="h-4 w-4" />
                                            ) : (
                                                <span className="text-xs font-bold">
                                                    {index + 1}
                                                </span>
                                            )}
                                        </div>
                                        <span
                                            className={`text-xs text-center font-medium hidden lg:block ${
                                                isThisStageCancelled
                                                    ? 'text-red-700'
                                                    : isActive
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
