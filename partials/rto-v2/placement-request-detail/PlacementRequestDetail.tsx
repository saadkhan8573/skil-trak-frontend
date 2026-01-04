import { EmptyData, LoadingAnimation, TechnicalError } from '@components'
import { WorkplaceHookProvider } from '@partials/common/StudentProfileDetail/components/Workplace/hooks'
import { RtoV2Api } from '@queries'
import { motion } from 'framer-motion'
import { CheckCircle2, Clock } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import {
    CollapsibleStudentDetailsCard,
    EnhancedComplianceChecks,
    EnhancedHighlightedTasksCard,
    EnhancedIndustryDetailsCard,
    EnhancedPlacementProgramCard,
    EnhancedRtoRequirementsCard,
    EnhancedStatusNotesCard,
    EnhancedStudentPreferencesChecklistCard,
    IndustryMatchValidationCard,
    PremiumCurrentActionsCard,
    StudentQuickSummaryCard,
} from './components/cards'
import { CleanHeader } from './components/CleanHeader'
import { FindWorkplaceSection } from './components/FindWorkplaceSection'
import { PremiumWorkflowTracker } from './components/header'
import {
    needsWorkplaceStages,
    needsWorkplaceStagesEnum,
    providedWorkplaceStages,
    providedWorkplaceStagesEnum,
} from './components/workplaceStages'
import {
    AgreementModal,
    CancelRequestModal,
    ManualNoteModal,
    PlacementProgramsModal,
    ProofUploadModal,
    ProvidedWorkplaceModal,
    QuickActionsModal,
    RejectionModal,
    ScheduleModal,
    StatusNotesModal,
} from './modal'
import { useWorkplace } from '@hooks'
import {
    HeaderSkeleton,
    WorkflowTrackerSkeleton,
    CardsSkeleton,
} from './skeletonLoader'

interface StatusNote {
    status: string
    note: string
    timestamp: string
    user: string
}

