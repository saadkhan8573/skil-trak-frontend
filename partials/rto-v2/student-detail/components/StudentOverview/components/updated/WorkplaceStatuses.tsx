import { Badge } from '@components'
import { WorkplaceStatusLabels } from '@utils'
import {
    Circle,
    CheckCircle,
    Clock,
    Search,
    Sparkles,
    TrendingUp,
    User,
    X,
    Zap,
} from 'lucide-react'
import moment from 'moment'
import { useState } from 'react'
import {
    IWorkplaceIndustries,
    WorkplaceWorkIndustriesType,
} from '@redux/queryTypes'
import { useStatusInfo } from '../../hooks/useStatusInfo'

interface WorkplaceStatusesProps {
    workplace: IWorkplaceIndustries
    workIndustry: WorkplaceWorkIndustriesType | undefined
    industry: any // Pass industry to avoid re-calculation if possible
    onCancelRequested: () => void
}

export function WorkplaceStatuses({
    workplace,
    workIndustry,
    industry,
    onCancelRequested,
}: WorkplaceStatusesProps) {
    const [hoveredStage, setHoveredStage] = useState<number | null>(null)

    const { statuses, progressPercent } = useStatusInfo({
        workplace: workplace as any,
        workIndustry: workIndustry as WorkplaceWorkIndustriesType,
    })

    // Map dynamic statuses to components
    const workflowSteps = statuses.map((status) => ({
        label: status.label,
        status: status.completed
            ? 'completed'
            : status.current
              ? 'current'
              : 'pending',
        icon: status.completed ? CheckCircle : status.current ? Clock : Circle,
        date: status.date,
    }))

    const currentStage = statuses.findIndex((s) => s.current) + 1
    const totalStages = statuses.length

    return (
        <div className="px-4 py-3 bg-linear-to-br from-slate-50 via-white to-blue-50/30 border-b border-slate-200/60 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-linear-to-br from-[#6B46C1]/5 to-transparent rounded-full blur-3xl"></div>

            <div className="relative flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Badge
                        Icon={Search}
                        className="bg-linear-to-r from-[#044866] to-[#0D5468] text-white px-2 py-0.5 shadow-lg shadow-[#044866]/30 hover:scale-105 transition-transform cursor-pointer text-xs"
                    >
                        {WorkplaceStatusLabels[workplace?.currentStatus]}
                    </Badge>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200 shadow-sm">
                        <TrendingUp className="w-3 h-3 text-emerald-600" />
                        <span className="text-xs font-semibold text-slate-700">
                            Stage {currentStage}
                        </span>
                        <span className="text-xs text-slate-500">
                            of {totalStages}
                        </span>
                    </div>
                </div>
                <div className="relative flex items-center gap-1.5 text-xs text-slate-500 bg-white/60 backdrop-blur-sm px-2 py-1 rounded-lg border border-slate-200">
                    <Clock className="w-3 h-3" />
                    <span>
                        Created:{' '}
                        {workplace?.createdAt
                            ? moment(workplace.createdAt).format('DD/MM/YYYY')
                            : '---'}
                    </span>
                    <div className="ml-1 h-3 w-px bg-slate-300"></div>
                    <User className="w-3 h-3" />
                    <span>
                        Assigned to:{' '}
                        <span className="font-semibold text-slate-700">
                            {workplace?.assignedTo?.user?.name || '---'}
                        </span>
                    </span>
                    <div className="ml-1 h-3 w-px bg-slate-300"></div>
                    <button
                        onClick={onCancelRequested}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 px-1.5 py-0.5 rounded transition-colors"
                    >
                        <X className="w-3 h-3" />
                        <span className="font-medium">Cancel</span>
                    </button>
                </div>
            </div>

            {/* Progress Bar with Steps - Ultra Premium */}
            <div className="relative pb-1">
                {/* Background Line with Glow */}
                <div className="absolute top-3 left-0 right-0 h-1 bg-slate-200 rounded-full shadow-inner"></div>

                {/* Progress Line with Gradient and Animation */}
                <div
                    className="absolute top-3 left-0 h-1 rounded-full transition-all duration-1000 ease-out shadow-lg overflow-hidden"
                    style={{ width: `${progressPercent}%` }}
                >
                    <div className="absolute inset-0 bg-linear-to-r from-emerald-400 via-emerald-500 to-emerald-600"></div>
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                </div>

                {/* Steps with Enhanced Interaction */}
                <div className="relative flex justify-between">
                    {workflowSteps.map((stage, index) => {
                        const StageIcon = stage.icon
                        const isCompleted = stage.status === 'completed'
                        const isCurrent = stage.status === 'current'
                        const isHovered = hoveredStage === index

                        return (
                            <div
                                key={index}
                                className="flex flex-col items-center group/stage cursor-pointer"
                                style={{ width: `${100 / 9}%` }}
                                onMouseEnter={() => setHoveredStage(index)}
                                onMouseLeave={() => setHoveredStage(null)}
                            >
                                {/* Stage Circle with Premium Effects */}
                                <div
                                    className={`relative w-6 h-6 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                        isCompleted
                                            ? 'bg-linear-to-br from-emerald-400 via-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/50 group-hover/stage:scale-110 group-hover/stage:rotate-6'
                                            : isCurrent
                                              ? 'bg-linear-to-br from-[#6B46C1] via-[#8B5CF6] to-[#A78BFA] text-white ring-2 ring-purple-200 shadow-xl shadow-purple-500/50 animate-pulse group-hover/stage:scale-110'
                                              : 'bg-white text-slate-400 border border-slate-300 shadow-md group-hover/stage:scale-110 group-hover/stage:border-slate-400'
                                    }`}
                                >
                                    <StageIcon
                                        className={`transition-all duration-300 ${
                                            isHovered ? 'w-6 h-6' : 'w-5 h-5'
                                        }`}
                                    />

                                    {/* Sparkle effect for completed */}
                                    {isCompleted && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg">
                                            <Sparkles className="w-3 h-3 text-emerald-500" />
                                        </div>
                                    )}

                                    {/* Pulse effect for current */}
                                    {isCurrent && (
                                        <>
                                            <div className="absolute inset-0 rounded-2xl bg-[#6B46C1] animate-ping opacity-20"></div>
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-linear-to-br from-[#F7A619] to-amber-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                                <Zap className="w-3 h-3 text-white" />
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Stage Label with Tooltip Effect */}
                                <div
                                    className={`mt-3 transition-all duration-300 ${
                                        isHovered ? 'transform scale-110' : ''
                                    }`}
                                >
                                    <span
                                        className={`text-xs text-center font-medium block transition-all duration-300 ${
                                            isCompleted
                                                ? 'text-emerald-600'
                                                : isCurrent
                                                  ? 'text-[#6B46C1]'
                                                  : 'text-slate-400'
                                        } ${isHovered ? 'text-slate-900' : ''}`}
                                    >
                                        {stage.label}
                                    </span>

                                    {/* Date display */}
                                    <span
                                        className={`text-[10px] text-center block mt-0.5 transition-all duration-300 ${
                                            isCompleted
                                                ? 'text-emerald-500'
                                                : isCurrent
                                                  ? 'text-[#8B5CF6]'
                                                  : 'text-slate-400'
                                        }`}
                                    >
                                        {stage.date}
                                    </span>

                                    {/* Hover tooltip */}
                                    {isHovered && (
                                        <div className="absolute z-10 mt-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg shadow-xl whitespace-nowrap animate-in fade-in slide-in-from-top-1 duration-200">
                                            {isCompleted
                                                ? '✓ Completed'
                                                : isCurrent
                                                  ? '⚡ In Progress'
                                                  : '○ Pending'}
                                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
