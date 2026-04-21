import { Save } from 'lucide-react'
import { useEffect } from 'react'
import { Button, usePermissions } from '@components'
import { Tooltip, TooltipTrigger, TooltipContent } from '@components/ui'
import { PermissionType } from '@types'
import {
    TradingHoursHeader,
    QuickActions,
    DayCard,
    OperatingSummary,
    DayHours,
} from './components'
import { RtoV2Api } from '@queries/portals/rto-v2/rto-v2.query'
import { useAppSelector } from '@redux/hooks'
import { useNotification } from '@hooks/useNotification'
import moment from 'moment'
import { IndustryApi } from '@redux'
import { useForm, FormProvider } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { TradingHoursTabSkeleton } from '../../../skeletonLoader'

const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
]

const daySchema = yup.object().shape({
    open: yup.boolean(),
    start: yup.string().when('open', {
        is: true,
        then: (schema) => schema.required('Start time is required'),
    }),
    end: yup.string().when('open', {
        is: true,
        then: (schema) =>
            schema
                .required('End time is required')
                .test(
                    'is-after-start',
                    'End time must be after start time',
                    function (value) {
                        const { start } = this.parent
                        if (!start || !value) return true
                        return value > start
                    }
                ),
    }),
    breakStart: yup
        .string()
        .test('break-within-hours', 'Invalid break time', function (value) {
            if (!value) return true
            const { start, end, open, mode } = this.parent
            if (!open || mode !== 'fixed') return true

            if (start && value < start) {
                return this.createError({
                    message: 'Break cannot start before opening',
                })
            }
            if (end && value >= end) {
                return this.createError({
                    message: 'Break must start before closing',
                })
            }
            return true
        }),
    breakEnd: yup
        .string()
        .test('break-end-within-hours', 'Invalid break end', function (value) {
            if (!value) return true
            const { start, end, breakStart, open, mode } = this.parent
            if (!open || mode !== 'fixed') return true

            if (start && value <= start) {
                return this.createError({
                    message: 'Break cannot end before opening',
                })
            }
            if (end && value > end) {
                return this.createError({
                    message: 'Break cannot end after closing',
                })
            }
            if (breakStart && value <= breakStart) {
                return this.createError({
                    message: 'Break end must be after start',
                })
            }
            return true
        }),
    shifts: yup.array().when('mode', {
        is: 'free-shifts',
        then: (schema) =>
            schema
                .of(
                    yup.object().shape({
                        start: yup.string().required('Start time is required'),
                        end: yup
                            .string()
                            .required('End time is required')
                            .test(
                                'shift-end-after-start',
                                'End time must be after start time',
                                function (value) {
                                    const { start } = this.parent
                                    if (!start || !value) return true
                                    return value > start
                                }
                            ),
                    })
                )
                .test('shifts-valid', 'Invalid shifts', function (shifts) {
                    if (!shifts || shifts.length === 0) return true
                    const {
                        start: dayStart,
                        end: dayEnd,
                        breakStart,
                        breakEnd,
                    } = this.parent

                    const errors: any[] = []

                    shifts.forEach((shift: any, index: number) => {
                        const { start: sStart, end: sEnd } = shift

                        // 1. Check if within day hours
                        if (dayStart && sStart < dayStart) {
                            errors.push(
                                this.createError({
                                    path: `${this.path}.${index}.start`,
                                    message: `Shift cannot start before opening (${dayStart})`,
                                })
                            )
                        }
                        if (dayEnd && sEnd > dayEnd) {
                            errors.push(
                                this.createError({
                                    path: `${this.path}.${index}.end`,
                                    message: `Shift cannot end after closing (${dayEnd})`,
                                })
                            )
                        }

                        // 2. Check overlap with break
                        if (breakStart && breakEnd) {
                            // Shift overlaps break if: ShiftStart < BreakEnd AND ShiftEnd > BreakStart
                            const overlaps =
                                sStart < breakEnd && sEnd > breakStart
                            if (overlaps) {
                                errors.push(
                                    this.createError({
                                        path: `${this.path}.${index}.start`,
                                        message: `Shift overlaps with break (${breakStart}-${breakEnd})`,
                                    })
                                )
                            }
                        }
                    })

                    if (errors.length > 0) {
                        return new yup.ValidationError(errors)
                    }

                    return true
                }),
    }),
})

