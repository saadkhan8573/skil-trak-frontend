import { EmptyData, TechnicalError } from '@components'
import { WorkplaceHookProvider } from '@partials/common/StudentProfileDetail/components/Workplace/hooks'
import { RtoV2Api } from '@queries'
import { setSelectedWorkplace, setStudentDetail, useAppDispatch } from '@redux'
import { Student } from '@types'
import { motion } from 'framer-motion'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import {
    EnhancedComplianceChecks,
    EnhancedHighlightedTasksCard,
    EnhancedIndustryDetailsCard,
    EnhancedPlacementProgramCard,
    EnhancedRtoRequirementsCard,
    EnhancedStatusNotesCard,
    EnhancedStudentPreferencesChecklistCard,
    // PremiumCurrentActionsCard,
    StudentQuickSummaryCard,
} from './components/cards'
import { CleanHeader } from './components/CleanHeader'
import { FindWorkplaceSection } from './components/FindWorkplaceSection'
import { PremiumWorkflowTracker } from './components/header'
import {
    needsWorkplaceStages,
    needsWorkplaceStagesEnum,
    providedWorkplaceStages,
} from './components/workplaceStages'
import { RejectionModal, ScheduleModal } from './modal'
import {
    CardsSkeleton,
    HeaderSkeleton,
    WorkflowTrackerSkeleton,
} from './skeletonLoader'
import { PremiumCurrentActionsCard } from '../placement-request-detail-v2'

interface StatusNote {
    status: string
    note: string
    timestamp: string
    user: string
}

