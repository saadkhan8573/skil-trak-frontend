import { Calendar, CheckCircle } from 'lucide-react'
import { Button, ConfigTabs, TabConfig, usePermissions } from '@components'
import { Tooltip, TooltipTrigger, TooltipContent } from '@components/ui'
import { PermissionType } from '@types'
import { useState } from 'react'
import { WeeklySchedule, DaySchedule } from './WeeklySchedule'
import { MonthlySchedule, MonthlyScheduleData } from './MonthlySchedule'
import { RtoV2Api } from '@queries/portals/rto-v2/rto-v2.query'
import { useNotification } from '@hooks/useNotification'

export function InterviewAvailability({ data }: any) {
    const [createAvailability, { isLoading }] =
        RtoV2Api.Industries.createAvailability()

    const hasPermission = usePermissions({
        permission: [PermissionType.CAN_PERFORM_INDUSTRY_ACTIONS],
    })

    // const industryDetail = useAppSelector(
    //     (state) => state.industry.industryDetail
    // )

    const [availabilityType, setAvailabilityType] = useState<
        'weekly' | 'monthly'
    >('weekly')

    // Initial State for Weekly
    const [weeklySchedule, setWeeklySchedule] = useState<DaySchedule[]>([
        {
            day: 'monday',
            isActive: true,
            slots: [{ startTime: '09:00', endTime: '17:00' }],
        },
        {
            day: 'tuesday',
            isActive: true,
            slots: [{ startTime: '09:00', endTime: '17:00' }],
        },
        {
            day: 'wednesday',
            isActive: true,
            slots: [{ startTime: '09:00', endTime: '17:00' }],
        },
        {
            day: 'thursday',
            isActive: true,
            slots: [{ startTime: '09:00', endTime: '17:00' }],
        },
        {
            day: 'friday',
            isActive: true,
            slots: [{ startTime: '09:00', endTime: '17:00' }],
        },
        { day: 'saturday', isActive: false, slots: [] },
        { day: 'sunday', isActive: false, slots: [] },
    ])

    // Initial State for Monthly
    const [monthlyData, setMonthlyData] = useState<MonthlyScheduleData>({
        startDate: '',
        endDate: '',
        slots: [{ startTime: '09:00', endTime: '17:00' }],
    })

    const { notification } = useNotification()

    const handleSave = async () => {
        try {
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
                    userId: data?.user?.id,
                }
            } else {
                if (!monthlyData.startDate || !monthlyData.endDate) {
                    notification.error({
                        title: 'Error',
                        description: 'Please select start and end dates.',
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
                    slots: monthlyData.slots,
                    endDate: monthlyData.endDate,
                    startDate: monthlyData.startDate,
                    userId: data?.user?.id,
                }
            }

            await createAvailability(payload).unwrap()
            notification.success({
                title: 'Success',
                description: 'Availability updated successfully!',
            })
        } catch (error) {
            notification.error({
                title: 'Error',
                description: 'Failed to update availability. Please try again.',
            })
        }
    }
    const tabs: TabConfig[] = [
        {
            value: 'weekly',
            label: 'Weekly Active Mode',
            // icon: Users,
            // count: count?.data?.pending,
            component: () => (
                <WeeklySchedule
                    schedule={weeklySchedule}
                    onChange={setWeeklySchedule}
                />
            ),
        },
        {
            value: 'monthly',
            label: 'Monthly Range Mode',
            // icon: Users,
            // count: count?.data?.pending,
            component: () => (
                <MonthlySchedule data={monthlyData} onChange={setMonthlyData} />
            ),
        },
    ]

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all">
            {/* Header */}
            <div className="bg-linear-to-r from-[#044866] to-[#0D5468] px-4 py-2 flex items-center justify-between">
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
                    onValueChange={(val: string) => {
                        setAvailabilityType(val as 'weekly' | 'monthly')
                    }}
                    className={'rounded!'}
                    tabsClasses="!p-1 !rounded-md"
                    tabsTriggerClasses="!py-1 !rounded-md"
                />

                {/* Action Footer */}
                <div className="border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-start gap-2 max-w-[70%]">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <p className="text-slate-500 text-xs leading-relaxed">
                            Changes will be immediately reflected in the student
                            booking portal.
                        </p>
                    </div>

                    {!hasPermission ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex">
                                    <Button
                                        onClick={handleSave}
                                        variant="primary"
                                        disabled={!hasPermission || isLoading}
                                    >
                                        {isLoading
                                            ? 'Saving...'
                                            : 'Save Availability'}
                                    </Button>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                Permission Not granted
                            </TooltipContent>
                        </Tooltip>
                    ) : (
                        <Button
                            onClick={handleSave}
                            variant="primary"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save Availability'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
