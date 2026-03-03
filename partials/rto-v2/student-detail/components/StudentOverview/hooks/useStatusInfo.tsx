import { WorkplaceCurrentStatus } from '@utils'
import {
    IWorkplaceIndustries,
    WorkplaceWorkIndustriesType,
} from '@redux/queryTypes'

export const useStatusInfo = ({
    workplace,
    workIndustry,
}: {
    workplace: IWorkplaceIndustries
    workIndustry: WorkplaceWorkIndustriesType
}) => {
    const statusMapping: Record<WorkplaceCurrentStatus, string> = {
        [WorkplaceCurrentStatus.NotRequested]: 'Student Added',
        [WorkplaceCurrentStatus.Applied]: 'Request Generated',
        [WorkplaceCurrentStatus.CaseOfficerAssigned]: 'Industry sourcing',
        [WorkplaceCurrentStatus.Interview]: 'Industry sourcing',
        [WorkplaceCurrentStatus.AwaitingStudentResponse]: 'Waiting for Student',
        [WorkplaceCurrentStatus.AwaitingRtoResponse]: 'Waiting for RTO',
        [WorkplaceCurrentStatus.AwaitingWorkplaceResponse]:
            'Waiting for Industry',
        [WorkplaceCurrentStatus.IndustryEligibility]:
            'Industry Eligibility Check',
        [WorkplaceCurrentStatus.AppointmentBooked]: 'Appointment',
        [WorkplaceCurrentStatus.AwaitingAgreementSigned]: 'Agreement Pending',
        [WorkplaceCurrentStatus.AgreementSigned]: 'Agreement Signed',
        [WorkplaceCurrentStatus.PlacementStarted]: 'Placement Started',
        [WorkplaceCurrentStatus.Completed]: 'Schedule Completed',
        [WorkplaceCurrentStatus.Cancelled]: 'Cancelled',
        [WorkplaceCurrentStatus.NoResponse]: 'No Response',
        [WorkplaceCurrentStatus.Rejected]: 'Rejected',
        [WorkplaceCurrentStatus.Terminated]: 'Terminated',
        [WorkplaceCurrentStatus.RejectedByStudent]: 'Rejected by Student',
        [WorkplaceCurrentStatus.RejectedByIndustry]: 'Rejected by Industry',
        [WorkplaceCurrentStatus.RejectedByRto]: 'Rejected by RTO',
    }

    const statusOrder = [
        WorkplaceCurrentStatus.NotRequested,
        WorkplaceCurrentStatus.Applied,
        WorkplaceCurrentStatus.CaseOfficerAssigned,
        WorkplaceCurrentStatus.Interview,
        WorkplaceCurrentStatus.AwaitingStudentResponse,
        WorkplaceCurrentStatus.AwaitingRtoResponse,
        WorkplaceCurrentStatus.AwaitingWorkplaceResponse,
        WorkplaceCurrentStatus.AppointmentBooked,
        WorkplaceCurrentStatus.AwaitingAgreementSigned,
        WorkplaceCurrentStatus.AgreementSigned,
        WorkplaceCurrentStatus.PlacementStarted,
        WorkplaceCurrentStatus.Completed,
        WorkplaceCurrentStatus.Cancelled,
        WorkplaceCurrentStatus.Terminated,
        WorkplaceCurrentStatus.NoResponse,
    ]

    const terminalStatuses = [
        WorkplaceCurrentStatus.Cancelled,
        WorkplaceCurrentStatus.Terminated,
        WorkplaceCurrentStatus.Rejected,
        WorkplaceCurrentStatus.NoResponse,
    ]

    const isTerminal = terminalStatuses.includes(workplace?.currentStatus)

    const terminalStatusesLabels = ['Rejected', 'No Response']

    const getStatusArrays = (
        currentStatus: WorkplaceCurrentStatus
    ): {
        completed: string[]
        pending: string[]
    } => {
        const currentIndex = statusOrder.indexOf(currentStatus)

        if (isTerminal) {
            return {
                completed: Array.from(
                    new Set(statusOrder.map((s) => statusMapping[s]))
                ),
                pending: [],
            }
        }

        if (currentIndex === -1) {
            return {
                completed: [],
                pending: Array.from(
                    new Set(
                        statusOrder
                            ?.filter(
                                (status) => !terminalStatuses.includes(status)
                            )
                            .map(
                                (s: WorkplaceCurrentStatus) => statusMapping[s]
                            )
                    )
                ),
            }
        }

        const completed = Array.from(
            new Set(
                statusOrder
                    .slice(0, currentIndex + 1) // Include current status in completed
                    .map(
                        (status: WorkplaceCurrentStatus) =>
                            statusMapping[status]
                    )
            )
        )

        const pending = Array.from(
            new Set(
                statusOrder
                    ?.filter((status) => !terminalStatuses.includes(status))
                    .slice(currentIndex + 1) // All statuses after current
                    .map(
                        (status: WorkplaceCurrentStatus) =>
                            statusMapping[status]
                    )
            )
        ).filter((label) => !completed.includes(label)) // Ensure no overlap if current label maps to multiple internal statuses

        return { completed, pending }
    }

    // Function to generate statuses based on current status
    const generateStatuses = (
        currentStatus: WorkplaceCurrentStatus,
        dateData?: any
    ) => {
        const currentIndex = statusOrder.indexOf(currentStatus)
        const currentLabel = statusMapping[currentStatus]

        const mappedStatuses: any[] = []
        const seenLabels = new Set<string>()

        statusOrder.forEach((status, index) => {
            const label = statusMapping[status]
            if (terminalStatusesLabels.includes(label)) return

            if (!seenLabels.has(label)) {
                seenLabels.add(label)

                // Determine if this step is current or completed
                // It's current if the currentLabel matches this step's label
                // It's completed if currentLabel matches a LATER step in the sequence
                const isCurrent = label === currentLabel

                // Find all indices for this label to check if we've passed it
                const labelIndices = statusOrder
                    .map((s, i) => (statusMapping[s] === label ? i : -1))
                    .filter((i) => i !== -1)
                const lastIndexForLabel = Math.max(...labelIndices)

                const isCompleted = index < currentIndex && !isCurrent

                mappedStatuses.push({
                    label,
                    completed: isCompleted,
                    current: isCurrent,
                    date: dateData?.[status] || null,
                })
            } else {
                // Update existing group's date if available
                const existing = mappedStatuses.find((s) => s.label === label)
                if (dateData?.[status] && !existing.date) {
                    existing.date = dateData[status]
                }
                // Update current status if this internal status is the current one
                if (index === currentIndex) {
                    existing.current = true
                    existing.completed = false
                }
            }
        })

        return mappedStatuses
    }

    const statuses = generateStatuses(workplace?.currentStatus, {
        [WorkplaceCurrentStatus.NotRequested]: workIndustry?.appliedDate,
        [WorkplaceCurrentStatus.Applied]: workIndustry?.appliedDate,
        [WorkplaceCurrentStatus.CaseOfficerAssigned]:
            workIndustry?.caseOfficerAssignedDate,
        [WorkplaceCurrentStatus.Interview]: workIndustry?.interviewDate,
        [WorkplaceCurrentStatus.AwaitingStudentResponse]: (workIndustry as any)
            ?.awaitingStudentResponseDate,
        [WorkplaceCurrentStatus.AwaitingRtoResponse]: (workIndustry as any)
            ?.awaitingRtoResponseDate,
        [WorkplaceCurrentStatus.AwaitingWorkplaceResponse]:
            workIndustry?.awaitingWorkplaceResponseDate,
        [WorkplaceCurrentStatus.AppointmentBooked]:
            workIndustry?.appointmentBookedDate,
        [WorkplaceCurrentStatus.AwaitingAgreementSigned]:
            workIndustry?.awaitingAgreementSignedDate,
        [WorkplaceCurrentStatus.AgreementSigned]:
            workIndustry?.AgreementSignedDate,
        [WorkplaceCurrentStatus.PlacementStarted]:
            workIndustry?.placementStartedDate,
        [WorkplaceCurrentStatus.Completed]: workIndustry?.isCompletedDate,
        [WorkplaceCurrentStatus.Cancelled]: workIndustry?.cancelledDate,
        [WorkplaceCurrentStatus.Terminated]: workIndustry?.terminatedDate,
        [WorkplaceCurrentStatus.NoResponse]: workIndustry?.industryResponseDate,
    })

    const getCurrentStep = () => {
        if (isTerminal) {
            return {
                label: statusMapping[workplace.currentStatus],
                completed: false,
                current: true,
                date: workIndustry?.cancelledDate || null,
            }
        }
        return statuses.find((step) => step.current === true) || null
    }

    const getNextStep = () => {
        if (isTerminal) return null
        const currentIndex = statuses.findIndex((step) => step.current === true)

        // If no current step found or current is the last step
        if (currentIndex === -1 || currentIndex === statuses.length - 1) {
            return null
        }

        return statuses[currentIndex + 1]
    }

    const getPreviousStep = () => {
        if (isTerminal) return statuses[statuses.length - 1]
        const currentIndex = statuses.findIndex((step) => step.current === true)

        // If no current step found or current is the first step
        if (currentIndex <= 0) {
            return null
        }

        return statuses[currentIndex - 1]
    }

    const validStatus = statuses.filter(
        (step: any) => !terminalStatusesLabels.includes(step?.label)
    )

    const currentStep = getCurrentStep()
    const completedCount = isTerminal
        ? statuses.length
        : currentStep?.label === 'Schedule Completed'
          ? validStatus?.length
          : statuses.filter((s) => s.completed).length
    const totalCount = validStatus.length
    const progressPercent =
        isTerminal || currentStep?.label === 'Schedule Completed'
            ? 100
            : Math.round((completedCount / totalCount) * 100)

    return {
        statuses,
        totalCount,
        completedCount,
        progressPercent,
        nextStep: getNextStep(),
        previousStep: getPreviousStep(),
        currentStep,
        validStatus,
        statusArrays: getStatusArrays(workplace?.currentStatus),
    }
}
