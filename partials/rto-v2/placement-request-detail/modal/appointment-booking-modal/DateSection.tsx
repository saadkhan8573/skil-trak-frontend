import { Calendar, Info } from 'lucide-react'
import { AvailableDay } from './generateAvailabilityDays'
import moment from 'moment'

interface DateSectionProps {
    availableDays: AvailableDay[]
    selectedDate: string | null
    onDateSelect: (date: string) => void
}

export const DateSection = ({
    availableDays,
    selectedDate,
    onDateSelect,
}: DateSectionProps) => (
    <div>
        <div className="mb-4 sm:mb-6">
            <div className="flex items-center gap-2.5 mb-2">
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: '#044866' }}
                >
                    <Info className="w-4 h-4" />
                </div>

                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">
                    Instructions
                </h2>
            </div>
            <div className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                <p>
                    The below available dates and time slots have been provided
                    directly by the industry to schedule your appointment with
                    the workplace supervisor.
                </p>
                <p>
                    Please select your preferred date first, then choose an
                    available time slot.
                </p>
                <p>
                    Kindly ensure you attend the scheduled appointment, as this
                    is an important step in confirming your placement.
                </p>
            </div>
        </div>
        <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
            <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: '#044866' }}
            >
                <Calendar className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base text-gray-900">
                    Select Date
                </h3>
                <p className="text-xs text-gray-500 hidden sm:block">
                    Choose your preferred day
                </p>
            </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {availableDays.map((day, index) => {
                const isSelected = selectedDate === day.date
                const availableCount = day.slots.filter(
                    (s: any) => s.available
                ).length
                const isPastDate = moment(day.date)
                    .endOf('day')
                    .isBefore(moment())
                return (
                    <button
                        key={day.date}
                        onClick={() => !isPastDate && onDateSelect(day.date)}
                        disabled={isPastDate}
                        title={
                            isPastDate
                                ? 'This date has already passed please update the industry availability'
                                : `${availableCount} slots available`
                        }
                        className={`day-card group relative p-3 sm:p-4 rounded-lg sm:rounded-xl text-center touch-manipulation ${
                            isPastDate
                                ? 'opacity-50 cursor-not-allowed'
                                : 'cursor-pointer'
                        }`}
                        style={{
                            backgroundColor: isSelected ? '#044866' : '#fff',
                            border: `2px solid ${
                                isSelected ? '#044866' : '#E5E7EB'
                            }`,
                            boxShadow: isSelected
                                ? '0 6px 12px -3px rgba(4, 72, 102, 0.3)'
                                : '0 1px 6px -1px rgba(0, 0, 0, 0.1)',
                            animationDelay: `${index * 0.05}s`,
                            animation: 'fadeIn 0.4s ease-out forwards',
                        }}
                    >
                        <div className="mb-1.5 sm:mb-2">
                            <div
                                className={`text-xs uppercase tracking-wide mb-1 sm:mb-1.5 ${
                                    isSelected
                                        ? 'text-white text-opacity-70'
                                        : 'text-gray-500'
                                }`}
                                style={{ fontSize: '10px' }}
                            >
                                {day.month}
                            </div>
                            <div
                                className={`text-2xl sm:text-3xl mb-0.5 leading-none ${
                                    isSelected ? 'text-white' : 'text-gray-900'
                                }`}
                            >
                                {day.dayNumber}
                            </div>
                            <div
                                className={`text-xs ${
                                    isSelected
                                        ? 'text-white text-opacity-90'
                                        : 'text-gray-600'
                                }`}
                            >
                                {day.dayName}
                            </div>
                        </div>

                        <div
                            className="inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-full"
                            style={{
                                backgroundColor: isSelected
                                    ? '#F7A619'
                                    : '#F3F4F6',
                                color: isSelected ? '#fff' : '#6B7280',
                                fontSize: '10px',
                            }}
                        >
                            <div
                                className="w-1 h-1 rounded-full"
                                style={{
                                    backgroundColor: isSelected
                                        ? '#fff'
                                        : '#10B981',
                                }}
                            />
                            {availableCount} slots
                        </div>

                        {isSelected && (
                            <div
                                className="absolute inset-0 rounded-lg sm:rounded-xl opacity-20"
                                style={{
                                    background:
                                        'linear-gradient(135deg, #F7A619 0%, transparent 100%)',
                                    pointerEvents: 'none',
                                }}
                            />
                        )}
                    </button>
                )
            })}
        </div>
    </div>
)
