import { Checkbox, TextInput } from '@components'

interface WeeklyAvailabilitySectionProps {
    weekSchedule: Array<{
        day: string
        available: boolean
        startTime: string
        endTime: string
    }>
}

export function WeeklyAvailabilitySection({
    weekSchedule,
}: WeeklyAvailabilitySectionProps) {
    return (
        <div>
            <h4 className="text-xs font-bold text-gray-900 mb-2">
                Weekly Availability
            </h4>
            <div className="space-y-2">
                {weekSchedule.map((daySchedule, index) => (
                    <DayScheduleRow
                        key={daySchedule.day}
                        index={index}
                        daySchedule={daySchedule}
                    />
                ))}
            </div>
        </div>
    )
}

interface DayScheduleRowProps {
    index: number
    daySchedule: {
        day: string
        available: boolean
        startTime: string
        endTime: string
    }
}

function DayScheduleRow({ index, daySchedule }: DayScheduleRowProps) {
    return (
        <div
            className={`grid grid-cols-1 lg:grid-cols-12 gap-2 items-center p-2 rounded-lg border transition-all duration-200 ${
                daySchedule.available
                    ? 'bg-white border-[#0D5468] shadow-sm'
                    : 'bg-slate-50 border-slate-200'
            }`}
        >
            {/* Day name and checkbox */}
            <div className="lg:col-span-3 flex items-center gap-2">
                <Checkbox
                    name={`weekSchedule.${index}.available`}
                    label={daySchedule.day}
                />
            </div>

            {/* Time inputs */}
            <div className="lg:col-span-9 grid sm:grid-cols-2 gap-2">
                <TextInput
                    name={`weekSchedule.${index}.startTime`}
                    type="time"
                    label="Start Time"
                />
                <TextInput
                    name={`weekSchedule.${index}.endTime`}
                    type="time"
                    label="End Time"
                />
            </div>
        </div>
    )
}
