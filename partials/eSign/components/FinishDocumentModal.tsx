import { Button, Typography } from '@components'
import { MediaQueries } from '@constants'
import React from 'react'
import { MdCancel } from 'react-icons/md'
import { useMediaQuery } from 'react-responsive'
import {
    CheckCircle,
    AlertCircle,
    ArrowRight,
    PenTool,
    LayoutList,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { FieldsTypeEnum } from '@components/Esign/components/SidebarData'

interface FinishDocumentModalProps {
    asModal?: boolean
    customFieldsData: any
    remainingFields: any
    onFinishSignModal: () => void
    onCancelFinishSign: () => void
    onGoToSignFieldIfRemaining: any
}

export const FinishDocumentModal = ({
    onCancelFinishSign,
    remainingFields,
    customFieldsData,
    onFinishSignModal,
    onGoToSignFieldIfRemaining,
    asModal,
}: FinishDocumentModalProps) => {
    const isMobile = useMediaQuery(MediaQueries.Tablet)
    const hasRemainingFields = remainingFields && remainingFields.length > 0

    // Detect if any signature field is missing data or needs a re-sign
    const missingSignatureField = customFieldsData?.find((field: any) => {
        if (field?.type !== FieldsTypeEnum.Signature) return false

        const responses = field?.responses || []
        const latestResponse = responses.reduce(
            (acc: any, curr: any) =>
                !acc || new Date(curr.updatedAt) > new Date(acc.updatedAt)
                    ? curr
                    : acc,
            null
        )

        const needsReSign = latestResponse?.reSignRequested
        const hasData = field?.fieldValue || responses.length > 0

        // If a re-sign is requested, we treat it as missing even if old data exists
        return needsReSign || !hasData
    })

    // Detect if any other required fields (non-signature) are missing
    const otherRequiredFields = remainingFields?.find(
        (field: any) => field?.type !== FieldsTypeEnum.Signature
    )

    const ModalContent = () => (
        <div className="space-y-5">
            <div className="space-y-3">
                <AnimatePresence mode="wait">
                    {hasRemainingFields ? (
                        <motion.div
                            key="remaining"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex gap-3"
                        >
                            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <div className="space-y-0.5">
                                <h3 className="font-bold text-amber-900 text-sm">
                                    Action Required
                                </h3>
                                <p className="text-[13px] text-amber-800 leading-tight font-medium">
                                    {missingSignatureField &&
                                    otherRequiredFields ? (
                                        <>
                                            You have{' '}
                                            <strong>missing signatures</strong>{' '}
                                            and
                                            <strong> incomplete fields</strong>.
                                            Please complete required actions to
                                            finalize.
                                        </>
                                    ) : missingSignatureField ? (
                                        'Your signature is required to finalize this document.'
                                    ) : (
                                        'Please fill in all the required fields before finalizing.'
                                    )}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="complete"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-3"
                        >
                            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex gap-3">
                                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                    <h3 className="font-bold text-emerald-900 text-sm">
                                        Ready to Finalize
                                    </h3>
                                    <p className="text-[13px] text-emerald-800 leading-tight">
                                        Thank you for completing all fields. You
                                        can now finalize your e-signature.
                                    </p>
                                </div>
                            </div>
                            <div className="px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-100 italic">
                                <p className="text-[11px] text-slate-500 leading-tight">
                                    <span className="font-bold text-slate-700 not-italic uppercase tracking-tighter mr-1">
                                        Important:
                                    </span>
                                    "Finish Signing" will make your signature
                                    legally binding and lock the document.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex flex-col gap-2.5">
                {missingSignatureField && (
                    <motion.button
                        whileHover={{ scale: 1.01, x: 3 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() =>
                            onGoToSignFieldIfRemaining(missingSignatureField)
                        }
                        className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 text-white font-bold rounded-xl shadow transition-all bg-[#0066CC] hover:bg-[#0055AA] hover:shadow-lg"
                    >
                        <PenTool className="w-5 h-5" />
                        <span>Sign Document Now</span>
                        <ArrowRight className="w-4 h-4 transition-transform" />
                    </motion.button>
                )}

                {otherRequiredFields && (
                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => {
                            const firstField = remainingFields?.find(
                                (f: any) => f?.type !== FieldsTypeEnum.Signature
                            )
                            onGoToSignFieldIfRemaining(firstField)
                        }}
                        className={`w-full flex items-center justify-center gap-2.5 px-5 py-3 text-[#0066CC] font-bold rounded-xl border-2 border-[#0066CC]/15 hover:bg-blue-50 transition-all font-sans text-sm`}
                    >
                        <LayoutList className="w-4.5 h-4.5" />
                        <span>Fill Missing Fields</span>
                    </motion.button>
                )}

                <motion.button
                    whileHover={
                        !hasRemainingFields ? { scale: 1.01, x: 3 } : {}
                    }
                    whileTap={!hasRemainingFields ? { scale: 0.99 } : {}}
                    disabled={hasRemainingFields}
                    onClick={onFinishSignModal}
                    className={`group w-full flex items-center justify-center gap-2.5 px-5 py-3.5 text-white font-bold rounded-xl shadow transition-all ${
                        hasRemainingFields
                            ? 'bg-slate-300 cursor-not-allowed hidden'
                            : 'hover:shadow-lg active:shadow-inner'
                    }`}
                    style={{
                        background: hasRemainingFields
                            ? '#D1D5DB'
                            : 'linear-gradient(135deg, #00A651, #33B86E)',
                    }}
                >
                    <CheckCircle className="w-5 h-5" />
                    <span>Finish Signing</span>
                    {!hasRemainingFields && (
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    )}
                </motion.button>

                <button
                    onClick={onCancelFinishSign}
                    className="w-full py-1.5 text-slate-400 font-medium hover:text-slate-600 transition-colors text-xs underline underline-offset-4 decoration-slate-200"
                >
                    Cancel and Continue Editing
                </button>
            </div>
        </div>
    )

    if (asModal) {
        return (
            <div className="p-6">
                <div className="mb-5 space-y-0.5">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                        Finalize E-Signature
                    </h2>
                    <p className="text-slate-500 font-medium text-[13px]">
                        Please review status before completing.
                    </p>
                </div>
                <ModalContent />
            </div>
        )
    }

    return (
        <div
            id={'finishSign'}
            className="fixed inset-0 bg-slate-900/10 backdrop-blur-[1px] z-9999 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white w-full max-w-[440px] p-6 rounded-3xl shadow-[0_15px_40px_-12px_rgba(0,0,0,0.1)] border border-slate-100 relative"
            >
                <div className="flex justify-between items-start mb-5">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">
                            Finalize E-Signature
                        </h2>
                        <p className="text-slate-500 font-medium text-[13px] mt-0.5">
                            Review document status before completing.
                        </p>
                    </div>
                    <button
                        onClick={onCancelFinishSign}
                        className="p-1.5 hover:bg-slate-50 rounded-full transition-colors group"
                    >
                        <MdCancel className="text-slate-200 group-hover:text-slate-400 text-2xl" />
                    </button>
                </div>
                <ModalContent />
            </motion.div>
        </div>
    )
}
