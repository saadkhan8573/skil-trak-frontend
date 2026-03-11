import { useForm, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { AppointmentStatusFormValues } from '../types/types'
import { appointmentSchema } from '../appointmentStatusSchema'

export const useAppointmentStatusForm = () => {
    const form = useForm<AppointmentStatusFormValues>({
        mode: 'onChange',
        resolver: yupResolver(appointmentSchema),
        defaultValues: {
            status: undefined,
            weekSchedule: [
                {
                    day: 'Monday',
                    available: false,
                    startTime: '08:00',
                    endTime: '17:00',
                },
                {
                    day: 'Tuesday',
                    available: false,
                    startTime: '08:00',
                    endTime: '17:00',
                },
                {
                    day: 'Wednesday',
                    available: false,
                    startTime: '08:00',
                    endTime: '17:00',
                },
                {
                    day: 'Thursday',
                    available: false,
                    startTime: '08:00',
                    endTime: '17:00',
                },
                {
                    day: 'Friday',
                    available: false,
                    startTime: '08:00',
                    endTime: '17:00',
                },
            ],
        },
    })

    const status = useWatch({ control: form.control, name: 'status' })
    const unsuccessfulReason = useWatch({
        control: form.control,
        name: 'unsuccessfulReason',
    })

    const toggleDay = (index: number) => {
        const days = form.getValues('weekSchedule')
        days[index].available = !days[index].available
        form.setValue('weekSchedule', days, { shouldValidate: true })
    }

    return {
        form,
        status,
        unsuccessfulReason,
        toggleDay,
    }
}
