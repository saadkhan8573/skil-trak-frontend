import { AuthorizedUserComponent, Badge, Permissions } from '@components'
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
    Zap,
    Building2,
    Briefcase,
    X,
} from 'lucide-react'
import moment from 'moment'
import { useMemo } from 'react'
import { useRouter } from 'next/router'

import {
    IWorkplaceIndustries,
    WorkplaceWorkIndustriesType,
} from '@redux/queryTypes'
import { useStatusInfo } from '../../hooks/useStatusInfo'
import { STATUS_CONTENT } from './statusMapping'
import { UserRoles } from '@constants'
import { TerminateWorkplaceButton } from './TerminateWorkplaceButton'
import { CancelWorkplaceButton } from './CancelWorkplaceButton'
import { ManualUpdateStatusDropdown } from './ManualUpdateStatusDropdown'

import { CoordinatorFeedbackModal } from './CoordinatorFeedbackModal'
import {
    AddFeedbackModal,
    PlacementFeedbackModal,
    ViewPlacementFeedbackModal,
} from './modals'
import { FeedbackButton } from '@partials/common/StudentProfileDetail/feedbackForm/components'
import {
    StarRating,
    ActionButton,
    Typography,
    usePermissions,
} from '@components'
import { CommonApi } from '@queries'
import { useAppSelector } from '@redux'
import { checkJsxVisibility } from '@utils'
import { useState, Activity } from 'react'
import { PermissionType } from '@types'

interface WorkplaceStatusesProps {
    workplace: IWorkplaceIndustries
    workIndustry: WorkplaceWorkIndustriesType | undefined
}

