import { AppointmentStatusFormValues } from '../types/types'

/**
 * Resolves the final status based on selection and reason
 */
export const resolveStatus = (
    status?: string,
    reason?: string
): 'successful' | 'missed' | 'rejected' | 'other' => {
    if (status === 'successful') return 'successful'

    const statusMap: Record<string, 'missed' | 'rejected'> = {
        missed: 'missed',
        rejected: 'rejected',
    }

    return statusMap[reason ?? ''] ?? 'other'
}

/**
 * Builds the API payload for appointment status update
 */
export const buildPayload = (
    formData: AppointmentStatusFormValues,
    status: string | undefined,
    appointment: any,
    industry: any,
    student: any
) => {
    const {
        weekSchedule = [],
        unsuccessfulReason,
        rejectionReason,
        otherReason,
        hours,
        ...rest
    } = formData

    const resolvedStatus = resolveStatus(status, unsuccessfulReason)
    const isSuccessful = resolvedStatus === 'successful'

    // Only include schedule timing if successful
    const scheduleTiming = isSuccessful
        ? weekSchedule
              .filter(({ available }) => available)
              .map(({ day, startTime, endTime }) => ({
                  day,
                  startTime,
                  endTime,
              }))
        : undefined

    return {
        body: {
            ...rest,
            ...(isSuccessful && { scheduleTiming, hours: Number(hours) }),
            ...(resolvedStatus === 'rejected' && { rejectionReason }),
            ...(resolvedStatus === 'other' && { otherReason }),
            course: appointment?.course?.id,
            workplace: industry?.id,
            appointmentId: appointment?.id,
            status: resolvedStatus,
        },
        params: {
            stdUser: student?.id,
        },
    }
}
