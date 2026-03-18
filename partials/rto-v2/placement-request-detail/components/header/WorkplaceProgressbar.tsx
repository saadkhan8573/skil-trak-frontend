import { motion } from 'framer-motion'
import { Briefcase, CheckCircle2, XCircle } from 'lucide-react'
import { Badge } from '@components'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@components/ui/tooltip'
import moment from 'moment'

// Reusing the same frontend-driven logic
import { useStatusInfo } from '../../../student-detail/components/StudentOverview/hooks/useStatusInfo'

export const WorkplaceProgressbar = ({
    workplace,
    workIndustry,
}: any) => {
    const { statuses, isProvidedWorkplace, currentStep } = useStatusInfo({
        workplace,
        workIndustry,
    })

    const isCancelled = workplace?.currentStatus === 'cancelled'
    const isTerminated = workplace?.currentStatus === 'terminated'
    const isErrorState = isCancelled || isTerminated

    // Calculate progress line
    const currentIdx = statuses.findIndex((s) => s.current)
    const completedOrCurrentIndex = 
        isErrorState ? statuses.length - 1 : // Full
        currentIdx !== -1 ? currentIdx : // Partial
        statuses.filter(s => s.completed).length - 1 // After some completion but no current (e.g. Schedule Completed)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-xl p-6 shadow-sm border ${
                isErrorState ? 'border-red-200 bg-red-50/10' : 'border-slate-200'
            }`}
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Badge
                        Icon={isErrorState ? XCircle : Briefcase}
                        text={
                            isCancelled
                                ? 'Cancelled'
                                : isTerminated
                                  ? 'Terminated'
                                  : isProvidedWorkplace
                                      ? 'Provided Workplace'
                                      : 'Needs Workplace'
                        }
                        className={`${
                            isErrorState
                                ? 'bg-red-500 shadow-red-500/30'
                                : isProvidedWorkplace
                                  ? 'bg-linear-to-r from-purple-500 to-indigo-500 shadow-purple-500/30'
                                  : 'bg-linear-to-r from-[#044866] to-[#0D5468] shadow-[#044866]/30'
                        } text-white border-0 shadow-lg px-3 py-1.5`}
                    />
                    <span className="text-sm text-slate-600">
                        {isErrorState
                            ? `Process ${isCancelled ? 'Cancelled' : 'Terminated'}`
                            : `Stage ${Math.max(1, currentIdx + 1)} of ${statuses.length}`}
                    </span>
                </div>
                <div className="text-sm text-slate-600">
                    <span className="font-bold">Workplace created date: </span>
                    {workplace?.createdAt
                        ? moment(workplace.createdAt).format('DD MMM YYYY, hh:mm A')
                        : '---'}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{
                        width: isErrorState
                            ? '100%'
                            : `${((completedOrCurrentIndex + 1) / statuses.length) * 100}%`,
                    }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`absolute inset-y-0 left-0 rounded-full ${
                        isErrorState
                            ? 'bg-red-500'
                            : isProvidedWorkplace
                              ? 'bg-linear-to-r from-purple-500 to-indigo-500'
                              : 'bg-linear-to-r from-[#044866] to-[#0D5468]'
                    }`}
                />
            </div>

            {/* Stages */}
            <div
                className={`${
                    isProvidedWorkplace
                        ? 'grid-cols-6 lg:grid-cols-10'
                        : 'grid-cols-6 lg:grid-cols-12'
                } grid gap-2 mt-4`}
            >
                {statuses?.map((stage, index) => {
                    const isThisStageCancelled = isCancelled && stage.label === 'Cancelled'
                    const isThisStageTerminated = isTerminated && stage.label === 'Terminated'
                    const isErrorNode = isThisStageCancelled || isThisStageTerminated

                    const isActive = !isErrorState && stage.current
                    const isCompleted = !isErrorState && stage.completed

                    return (
                        <TooltipProvider key={index}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div
                                        className={`flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all cursor-pointer ${
                                            isErrorNode
                                                ? 'bg-red-50 border-2 border-red-300'
                                                : isActive
                                                  ? isProvidedWorkplace
                                                      ? 'bg-linear-to-br from-purple-50 to-indigo-50 border-2 border-purple-300'
                                                      : 'bg-linear-to-br from-[#044866]/5 to-[#0D5468]/5 border-2 border-[#044866]/30'
                                                  : isCompleted
                                                    ? 'bg-emerald-50 border border-emerald-200'
                                                    : 'bg-slate-50 border border-slate-200 opacity-50' // Muted if cancelled
                                        }`}
                                    >
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                isErrorNode
                                                    ? 'bg-red-500 text-white'
                                                    : isActive
                                                      ? isProvidedWorkplace
                                                          ? 'bg-linear-to-br from-purple-500 to-indigo-500 text-white'
                                                          : 'bg-linear-to-br from-[#044866] to-[#0D5468] text-white'
                                                      : isCompleted
                                                        ? 'bg-emerald-500 text-white'
                                                        : 'bg-slate-300 text-white'
                                            }`}
                                        >
                                            {isErrorNode ? (
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
                                                isErrorNode
                                                    ? 'text-red-700'
                                                    : isActive
                                                      ? isProvidedWorkplace
                                                          ? 'text-purple-700'
                                                          : 'text-[#044866]'
                                                      : isCompleted
                                                        ? 'text-emerald-700'
                                                        : 'text-slate-500'
                                            }`}
                                        >
                                            {stage?.label}
                                        </span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="font-semibold">
                                        {stage?.label}
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
