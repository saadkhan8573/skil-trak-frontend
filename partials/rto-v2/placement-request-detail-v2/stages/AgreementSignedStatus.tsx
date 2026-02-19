import { motion } from 'framer-motion'
import { Button } from '@components'
import { FileCheck, CalendarCheck } from 'lucide-react'

interface IAgreementSignedStatusProps {
    setShowScheduleDialog: (show: boolean) => void
}

export const AgreementSignedStatus = ({
    setShowScheduleDialog,
}: IAgreementSignedStatusProps) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
    >
        <div className="relative overflow-hidden p-4 bg-linear-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/30 rounded-full -mr-16 -mt-16" />
            <div className="relative flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                    <FileCheck className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                    <p className="text-emerald-900 font-medium">
                        Agreement Signed
                    </p>
                    <p className="text-emerald-700 text-sm mt-1">
                        Confirm schedule to proceed
                    </p>
                </div>
            </div>
        </div>

        <Button
            className="w-full bg-linear-to-r from-[#044866] to-[#0D5468] hover:from-[#0D5468] hover:to-[#044866] text-white shadow-lg shadow-[#044866]/20 h-11"
            onClick={() => setShowScheduleDialog(true)}
        >
            <CalendarCheck className="mr-2 h-4 w-4" /> Confirm Schedule
        </Button>
    </motion.div>
)
