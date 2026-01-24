export const getStatusCategory = (status: string): string => {
    // Active statuses
    if (status === 'agreementSigned' || status === 'placementStarted') {
        return 'active'
    }

    // Completed status
    if (status === 'completed') {
        return 'completed'
    }

    // Pending statuses
    if (
        status === 'applied' ||
        status === 'caseOfficerAssigned' ||
        status === 'interview' ||
        status === 'industryEligibility' ||
        status === 'industryEligibility' ||
        status === 'awaitingWorkplaceResponse' ||
        status === 'awaitingStudentResponse' ||
        status === 'awaitingRtoResponse' ||
        status === 'appointmentBooked' ||
        status === 'awaitingAgreementSigned'
    ) {
        return 'pending'
    }

    // Withdrawn/Cancelled statuses
    if (
        status === 'noResponse' ||
        status === 'rejected' ||
        status === 'terminated' ||
        status === 'cancelled'
    ) {
        return 'withdrawn'
    }

    // Default for notRequested or unknown
    return 'unknown'
}
