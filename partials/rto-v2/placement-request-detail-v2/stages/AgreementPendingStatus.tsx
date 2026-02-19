import { motion } from 'framer-motion'
import { Button } from '@components'
import { AgreementModal } from '@partials/rto-v2/placement-request-detail/modal'
import { FileSignature } from 'lucide-react'

interface IAgreementPendingStatusProps {
    workplace: any
    student: any
    showAgreementDialog: boolean
    setShowAgreementDialog: (show: boolean) => void
    onAgreementSigned: () => void
}

export const AgreementPendingStatus = ({
    workplace,
    student,
    showAgreementDialog,
    setShowAgreementDialog,
    onAgreementSigned,
}: IAgreementPendingStatusProps) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
    >
        <div className="relative overflow-hidden p-4 bg-linear-to-br from-indigo-50 to-purple-50 border border-[#0D5468]/20 rounded-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0D5468]/5 rounded-full -mr-16 -mt-16" />
            <div className="relative flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                    <FileSignature className="h-5 w-5 text-[#0D5468]" />
                </div>
                <div className="flex-1">
                    <p className="text-[#0D5468] font-medium">
                        Agreement & Eligibility Pending
                    </p>
                    <p className="text-[#0D5468] text-sm mt-1">
                        Generate or upload placement agreement
                    </p>
                </div>
            </div>
        </div>

        <Button
            className="w-full bg-linear-to-r from-[#0D5468] to-[#044866] hover:from-[#044866] hover:to-[#0D5468] text-white shadow-lg shadow-[#0D5468]/20 h-11"
            onClick={() => setShowAgreementDialog(true)}
        >
            <FileSignature className="mr-2 h-4 w-4" /> Generate Agreement
        </Button>

        {showAgreementDialog && (
            <AgreementModal
                open={showAgreementDialog}
                onClose={() => setShowAgreementDialog(false)}
                onConfirm={onAgreementSigned}
                workplace={workplace}
                student={student}
            />
        )}
    </motion.div>
)
