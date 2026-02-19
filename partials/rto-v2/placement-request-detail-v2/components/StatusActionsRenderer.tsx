import { ReactElement, useState } from 'react'

import { IStatusActionRendererProps } from '../types/statusActions.types'

// Status components
import { PlacementInProgressStatus } from '../stages/PlacementInProgressStatus'
import { StudentAddedStatus } from '../stages/StudentAddedStatus'
import { RequestGeneratedStatus } from '../stages/RequestGeneratedStatus'
import { WaitingForRTOStatus } from '../stages/WaitingForRTOStatus'
import { WaitingForStudentStatus } from '../stages/WaitingForStudentStatus'
import { IndustryEligibilityPendingStatus } from '../stages/IndustryEligibilityPendingStatus'
import { WaitingForIndustryStatus } from '../stages/WaitingForIndustryStatus'
import { AppointmentStatus } from '../stages/AppointmentStatus'
import { AgreementPendingStatus } from '../stages/AgreementPendingStatus'
import { AgreementSignedStatus } from '../stages/AgreementSignedStatus'
import { PlacementStartedStatus } from '../stages/PlacementStartedStatus'
import { ScheduleCompletedStatus } from '../stages/ScheduleCompletedStatus'
import { CompletedStatus } from '../stages/CompletedStatus'
import { ProvidedWorkplaceRequestStatus } from '../stages/ProvidedWorkplaceRequestStatus'
import { ProvidedIndustryEligibilityStatus } from '../stages/ProvidedIndustryEligibilityStatus'
import { ProvidedAgreementPendingStatus } from '../stages/ProvidedAgreementPendingStatus'
import { ProvidedAgreementSignedStatus } from '../stages/ProvidedAgreementSignedStatus'
import { CancelledStatus } from '../stages/CancelledStatus'
import {
    needsWorkplaceStagesEnum,
    providedWorkplaceStagesEnum,
} from '@partials/rto-v2/placement-request-detail/components/workplaceStages'

export const StatusActionsRenderer = ({
    isCancelled,
    isPlacementStarted,
    cancellationReason,
    currentStatus,
    setStatusNote,
    appointmentDate,
    setShowScheduleDialog,
    setPendingStatus,
    workplaceType,
    workplace,
    student,
    setModal,
    onCancelModal,
}: IStatusActionRendererProps) => {
    const [showAgreementDialog, setShowAgreementDialog] = useState(false)

    const requestStatusChange = (newStatus: string) => {
        setPendingStatus(newStatus)
        setStatusNote('')
    }

    const commonProps = {
        workplace,
        student,
        appointmentDate,
        setShowScheduleDialog,
        setShowAgreementDialog,
        showAgreementDialog,
        setModal,
        onCancelModal,
        requestStatusChange,
    }

    // Handle cancelled status
    if (isCancelled) {
        return (
            <CancelledStatus
                reason={cancellationReason}
                title="Placement Request Cancelled"
            />
        )
    }

    // Handle active placement
    if (isPlacementStarted) {
        return <PlacementInProgressStatus />
    }

    // Render based on current stage
    switch (currentStatus?.stage) {
        case needsWorkplaceStagesEnum.STUDENT_ADDED:
            return <StudentAddedStatus />

        case needsWorkplaceStagesEnum.REQUEST_GENERATED:
            return (
                <RequestGeneratedStatus
                    {...commonProps}
                    setModal={setModal}
                    onCancelModal={onCancelModal}
                />
            )

        case needsWorkplaceStagesEnum.WAITING_FOR_RTO:
            return <WaitingForRTOStatus />

        case needsWorkplaceStagesEnum.WAITING_FOR_STUDENT:
            return <WaitingForStudentStatus />

        case needsWorkplaceStagesEnum.Industry_Eligibility_Pending:
            return <IndustryEligibilityPendingStatus />

        case needsWorkplaceStagesEnum.WAITING_FOR_INDUSTRY:
            return <WaitingForIndustryStatus />

        case needsWorkplaceStagesEnum.APPOINTMENT:
            return (
                <AppointmentStatus
                    {...commonProps}
                    appointmentDate={appointmentDate}
                    onAppointmentSuccessful={() =>
                        requestStatusChange('Agreement Pending')
                    }
                    setShowAppointmentDialog={setShowAgreementDialog}
                />
            )

        case needsWorkplaceStagesEnum.AGREEMENT_PENDING:
            return (
                <AgreementPendingStatus
                    {...commonProps}
                    onAgreementSigned={() => {
                        setShowAgreementDialog(true)
                        requestStatusChange('Agreement Signed')
                    }}
                />
            )

        case needsWorkplaceStagesEnum.AGREEMENT_SIGNED:
            return (
                <AgreementSignedStatus
                    setShowScheduleDialog={setShowScheduleDialog}
                />
            )

        case needsWorkplaceStagesEnum.PLACEMENT_STARTED:
            return <PlacementStartedStatus />

        case needsWorkplaceStagesEnum.SCHEDULE_COMPLETED:
            return <ScheduleCompletedStatus />

        case needsWorkplaceStagesEnum.COMPLETED:
            return <CompletedStatus />

        case needsWorkplaceStagesEnum.CANCELLED:
            return (
                <CancelledStatus
                    reason={cancellationReason}
                    title="Placement Cancelled"
                />
            )

        // Provided workplace stages
        case providedWorkplaceStagesEnum.PROVIDED_WORKPLACE_REQUEST:
            return <ProvidedWorkplaceRequestStatus />

        case providedWorkplaceStagesEnum.INDUSTRY_ELIGIBILITY_PENDING:
            return <ProvidedIndustryEligibilityStatus />

        case providedWorkplaceStagesEnum.AGREEMENT_AND_ELIGIBILITY_PENDING:
            return (
                <ProvidedAgreementPendingStatus
                    {...commonProps}
                    onAgreementSigned={() => {
                        setShowAgreementDialog(true)
                        requestStatusChange('Agreement Signed')
                    }}
                />
            )

        case providedWorkplaceStagesEnum.AGREEMENT_AND_ELIGIBILITY_SIGNED:
            return (
                <ProvidedAgreementSignedStatus
                    setShowScheduleDialog={setShowScheduleDialog}
                />
            )

        case providedWorkplaceStagesEnum.CANCELLED:
            return (
                <CancelledStatus
                    reason={cancellationReason}
                    title="Placement Cancelled"
                />
            )

        default:
            return null
    }
}
