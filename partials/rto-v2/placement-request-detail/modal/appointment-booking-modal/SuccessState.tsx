import { Calendar, CheckCircle2, Sparkles } from 'lucide-react'
import { AvailableDay } from './generateAvailabilityDays'

interface SuccessStateProps {
    selectedDay: AvailableDay | undefined
    selectedTime: string | null
    supervisorName?: string
}

export const SuccessState = ({
    selectedDay,
    selectedTime,
    supervisorName = 'Dr. Sarah Johnson',
}: SuccessStateProps) => (
    <div className="py-8 sm:py-12 text-center">
        <div
            className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full flex items-center justify-center mb-4 sm:mb-5 relative"
            style={{ backgroundColor: '#E8F3F7' }}
        >
            <div
                className="absolute inset-0 rounded-full"
                style={{
                    background:
                        'linear-gradient(135deg, #044866 0%, #0D5468 100%)',
                    animation: 'pulse 2s ease-in-out infinite',
                }}
            />
            <CheckCircle2
                className="w-8 h-8 sm:w-10 sm:h-10 text-white relative z-10"
                style={{
                    animation: 'fadeIn 0.5s ease-out',
                    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))',
                }}
            />
        </div>

        <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-4 h-4" style={{ color: '#F7A619' }} />
            <h3 className="text-lg sm:text-xl" style={{ color: '#044866' }}>
                Success!
            </h3>
            <Sparkles className="w-4 h-4" style={{ color: '#F7A619' }} />
        </div>

        <p className="text-xs sm:text-sm text-gray-600 mb-5 sm:mb-6 max-w-md mx-auto px-4">
            Your appointment has been confirmed. You'll receive a confirmation
            email shortly.
        </p>

        <div
            className="max-w-md mx-auto p-5 sm:p-6 rounded-xl"
            style={{
                background: 'linear-gradient(135deg, #E8F3F7 0%, #FEF3E7 100%)',
            }}
        >
            <div className="flex items-center justify-center gap-2 mb-3">
                <Calendar className="w-4 h-4" style={{ color: '#044866' }} />
                <p className="text-xs text-gray-600">Appointment Details</p>
            </div>

            <p
                className="text-base sm:text-lg mb-1.5"
                style={{ color: '#044866' }}
            >
                {selectedDay?.dayName}, {selectedDay?.month}{' '}
                {selectedDay?.dayNumber}, 2025
            </p>
            <p
                className="text-xl sm:text-2xl mb-3"
                style={{ color: '#F7A619' }}
            >
                {selectedTime}
            </p>

            <div className="pt-3 border-t border-gray-300">
                <p className="text-xs text-gray-600">with</p>
                <p className="text-sm text-gray-900">{supervisorName}</p>
            </div>
        </div>
    </div>
)