export function WorkplaceStatuses({
    workplace,
    workIndustry,
}: WorkplaceStatusesProps) {
    const wpId = workplace?.id
    const router = useRouter()
    const hasPermission = usePermissions([
        PermissionType.CHANGE_WORKPLACE_STATUS,
    ])

    const student = useAppSelector((state) => state.student.studentDetail)

    // Placement feedback eligible courses
    const courseSchedules = CommonApi.Feedback.useGetCourseSchedules(
        { userId: student?.user?.id },
        { skip: !student?.user?.id }
    )
    const eligibleCourses =
        courseSchedules?.data?.courses?.filter(
            (course: any) => course.message === 'eligible for feedback'
        ) || []

    const [showFeedbackModal, setShowFeedbackModal] = useState(false)
    const [showAddFeedbackModal, setShowAddFeedbackModal] = useState(false)
    const [placementFeedbackCourseId, setPlacementFeedbackCourseId] = useState<
        string | null
    >(null)
    const [showViewPlacementFeedback, setShowViewPlacementFeedback] =
        useState(false)

    const { statuses: localStatuses, progressPercent: localProgressPercent } =
        useStatusInfo({
            workplace: workplace as any,
            workIndustry: workIndustry as WorkplaceWorkIndustriesType,
        })

    // Build workflow steps from frontend-driven statuses only
    const workflowSteps = useMemo(() => {
        if (!localStatuses || localStatuses.length === 0) return []

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
            date: status.date ? moment(status.date).format('DD/MM/YYYY') : null,
        }))
    }, [localStatuses])

    const role = getUserCredentials()?.role

    const totalStages = workflowSteps.length || 1
    const currentStageIndex = workflowSteps.findIndex(
        (s) => s.status === 'current'
    )
    const currentStage =
        currentStageIndex !== -1
            ? currentStageIndex + 1
            : workflowSteps.filter((s) => s.status === 'completed').length

    const currentProgressPercent = localProgressPercent || 0

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

    const resolvedIndustry = useMemo(() => {
        if (
            Array.isArray(workplace?.industries) &&
            workplace?.industries?.length > 0
        ) {
            return workplace?.industries?.[0]?.industry
        }

        const approvalIndustry =
            workplace?.studentProvidedWorkplaceRequestApproval?.industry

        if (approvalIndustry?.id && approvalIndustry?.showOnboarding) {
            return approvalIndustry
        }

        return null
    }, [workplace])
    const onboardingUrl = useMemo(() => {
        if (!resolvedIndustry?.id) return null

        if (role === UserRoles.SUBADMIN) {
            return `/portals/sub-admin/students/${router.query.id}/provide-workplace-detail/${resolvedIndustry.id}`
        }

        if (role === UserRoles.ADMIN) {
            return `/portals/admin/student/${router.query.id}/provide-workplace-detail/${resolvedIndustry.id}`
        }

        return null
    }, [resolvedIndustry, role, router.query.id])

    return (
        <div className="px-4 py-3 bg-linear-to-br from-slate-50 via-white to-blue-50/30 border-b border-slate-200/60 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-linear-to-br from-[#6B46C1]/5 to-transparent rounded-full blur-3xl"></div>

            <div className="relative flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Activity mode={checkJsxVisibility(hasPermission)}>
                        <ManualUpdateStatusDropdown
                            workplaceId={Number(workplace.id)}
                            currentStatus={workplace.currentStatus}
                        />
                    </Activity>
                    <Activity mode={checkJsxVisibility(!hasPermission)}>
                        <Badge
                            Icon={Search}
                            className="bg-linear-to-r from-[#044866] to-[#0D5468] text-white px-2 py-0.5 shadow-lg shadow-[#044866]/30 hover:scale-105 transition-transform text-xs"
                        >
                            {WorkplaceStatusLabels[workplace?.currentStatus]}
                        </Badge>
                    </Activity>

                    <Badge
                        Icon={
                            workplace?.studentProvidedWorkplace
                                ? Briefcase
                                : Building2
                        }
                        className={`text-white px-2 py-0.5 shadow-lg transition-transform text-xs ${
                            workplace?.studentProvidedWorkplace
                                ? 'bg-linear-to-r from-violet-500 to-purple-600 shadow-purple-500/30'
                                : 'bg-linear-to-r from-orange-500 to-amber-600 shadow-orange-500/30'
                        }`}
                    >
                        {workplace?.studentProvidedWorkplace ||
                        workplace?.byExistingAbn
                            ? 'Provided Workplace'
                            : 'Need Workplace'}
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
                    {resolvedIndustry?.showOnboarding && onboardingUrl && (
                        <Badge
                            Icon={ExternalLink}
                            className="bg-linear-to-r from-indigo-500 to-blue-600 text-white px-2 py-0.5 shadow-lg hover:scale-105 transition-transform text-[10px] cursor-pointer"
                            onClick={() => router.push(onboardingUrl)}
                        >
                            Onboarding
                        </Badge>
                    )}
                </div>
                <div className="relative flex items-center gap-1.5 text-xs text-slate-500 bg-white/60 backdrop-blur-sm px-2 py-1 rounded-lg border border-slate-200">
                    <Permissions
                        permission={PermissionType.VIEW_PLACEMENT_PROFILE}
                    >
                        <Badge
                            variant="primaryNew"
                            Icon={ExternalLink}
                            text={'Visit Placement Profile'}
                            onClick={onSelectWorkplace}
                        />
                    </Permissions>
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

                    <Permissions permission={[PermissionType.CANCEL_WORKPLACE]}>
                        <CancelWorkplaceButton
                            workplaceId={Number(wpId)}
                            canCancel={canCancel}
                        />
                    </Permissions>
                    <AuthorizedUserComponent roles={[UserRoles.SUBADMIN]}>
                        <Permissions
                            permission={PermissionType.TERMINATE_PLACEMENT}
                        >
                            <TerminateWorkplaceButton
                                workplaceId={Number(wpId)}
                                isTerminated={workplace?.isTerminated}
                                isCancelled={
                                    workplace?.currentStatus ===
                                    WorkplaceCurrentStatus.Cancelled
                                }
                            />
                        </Permissions>
                    </AuthorizedUserComponent>
                </div>
            </div>

            {/* Feedback Actions Row */}
            {workplace.id && (
                <div className="flex items-center gap-x-3 mb-4 px-2 py-1.5 bg-white/60 backdrop-blur-sm rounded-lg border border-slate-200">
                    {/* Coordinators Feedback Block */}
                    {workplace?.studentFeedBacks &&
                    workplace?.studentFeedBacks?.length > 0 ? (
                        <div className="flex items-center gap-x-2 border-r border-slate-300 pr-3">
                            <ActionButton
                                variant={'link'}
                                onClick={() => setShowFeedbackModal(true)}
                            >
                                Coordinators Feedback
                            </ActionButton>
                            <div className="flex items-center gap-x-1">
                                <StarRating
                                    count={5}
                                    value={
                                        workplace?.studentFeedBacks?.[0]?.rating
                                    }
                                    edit={false}
                                />
                                <Typography
                                    variant="label"
                                    className="text-xs text-slate-700"
                                >
                                    {workplace?.studentFeedBacks?.[0]?.rating}
                                </Typography>
                            </div>
                        </div>
                    ) : (
                        <AuthorizedUserComponent
                            roles={[UserRoles.ADMIN, UserRoles.SUBADMIN]}
                        >
                            <Activity
                                mode={checkJsxVisibility(
                                    workplace?.currentStatus ===
                                        WorkplaceCurrentStatus.AgreementSigned
                                )}
                            >
                                <div className="border-r border-slate-300 pr-3">
                                    <ActionButton
                                        variant={'link'}
                                        onClick={() =>
                                            setShowAddFeedbackModal(true)
                                        }
                                    >
                                        Add Feedback
                                    </ActionButton>
                                </div>
                            </Activity>
                        </AuthorizedUserComponent>
                    )}

                    {/* Placement Feedback Block */}
                    <div className="flex items-center gap-x-2">
                        <AuthorizedUserComponent
                            roles={[UserRoles.ADMIN, UserRoles.SUBADMIN]}
                        >
                            <Activity
                                mode={checkJsxVisibility(
                                    eligibleCourses?.length > 0
                                )}
                            >
                                <FeedbackButton
                                    eligibleCourses={eligibleCourses}
                                    onPlacementFeedback={(courseId) => {
                                        setPlacementFeedbackCourseId(courseId)
                                    }}
                                />
                            </Activity>
                        </AuthorizedUserComponent>
                        <AuthorizedUserComponent
                            roles={[
                                UserRoles.ADMIN,
                                UserRoles.SUBADMIN,
                                UserRoles.RTO,
                            ]}
                        >
                            {workplace?.studentFeedBacks &&
                            workplace?.studentFeedBacks?.length > 0 ? (
                                <ActionButton
                                    variant={'link'}
                                    onClick={() =>
                                        setShowViewPlacementFeedback(true)
                                    }
                                >
                                    View Placement Feedback
                                </ActionButton>
                            ) : null}
                        </AuthorizedUserComponent>
                    </div>
                </div>
            )}

            {/* Progress Bar with Steps - Ultra Premium */}
            <div className="relative pb-1">
                {/* Cancelled Overlay */}
                {workplace?.currentStatus ===
                    WorkplaceCurrentStatus.Cancelled && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg backdrop-blur-sm bg-white/60">
                        <div className="flex items-center gap-2">
                            <X className="w-5 h-5 text-red-500" />
                            <span className="font-semibold text-red-500 tracking-wide">
                                Workplace Cancelled
                            </span>
                        </div>
                    </div>
                )}
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

            {workplace.id && (
                <>
                    <CoordinatorFeedbackModal
                        wpId={workplace.id}
                        open={showFeedbackModal}
                        onOpenChange={setShowFeedbackModal}
                    />
                    <AddFeedbackModal
                        open={showAddFeedbackModal}
                        onOpenChange={setShowAddFeedbackModal}
                        wpId={workplace.id}
                        industryId={workplace?.industries?.[0]?.industry?.id!}
                        student={student}
                        course={workplace?.courses?.[0]!}
                        id={workplace?.industries?.[0]?.id}
                        isStartPlacement={false}
                    />
                    {placementFeedbackCourseId && (
                        <PlacementFeedbackModal
                            open={!!placementFeedbackCourseId}
                            onOpenChange={(open) => {
                                if (!open) setPlacementFeedbackCourseId(null)
                            }}
                            stdUserId={student?.user?.id!}
                            courseId={placementFeedbackCourseId}
                        />
                    )}
                    <ViewPlacementFeedbackModal
                        open={showViewPlacementFeedback}
                        onOpenChange={setShowViewPlacementFeedback}
                        userId={student?.user?.id!}
                    />
                </>
            )}
        </div>
    )
}
