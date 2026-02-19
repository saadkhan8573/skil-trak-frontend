import { motion } from 'framer-motion'
import { Button } from '@components'
import { FileCheck, CalendarCheck } from 'lucide-react'

interface IProvidedAgreementSignedStatusProps {
    setShowScheduleDialog: (show: boolean) => void
}

export const ProvidedAgreementSignedStatus = ({
    setShowScheduleDialog,
}: IProvidedAgreementSignedStatusProps) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
    >
        <div className="relative overflow-hidden p-4 bg-linear-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/30 rounded-full -mr-16 -mt-16" />
            <div className="relative flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                    <FileCheck className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                    <p className="text-green-900 font-medium">
                        Agreement Signed
                    </p>
                    <p className="text-green-700 text-sm mt-1">
                        Ready to start placement
                    </p>
                </div>
            </div>
        </div>

        <Button
            className="w-full bg-linear-to-r from-[#044866] via-[#0D5468] to-[#044866] hover:from-[#0D5468] hover:via-[#044866] hover:to-[#0D5468] text-white shadow-xl shadow-[#044866]/30 h-12 font-semibold transition-all duration-500 hover:shadow-2xl hover:shadow-[#044866]/40 hover:-translate-y-0.5"
            onClick={() => setShowScheduleDialog(true)}
        >
            <CalendarCheck className="mr-2 h-5 w-5" /> Add Placement Schedule
        </Button>
    </motion.div>
)
