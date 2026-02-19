import { motion } from 'framer-motion'
import { Button } from '@components'
import { CalendarCheck, CheckCircle2, Calendar } from 'lucide-react'

interface IAppointmentStatusProps {
    appointmentDate: string
    setShowAppointmentDialog: (show: boolean) => void
    onAppointmentSuccessful: () => void
}

export const AppointmentStatus = ({
    appointmentDate,
    setShowAppointmentDialog,
    onAppointmentSuccessful,
}: IAppointmentStatusProps) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
    >
        <div className="relative overflow-hidden p-4 bg-linear-to-br from-indigo-50 to-blue-50 border border-[#0D5468]/20 rounded-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0D5468]/5 rounded-full -mr-16 -mt-16" />
            <div className="relative flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                    <CalendarCheck className="h-5 w-5 text-[#0D5468]" />
                </div>
                <div className="flex-1">
                    <p className="text-[#0D5468] font-medium">
                        Appointment Stage
                    </p>
                    {appointmentDate && (
                        <p className="text-[#0D5468] text-sm mt-1">
                            Scheduled: {appointmentDate}
                        </p>
                    )}
                </div>
            </div>
        </div>

        {/* {!appointmentDate ? (
            <Button
                className="w-full bg-linear-to-r from-[#0D5468] to-[#044866] hover:from-[#044866] hover:to-[#0D5468] text-white shadow-lg shadow-[#0D5468]/20 h-11"
                onClick={() => setShowAppointmentDialog(true)}
            >
                <Calendar className="mr-2 h-4 w-4" /> Book Appointment
            </Button>
        ) : (
            <>
                <Button
                    className="w-full bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-lg shadow-emerald-600/20 h-11"
                    onClick={onAppointmentSuccessful}
                >
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Successful
                </Button>
                <Button
                    outline
                    variant="secondary"
                    className="w-full border-2 border-slate-200 hover:border-slate-300 h-11"
                    onClick={() => setShowAppointmentDialog(true)}
                >
                    <Calendar className="mr-2 h-4 w-4" /> Book Appointment
                </Button>
                <Button
                    outline
                    variant="secondary"
                    className="w-full border-2 border-slate-200 hover:border-slate-300 h-11"
                    onClick={() => setShowAppointmentDialog(true)}
                >
                    <Calendar className="mr-2 h-4 w-4" /> Reschedule
                </Button>
            </>
        )} */}
    </motion.div>
)
