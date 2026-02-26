import { Badge, Button } from '@components'
import { latestWpApprovalRequest } from '@partials/rto-v2'
import { useAppSelector } from '@redux/hooks'
import { Supervisor } from '@types'
import { WorkplaceCurrentStatus, WorkplaceStatusLabels } from '@utils'
import {
    Building2,
    CheckCircle,
    Circle,
    Clock,
    FileText,
    Plus,
    Search,
    Sparkles,
    TrendingUp,
    User,
    X,
    Zap,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { WorkplaceWorkIndustriesType } from 'redux/queryTypes'
import { useStatusInfo } from '../../hooks/useStatusInfo'
import { ResendApprovalEmailModal } from '../../modal/ResendApprovalEmailModal'
import { AbourtWorkplace } from './AbourtWorkplace'
import {
    WorkplaceApproveModal,
    WorkplaceCancelModal,
    WorkplaceRejectModal,
} from './modals'
import { StudentWorkplaceComplianceChecks } from './StudentWorkplaceComplianceChecks'
import { WorkplaceIndustryInfo } from './WorkplaceIndustryInfo'
import { WorkplaceMapView } from './WorkplaceMapView'

interface WorkplaceBioProps {
    selectedCourseId: string
}

export function WorkplaceBio({ selectedCourseId }: WorkplaceBioProps) {
    const { selectedWorkplace, studentDetail } = useAppSelector(
        (state) => state?.student
    )
    const workplace = selectedWorkplace

    const [isResendModalOpen, setIsResendModalOpen] = useState(false)
    const [hoveredStage, setHoveredStage] = useState<number | null>(null)
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [showApproveModal, setShowApproveModal] = useState(false)
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [cancelComment, setCancelComment] = useState('')
    const [approveComment, setApproveComment] = useState('')
    const [rejectComment, setRejectComment] = useState('')
    const [isCancelling, setIsCancelling] = useState(false)
    const [isApproving, setIsApproving] = useState(false)
    const [isRejecting, setIsRejecting] = useState(false)

    const latestWorkplaceApprovaleRequest = useMemo(() => {
        return latestWpApprovalRequest(
            workplace?.workplaceApprovaleRequest || []
        )
    }, [workplace?.workplaceApprovaleRequest])

    const workIndustry = workplace?.industries?.find(
        (i: WorkplaceWorkIndustriesType) => i?.applied
    )

    console.log('workIndustryworkIndustry', workIndustry)

    const industry =
        workIndustry?.industry ||
        latestWorkplaceApprovaleRequest?.industry ||
        workplace?.studentProvidedWorkplaceRequestApproval?.industry

    const supervisor: Supervisor =
        latestWorkplaceApprovaleRequest?.industry?.supervisors?.[0]

    const { statuses, progressPercent, completedCount, totalCount } =
        useStatusInfo({
            workplace: workplace as any,
            workIndustry: workIndustry as WorkplaceWorkIndustriesType,
        })

    if (!workplace) return null

    const handleCancelPlacement = () => {
        if (!cancelComment.trim()) {
            return // Don't submit without comment
        }

        setIsCancelling(true)

        // Simulate API call
        setTimeout(() => {
            setIsCancelling(false)
            setShowCancelModal(false)
            setCancelComment('')
            // Show success message or update UI
            alert(
                'Placement cancelled. Notifications sent to industry and student.'
            )
        }, 1500)
    }

    const handleApprovePlacement = () => {
        if (!approveComment.trim()) {
            return // Don't submit without comment
        }

        setIsApproving(true)

        // Simulate API call
        setTimeout(() => {
            setIsApproving(false)
            setShowApproveModal(false)
            setApproveComment('')
            // Show success message or update UI
            alert(
                'Placement approved. Notifications sent to industry and student.'
            )
        }, 1500)
    }

    const handleRejectPlacement = () => {
        if (!rejectComment.trim()) {
            return // Don't submit without comment
        }

        setIsRejecting(true)

        // Simulate API call
        setTimeout(() => {
            setIsRejecting(false)
            setShowRejectModal(false)
            setRejectComment('')
            // Show success message or update UI
            alert(
                'Placement rejected. Notifications sent to industry and student.'
            )
        }, 1500)
    }

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

    const isCompletedWP = [
        WorkplaceCurrentStatus.Completed,
        WorkplaceCurrentStatus.Cancelled,
        WorkplaceCurrentStatus.Rejected,
        WorkplaceCurrentStatus.Terminated,
        WorkplaceCurrentStatus.NoResponse,
        WorkplaceCurrentStatus.PlacementStarted,
    ].includes(workplace?.currentStatus)

    return (
        <div className="space-y-3">
            {/* Placement Management Header - Premium Design */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-[#6B46C1]/20 shadow-2xl shadow-purple-500/10 overflow-hidden group hover:shadow-3xl hover:shadow-purple-500/20 transition-all duration-500">
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-linear-to-br from-[#6B46C1]/5 via-transparent to-[#8B5CF6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                {/* Header with Actions */}
                <div className="relative bg-linear-to-r from-[#0D5468] via-[#044866] to-[#0D5468] px-4 py-2.5 flex items-center justify-between overflow-hidden">
                    {/* Animated background elements */}
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
                    <div className="absolute top-0 left-0 w-64 h-64 bg-[#6B46C1]/10 rounded-full blur-3xl -translate-x-32 -translate-y-32"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#8B5CF6]/10 rounded-full blur-3xl translate-x-32 translate-y-32"></div>

                    <div className="relative flex items-center gap-3">
                        <div className="relative group/icon">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover/icon:scale-110 group-hover/icon:rotate-6 transition-all duration-300 shadow-lg">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-linear-to-br from-[#F7A619] to-amber-500 rounded-full animate-pulse shadow-lg shadow-[#F7A619]/50"></div>
                        </div>
                        <div>
                            <h2 className="text-white text-xl font-semibold tracking-tight">
                                Placement Management
                            </h2>
                            <p className="text-white/70 text-sm flex items-center gap-1.5 mt-0.5">
                                <Sparkles className="w-3.5 h-3.5" />
                                Smart Workplace Matching
                                <Badge className="bg-emerald-500 text-white border-0 text-xs px-2 py-0.5 ml-1 shadow-lg animate-pulse">
                                    Active
                                </Badge>
                            </p>
                        </div>
                    </div>

                    <div className="relative flex items-center gap-2">
                        <Button
                            variant="primaryNew"
                            outline
                            className="bg-white/5 hover:bg-white/15 text-white border-white/20 hover:border-white/30 backdrop-blur-sm hover:scale-105 transition-all duration-300"
                        >
                            <FileText className="w-3.5 h-3.5 mr-1.5" />
                            VIEW ANSWERS
                        </Button>
                        {isCompletedWP && (
                            <Button
                                variant="primaryNew"
                                className="bg-[#F7A619] hover:bg-[#F7A619]/80 text-white border-0 shadow-lg shadow-[#F7A619]/30"
                            >
                                <Plus className="w-4 h-4" />
                                Add New
                            </Button>
                        )}
                    </div>
                </div>

                {/* Workflow Progress - Enhanced */}
                <div className="px-4 py-3 bg-linear-to-br from-slate-50 via-white to-blue-50/30 border-b border-slate-200/60 relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-linear-to-br from-[#6B46C1]/5 to-transparent rounded-full blur-3xl"></div>

                    <div className="relative flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Badge
                                Icon={Search}
                                className="bg-linear-to-r from-[#044866] to-[#0D5468] text-white px-2 py-0.5 shadow-lg shadow-[#044866]/30 hover:scale-105 transition-transform cursor-pointer text-xs"
                            >
                                {
                                    WorkplaceStatusLabels[
                                        workplace?.currentStatus
                                    ]
                                }
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
                                {industry?.createdAt
                                    ? new Date(
                                          industry.createdAt
                                      ).toLocaleDateString()
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
                                onClick={() => setShowCancelModal(true)}
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
                                        onMouseEnter={() =>
                                            setHoveredStage(index)
                                        }
                                        onMouseLeave={() =>
                                            setHoveredStage(null)
                                        }
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
                                                    isHovered
                                                        ? 'w-6 h-6'
                                                        : 'w-5 h-5'
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
                                                isHovered
                                                    ? 'transform scale-110'
                                                    : ''
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

                {/* Workplace Details - Two Column Premium Layout */}
                <div className="p-5 bg-linear-to-br from-white via-slate-50/50 to-white border-b border-slate-200/60">
                    <div className="grid lg:grid-cols-2 gap-5">
                        {/* Left Column - Workplace Info with Cards */}
                        <WorkplaceIndustryInfo
                            industry={industry}
                            supervisor={supervisor}
                            latestWorkplaceApprovaleRequest={
                                latestWorkplaceApprovaleRequest
                            }
                        />

                        {/* Right Column - Distance and Action Cards - Full Height Match */}
                        <div className="flex flex-col gap-2">
                            {/* Distance Card with Animation - Compact */}
                            <WorkplaceMapView
                                industry={industry}
                                distance={workIndustry?.distance || 0}
                                student={studentDetail!}
                            />

                            {/* Current Stage Actions Card - Flex-1 to Fill Remaining Space */}
                            <div className="relative group/action overflow-hidden rounded-lg bg-linear-to-br from-purple-50 via-white to-purple-50 border border-[#6B46C1]/30 shadow-md hover:shadow-xl transition-all duration-500 flex-1 flex flex-col">
                                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent translate-x-[-200%] group-hover/action:translate-x-[200%] transition-transform duration-1000"></div>

                                <div className="relative flex flex-col h-full p-4">
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="flex items-start gap-2.5 flex-1">
                                            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#6B46C1] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-purple-500/40 group-hover/action:scale-110 transition-transform shrink-0">
                                                <Clock className="w-4.5 h-4.5 text-white animate-pulse" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-slate-500 mb-1">
                                                    Take action to progress
                                                    placement
                                                </p>
                                                <p className="text-sm font-bold text-[#6B46C1] mb-2">
                                                    Awaiting Industry
                                                    Confirmation
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Buttons - Positioned Right */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            {/* Industry action buttons - show when "Waiting for industry" */}
                                            {workflowSteps.find(
                                                (s) =>
                                                    s.label ===
                                                    'Waiting for industry'
                                            )?.status === 'current' && (
                                                <>
                                                    <Button
                                                        onClick={() =>
                                                            setShowApproveModal(
                                                                true
                                                            )
                                                        }
                                                        className="h-8 px-3 text-xs bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all"
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        variant="error"
                                                        outline
                                                        onClick={() =>
                                                            setShowRejectModal(
                                                                true
                                                            )
                                                        }
                                                        className="h-8 px-3 text-xs border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300"
                                                    >
                                                        <X className="w-3.5 h-3.5 mr-1" />
                                                        Reject
                                                    </Button>
                                                </>
                                            )}

                                            {/* Student action buttons - show when "Waiting for student" */}
                                            {workflowSteps.find(
                                                (s) =>
                                                    s.label ===
                                                    'Waiting for student'
                                            )?.status === 'current' && (
                                                <>
                                                    <Button
                                                        onClick={() =>
                                                            setShowApproveModal(
                                                                true
                                                            )
                                                        }
                                                        className="h-8 px-3 text-xs bg-linear-to-r from-[#6B46C1] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#A78BFA] text-white shadow-md hover:shadow-lg transition-all"
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        variant="error"
                                                        outline
                                                        onClick={() =>
                                                            setShowRejectModal(
                                                                true
                                                            )
                                                        }
                                                        className="h-8 px-3 text-xs border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300"
                                                    >
                                                        <X className="w-3.5 h-3.5 mr-1" />
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description with flex-grow to push to bottom */}
                                    <div className="grow flex items-end">
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            The workplace will review your
                                            placement request shortly
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* About the Workplace - Premium Biography Section */}
                <AbourtWorkplace bio={industry?.bio} />
            </div>

            {/* Compliance Checks - Compact Version */}
            <StudentWorkplaceComplianceChecks />

            <WorkplaceCancelModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={handleCancelPlacement}
                comment={cancelComment}
                setComment={setCancelComment}
                isLoading={isCancelling}
            />

            <WorkplaceApproveModal
                isOpen={showApproveModal}
                onClose={() => setShowApproveModal(false)}
                onConfirm={handleApprovePlacement}
                comment={approveComment}
                setComment={setApproveComment}
                isLoading={isApproving}
            />

            <WorkplaceRejectModal
                isOpen={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                onConfirm={handleRejectPlacement}
                comment={rejectComment}
                setComment={setRejectComment}
                isLoading={isRejecting}
            />

            <ResendApprovalEmailModal
                open={isResendModalOpen}
                onOpenChange={setIsResendModalOpen}
                approvalId={latestWorkplaceApprovaleRequest?.id}
            />
        </div>
    )
}
