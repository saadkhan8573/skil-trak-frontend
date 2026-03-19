import { WorkplaceCurrentStatus, WorkplaceStatusLabels } from '@utils'
import {
    IWorkplaceIndustries,
    WorkplaceWorkIndustriesType,
} from '@redux/queryTypes'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
export interface StatusStep {
    label: string
    completed: boolean
    current: boolean
    date: string | null
}

// ─────────────────────────────────────────────────────────────────────────────
// Sequences
// Each entry is  { label, statuses[] } so multiple internal statuses can
// collapse into a single visible step.
// ─────────────────────────────────────────────────────────────────────────────

/** Steps shown when the student or RTO provided/brought their own workplace */
const PROVIDED_WORKPLACE_STEPS: {
    label: string
    statuses: WorkplaceCurrentStatus[]
}[] = [
    {
        label: 'Student Added',
        statuses: [WorkplaceCurrentStatus.NotRequested],
    },
    {
        label: 'Provided Workplace Request',
        statuses: [WorkplaceCurrentStatus.Applied],
    },
    {
        label: 'Industry Eligibility Pending',
        statuses: [WorkplaceCurrentStatus.IndustryEligibility],
    },
    {
        label: 'Waiting for Industry',
        statuses: [WorkplaceCurrentStatus.AwaitingWorkplaceResponse],
    },
    {
        label: 'Agreement and Eligibility Pending',
        statuses: [WorkplaceCurrentStatus.AwaitingAgreementSigned],
    },
    {
        label: 'Agreement and Eligibility Signed',
        statuses: [WorkplaceCurrentStatus.AgreementSigned],
    },
    {
        label: 'Placement Started',
        statuses: [WorkplaceCurrentStatus.PlacementStarted],
    },
    {
        label: 'Completed',
        statuses: [WorkplaceCurrentStatus.Completed],
    },
    {
        label: 'Cancelled',
        statuses: [WorkplaceCurrentStatus.Cancelled],
    },
    {
        label: 'Terminated',
        statuses: [WorkplaceCurrentStatus.Terminated],
    },
]

/** Steps shown when the student needs the RTO/team to find a workplace */
const NEED_WORKPLACE_STEPS: {
    label: string
    statuses: WorkplaceCurrentStatus[]
}[] = [
    {
        label: 'Student Added',
        statuses: [WorkplaceCurrentStatus.NotRequested],
    },
    {
        label: 'Industry Sourcing',
        statuses: [
            WorkplaceCurrentStatus.Applied,
            WorkplaceCurrentStatus.CaseOfficerAssigned,
            WorkplaceCurrentStatus.Interview,
        ],
    },
    {
        label: 'Waiting for Student',
        statuses: [WorkplaceCurrentStatus.AwaitingStudentResponse],
    },
    {
        label: 'Waiting for RTO',
        statuses: [WorkplaceCurrentStatus.AwaitingRtoResponse],
    },
    {
        label: 'Waiting for Industry',
        statuses: [WorkplaceCurrentStatus.AwaitingWorkplaceResponse],
    },
    {
        label: 'Appointment',
        statuses: [WorkplaceCurrentStatus.AppointmentBooked],
    },
    {
        label: 'Agreement Pending',
        statuses: [WorkplaceCurrentStatus.AwaitingAgreementSigned],
    },
    {
        label: 'Agreement Signed',
        statuses: [WorkplaceCurrentStatus.AgreementSigned],
    },
    {
        label: 'Placement Started',
        statuses: [WorkplaceCurrentStatus.PlacementStarted],
    },
    {
        label: 'Completed',
        statuses: [WorkplaceCurrentStatus.Completed],
    },
    {
        label: 'Cancelled',
        statuses: [WorkplaceCurrentStatus.Cancelled],
    },
    {
        label: 'Terminated',
        statuses: [WorkplaceCurrentStatus.Terminated],
    },
]

const TERMINAL_STATUSES: WorkplaceCurrentStatus[] = [
    WorkplaceCurrentStatus.Cancelled,
    WorkplaceCurrentStatus.Terminated,
    WorkplaceCurrentStatus.Rejected,
    WorkplaceCurrentStatus.NoResponse,
    WorkplaceCurrentStatus.RejectedByStudent,
    WorkplaceCurrentStatus.RejectedByIndustry,
    WorkplaceCurrentStatus.RejectedByRto,
]

