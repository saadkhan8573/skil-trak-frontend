import * as yup from 'yup'

const isTodayOrFuture = (value?: string) => {
    if (!value) return false

    const selected = new Date(value)
    const today = new Date()

    today.setHours(0, 0, 0, 0)
    selected.setHours(0, 0, 0, 0)

    return selected >= today
}

export const appointmentSchema = yup.object({
    status: yup
        .mixed<'successful' | 'not-successful'>()
        .oneOf(['successful', 'not-successful'])
        .nullable()
        .required('Status is required'),

    hours: yup.string().when('status', {
        is: 'successful',
        then: (s) => s.required('Total hours required'),
        otherwise: (s) => s.optional(),
    }),

    startDate: yup.string().when('status', {
        is: 'successful',
        then: (s) =>
            s
                .required('Start date required')
                .test(
                    'not-in-past',
                    'Start date cannot be in the past',
                    isTodayOrFuture
                ),
        otherwise: (s) => s.optional(),
    }),

    unsuccessfulReason: yup.string().when('status', {
        is: 'not-successful',
        then: (s) => s.required('Reason required'),
        otherwise: (s) => s.optional(),
    }),

    rejectionReason: yup.string().when('unsuccessfulReason', {
        is: 'rejected-by-industry',
        then: (s) => s.required('Rejection reason required'),
        otherwise: (s) => s.optional(),
    }),

    otherReason: yup.string().when('unsuccessfulReason', {
        is: 'other',
        then: (s) => s.required('Please describe reason'),
        otherwise: (s) => s.optional(),
    }),

    weekSchedule: yup.array().when('status', {
        is: 'successful',
        then: (schema) =>
            schema
                .of(
                    yup.object({
                        day: yup.string().required(),
                        available: yup.boolean().required(),

                        startTime: yup.string().when('available', {
                            is: true,
                            then: (s) =>
                                s
                                    .required('Start time required')
                                    .test(
                                        'start-before-end',
                                        'Start time must be before end time',
                                        function (startTime) {
                                            const { endTime, available } =
                                                this.parent
                                            if (!available) return true
                                            if (!startTime || !endTime)
                                                return true

                                            const toMinutes = (
                                                time: string
                                            ) => {
                                                const [h, m] = time
                                                    .split(':')
                                                    .map(Number)
                                                return h * 60 + m
                                            }

                                            return (
                                                toMinutes(startTime) <
                                                toMinutes(endTime)
                                            )
                                        }
                                    ),
                            otherwise: (s) => s.optional(),
                        }),

                        endTime: yup.string().when('available', {
                            is: true,
                            then: (s) =>
                                s
                                    .required('End time required')
                                    .test(
                                        'end-after-start',
                                        'End time must be after start time',
                                        function (endTime) {
                                            const { startTime, available } =
                                                this.parent
                                            if (!available) return true
                                            if (!startTime || !endTime)
                                                return true

                                            const toMinutes = (
                                                time: string
                                            ) => {
                                                const [h, m] = time
                                                    .split(':')
                                                    .map(Number)
                                                return h * 60 + m
                                            }

                                            return (
                                                toMinutes(startTime) <
                                                toMinutes(endTime)
                                            )
                                        }
                                    ),
                            otherwise: (s) => s.optional(),
                        }),
                    })
                )
                .test(
                    'at-least-one-day',
                    'Select at least one available day',
                    (days) => {
                        if (!days) return false
                        return days.some((d) => d.available === true)
                    }
                ),
        otherwise: (schema) => schema.optional(),
    }),
})