export const PlacementRequestDetail = () => {
    const dispatch = useAppDispatch()

    const router = useRouter()
    const wpId = router?.query?.id
    const studentId = router.query.studentId
    const placementRequestsDetails =
        RtoV2Api.PlacementRequests.useStudentPlacementProfileDetails(wpId, {
            skip: !wpId,
        })

    const [currentStatus, setCurrentStatus] = useState<string>(
        needsWorkplaceStagesEnum.REQUEST_GENERATED
    )

    const [showScheduleDialog, setShowScheduleDialog] = useState(false)
    const [showRejectionDialog, setShowRejectionDialog] = useState(false)
    const [showFindWorkplaceSection, setShowFindWorkplaceSection] =
        useState(false)

    const [appointmentDate, setAppointmentDate] = useState('')
    const [rejectionReason, setRejectionReason] = useState('')

    const [pendingStatus, setPendingStatus] = useState<string>('')
    const [statusNote, setStatusNote] = useState('')
    const [statusNotes, setStatusNotes] = useState<StatusNote[]>([
        {
            status: 'Student Added',
            note: 'Initial student profile created in the system',
            timestamp: '7 Nov 2025, 9:00 AM',
            user: 'Lena',
        },
    ])
    const [selectedRequirements, setSelectedRequirements] = useState<string[]>([
        'acute-care',
    ])
    const [verifiedPreferences, setVerifiedPreferences] = useState<number[]>([])

    const [isCancelled, setIsCancelled] = useState(false)
    const [cancellationReason, setCancellationReason] = useState('')
    const [isPlacementStarted, setIsPlacementStarted] = useState(false)

    // Sticky scroll state
    const leftPanelRef = useRef<HTMLDivElement>(null)
    const rightPanelRef = useRef<HTMLDivElement>(null)
    const [leftPanelSticky, setLeftPanelSticky] = useState(false)
    const [rightPanelSticky, setRightPanelSticky] = useState(false)

    const studentDetails =
        RtoV2Api.PlacementRequests.useStudentPlacementDetails(studentId, {
            skip: !studentId,
        })

    // Workflow for students who need a workplace
    const workplaceType = placementRequestsDetails?.data
        ?.studentProvidedWorkplace
        ? 'provided'
        : 'needs'
    const workflowStages =
        workplaceType === 'provided'
            ? providedWorkplaceStages
            : needsWorkplaceStages
    const progressData = RtoV2Api.PlacementRequests.useStudentPlacementProgress(
        Number(wpId),
        {
            skip: !wpId,
        }
    )

    const highlightedAndRtoReq =
        RtoV2Api.PlacementRequests.useIndustryPlacementHighlightedTasks(wpId, {
            skip: !wpId,
        })
    const progress = progressData?.data ?? []

    const lastTrueIndex = progress
        ?.map((s: any) => s.completed)
        ?.lastIndexOf(true)
    const wpCurrentStatus = progress[lastTrueIndex]

    useEffect(() => {
        if (studentDetails?.isSuccess && studentDetails?.data) {
            dispatch(setStudentDetail(studentDetails?.data))
        }

        return () => {
            dispatch(setStudentDetail(null as unknown as Student))
        }
    }, [studentDetails])

    useEffect(() => {
        if (
            placementRequestsDetails?.isSuccess &&
            placementRequestsDetails?.data
        ) {
            dispatch(setSelectedWorkplace(placementRequestsDetails?.data))
        }

        return () => {
            dispatch(setSelectedWorkplace(null))
        }
    }, [placementRequestsDetails])

    const getCurrentStageIndex = () => {
        const index = progressData?.data?.findIndex(
            (s: any) => s.stage === currentStatus
        )
        return typeof index === 'number' && index !== -1 ? index : 0
    }

    const studentPreferences = [
        {
            id: 1,
            question: 'Preferred workplace location?',
            answer: 'Within 15km of home (Melbourne CBD area)',
            category: 'Location & Accessibility',
        },
        {
            id: 2,
            question: 'Preferred commute method?',
            answer: 'Public Transport (Train/Tram)',
            category: 'Location & Accessibility',
        },
        {
            id: 3,
            question: 'Access to own transport?',
            answer: 'No, relies on public transport',
            category: 'Location & Accessibility',
        },
        {
            id: 4,
            question: 'Willing to work in regional areas?',
            answer: 'No, prefer metro Melbourne',
            category: 'Location & Accessibility',
        },
        {
            id: 5,
            question: 'Availability for placement?',
            answer: 'Monday to Friday, 8:00 AM - 4:00 PM',
            category: 'Schedule & Availability',
        },
        {
            id: 6,
            question: 'Preferred shift type?',
            answer: 'Day shifts (morning/afternoon)',
            category: 'Schedule & Availability',
        },
        {
            id: 7,
            question: 'Flexibility for weekend work?',
            answer: 'Available for occasional weekend shifts if needed',
            category: 'Schedule & Availability',
        },
        {
            id: 8,
            question: 'Current employment status?',
            answer: 'Part-time employed (evenings only)',
            category: 'Schedule & Availability',
        },
        {
            id: 9,
            question: 'Desired workplace type?',
            answer: 'Hospital - Aged Care Unit',
            category: 'Workplace Preferences',
        },
        {
            id: 10,
            question: 'Preferred facility size?',
            answer: 'Medium to large facility (50+ beds)',
            category: 'Workplace Preferences',
        },
        {
            id: 11,
            question: 'Special interests in aged care?',
            answer: 'Activities and recreation therapy',
            category: 'Workplace Preferences',
        },
        {
            id: 12,
            question: 'Any specific learning objectives?',
            answer: 'Gain experience in dementia care and palliative care',
            category: 'Learning & Development',
        },
        {
            id: 13,
            question: 'Previous healthcare experience?',
            answer: 'Yes, 6 months as healthcare assistant',
            category: 'Learning & Development',
        },
        {
            id: 14,
            question: 'Career goals post-qualification?',
            answer: 'Work in residential aged care facility',
            category: 'Learning & Development',
        },
        {
            id: 15,
            question: 'Technology proficiency level?',
            answer: 'Advanced - comfortable with electronic health records',
            category: 'Skills & Capabilities',
        },
        {
            id: 16,
            question: 'Language skills?',
            answer: 'English (Native), Mandarin (Conversational)',
            category: 'Skills & Capabilities',
        },
        {
            id: 17,
            question: 'Any medical conditions to consider?',
            answer: 'None',
            category: 'Health & Wellbeing',
        },
        {
            id: 18,
            question: 'Any allergies or dietary requirements?',
            answer: 'No allergies',
            category: 'Health & Wellbeing',
        },
        {
            id: 19,
            question: 'Cultural considerations?',
            answer: 'Respectful of diverse backgrounds, no restrictions',
            category: 'Additional Information',
        },
        {
            id: 20,
            question: 'Join Talent Pool for future opportunities?',
            answer: 'Yes, opted in',
            category: 'Additional Information',
        },
    ]

    const requestStatusChange = (newStatus: string) => {
        setPendingStatus(newStatus)
        setStatusNote('')
    }

    const handleSubmitRejection = () => {
        setShowRejectionDialog(false)
        requestStatusChange(needsWorkplaceStagesEnum.REQUEST_GENERATED)
    }

    const toggleRequirement = (id: string) => {
        setSelectedRequirements((prev) =>
            prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
        )
    }

    const togglePreferenceVerification = (id: number) => {
        setVerifiedPreferences((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        )

        if (!verifiedPreferences.includes(id)) {
            // Preference verified and matched
        }
    }
    const wpApprovalStatus =
        placementRequestsDetails?.data?.workplaceApprovaleRequest?.filter(
            (req: any) =>
                req?.status !== 'rejected' &&
                req?.rtoApprovalStatus !== 'rejected'
        )

    const handleCancelRequest = (reason: string) => {
        setIsCancelled(true)
        setCancellationReason(reason)

        const cancelNote: StatusNote = {
            status: 'Request Cancelled',
            note: `Placement request cancelled. Reason: ${reason}`,
            timestamp: moment().format('D MMM YYYY, h:mm a'),
            user: 'Lena',
        }

        setStatusNotes((prev) => [...prev, cancelNote])
    }

    // Sticky scroll detection
    useEffect(() => {
        const handleScroll = () => {
            if (!leftPanelRef.current || !rightPanelRef.current) return

            const leftHeight = leftPanelRef.current.offsetHeight
            const rightHeight = rightPanelRef.current.offsetHeight
            const scrollTop = window.scrollY
            const windowHeight = window.innerHeight
            const headerHeight = 80 // Approximate header height

            // Calculate when each panel should become sticky
            const leftBottomReached =
                scrollTop + windowHeight >= leftHeight + headerHeight
            const rightBottomReached =
                scrollTop + windowHeight >= rightHeight + headerHeight

            // If left is shorter, make it sticky when it reaches bottom while right is still scrolling
            if (leftHeight < rightHeight) {
                setLeftPanelSticky(leftBottomReached && !rightBottomReached)
                setRightPanelSticky(false)
            }
            // If right is shorter, make it sticky when it reaches bottom while left is still scrolling
            else if (rightHeight < leftHeight) {
                setRightPanelSticky(rightBottomReached && !leftBottomReached)
                setLeftPanelSticky(false)
            }
            // If they're equal height, neither should be sticky
            else {
                setLeftPanelSticky(false)
                setRightPanelSticky(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        window.addEventListener('resize', handleScroll)

        // Initial check
        handleScroll()

        return () => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('resize', handleScroll)
        }
    }, [workplaceType, currentStatus]) // Re-run when content might change
    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-100/50">
            {placementRequestsDetails?.isError ? <TechnicalError /> : null}
            {placementRequestsDetails.isLoading ? (
                <div className="space-y-0">
                    <HeaderSkeleton />
                    <WorkflowTrackerSkeleton />
                    <CardsSkeleton />
                </div>
            ) : placementRequestsDetails?.isSuccess &&
              placementRequestsDetails?.data ? (
                <>
                    {/* Clean Modern Header */}
                    <CleanHeader
                        isCancelled={isCancelled}
                        isPlacementStarted={isPlacementStarted}
                        workplaceType={workplaceType}
                        onCancelSuccess={handleCancelRequest}
                        workflowStages={progress}
                        currentStatus={wpCurrentStatus}
                        getCurrentStageIndex={getCurrentStageIndex}
                        student={studentDetails?.data}
                        wpCurrStatus={
                            placementRequestsDetails?.data?.currentStatus
                        }
                    />

                    {/* Premium Workflow Tracker */}
                    <PremiumWorkflowTracker
                        workplace={placementRequestsDetails?.data}
                        workIndustry={
                            placementRequestsDetails?.data?.industries?.[0]
                        }
                    />

                    {/* Main Content */}
                    <div className="p-4">
                        <div className="max-w-475 mx-auto">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Left Panel - Student Information */}
                                <motion.div
                                    ref={leftPanelRef}
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{
                                        duration: 0.5,
                                        ease: 'easeOut',
                                    }}
                                    className={`space-y-7 ${
                                        leftPanelSticky
                                            ? 'sticky top-24 self-start'
                                            : ''
                                    }`}
                                >
                                    <StudentQuickSummaryCard
                                        studentDetails={studentDetails?.data}
                                    />

                                    <EnhancedComplianceChecks />
                                    <EnhancedPlacementProgramCard
                                        toggleRequirement={toggleRequirement}
                                    />
                                    {workplaceType === 'needs' && (
                                        <EnhancedStudentPreferencesChecklistCard
                                            verifiedPreferences={
                                                verifiedPreferences
                                            }
                                            studentPreferences={
                                                studentPreferences
                                            }
                                            togglePreferenceVerification={
                                                togglePreferenceVerification
                                            }
                                        />
                                    )}
                                </motion.div>

                                {/* Right Panel - Enhanced Industry Workflow */}
                                <motion.div
                                    ref={rightPanelRef}
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{
                                        duration: 0.5,
                                        ease: 'easeOut',
                                    }}
                                    className={`space-y-7 ${
                                        rightPanelSticky
                                            ? 'sticky top-24 self-start'
                                            : ''
                                    }`}
                                >
                                    {/* Enhanced Industry Details */}
                                    <EnhancedIndustryDetailsCard
                                        workplaceType={workplaceType}
                                        workplace={
                                            placementRequestsDetails?.data
                                        }
                                        student={studentDetails?.data}
                                    />

                                    {/* Premium Current Actions Card */}
                                    <WorkplaceHookProvider
                                        student={studentDetails?.data}
                                    >
                                        <PremiumCurrentActionsCard
                                            isCancelled={isCancelled}
                                            isPlacementStarted={
                                                isPlacementStarted
                                            }
                                            cancellationReason={
                                                cancellationReason
                                            }
                                            currentStatus={wpCurrentStatus}
                                            setStatusNote={setStatusNote}
                                            appointmentDate={appointmentDate}
                                            setShowScheduleDialog={
                                                setShowScheduleDialog
                                            }
                                            setPendingStatus={setPendingStatus}
                                            workplace={
                                                placementRequestsDetails?.data
                                            }
                                            workplaceType={workplaceType}
                                            student={studentDetails?.data}
                                        />
                                    </WorkplaceHookProvider>
                                    {/* Find Workplace Section - Only shown when Industry Sourcing */}
                                    {wpCurrentStatus?.stage ===
                                        needsWorkplaceStagesEnum.REQUEST_GENERATED &&
                                        wpApprovalStatus?.length === 0 && (
                                            <FindWorkplaceSection
                                                isExpanded={
                                                    showFindWorkplaceSection
                                                }
                                                onToggle={() =>
                                                    setShowFindWorkplaceSection(
                                                        !showFindWorkplaceSection
                                                    )
                                                }
                                                workplace={
                                                    placementRequestsDetails?.data
                                                }
                                            />
                                        )}

                                    {/* Enhanced Highlighted Tasks */}
                                    <EnhancedHighlightedTasksCard
                                        data={highlightedAndRtoReq?.data || []}
                                    />
                                    {/* Enhanced RTO Requirements */}
                                    <EnhancedRtoRequirementsCard
                                        data={highlightedAndRtoReq?.data || []}
                                    />

                                    {/* Enhanced Status Notes */}
                                    <EnhancedStatusNotesCard
                                        rtoUserId={
                                            studentDetails?.data?.rto?.user?.id
                                        }
                                    />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                    {/* Schedule Modal */}
                    <ScheduleModal
                        open={showScheduleDialog}
                        onClose={() => setShowScheduleDialog(false)}
                        student={studentDetails?.data}
                    />

                    {/* Rejection Modal */}
                    <RejectionModal
                        open={showRejectionDialog}
                        onClose={() => setShowRejectionDialog(false)}
                        reason={rejectionReason}
                        onReasonChange={setRejectionReason}
                        onConfirm={handleSubmitRejection}
                    />
                </>
            ) : placementRequestsDetails?.isSuccess ? (
                <EmptyData title="No Placement Request Details Found" />
            ) : null}
        </div>
    )
}
