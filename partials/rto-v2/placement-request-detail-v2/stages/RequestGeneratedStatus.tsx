import { motion } from 'framer-motion'
import { Button } from '@components'
import { WPProcessMatchingLoader } from '@partials/common/StudentProfileDetail/components/Workplace/components/IndustryDetail/components/WPProcessMatchingLoader'
import { useWorkplaceHook } from '@partials/common/StudentProfileDetail/components/Workplace/hooks'
import { ReRunWPAutomation } from '@partials/common/StudentProfileDetail/components'
import { FileText, Clock, Sparkles } from 'lucide-react'
import { ReactElement } from 'react'

interface IRequestGeneratedStatusProps {
    workplace: any
    setModal: (modal: ReactElement | null) => void
    onCancelModal: () => void
}

export const RequestGeneratedStatus = ({
    workplace,
    setModal,
    onCancelModal,
}: IRequestGeneratedStatusProps) => {
    const { autoApplyLoader } = useWorkplaceHook()

    const wpApprovalStatus = workplace?.workplaceApprovaleRequest?.filter(
        (req: any) =>
            req?.status !== 'rejected' && req?.rtoApprovalStatus !== 'rejected'
    )

    const handleReRunAutomation = () => {
        setModal(
            <ReRunWPAutomation workplace={workplace} onCancel={onCancelModal} />
        )
    }

    // No approval status - show automation option
    if (wpApprovalStatus?.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
            >
                {autoApplyLoader ? (
                    <WPProcessMatchingLoader />
                ) : (
                    <>
                        <div className="relative overflow-hidden p-4 bg-linear-to-br from-blue-50 to-cyan-50 border border-[#044866]/20 rounded-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#044866]/5 rounded-full -mr-16 -mt-16" />
                            <div className="relative flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <FileText className="h-5 w-5 text-[#044866]" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[#044866] font-medium">
                                        Workplace Request Created
                                    </p>
                                    <p className="text-[#0D5468] text-sm mt-1">
                                        Choose how to find a suitable industry
                                        placement.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Button
                            className="w-full bg-linear-to-r from-[#044866] via-[#0D5468] to-[#044866] hover:from-[#0D5468] hover:via-[#044866] hover:to-[#0D5468] text-white shadow-xl shadow-[#044866]/30 h-12 font-semibold transition-all duration-500 hover:shadow-2xl hover:shadow-[#044866]/40 hover:-translate-y-0.5"
                            onClick={handleReRunAutomation}
                        >
                            <Sparkles className="mr-2 h-5 w-5 animate-pulse" />{' '}
                            Re-Run Automation
                        </Button>
                    </>
                )}
            </motion.div>
        )
    }

    // Has approval status - show pending message
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
        >
            <div className="relative overflow-hidden p-4 bg-linear-to-br from-amber-50 to-orange-50 border border-[#F7A619]/30 rounded-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F7A619]/10 rounded-full -mr-16 -mt-16" />
                <div className="relative flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Clock className="h-5 w-5 text-[#F7A619]" />
                    </div>
                    <div className="flex-1">
                        <p className="text-amber-900 font-medium">
                            Request Generated
                        </p>
                        <p className="text-amber-600 text-xs mt-1">
                            Request Generated verify industry capacity
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
