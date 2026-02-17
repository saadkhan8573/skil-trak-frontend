import { Button } from "@components"
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react"
import { AvailableDay } from "./generateAvailabilityDays"

interface BookingFooterProps {
    selectedDate: string | null
    selectedTime: string | null
    selectedDay: AvailableDay | undefined
    isLoading: boolean
    onBooking: () => void
}

export const BookingFooter = ({
    selectedDate,
    selectedTime,
    selectedDay,
    isLoading,
    onBooking,
}: BookingFooterProps) => {
    const isButtonDisabled = !selectedDate || !selectedTime || isLoading

    return (
        <div
            className="px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 border-t"
            style={{
                borderColor: '#E5E7EB',
                background: 'linear-gradient(to top, #F9FAFB 0%, #fff 100%)',
                boxShadow: '0 -3px 5px -1px rgba(0, 0, 0, 0.05)',
            }}
        >
            <div className="flex-1 min-w-0">
                {selectedDate && selectedTime ? (
                    <div className="flex items-center gap-2 sm:gap-2.5">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: '#E8F3F7' }}
                        >
                            <CheckCircle2
                                className="w-4 h-4"
                                style={{ color: '#044866' }}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 hidden sm:block">
                                Ready to confirm
                            </p>
                            <p
                                className="text-xs sm:text-sm truncate"
                                style={{ color: '#044866' }}
                            >
                                {selectedDay?.dayName}, {selectedDay?.month}{' '}
                                {selectedDay?.dayNumber}
                                <span className="mx-1.5">•</span>
                                <span style={{ color: '#F7A619' }}>
                                    {selectedTime}
                                </span>
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 sm:gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                            <Sparkles className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-gray-600">
                                Select date & time
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <Button
                loading={isLoading}
                onClick={onBooking}
                disabled={isButtonDisabled}
                Icon={ArrowRight}
                text="Confirm Booking"
                variant="primaryNew"
            />
        </div>
    )
}
