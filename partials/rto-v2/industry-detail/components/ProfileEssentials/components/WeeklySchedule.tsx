import { Select } from '@components'
import { Clock, CalendarDays } from 'lucide-react'
import { OptionType } from '@types'

export interface DaySchedule {
    day: string
    isActive: boolean
    slots: { startTime: string; endTime: string }[]
}

interface WeeklyScheduleProps {
    schedule: DaySchedule[]
    onChange: (schedule: DaySchedule[]) => void
}

const weekDays = [
    { key: 'monday', label: 'Mon', full: 'Monday' },
    { key: 'tuesday', label: 'Tue', full: 'Tuesday' },
    { key: 'wednesday', label: 'Wed', full: 'Wednesday' },
    { key: 'thursday', label: 'Thu', full: 'Thursday' },
    { key: 'friday', label: 'Fri', full: 'Friday' },
    { key: 'saturday', label: 'Sat', full: 'Saturday' },
    { key: 'sunday', label: 'Sun', full: 'Sunday' },
]

const timeSlotPresets: OptionType[] = [
    { label: 'Morning (9:00 AM - 12:00 PM)', value: 'morning' },
    { label: 'Afternoon (1:00 PM - 5:00 PM)', value: 'afternoon' },
    { label: 'All Day (9:00 AM - 5:00 PM)', value: 'allday' },
    { label: 'Custom', value: 'custom' },
]

export function WeeklySchedule({ schedule, onChange }: WeeklyScheduleProps) {
    const handleToggleDay = (dayKey: string) => {
        const newSchedule = schedule.map((day) => {
            if (day.day === dayKey) {
                return {
                    ...day,
                    isActive: !day.isActive,
                    // If activating, ensure there is exactly one slot
                    slots: !day.isActive
                        ? [{ startTime: '09:00', endTime: '12:00' }]
                        : [], // Clear slots if deactivating
                }
            }
            return day
        })
        onChange(newSchedule)
    }

    const detectPreset = (start: string, end: string): string => {
        if (start === '09:00' && end === '12:00') return 'morning'
        if (start === '13:00' && end === '17:00') return 'afternoon'
        if (start === '09:00' && end === '17:00') return 'allday'
        return 'custom'
    }

    const handlePresetChange = (dayKey: string, value: string) => {
        let newStart = '09:00'
        let newEnd = '12:00'

        if (value === 'morning') {
            newStart = '09:00'
            newEnd = '12:00'
        } else if (value === 'afternoon') {
            newStart = '13:00'
            newEnd = '17:00'
        } else if (value === 'allday') {
            newStart = '09:00'
            newEnd = '17:00'
        } else {
            // Default to a non-preset time to ensure custom inputs are shown
            // 09:00 - 18:00 does not match any preset
            newStart = '09:00'
            newEnd = '18:00'
        }

        const newSchedule = schedule.map((day) => {
            if (day.day === dayKey) {
                // Ensure exactly one slot with the new times
                return {
                    ...day,
                    slots: [{ startTime: newStart, endTime: newEnd }],
                }
            }
            return day
        })
        onChange(newSchedule)
    }

    const handleTimeChange = (
        dayKey: string,
        field: 'startTime' | 'endTime',
        value: string
    ) => {
        const newSchedule = schedule.map((day) => {
            if (day.day === dayKey) {
                const currentSlot = day.slots[0] || {
                    startTime: '09:00',
                    endTime: '17:00',
                }
                const newSlot = { ...currentSlot, [field]: value }
                return { ...day, slots: [newSlot] }
            }
            return day
        })
        onChange(newSchedule)
    }

    return (
        <div className="space-y-3 animate-in fade-in duration-500">
            {/* Day Selector - Horizontal Strip */}
            <div className="bg-white px-4 py-2 rounded border border-slate-100 shadow-sm">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-emerald-500" />
                    Select Working Days
                </label>
                <div className="flex justify-between items-center gap-2">
                    {weekDays.map((day) => {
                        const isSelected = schedule.find(
                            (s) => s.day === day.key
                        )?.isActive
                        return (
                            <button
                                key={day.key}
                                onClick={() => handleToggleDay(day.key)}
                                className={`
                                    flex-1 h-6 cursor-pointer rounded-sm flex flex-col items-center justify-center transition-all duration-200 border
                                    ${isSelected
                                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-200 shadow-lg scale-105'
                                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600'
                                    }
                                `}
                            >
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                                    {day.full.substring(0, 3)}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Active Days Slots */}
            <div className="space-y-2">
                {schedule
                    .filter((d) => d.isActive)
                    .map((day) => {
                        const dayLabel = weekDays.find(
                            (w) => w.key === day.day
                        )?.full

                        // Ensure there's a slot to render
                        const slot = day.slots[0] || {
                            startTime: '09:00',
                            endTime: '12:00',
                        }
                        const currentPreset = detectPreset(
                            slot.startTime,
                            slot.endTime
                        )

                        return (
                            <div
                                key={day.day}
                                className="bg-white rounded border border-slate-200 px-4 py-1 shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="flex items-center gap-3 w-32">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs uppercase flex-shrink-0">
                                            {dayLabel?.substring(0, 3)}
                                        </div>
                                        <h4 className="font-semibold text-slate-800 text-sm">
                                            {dayLabel}
                                        </h4>
                                    </div>

                                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
                                        <div className="w-full sm:w-1/2">
                                            <Select
                                                name={`preset-${day.day}`}
                                                options={timeSlotPresets}
                                                value={currentPreset}
                                                onChange={(opt: any) =>
                                                    handlePresetChange(
                                                        day.day,
                                                        opt.value
                                                    )
                                                }
                                                className="w-full text-xs"
                                                showError={false}
                                            />
                                        </div>

                                        {currentPreset === 'custom' ? (
                                            <div className="flex items-center gap-2 flex-1 animate-in fade-in zoom-in-95 duration-200">
                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                <div className="flex items-center gap-2 flex-1">
                                                    <input
                                                        type="time"
                                                        value={slot.startTime}
                                                        onChange={(e) =>
                                                            handleTimeChange(
                                                                day.day,
                                                                'startTime',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-500 w-full cursor-pointer transition-colors hover:border-emerald-300"
                                                    />
                                                    <span className="text-slate-400 font-light text-[10px] uppercase">
                                                        to
                                                    </span>
                                                    <input
                                                        type="time"
                                                        value={slot.endTime}
                                                        onChange={(e) =>
                                                            handleTimeChange(
                                                                day.day,
                                                                'endTime',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-500 w-full text-right cursor-pointer transition-colors hover:border-emerald-300"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex-1 text-xs text-slate-400 italic flex items-center gap-2 animate-in fade-in">
                                                <Clock className="w-3 h-3 text-slate-300" />
                                                {slot.startTime} -{' '}
                                                {slot.endTime}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                {schedule.filter((d) => d.isActive).length === 0 && (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 text-sm">
                            Select days above to configure availability
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