// ─────────────────────────────────────────────────────────────────────────────
// Date lookup
// ─────────────────────────────────────────────────────────────────────────────
const buildDateLookup = (
    workIndustry: WorkplaceWorkIndustriesType | undefined
): Partial<Record<WorkplaceCurrentStatus, string | null>> => ({
    [WorkplaceCurrentStatus.NotRequested]:
        ((workIndustry as any)?.createdAt as unknown as string) ?? null,
    [WorkplaceCurrentStatus.Applied]:
        (workIndustry?.appliedDate as unknown as string) ?? null,
    [WorkplaceCurrentStatus.CaseOfficerAssigned]:
        (workIndustry?.caseOfficerAssignedDate as unknown as string) ?? null,
    [WorkplaceCurrentStatus.Interview]:
        (workIndustry?.interviewDate as unknown as string) ?? null,
    [WorkplaceCurrentStatus.IndustryEligibility]:
        ((workIndustry as any)?.industryEligibilityDate as unknown as string) ??
        null,
    [WorkplaceCurrentStatus.AwaitingStudentResponse]:
        ((workIndustry as any)
            ?.awaitingStudentResponseDate as unknown as string) ?? null,
    [WorkplaceCurrentStatus.AwaitingRtoResponse]:
        ((workIndustry as any)?.awaitingRtoResponseDate as unknown as string) ??
        null,
    [WorkplaceCurrentStatus.AwaitingWorkplaceResponse]:
        (workIndustry?.awaitingWorkplaceResponseDate as unknown as string) ??
        null,
    [WorkplaceCurrentStatus.AppointmentBooked]:
        (workIndustry?.appointmentBookedDate as unknown as string) ?? null,
    [WorkplaceCurrentStatus.AwaitingAgreementSigned]:
        (workIndustry?.awaitingAgreementSignedDate as unknown as string) ??
        null,
    [WorkplaceCurrentStatus.AgreementSigned]:
        (workIndustry?.AgreementSignedDate as unknown as string) ?? null,
    [WorkplaceCurrentStatus.PlacementStarted]:
        (workIndustry?.placementStartedDate as unknown as string) ?? null,
    [WorkplaceCurrentStatus.Completed]:
        (workIndustry?.isCompletedDate as unknown as string) ?? null,
    [WorkplaceCurrentStatus.Cancelled]:
        (workIndustry?.cancelledDate as unknown as string) ?? null,
    [WorkplaceCurrentStatus.Terminated]:
        ((workIndustry as any)?.terminatedDate as unknown as string) ?? null,
})

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────
export const useStatusInfo = ({
    workplace,
    workIndustry,
}: {
    workplace: IWorkplaceIndustries
    workIndustry: WorkplaceWorkIndustriesType
}) => {
    const currentStatus = workplace?.currentStatus
    const isTerminal = TERMINAL_STATUSES.includes(currentStatus)

    // Pick the correct sequence based on workplace type
    const isProvidedWorkplace =
        !!(workplace as any)?.studentProvidedWorkplace ||
        !!(workplace as any)?.byExistingAbn

    const sequence = isProvidedWorkplace
        ? PROVIDED_WORKPLACE_STEPS
        : NEED_WORKPLACE_STEPS

    // Find which step index the current status belongs to
    const currentStepIndex = sequence.findIndex((step) =>
        step.statuses.includes(currentStatus)
    )

    const dateLookup = buildDateLookup(workIndustry)

    // Best date for a step = first non-null date among its mapped statuses
    const getStepDate = (step: {
        statuses: WorkplaceCurrentStatus[]
    }): string | null => {
        for (const s of step.statuses) {
            const d = dateLookup[s]
            if (d) return d
        }
        return null
    }

    /**
     * Build the step array for the UI.
     *
     * Terminal state  → every step completed (full progress bar)
     * Normal state    → steps before current = completed,
     *                   current step = current,
     *                   steps after  = pending
     * Unknown status  → all pending
     */
    const baseStatuses: StatusStep[] = sequence.map((step, idx) => {
        let completed = false
        let current = false

        if (currentStepIndex === -1) {
            // status not in sequence – leave all pending
        } else if (idx < currentStepIndex) {
            completed = true
        } else if (idx === currentStepIndex) {
            current = true
        }

        return {
            label: step.label,
            completed,
            current,
            date: getStepDate(step),
        }
    })

    // If terminal but not in the sequence (e.g., Rejected, No Response), append it
    let statuses = [...baseStatuses]
    if (isTerminal && currentStepIndex === -1) {
        statuses.push({
            label:
                (WorkplaceStatusLabels as any)[currentStatus] || currentStatus,
            completed: false,
            current: true,
            date: dateLookup[currentStatus] || null,
        })
    }

    // ── Derived values ────────────────────────────────────────────────────────
    const getCurrentStep = (): StatusStep | null => {
        if (isTerminal) return statuses[statuses.length - 1] ?? null
        return statuses.find((s) => s.current) ?? null
    }

    const getNextStep = (): StatusStep | null => {
        if (isTerminal) return null
        const idx = statuses.findIndex((s) => s.current)
        if (idx === -1 || idx === statuses.length - 1) return null
        return statuses[idx + 1]
    }

    const getPreviousStep = (): StatusStep | null => {
        if (isTerminal) return statuses[statuses.length - 2] ?? null
        const idx = statuses.findIndex((s) => s.current)
        if (idx <= 0) return null
        return statuses[idx - 1]
    }

    const currentStep = getCurrentStep()
    const completedCount = statuses.filter((s) => s.completed).length
    const totalCount = statuses.length

    const progressPercent =
        currentStep?.label === 'Completed' ||
        currentStep?.label === 'Schedule Completed'
            ? 100
            : Math.round((completedCount / totalCount) * 100)

    const getStatusArrays = () => ({
        completed: statuses.filter((s) => s.completed).map((s) => s.label),
        pending: statuses
            .filter((s) => !s.completed && !s.current)
            .map((s) => s.label),
    })

    return {
        statuses,
        totalCount,
        completedCount,
        progressPercent,
        nextStep: getNextStep(),
        previousStep: getPreviousStep(),
        currentStep,
        validStatus: statuses,
        statusArrays: getStatusArrays(),
        isProvidedWorkplace,
    }
}
