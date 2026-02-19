import { CheckCircle2, Clock } from 'lucide-react'
import { AvailableDay } from './generateAvailabilityDays'
import moment from 'moment'

interface TimeSectionProps {
    selectedDay: AvailableDay | undefined
    selectedTime: string | null
    onTimeSelect: (time: string, slotId: number) => void
    isEnabled: boolean
}

export const TimeSection = ({
    selectedDay,
    selectedTime,
    onTimeSelect,
    isEnabled,
}: TimeSectionProps) => (
    <div
        style={{
            opacity: isEnabled ? 1 : 0.4,
            pointerEvents: isEnabled ? 'auto' : 'none',
            transition: 'all 0.3s ease',
        }}
    >
        <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
            <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                style={{
                    backgroundColor: isEnabled ? '#F7A619' : '#D1D5DB',
                }}
            >
                <Clock className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base text-gray-900">
                    Select Time
                </h3>
                <p className="text-xs text-gray-500 truncate">
                    {selectedDay
                        ? `${selectedDay.dayName}, ${selectedDay.month} ${selectedDay.dayNumber}`
                        : 'Choose a date first'}
                </p>
            </div>
        </div>

        {selectedDay && (
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                {selectedDay.slots.map((slot: any, index: number) => {
                    const isSelected = selectedTime === slot.time
                    const slotDateTime = moment(
                        `${selectedDay.date} ${slot.time}`,
                        'YYYY-MM-DD hh:mm A'
                    )

                    const isPastTime = slotDateTime.isBefore(moment())
                    const isDisabled = !slot.available || isPastTime
                    return (
                        <button
                            key={index}
                            onClick={() => {
                                if (!isDisabled) {
                                    onTimeSelect(slot?.time, slot?.id)
                                }
                            }}
                            disabled={isDisabled}
                            className="slot-card relative p-3 rounded-lg text-center touch-manipulation"
                            style={{
                                backgroundColor: !slot.available
                                    ? '#F9FAFB'
                                    : isSelected
                                      ? '#F7A619'
                                      : '#fff',
                                border: `2px solid ${
                                    !slot.available
                                        ? '#E5E7EB'
                                        : isSelected
                                          ? '#F7A619'
                                          : '#E5E7EB'
                                }`,
                                boxShadow: isSelected
                                    ? '0 6px 12px -3px rgba(247, 166, 25, 0.4)'
                                    : !slot.available
                                      ? 'none'
                                      : '0 1px 6px -1px rgba(0, 0, 0, 0.1)',
                                cursor: !slot.available
                                    ? 'not-allowed'
                                    : 'pointer',
                                animationDelay: `${index * 0.03}s`,
                                animation: 'fadeIn 0.3s ease-out forwards',
                                minHeight: '48px',
                            }}
                        >
                            <div
                                className={`text-xs ${
                                    !slot.available
                                        ? 'text-gray-400'
                                        : isSelected
                                          ? 'text-white'
                                          : 'text-gray-900'
                                }`}
                            >
                                {slot.time}
                            </div>
                            {!slot.available && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-full h-0.5 bg-gray-300 transform -rotate-12" />
                                </div>
                            )}
                            {isSelected && (
                                <div className="absolute -top-1 -right-1">
                                    <CheckCircle2
                                        className="w-4 h-4 text-white bg-green-500 rounded-full"
                                        fill="currentColor"
                                    />
                                </div>
                            )}
                        </button>
                    )
                })}
            </div>
        )}
    </div>
)