export const PlacementRequestDetail = () => {
    // const [workplaceType, setWorkplaceType] = useState<
    //     'needs' | 'provided' | null
    // >(null)
    const router = useRouter()
    const wpId = router?.query?.id
    const studentId = router.query.studentId
    const placementRequestsDetails =
        RtoV2Api.PlacementRequests.useStudentPlacementProfileDetails(wpId, {
            skip: !wpId,
        })
    // const industryAvailability = RtoV2Api.Industries.useIndustryAvailabilityV2(
    //     Number(router.query.id),
    //     { skip: !router.query.id }
    // )
    const [currentStatus, setCurrentStatus] =
        useState<string>('Request Generated')

    const [showScheduleDialog, setShowScheduleDialog] = useState(false)
    const [showRejectionDialog, setShowRejectionDialog] = useState(false)
    const [showStatusNotesDialog, setShowStatusNotesDialog] = useState(false)
    const [showPlacementReqDialog, setShowPlacementReqDialog] = useState(false)
    const [showFindWorkplaceSection, setShowFindWorkplaceSection] =
        useState(false)
    const [showProvidedWorkplaceDialog, setShowProvidedWorkplaceDialog] =
        useState(false)
    const [showProofUploadDialog, setShowProofUploadDialog] = useState(false)
    const [appointmentDate, setAppointmentDate] = useState('')
    const [rejectionReason, setRejectionReason] = useState('')
    const [selectedIndustry, setSelectedIndustry] = useState(
        "St Vincent's Hospital"
    )
    const [scheduleStartDate, setScheduleStartDate] = useState('')
    const [scheduleEndDate, setScheduleEndDate] = useState('')
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
    const [showStudentDetails, setShowStudentDetails] = useState(false)
    const [verifiedPreferences, setVerifiedPreferences] = useState<number[]>([])
    const [recentlyVerified, setRecentlyVerified] = useState<number[]>([])
    const [abnSearch, setAbnSearch] = useState('')
    const [industryFound, setIndustryFound] = useState<boolean | null>(null)
    const [proofFile, setProofFile] = useState<File | null>(null)
    const [proofSkipped, setProofSkipped] = useState(false)

    // New Industry Form State
    const [newIndustryForm, setNewIndustryForm] = useState({
        industryName: '',
        abn: '',
        businessAddress: '',
        website: '',
        contactName: '',
        contactPhone: '',
        contactEmail: '',
        offeredCourses: 'cert3-nursing',
        additionalInfo: '',
    })
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
    const [isCancelled, setIsCancelled] = useState(false)
    const [isPlacementStarted, setIsPlacementStarted] = useState(false)
    const [showCancelDialog, setShowCancelDialog] = useState(false)
    const [cancellationReason, setCancellationReason] = useState('')
    const [confirmedTasks, setConfirmedTasks] = useState<{
        [key: number]: { date: string; person: string }
    }>({})
    const [confirmedRtoReqs, setConfirmedRtoReqs] = useState<{
        [key: number]: { date: string; person: string }
    }>({})

    // Manual Notes & Quick Actions
    const [newManualNote, setNewManualNote] = useState('')
    const [showManualNoteDialog, setShowManualNoteDialog] = useState(false)
    const [appointmentMissed, setAppointmentMissed] = useState(false)
    const [requestCreatedTime] = useState(new Date('2025-11-19T10:00:00')) // Simulated creation time
    const [showQuickActionsDialog, setShowQuickActionsDialog] = useState(false)
    const [selectedQuickAction, setSelectedQuickAction] = useState<string>('')
    const [quickActionReason, setQuickActionReason] = useState('')

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
        wpId,
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
    // const lastTrueIndex = progress?.data
    //     ?.map((s: any) => s?.completed)
    //     ?.lastIndexOf(true)
    // const wpCurrentStatus = progress?.data[lastTrueIndex]
    const getCurrentStageIndex = () => {
        const index = progressData?.data?.findIndex(
            (s: any) => s.stage === currentStatus
        )
        return index !== -1 ? index : 0
    }

    const complianceChecks = [
        {
            name: 'Police Check',
            status: 'verified',
            expiry: '12/31/2025',
            icon: CheckCircle2,
            color: 'text-emerald-600',
        },
        {
            name: 'NDIS Check',
            status: 'pending',
            expiry: 'Pending',
            icon: Clock,
            color: 'text-amber-600',
        },
        {
            name: 'Working with Children',
            status: 'verified',
            expiry: '10/12/2025',
            icon: CheckCircle2,
            color: 'text-emerald-600',
        },
    ]

    const placementRequirements = [
        { id: 'acute-care', category: 'Acute Care', completed: 28, total: 40 },
        {
            id: 'community',
            category: 'Community Health',
            completed: 15,
            total: 40,
        },
        { id: 'emergency', category: 'Emergency', completed: 0, total: 40 },
    ]

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
        setShowStatusNotesDialog(true)
    }

    const confirmStatusChange = () => {
        if (!statusNote.trim()) {
            // Please add a status check note before proceeding
            return
        }

        const now = new Date()
        const timestamp = now.toLocaleString('en-AU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })

        const newNote: StatusNote = {
            status: pendingStatus,
            note: statusNote,
            timestamp: timestamp,
            user: 'Lena',
        }

        setStatusNotes([newNote, ...statusNotes])
        setCurrentStatus(pendingStatus)

        // Auto-verify preferences based on workflow stage
        autoVerifyPreferences(pendingStatus)

        setShowStatusNotesDialog(false)
        setStatusNote('')
        // Status updated to: ${pendingStatus}
    }

    const autoVerifyPreferences = (status: string) => {
        let prefsToVerify: number[] = []
        let message = ''

        switch (status) {
            case 'Request Generated':
                // Verify basic student information preferences
                prefsToVerify = [13, 17, 18, 19, 20] // Previous experience, medical, allergies, cultural, talent pool
                message = '5 basic preferences auto-verified'
                break

            case 'Waiting for RTO':
                // Industry matched - verify location and workplace preferences
                prefsToVerify = [1, 2, 3, 4, 9, 10] // Location, commute, transport, regional, workplace type, facility size
                message = '6 location & workplace preferences auto-verified'
                break

            case 'Waiting for Student':
                // Student reviewing - verify learning objectives
                prefsToVerify = [11, 12, 14] // Special interests, learning objectives, career goals
                message = '3 learning preferences auto-verified'
                break

            case 'Appointment':
                // Appointment booked - verify availability and schedule
                prefsToVerify = [5, 6, 7, 8] // Availability, shift type, weekend flexibility, employment status
                message = '4 schedule preferences auto-verified'
                break

            case 'Agreement Signed':
                // Agreement signed - verify skills and capabilities
                prefsToVerify = [15, 16] // Technology proficiency, language skills
                message = '2 skill preferences auto-verified'
                break

            case 'Placement Started':
                // All preferences should be verified by now
                prefsToVerify = [
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                    18, 19, 20,
                ]
                message = 'All preferences verified - placement active'
                break

            case 'Completed':
                // Ensure everything is verified
                prefsToVerify = [
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                    18, 19, 20,
                ]
                message = 'All preferences confirmed - placement completed'
                break
        }

        if (prefsToVerify.length > 0) {
            setVerifiedPreferences((prev) => {
                const newPrefs = [...new Set([...prev, ...prefsToVerify])]
                const newlyAdded = prefsToVerify.filter(
                    (p) => !prev.includes(p)
                )

                if (newlyAdded.length > 0) {
                    // Track recently verified for animation
                    setRecentlyVerified(newlyAdded)

                    // Clear recently verified after animation
                    setTimeout(() => {
                        setRecentlyVerified([])
                    }, 3000)

                    // ${newlyAdded.length} new preference(s) matched with workplace
                }

                return newPrefs
            })
        }
    }
    const handleSearchIndustry = () => {
        // Simulate search - in real app this would call an API
        setTimeout(() => {
            // For demo, randomly decide if industry is found
            const found = abnSearch.length > 5 // Simple logic for demo
            setIndustryFound(found)

            // If not found, pre-fill ABN in the form
            if (!found) {
                setNewIndustryForm((prev) => ({
                    ...prev,
                    abn: formatABN(abnSearch),
                }))
            }

            // Keep the dialog open to show results inline
            // If found, user can click "Continue to Proof Upload"
            // If not found, form will appear inline
        }, 1000)
    }

    const handleSubmitProof = () => {
        const wasSkipped = proofSkipped
        setShowProofUploadDialog(false)
        setShowProvidedWorkplaceDialog(false)
        setProofSkipped(false)

        if (wasSkipped && proofFile) {
            // Proof of employment uploaded successfully
        }

        // Only change status if we're not in a later stage (i.e., this is initial upload)
        if (!wasSkipped) {
            if (industryFound) {
                // Skip to Waiting for Industry (existing industry)
                requestStatusChange('Waiting for Industry')
            } else {
                // Go to Industry Eligibility Pending (new industry)
                requestStatusChange('Industry Eligibility Pending')
            }
        }
    }

    const handleSkipProof = () => {
        setShowProofUploadDialog(false)
        setShowProvidedWorkplaceDialog(false)
        setProofSkipped(true)

        // Proof of employment can be uploaded later

        if (industryFound) {
            // Skip to Waiting for Industry (existing industry)
            requestStatusChange('Waiting for Industry')
        } else {
            // Go to Industry Eligibility Pending (new industry)
            requestStatusChange('Industry Eligibility Pending')
        }
    }

    // Form validation functions
    const validateForm = () => {
        const errors: { [key: string]: string } = {}

        if (!newIndustryForm.industryName.trim()) {
            errors.industryName = 'Industry name is required'
        }

        if (!newIndustryForm.abn.trim()) {
            errors.abn = 'ABN is required'
        } else {
            const abnDigits = newIndustryForm.abn.replace(/\s/g, '')
            if (!/^\d{11}$/.test(abnDigits)) {
                errors.abn = 'Invalid ABN format (should be 11 digits)'
            }
        }

        if (!newIndustryForm.businessAddress.trim()) {
            errors.businessAddress = 'Business address is required'
        }

        if (!newIndustryForm.contactName.trim()) {
            errors.contactName = 'Contact person name is required'
        }

        if (!newIndustryForm.contactPhone.trim()) {
            errors.contactPhone = 'Contact phone is required'
        } else if (!/^[\d\s\(\)\+\-]+$/.test(newIndustryForm.contactPhone)) {
            errors.contactPhone = 'Invalid phone number format'
        }

        if (!newIndustryForm.contactEmail.trim()) {
            errors.contactEmail = 'Contact email is required'
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newIndustryForm.contactEmail)
        ) {
            errors.contactEmail = 'Invalid email format'
        }

        if (
            newIndustryForm.website &&
            !/^https?:\/\/.+/.test(newIndustryForm.website)
        ) {
            errors.website = 'Website must start with http:// or https://'
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const formatABN = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 11)
        if (digits.length <= 2) return digits
        if (digits.length <= 5)
            return `${digits.slice(0, 2)} ${digits.slice(2)}`
        if (digits.length <= 8)
            return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(
                5
            )}`
        return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(
            5,
            8
        )} ${digits.slice(8)}`
    }

    const handleSubmitNewIndustry = () => {
        if (!validateForm()) {
            const errorCount = Object.keys(formErrors).length
            // Form validation failed - Please correct errors before submitting
            return
        }

        // Industry details submitted for HOD review

        setShowProvidedWorkplaceDialog(false)
        setShowProofUploadDialog(true)
        setIndustryFound(false)
    }

    const handleSubmitRejection = () => {
        setShowRejectionDialog(false)
        requestStatusChange('Request Generated')
    }

    // Manual Notes Handler
    const handleAddManualNote = () => {
        if (!newManualNote.trim()) {
            // Please enter a note
            return
        }

        const note = {
            status: 'Manual Note',
            note: newManualNote,
            timestamp: new Date().toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            }),
            user: 'Lena',
        }

        setStatusNotes((prev) => [note, ...prev])
        setNewManualNote('')
        setShowManualNoteDialog(false)

        // Note added successfully
    }
    // Check if cancellation is within 48 hours
    const canCancelRequest = () => {
        const now = new Date()
        const hoursSinceCreation =
            (now.getTime() - requestCreatedTime.getTime()) / (1000 * 60 * 60)
        return hoursSinceCreation <= 48
    }

    // Quick Actions Handler
    const handleQuickAction = (action: string) => {
        setSelectedQuickAction(action)
        setShowQuickActionsDialog(true)
    }

    const handleSubmitQuickAction = () => {
        if (!quickActionReason.trim()) {
            // Please provide a reason
            return
        }

        const actionNote = {
            status: selectedQuickAction,
            note: quickActionReason,
            timestamp: new Date().toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            }),
            user: 'Lena',
        }

        setStatusNotes((prev) => [actionNote, ...prev])

        // Update status based on action
        if (selectedQuickAction === 'On Hold') {
            setCurrentStatus('On Hold')
            // Placement put on hold
        } else if (selectedQuickAction === 'Cancelled') {
            setIsCancelled(true)
            setCurrentStatus('Cancelled')
            // Placement cancelled
        } else if (selectedQuickAction === 'Terminated') {
            setCurrentStatus('Terminated')
            // Placement terminated
        }

        setShowQuickActionsDialog(false)
        setQuickActionReason('')
        setSelectedQuickAction('')
    }

    const handleScheduleConfirmed = () => {
        if (!scheduleStartDate || !scheduleEndDate) {
            // Please select start and end dates
            return
        }
        setShowScheduleDialog(false)
        requestStatusChange('Placement Started')
        // Trigger placement started state
        setTimeout(() => handleStartPlacement(), 500)
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

    const confirmTaskWithWorkplace = (taskIndex: number) => {
        const now = new Date()
        const dateStamp = now.toLocaleString('en-AU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })

        setConfirmedTasks((prev) => ({
            ...prev,
            [taskIndex]: {
                date: dateStamp,
                person: 'Lena Rodriguez',
            },
        }))

        // Task confirmed with workplace
    }

    const confirmRtoReqWithWorkplace = (reqIndex: number) => {
        const now = new Date()
        const dateStamp = now.toLocaleString('en-AU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })

        setConfirmedRtoReqs((prev) => ({
            ...prev,
            [reqIndex]: {
                date: dateStamp,
                person: 'Lena Rodriguez',
            },
        }))

        // Requirement confirmed with workplace
    }

    const handleCancelRequest = () => {
        if (!cancellationReason.trim()) {
            // Please provide a reason for cancellation
            return
        }

        setIsCancelled(true)
        setShowCancelDialog(false)

        const cancelNote: StatusNote = {
            status: 'Request Cancelled',
            note: `Placement request cancelled. Reason: ${cancellationReason}`,
            timestamp: new Date().toLocaleString('en-AU', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            }),
            user: 'Lena',
        }

        setStatusNotes((prev) => [...prev, cancelNote])

        // Placement request has been cancelled - All workflow actions are now disabled
    }

    const handleStartPlacement = () => {
        setIsPlacementStarted(true)

        const startNote: StatusNote = {
            status: 'Placement Started',
            note: 'Student has commenced workplace placement',
            timestamp: new Date().toLocaleString('en-AU', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            }),
            user: 'Lena',
        }

        setStatusNotes((prev) => [...prev, startNote])

        // Placement has started - Student is now active in workplace
    }

    const showIndustryDetails = [
        needsWorkplaceStagesEnum.REQUEST_GENERATED &&
            placementRequestsDetails?.data?.workplaceApprovaleRequest?.length >
                0,
        needsWorkplaceStagesEnum.WAITING_FOR_RTO,
        needsWorkplaceStagesEnum.WAITING_FOR_STUDENT,
        providedWorkplaceStagesEnum.INDUSTRY_ELIGIBILITY_PENDING,
        providedWorkplaceStagesEnum.AGREEMENT_AND_ELIGIBILITY_PENDING,
        needsWorkplaceStagesEnum.WAITING_FOR_INDUSTRY,
        needsWorkplaceStagesEnum.APPOINTMENT,
        needsWorkplaceStagesEnum.AGREEMENT_PENDING,
        needsWorkplaceStagesEnum.AGREEMENT_SIGNED,
        needsWorkplaceStagesEnum.PLACEMENT_STARTED,
        needsWorkplaceStagesEnum.SCHEDULE_COMPLETED,
        needsWorkplaceStagesEnum.COMPLETED,
    ].includes(wpCurrentStatus?.stage)

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100/50">
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
                        canCancelRequest={canCancelRequest}
                        handleQuickAction={handleQuickAction}
                        setShowCancelDialog={setShowCancelDialog}
                        setShowManualNoteDialog={setShowManualNoteDialog}
                        workflowStages={progress}
                        currentStatus={wpCurrentStatus}
                        getCurrentStageIndex={getCurrentStageIndex}
                    />

                    {/* Premium Workflow Tracker */}
                    <PremiumWorkflowTracker
                        workplaceType={workplaceType}
                        workflowStages={workflowStages}
                        currentStatus={wpCurrentStatus}
                        placementRequest={placementRequestsDetails?.data}
                    />

                    {/* Main Content */}
                    <div className="px-8 py-8">
                        <div className="max-w-[1900px] mx-auto">
                            <div className="grid grid-cols-2 gap-10">
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
                                        appointmentMissed={appointmentMissed}
                                        selectedRequirements={
                                            selectedRequirements
                                        }
                                        placementRequirements={
                                            placementRequirements
                                        }
                                        studentDetails={studentDetails?.data}
                                    />
                                    <CollapsibleStudentDetailsCard
                                        setShowStudentDetails={
                                            setShowStudentDetails
                                        }
                                        showStudentDetails={showStudentDetails}
                                        studentDetails={studentDetails?.data}
                                    />
                                    <EnhancedComplianceChecks
                                        complianceChecks={complianceChecks}
                                    />
                                    <EnhancedPlacementProgramCard
                                        selectedRequirements={
                                            selectedRequirements
                                        }
                                        placementRequirements={
                                            placementRequirements
                                        }
                                        toggleRequirement={toggleRequirement}
                                        setShowPlacementReqDialog={
                                            setShowPlacementReqDialog
                                        }
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
                                            recentlyVerified={recentlyVerified}
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
                                    {/* Industry Match Validation - Shown from workflow start through completion */}
                                    {/* {workplaceType === 'needs' && (
                                        <IndustryMatchValidationCard
                                            wpCurrentStatus={wpCurrentStatus}
                                            workplaceType={workplaceType}
                                        />
                                    )} */}

                                    {/* Enhanced Industry Details */}
                                    <EnhancedIndustryDetailsCard
                                        // showIndustryDetails={
                                        //     showIndustryDetails
                                        // }
                                        selectedIndustry={selectedIndustry}
                                        workplaceType={workplaceType}
                                        proofSkipped={proofSkipped}
                                        // industry={
                                        //     placementRequestsDetails?.data
                                        //         ?.industries?.[0]?.industry
                                        // }
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
                                            setShowStatusNotesDialog={
                                                setShowStatusNotesDialog
                                            }
                                            selectedIndustry={selectedIndustry}
                                            proofSkipped={proofSkipped}
                                            setShowProofUploadDialog={
                                                setShowProofUploadDialog
                                            }
                                            setShowRejectionDialog={
                                                setShowRejectionDialog
                                            }
                                            appointmentDate={appointmentDate}
                                            setShowScheduleDialog={
                                                setShowScheduleDialog
                                            }
                                            setShowProvidedWorkplaceDialog={
                                                setShowProvidedWorkplaceDialog
                                            }
                                            setPendingStatus={setPendingStatus}
                                            setCurrentStatus={setCurrentStatus}
                                            workplace={
                                                placementRequestsDetails?.data
                                            }
                                            workplaceType={workplaceType}
                                            student={studentDetails?.data}
                                        />
                                    </WorkplaceHookProvider>
                                    {/* Find Workplace Section - Only shown when Request Generated */}
                                    {wpCurrentStatus?.stage ===
                                        'Request Generated' &&
                                        placementRequestsDetails?.data
                                            ?.workplaceApprovaleRequest
                                            ?.length === 0 && (
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
                                        confirmedTasks={confirmedTasks}
                                        confirmTaskWithWorkplace={
                                            confirmTaskWithWorkplace
                                        }
                                        data={highlightedAndRtoReq?.data || []}
                                    />
                                    {/* Enhanced RTO Requirements */}
                                    <EnhancedRtoRequirementsCard
                                        confirmedRtoReqs={confirmedRtoReqs}
                                        confirmRtoReqWithWorkplace={
                                            confirmRtoReqWithWorkplace
                                        }
                                        data={highlightedAndRtoReq?.data || []}
                                    />

                                    {/* Enhanced Status Notes */}
                                    <EnhancedStatusNotesCard />
                                </motion.div>

                                {/* Right Panel - Industry Information & Workflow */}
                                {/* <IndustryInformationWorkflowCard
                            showIndustryDetails={showIndustryDetails}
                        /> */}
                            </div>
                        </div>
                    </div>

                    {/* Appointment Modal */}
                    {/* <AppointmentModal
                open={showAppointmentDialog}
                onClose={() => setShowAppointmentDialog(false)}
                appointmentDate={appointmentDate}
                onAppointmentDateChange={setAppointmentDate}
                onConfirm={handleBookAppointment}
            /> */}
                    {/* <AppointmentBookingModal
                        isOpen={showAppointmentDialog}
                        onClose={setShowAppointmentDialog}
                        availability={industryAvailability?.data}
                    /> */}

                    {/* Agreement Modal */}

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

                    {/* Status Notes Modal */}
                    <StatusNotesModal
                        open={showStatusNotesDialog}
                        onClose={() => setShowStatusNotesDialog(false)}
                        currentStatus={currentStatus}
                        pendingStatus={pendingStatus}
                        note={statusNote}
                        onNoteChange={setStatusNote}
                        onConfirm={confirmStatusChange}
                    />

                    {/* Placement Programs Modal */}
                    <PlacementProgramsModal
                        open={showPlacementReqDialog}
                        onClose={() => setShowPlacementReqDialog(false)}
                        placementRequirements={placementRequirements}
                        selectedRequirements={selectedRequirements}
                    />

                    {/* Provided Workplace Search Modal */}
                    <ProvidedWorkplaceModal
                        open={showProvidedWorkplaceDialog}
                        onClose={() => {
                            setShowProvidedWorkplaceDialog(false)
                            setIndustryFound(null)
                            setAbnSearch('')
                            setNewIndustryForm({
                                industryName: '',
                                abn: '',
                                businessAddress: '',
                                website: '',
                                contactName: '',
                                contactPhone: '',
                                contactEmail: '',
                                offeredCourses: 'cert3-nursing',
                                additionalInfo: '',
                            })
                            setFormErrors({})
                        }}
                        abnSearch={abnSearch}
                        onAbnSearchChange={setAbnSearch}
                        industryFound={industryFound}
                        onIndustryFoundChange={setIndustryFound}
                        newIndustryForm={newIndustryForm}
                        onNewIndustryFormChange={setNewIndustryForm}
                        formErrors={formErrors}
                        onFormErrorsChange={setFormErrors}
                        onSearch={handleSearchIndustry}
                        onSubmitNewIndustry={handleSubmitNewIndustry}
                        onContinueToProof={() => {
                            setShowProvidedWorkplaceDialog(false)
                            setShowProofUploadDialog(true)
                        }}
                        formatABN={formatABN}
                    />

                    {/* Proof of Employment Upload Modal */}
                    <ProofUploadModal
                        open={showProofUploadDialog}
                        onClose={() => {
                            setShowProofUploadDialog(false)
                            setProofFile(null)
                        }}
                        proofFile={proofFile}
                        onProofFileChange={setProofFile}
                        onSubmit={handleSubmitProof}
                        onSkip={handleSkipProof}
                    />

                    {/* Cancel Request Modal */}
                    <CancelRequestModal
                        open={showCancelDialog}
                        onClose={() => {
                            setShowCancelDialog(false)
                            setCancellationReason('')
                        }}
                        cancellationReason={cancellationReason}
                        onCancellationReasonChange={setCancellationReason}
                        onConfirm={handleCancelRequest}
                    />

                    {/* Manual Note Modal */}
                    <ManualNoteModal
                        open={showManualNoteDialog}
                        onClose={() => {
                            setShowManualNoteDialog(false)
                            setNewManualNote('')
                        }}
                        note={newManualNote}
                        onNoteChange={setNewManualNote}
                        onConfirm={handleAddManualNote}
                    />

                    {/* Quick Actions Modal */}
                    <QuickActionsModal
                        open={showQuickActionsDialog}
                        onClose={() => {
                            setShowQuickActionsDialog(false)
                            setQuickActionReason('')
                            setSelectedQuickAction('')
                        }}
                        selectedAction={selectedQuickAction}
                        reason={quickActionReason}
                        onReasonChange={setQuickActionReason}
                        onConfirm={handleSubmitQuickAction}
                    />
                </>
            ) : placementRequestsDetails?.isSuccess ? (
                <EmptyData title="No Placement Request Details Found" />
            ) : null}
        </div>
    )
}
