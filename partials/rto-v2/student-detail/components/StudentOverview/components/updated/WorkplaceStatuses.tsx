import { Badge } from '@components'
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui/tooltip'
import {
    getUserCredentials,
    WorkplaceCurrentStatus,
    WorkplaceStatusLabels,
} from '@utils'
import {
    Circle,
    CheckCircle,
    Clock,
    ExternalLink,
    Search,
    Sparkles,
    TrendingUp,
    User,
    X,
    Zap,
} from 'lucide-react'
import moment from 'moment'
import { useMemo, useState } from 'react'
import {
    IWorkplaceIndustries,
    WorkplaceWorkIndustriesType,
} from '@redux/queryTypes'
import { useStatusInfo } from '../../hooks/useStatusInfo'
import { RtoV2Api } from '@queries'
import { STATUS_CONTENT } from './statusMapping'
import { UserRoles } from '@constants'
import { useRouter } from 'next/router'

interface WorkplaceStatusesProps {
    workplace: IWorkplaceIndustries
    workIndustry: WorkplaceWorkIndustriesType | undefined
    onCancelRequested: () => void
}

export function WorkplaceStatuses({
    workplace,
    workIndustry,
    onCancelRequested,
}: WorkplaceStatusesProps) {
    const wpId = workplace?.id
    const router = useRouter()

    const progressData = RtoV2Api.PlacementRequests.useStudentPlacementProgress(
        wpId!,
        {
            skip: !wpId,
        }
    )

    const apiProgress = progressData?.data

    const { statuses: localStatuses, progressPercent: localProgressPercent } =
        useStatusInfo({
            workplace: workplace as any,
            workIndustry: workIndustry as WorkplaceWorkIndustriesType,
        })

    // Map dynamic statuses to components - Preferred API data, fallback to local logic
    const workflowSteps = useMemo(() => {
        if (apiProgress && apiProgress.length > 0) {
            // Find the last completed stage to treat it as "current" (In Progress)
            const lastCompletedIndex = [...apiProgress]
                .reverse()
                .findIndex((s: any) => s.completed)
            const currentStageIndex =
                lastCompletedIndex !== -1
                    ? apiProgress.length - 1 - lastCompletedIndex
                    : -1

            return apiProgress.map((status: any, index: number) => {
                let mappedStatus: 'completed' | 'current' | 'pending' =
                    'pending'

                if (currentStageIndex !== -1) {
                    if (index < currentStageIndex) {
                        mappedStatus = 'completed'
                    } else if (index === currentStageIndex) {
                        mappedStatus = 'current'
                    } else {
                        mappedStatus = 'pending'
                    }
                } else {
                    // Fallback to original logic if none are completed
                    mappedStatus = status.completed
                        ? 'completed'
                        : status.current
                          ? 'current'
                          : 'pending'
                }

                return {
                    label: status.stage,
                    status: mappedStatus,
                    icon:
                        mappedStatus === 'completed'
                            ? CheckCircle
                            : mappedStatus === 'current'
                              ? Clock
                              : Circle,
                    date: status.date
                        ? moment(status.date).format('DD/MM/YYYY')
                        : null,
                }
            })
        }

        if (localStatuses && localStatuses.length > 0) {
            return localStatuses.map((status: any) => ({
                label: status.label,
                status: status.completed
                    ? 'completed'
                    : status.current
                      ? 'current'
                      : 'pending',
                icon: status.completed
                    ? CheckCircle
                    : status.current
                      ? Clock
                      : Circle,
                date: status.date,
            }))
        }

        return []
    }, [apiProgress, localStatuses])

    const role = getUserCredentials()?.role

    const totalStages = workflowSteps.length || 1
    const currentStageIndex = workflowSteps.findIndex(
        (s) => s.status === 'current'
    )
    const currentStage =
        currentStageIndex !== -1
            ? currentStageIndex + 1
            : workflowSteps.filter((s) => s.status === 'completed').length

    // Use API progress percent if available, otherwise fallback to local calculation
    const currentProgressPercent = useMemo(() => {
        if (apiProgress && apiProgress.length > 0) {
            const completedCount = workflowSteps.filter(
                (s: any) => s.status === 'completed'
            ).length
            return Math.round((completedCount / totalStages) * 100)
        }
        return localProgressPercent || 0
    }, [apiProgress, localProgressPercent, workflowSteps, totalStages])

    const hasCancelledRequests = (workplace?.cancelledRequests?.length ?? 0) > 0

    const allowCancellationStatuses = [
        WorkplaceCurrentStatus.Applied,
        WorkplaceCurrentStatus.CaseOfficerAssigned,
        WorkplaceCurrentStatus.Interview,
        WorkplaceCurrentStatus.IndustryEligibility,
        WorkplaceCurrentStatus.AwaitingWorkplaceResponse,
        WorkplaceCurrentStatus.AwaitingStudentResponse,
        WorkplaceCurrentStatus.AwaitingRtoResponse,
        WorkplaceCurrentStatus.AppointmentBooked,
        WorkplaceCurrentStatus.AwaitingAgreementSigned,
    ]

    const canCancel =
        allowCancellationStatuses.includes(workplace?.currentStatus) &&
        !hasCancelledRequests

    const onSelectWorkplace = () => {
        if (role === UserRoles.RTO) {
            router.push(
                `/portals/rto/students-and-placements/placement-requests/${workplace.id}/${workplace.student?.id}`
            )
        } else if (role === UserRoles.ADMIN) {
            router.push(
                `/portals/admin/workplaces/${workplace.id}/${workplace.student?.id}`
            )
        } else if (role === UserRoles.SUBADMIN) {
            router.push(
                `/portals/sub-admin/tasks/workplace/${workplace.id}/${workplace.student?.id}`
            )
        }
    }
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
                    <Badge
                        variant="primaryNew"
                        Icon={ExternalLink}
                        text={'Visit Placement Profile'}
                        onClick={onSelectWorkplace}
                    />
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
                        onClick={canCancel ? onCancelRequested : undefined}
                        disabled={!canCancel}
                        className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${
                            !canCancel
                                ? 'text-slate-400 cursor-not-allowed opacity-60'
                                : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                        }`}
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
                    style={{ width: `${currentProgressPercent}%` }}
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

                        return (
                            <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                    <div
                                        className="flex flex-col items-center group/stage cursor-pointer"
                                        style={{
                                            width: `${100 / totalStages}%`,
                                        }}
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
                                            <StageIcon className="transition-all duration-300 w-5 h-5 group-hover/stage:w-6 group-hover/stage:h-6" />

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

                                        {/* Stage Label */}
                                        <div className="mt-3 group-hover/stage:transform group-hover/stage:scale-105 transition-all duration-300 text-center">
                                            <span
                                                className={`text-xs font-medium block transition-all duration-300 ${
                                                    isCompleted
                                                        ? 'text-emerald-600'
                                                        : isCurrent
                                                          ? 'text-[#6B46C1]'
                                                          : 'text-slate-400'
                                                } group-hover/stage:text-slate-900`}
                                            >
                                                {stage.label}
                                            </span>

                                            {/* Date display */}
                                            {stage.date && (
                                                <span
                                                    className={`text-[10px] block mt-0.5 transition-all duration-300 ${
                                                        isCompleted
                                                            ? 'text-emerald-500'
                                                            : isCurrent
                                                              ? 'text-[#8B5CF6]'
                                                              : 'text-slate-400'
                                                    }`}
                                                >
                                                    {stage.date}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <div className="flex flex-col gap-1 max-w-64">
                                        <p className="font-bold text-sm">
                                            {STATUS_CONTENT[stage.label]
                                                ?.title ||
                                                (isCompleted
                                                    ? '✓ Completed'
                                                    : isCurrent
                                                      ? '⚡ In Progress'
                                                      : '○ Pending')}
                                        </p>
                                        <p className="text-xs opacity-90 leading-relaxed">
                                            {STATUS_CONTENT[stage.label]
                                                ?.description || stage.label}
                                        </p>
                                        <p className="text-[10px] italic mt-1 text-white/70">
                                            {isCompleted
                                                ? 'Status: Completed'
                                                : isCurrent
                                                  ? 'Status: In Progress'
                                                  : 'Status: Pending'}
                                        </p>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
