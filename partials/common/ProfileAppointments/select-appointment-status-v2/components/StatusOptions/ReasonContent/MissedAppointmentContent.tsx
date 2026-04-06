import { Calendar } from 'lucide-react'
import { Button } from '@components'

export function MissedAppointmentContent() {
    return (
        <div className="mt-3 p-3 bg-white rounded-lg border-2 border-[#F7A619]/50 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-2">
                <div className="p-1.5 bg-[#F7A619]/10 rounded">
                    <Calendar className="w-4 h-4 text-[#F7A619]" />
                </div>
                <div className="flex-1">
                    <h4 className="text-xs font-semibold text-gray-900 mb-1">
                        Book Another Appointment
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                        The student missed the appointment. System will auto
                        generate another one.
                    </p>
                    {/* <Button
                        onClick={handleBookAnotherAppointment}
                        className="w-full h-8 text-xs bg-[#F7A619] hover:bg-[#F7A619]/90 text-white font-semibold"
                    >
                        <Calendar className="w-3 h-3 mr-1" />
                        Book New Appointment
                    </Button> */}
                </div>
            </div>
        </div>
    )
}
