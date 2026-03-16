import { UserRoles } from '@constants'
import { useNotification } from '@hooks'
import { checkJsxVisibility } from '@utils'
import { motion } from 'framer-motion'
import { CheckCircle, FileText, Send } from 'lucide-react'
import { Activity, useState } from 'react'
import { SendBackModal } from '../modal'
import { SignatureBlocks } from './SignatureBlocks'
import { FieldsTypeEnum } from '@components/Esign/components/SidebarData'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@components/ui/tooltip'

interface EsignRightSidebarProps {
    documentDetail?: any
    currentRole: string
    onFinishSign?: () => void
    onSignatureClicked?: (sign: any) => void
    signatureFields?: any[]
}

export const EsignRightSidebar = ({
    documentDetail,
    currentRole,
    onFinishSign,
    onSignatureClicked,
    signatureFields,
}: EsignRightSidebarProps) => {
    const role = currentRole
    const { notification } = useNotification()
    const [openSendBack, setOpenSendBack] = useState(false)

    const findSignerByRole = (role: string) =>
        documentDetail?.signers?.find((s: any) => s?.user?.role === role)

    const signatureConfigs = [
        {
            signature: findSignerByRole(UserRoles.STUDENT),
            label: 'Student Signature',
        },
        {
            signature: findSignerByRole(UserRoles.INDUSTRY),
            label: 'Industry Partner',
        },
        {
            signature: findSignerByRole(UserRoles.RTO),
            label: 'RTO Approval',
        },
    ]

    const mySignature = findSignerByRole(role)

    const otherSigners = documentDetail?.signers?.filter(
        (s: any) => s?.user?.role !== UserRoles.RTO
    )
    const allOthersSigned =
        otherSigners?.length > 0 &&
        otherSigners?.every((s: any) => s?.status === 'signed')

    const isRtoAndOthersNotSigned = role === UserRoles.RTO && !allOthersSigned

    return (
        <div className="space-y-6">
            {/* Signature Progress */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-sm border p-4 md:p-6"
                style={{ borderColor: '#E2E8F0' }}
            >
                <h2
                    className="text-lg md:text-xl font-bold mb-6 flex items-center gap-2"
                    style={{ color: '#0F172A' }}
                >
                    <FileText
                        className="w-5 h-5"
                        style={{ color: '#0066CC' }}
                    />
                    Signature Progress
                </h2>

                <div className="space-y-4">
                    {signatureConfigs.map((config, index) => (
                        <SignatureBlocks
                            key={index}
                            signature={config.signature}
                            label={config.label}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Action Buttons */}
            <Activity
                mode={checkJsxVisibility(
                    role === UserRoles.RTO &&
                        mySignature?.status !== 'signed' &&
                        documentDetail?.status !== 'signed'
                )}
            >
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl shadow-sm border p-4 md:p-6"
                    style={{ borderColor: '#E2E8F0' }}
                >
                    <h2
                        className="text-lg md:text-xl font-bold mb-4"
                        style={{ color: '#0F172A' }}
                    >
                        RTO Actions
                    </h2>
                    <div className="space-y-3">
                        <Activity
                            mode={checkJsxVisibility(
                                signatureFields?.some(
                                    (f) => f.type === FieldsTypeEnum.Signature
                                ) || false
                            )}
                        >
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    if (
                                        signatureFields &&
                                        signatureFields.length > 0
                                    ) {
                                        const firstUnsignedSignature =
                                            signatureFields.find(
                                                (f) =>
                                                    !f.fieldValue &&
                                                    f.type ===
                                                        FieldsTypeEnum.Signature
                                            )
                                        if (firstUnsignedSignature) {
                                            onSignatureClicked?.(
                                                firstUnsignedSignature
                                            )
                                        } else {
                                            const firstSignature =
                                                signatureFields.find(
                                                    (f) =>
                                                        f.type ===
                                                        FieldsTypeEnum.Signature
                                                )
                                            onSignatureClicked?.(firstSignature)
                                        }
                                    }
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                                style={{
                                    background:
                                        'linear-gradient(135deg, #0066CC, #3385D6)',
                                }}
                            >
                                <CheckCircle className="w-5 h-5" />
                                Sign Document
                            </motion.button>
                        </Activity>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="w-full">
                                        <motion.button
                                            whileHover={
                                                !isRtoAndOthersNotSigned
                                                    ? { scale: 1.02 }
                                                    : {}
                                            }
                                            whileTap={
                                                !isRtoAndOthersNotSigned
                                                    ? { scale: 0.98 }
                                                    : {}
                                            }
                                            disabled={isRtoAndOthersNotSigned}
                                            onClick={onFinishSign}
                                            className={`w-full flex items-center justify-center gap-2 px-4 py-4 text-white font-semibold rounded-xl shadow-lg transition-all mt-4 ${
                                                isRtoAndOthersNotSigned
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : 'hover:shadow-xl'
                                            }`}
                                            style={{
                                                background:
                                                    'linear-gradient(135deg, #00A651, #33B86E)',
                                            }}
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            Finish Signing
                                        </motion.button>
                                    </div>
                                </TooltipTrigger>
                                {isRtoAndOthersNotSigned && (
                                    <TooltipContent>
                                        <p>
                                            Waiting for other parties to sign
                                            before RTO can finish.
                                        </p>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </TooltipProvider>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setOpenSendBack(true)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                            style={{
                                background:
                                    'linear-gradient(135deg, #E63946, #DC2626)',
                            }}
                        >
                            <Send className="w-5 h-5" />
                            Send Back for Revision
                        </motion.button>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 p-4 rounded-xl border"
                        style={{
                            background: '#DBEAFE',
                            borderColor: '#93C5FD',
                        }}
                    >
                        <p
                            className="text-xs font-medium"
                            style={{ color: '#1E40AF' }}
                        >
                            💡 Review the document carefully before signing. You
                            can send it back if revisions are needed.
                        </p>
                    </motion.div>
                </motion.div>
            </Activity>

            <Activity
                mode={checkJsxVisibility(
                    documentDetail?.status !== 'signed' &&
                        mySignature?.status !== 'signed' &&
                        role !== UserRoles.RTO
                )}
            >
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-xl shadow-sm border p-4 md:p-6"
                    style={{ borderColor: '#E2E8F0' }}
                >
                    <h2
                        className="text-lg md:text-xl font-bold mb-4"
                        style={{ color: '#0F172A' }}
                    >
                        Your Action Required
                    </h2>
                    <Activity
                        mode={checkJsxVisibility(
                            signatureFields?.some(
                                (f) => f.type === FieldsTypeEnum.Signature
                            ) || false
                        )}
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                if (
                                    signatureFields &&
                                    signatureFields.length > 0
                                ) {
                                    const firstUnsignedSignature =
                                        signatureFields.find(
                                            (f) =>
                                                !f.fieldValue &&
                                                f.type ===
                                                    FieldsTypeEnum.Signature
                                        )
                                    if (firstUnsignedSignature) {
                                        onSignatureClicked?.(
                                            firstUnsignedSignature
                                        )
                                    } else {
                                        const firstSignature =
                                            signatureFields.find(
                                                (f) =>
                                                    f.type ===
                                                    FieldsTypeEnum.Signature
                                            )
                                        onSignatureClicked?.(firstSignature)
                                    }
                                }
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                            style={{
                                background:
                                    'linear-gradient(135deg, #0066CC, #3385D6)',
                            }}
                        >
                            <CheckCircle className="w-5 h-5" />
                            Sign Document
                        </motion.button>
                    </Activity>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onFinishSign}
                        className="w-full flex items-center justify-center gap-2 px-4 py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all mt-4"
                        style={{
                            background:
                                'linear-gradient(135deg, #00A651, #33B86E)',
                        }}
                    >
                        <CheckCircle className="w-5 h-5" />
                        Finish Signing
                    </motion.button>
                </motion.div>
            </Activity>

            {documentDetail?.status === 'signed' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-xl p-4 md:p-6 border-2 shadow-md"
                    style={{ background: '#D4F4E2', borderColor: '#86EFAC' }}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', bounce: 0.5 }}
                        >
                            <CheckCircle
                                className="w-8 h-8"
                                style={{ color: '#00A651' }}
                            />
                        </motion.div>
                        <h3
                            className="text-lg font-bold"
                            style={{ color: '#065F46' }}
                        >
                            Document Completed
                        </h3>
                    </div>
                    <p className="text-sm" style={{ color: '#047857' }}>
                        ✓ This document has been signed by all parties and is
                        now complete.
                    </p>
                </motion.div>
            )}
            <SendBackModal
                isOpen={openSendBack}
                signers={documentDetail?.signers}
                documentId={documentDetail?.id}
                onClose={() => setOpenSendBack(false)}
                documentTitle={documentDetail?.template?.name || ''}
            />
        </div>
    )
}
