import {
    Button,
    ConfigTabs,
    ShowErrorNotifications,
    TabConfig,
} from '@components'
import { useNotification } from '@hooks/useNotification'
import { RtoV2Api } from '@queries/portals/rto-v2/rto-v2.query'
import { useAppSelector } from '@redux/hooks'
import { Calendar, CheckCircle } from 'lucide-react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { MonthlySchedule, MonthlyScheduleData } from './MonthlySchedule'
import { DaySchedule, WeeklySchedule } from './WeeklySchedule'

interface InterviewAvailabilityProps {
    onSuccess?: () => void
}

export function InterviewAvailability({
    onSuccess,
}: InterviewAvailabilityProps = {}) {
    const [createAvailability, createAvailabilityResult] =
        RtoV2Api.Industries.createAvailability()

    const industryDetail = useAppSelector(
        (state) => state.industry.industryDetail
    )

    const interviewAvailability = RtoV2Api.Industries.useIndustryAvailabilityV2(
        industryDetail?.id!,
        {
            skip: !industryDetail?.id,
        }
    )

    const [availabilityType, setAvailabilityType] = useState<
        'weekly' | 'monthly'
    >('weekly')

    // Initial State for Weekly
    const [weeklySchedule, setWeeklySchedule] = useState<DaySchedule[]>([
        {
            day: 'monday',
            isActive: false,
            slots: [{ startTime: '09:00', endTime: '17:00' }],
        },
        {
            day: 'tuesday',
            isActive: false,
            slots: [{ startTime: '09:00', endTime: '17:00' }],
        },
        {
            day: 'wednesday',
            isActive: false,
            slots: [{ startTime: '09:00', endTime: '17:00' }],
        },
        {
            day: 'thursday',
            isActive: false,
            slots: [{ startTime: '09:00', endTime: '17:00' }],
        },
        {
            day: 'friday',
            isActive: false,
            slots: [{ startTime: '09:00', endTime: '17:00' }],
        },
        { day: 'saturday', isActive: false, slots: [] },
        { day: 'sunday', isActive: false, slots: [] },
    ])

    // Initial State for Monthly
    const [monthlyData, setMonthlyData] = useState<MonthlyScheduleData>({
        dates: [],
        slots: [{ startTime: '09:00', endTime: '17:00' }],
    })

    // Interviewer state
    // const [selectedInterviewer, setSelectedInterviewer] = useState<
    //     number | null
    // >(null)

    // Fetch coordinators

    useEffect(() => {
        if (interviewAvailability.data) {
            const { type, slots, dates } = interviewAvailability.data
            setAvailabilityType(type || 'weekly')
            // setSelectedInterviewer(
            //     interviewAvailability.data.interviewer?.id || null
            // )

            if (type === 'weekly' && slots) {
                setMonthlyData({
                    dates: [],
                    slots: [{ startTime: '09:00', endTime: '17:00' }],
                })
                setWeeklySchedule((prev) =>
                    prev.map((day) => {
                        const daySlots = slots.filter((s) => s.day === day.day)
                        return {
                            ...day,
                            isActive: daySlots.length > 0,
                            slots:
                                daySlots.length > 0
                                    ? daySlots.map((s) => ({
                                        startTime: s.startTime.substring(
                                            0,
                                            5
                                        ),
                                        endTime: s.endTime.substring(0, 5),
                                    }))
                                    : day.slots,
                        }
                    })
                )
            } else if (type === 'monthly' && dates) {
                setWeeklySchedule([
                    {
                        day: 'monday',
                        isActive: false,
                        slots: [{ startTime: '09:00', endTime: '17:00' }],
                    },
                    {
                        day: 'tuesday',
                        isActive: false,
                        slots: [{ startTime: '09:00', endTime: '17:00' }],
                    },
                    {
                        day: 'wednesday',
                        isActive: false,
                        slots: [{ startTime: '09:00', endTime: '17:00' }],
                    },
                    {
                        day: 'thursday',
                        isActive: false,
                        slots: [{ startTime: '09:00', endTime: '17:00' }],
                    },
                    {
                        day: 'friday',
                        isActive: false,
                        slots: [{ startTime: '09:00', endTime: '17:00' }],
                    },
                    { day: 'saturday', isActive: false, slots: [] },
                    { day: 'sunday', isActive: false, slots: [] },
                ])
                setMonthlyData((prev) => ({
                    dates: dates.map((d: any) => ({
                        date: moment(d.date).format('YYYY-MM-DD'),
                    })),
                    slots:
                        slots && slots.length > 0
                            ? slots.map((s: any) => ({
                                startTime: s.startTime.substring(0, 5),
                                endTime: s.endTime.substring(0, 5),
                            }))
                            : prev.slots,
                }))
            }
        }
    }, [interviewAvailability.data])

    const { notification } = useNotification()

    const handleSave = async () => {
        try {
            // Validate interviewer is selected
            // if (!selectedInterviewer) {
            //     notification.error({
            //         title: 'Error',
            //         description: 'Please select an interviewer.',
            //     })
            //     return
            // }

            let payload: any = {}

            if (availabilityType === 'weekly') {
                const activeDays = weeklySchedule.filter((d) => d.isActive)
                if (activeDays.length === 0) {
                    notification.error({
                        title: 'Error',
                        description: 'Please select at least one day.',
                    })
                    return
                }

                // Flatten slots for payload
                const slots = activeDays.flatMap((day) =>
                    day.slots.map((slot) => ({
                        day: day.day,
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                    }))
                )

                payload = {
                    type: 'weekly',
                    slots,
                    userId: industryDetail?.user?.id,
                    // interviewer: selectedInterviewer,
                }
            } else {
                if (monthlyData.dates.length === 0) {
                    notification.error({
                        title: 'Error',
                        description: 'Please select at least one date.',
                    })
                    return
                }
                if (monthlyData.slots.length === 0) {
                    notification.error({
                        title: 'Error',
                        description: 'Please add at least one time slot.',
                    })
                    return
                }

                payload = {
                    type: 'monthly',
                    dates: monthlyData.dates,
                    slots: monthlyData.slots,
                    userId: industryDetail?.user?.id,
                    // interviewer: selectedInterviewer,
                }
            }

            await createAvailability(payload).unwrap()
            notification.success({
                title: 'Success',
                description: 'Availability updated successfully!',
            })
            if (onSuccess) {
                onSuccess()
            }
        } catch (error) {
            console.error('Failed to save availability', error)
        }
    }
    const tabs: TabConfig[] = [
        {
            value: 'weekly',
            label: 'Weekly Active Mode',
            component: () => (
                <WeeklySchedule
                    schedule={weeklySchedule}
                    onChange={setWeeklySchedule}
                />
            ),
        },
        {
            value: 'monthly',
            label: 'Monthly Date Mode',
            component: () => (
                <MonthlySchedule data={monthlyData} onChange={setMonthlyData} />
            ),
        },
    ]

    return (
        <>
            <ShowErrorNotifications result={createAvailabilityResult} />
            <div
                id="interview-availability"
                className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all"
            >
                {/* Header */}
                <div className="bg-gradient-to-r rounded-t-xl from-[#044866] to-[#0D5468] px-4 py-2 flex items-center justify-between">
                    <h3 className="text-white flex items-center gap-2 text-sm font-semibold tracking-wide">
                        <Calendar className="w-4 h-4" />
                        Interview Availability
                    </h3>
                    <div className="flex items-center gap-2 bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                        <span className="text-[10px] text-white font-medium uppercase tracking-wide">
                            Active
                        </span>
                    </div>
                </div>

                <div className="px-4 py-2 space-y-3">
                    <ConfigTabs
                        tabs={tabs}
                        value={availabilityType}
                        onValueChange={(val: string) =>
                            setAvailabilityType(val as 'weekly' | 'monthly')
                        }
                        className={'!rounded'}
                        tabsClasses="!p-1 !rounded-md"
                        tabsTriggerClasses="!py-1 !rounded-md"
                    />

                    {/* Action Footer */}
                    <div className="border-t border-slate-100 space-y-3 pt-3">
                        {/* Coordinator Select */}
                        {/* <div className="space-y-1.5">
                            <Select
                                label={'Select Interviewer'}
                                name="interviewer"
                                options={coordinators.map(
                                    (coordinator: any) => ({
                                        label: `${coordinator.user.name} (${coordinator.user.email})`,
                                        value: String(coordinator.user.id),
                                    })
                                )}
                                value={
                                    selectedInterviewer
                                        ? String(selectedInterviewer)
                                        : ''
                                }
                                onChange={(opt: any) =>
                                    setSelectedInterviewer(
                                        opt.value ? Number(opt.value) : null
                                    )
                                }
                                className="w-full"
                                showError={false}
                            />
                        </div> */}

                        <div className="flex items-center justify-between">
                            <div className="flex items-start gap-2 max-w-[70%]">
                                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <p className="text-slate-500 text-xs leading-relaxed">
                                    Changes will be immediately reflected in the
                                    student booking portal.
                                </p>
                            </div>

                            <Button
                                onClick={handleSave}
                                variant="primary"
                                className="bg-[#044866] hover:bg-[#03364d] text-white px-6 py-2 rounded-lg text-xs font-semibold shadow-lg shadow-[#044866]/20 transition-all hover:scale-105 active:scale-95"
                                disabled={createAvailabilityResult.isLoading}
                            >
                                {createAvailabilityResult.isLoading
                                    ? 'Saving...'
                                    : 'Save Availability'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