const validationSchema = yup.object().shape({
    hours: yup
        .object()
        .shape(
            daysOfWeek.reduce(
                (acc, day) => ({ ...acc, [day.key]: daySchema }),
                {}
            )
        ),
})

const initialHours: Record<string, DayHours> = {
    monday: {
        open: false,
        mode: 'fixed',
        start: '09:00',
        end: '17:00',
        breakStart: '12:00',
        breakEnd: '13:00',
        shifts: [],
    },
    tuesday: {
        open: false,
        mode: 'fixed',
        start: '09:00',
        end: '17:00',
        breakStart: '12:00',
        breakEnd: '13:00',
        shifts: [],
    },
    wednesday: {
        open: false,
        mode: 'fixed',
        start: '09:00',
        end: '17:00',
        breakStart: '12:00',
        breakEnd: '13:00',
        shifts: [],
    },
    thursday: {
        open: false,
        mode: 'fixed',
        start: '09:00',
        end: '17:00',
        breakStart: '12:00',
        breakEnd: '13:00',
        shifts: [],
    },
    friday: {
        open: false,
        mode: 'fixed',
        start: '09:00',
        end: '17:00',
        breakStart: '12:00',
        breakEnd: '13:00',
        shifts: [],
    },
    saturday: {
        open: false,
        mode: 'fixed',
        start: '09:00',
        end: '13:00',
        breakStart: '',
        breakEnd: '',
        shifts: [],
    },
    sunday: {
        open: false,
        mode: 'fixed',
        start: '09:00',
        end: '13:00',
        breakStart: '',
        breakEnd: '',
        shifts: [],
    },
}

export function TradingHoursModule() {
    const methods = useForm({
        defaultValues: {
            hours: initialHours,
        },
        resolver: yupResolver(validationSchema),
        mode: 'all',
    })
    const { reset, handleSubmit, getValues, setValue } = methods

    const industryDetail = useAppSelector(
        (state) => state.industry.industryDetail
    )
    const industryUserId = industryDetail?.user?.id

    const hasPermission = usePermissions({
        permission: PermissionType.CAN_PERFORM_INDUSTRY_ACTIONS,
    })

    const { data: apiData, isLoading: isFetching } =
        RtoV2Api.Industries.useGetIndutryAvailableHours(industryUserId!, {
            skip: !industryUserId,
        })

    const [createHours, { isLoading: isSaving }] =
        IndustryApi.AvailableShifts.useAddWorkingHoursMutation()
    const { notification } = useNotification()

    useEffect(() => {
        if (apiData && apiData.length > 0) {
            const newHours: Record<string, DayHours> = JSON.parse(
                JSON.stringify(initialHours)
            )

            // Reset all to closed first to ensure we only open what's in DB
            Object.keys(newHours).forEach((day) => {
                newHours[day].open = false
            })

            apiData.forEach((dayData: any) => {
                const dayName = dayData.day
                if (newHours[dayName]) {
                    newHours[dayName].open = dayData.dayOn
                    newHours[dayName].start = moment(dayData.openingTime, [
                        'h:mm A',
                        'HH:mm',
                    ]).format('HH:mm')
                    newHours[dayName].end = moment(dayData.closingTime, [
                        'h:mm A',
                        'HH:mm',
                    ]).format('HH:mm')

                    if (dayData.breakStart && dayData.breakEnd) {
                        newHours[dayName].breakStart = moment(
                            dayData.breakStart,
                            ['h:mm A', 'HH:mm']
                        ).format('HH:mm')
                        newHours[dayName].breakEnd = moment(dayData.breakEnd, [
                            'h:mm A',
                            'HH:mm',
                        ]).format('HH:mm')
                    } else {
                        newHours[dayName].breakStart = ''
                        newHours[dayName].breakEnd = ''
                    }

                    if (dayData.shifts && dayData.shifts.length > 0) {
                        newHours[dayName].mode = 'free-shifts'
                        newHours[dayName].shifts = dayData.shifts.map(
                            (s: any) => ({
                                start: moment(s.startTime || s.openingTime, [
                                    'h:mm A',
                                    'HH:mm',
                                ]).format('HH:mm'),
                                end: moment(s.endTime || s.closingTime, [
                                    'h:mm A',
                                    'HH:mm',
                                ]).format('HH:mm'),
                                studentCapacity: s.studentCapacity || '0',
                                shiftId: s?.id,
                            })
                        )
                    } else {
                        newHours[dayName].shifts = []
                    }
                }
            })
            reset({ hours: newHours })
        }
    }, [apiData, reset])

    const handleCopyMonFri = () => {
        const mondayHours = getValues('hours.monday')
        ;['tuesday', 'wednesday', 'thursday', 'friday'].forEach((day) => {
            setValue(`hours.${day}`, mondayHours)
        })
    }

    const handleReset = () => {
        reset({ hours: initialHours })
    }

    const onSubmit = async (data: { hours: Record<string, DayHours> }) => {
        const hours = data.hours
        try {
            const payload = {
                days: Object.entries(hours)
                    .filter(([_, h]) => h.open)
                    .map(([day, h]) => {
                        return {
                            day: day,
                            dayOn: true,
                            openingTime: h.start,
                            closingTime: h.end,
                            break: !!(h.breakStart && h.breakEnd),
                            breakStart: h.breakStart,
                            breakEnd: h.breakEnd,
                            shifts: h.shifts.map((s) => ({
                                openingTime: s.start,
                                closingTime: s.end,
                                studentCapacity: s.studentCapacity,
                            })),
                        }
                    }),
            }

            await createHours({
                userId: industryUserId,
                ...payload,
            }).unwrap()

            notification.success({
                title: 'Success',
                description: 'Trading hours saved',
            })
        } catch (error) {
            notification.error({
                title: 'Error',
                description:
                    'Failed to update trading hours. Please try again.',
            })
        }
    }

    if (isFetching) {
        return <TradingHoursTabSkeleton />
    }

    return (
        <FormProvider {...methods}>
            <div className="space-y-3 px-4 py-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-1.5">
                    <TradingHoursHeader />
                    <QuickActions
                        onCopyMonFri={handleCopyMonFri}
                        onReset={handleReset}
                    />
                </div>

                {/* Days Grid */}
                <div className="grid gap-2">
                    {daysOfWeek.map(({ key, label }) => (
                        <DayCard key={key} day={label} dayKey={key} />
                    ))}
                </div>

                {/* Summary Card */}
                <OperatingSummary daysOfWeek={daysOfWeek.map((d) => d.key)} />

                {/* Save Button */}
                {!hasPermission ? (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="w-full">
                                <Button
                                    fullWidth
                                    onClick={handleSubmit(onSubmit)}
                                    variant="primaryNew"
                                    disabled={
                                        !hasPermission || isSaving || isFetching
                                    }
                                >
                                    {isSaving ? (
                                        'Saving...'
                                    ) : (
                                        <>
                                            <Save className="w-3.5 h-3.5 mr-2" />
                                            Save Trading Hours
                                        </>
                                    )}
                                </Button>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>Permission Not granted</TooltipContent>
                    </Tooltip>
                ) : (
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSaving || isFetching}
                        variant="primaryNew"
                        fullWidth
                    >
                        {isSaving ? (
                            'Saving...'
                        ) : (
                            <>
                                <Save className="w-3.5 h-3.5 mr-2" />
                                Save Trading Hours
                            </>
                        )}
                    </Button>
                )}
            </div>
        </FormProvider>
    )
}
