import { ShowErrorNotifications } from '@components'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { UserRoles } from '@constants'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNotification } from '@hooks'
import { CommonApi } from '@redux'
import { cn } from '@utils'
import { motion } from 'framer-motion'
import {
    AlertCircle,
    Building2,
    GraduationCap,
    Send,
    Users,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

interface SendBackModalProps {
    isOpen: boolean
    documentTitle: string
    documentId: number
    signers?: any[]
    onClose: () => void
}

interface SendBackFormData {
    recipients: number[]
    reason: string
}

const schema = yup.object().shape({
    recipients: yup
        .array()
        .of(yup.number().required())
        .min(1, 'At least one recipient is required')
        .required('At least one recipient is required'),
    reason: yup
        .string()
        .min(10, 'Reason must be at least 10 characters')
        .required('Reason is required'),
})

export function SendBackModal({
    isOpen,
    documentTitle,
    documentId,
    signers,
    onClose,
}: SendBackModalProps) {
    const { notification } = useNotification()

    const {
        control,
        handleSubmit: handleFormSubmit,
        register,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<SendBackFormData>({
        mode: 'all',
        resolver: yupResolver(schema),
        defaultValues: {
            recipients: [],
            reason: '',
        },
    })

    const selectedRecipients = watch('recipients')
    const reason = watch('reason')

    const [sendBackForRevision, sendBackForRevisionResult] =
        CommonApi.ESign.sendBackForRevision()

    const toggleRecipient = (recipient: number) => {
        const current = selectedRecipients || []
        const updated = current.includes(recipient)
            ? current.filter((r) => r !== recipient)
            : [...current, recipient]
        setValue('recipients', updated, { shouldValidate: true })
    }

    const handleSubmit = async (data: SendBackFormData) => {
        try {
            const response = await sendBackForRevision({
                document: documentId,
                userIds: data.recipients,
                reason: data.reason,
            }).unwrap()

            if (Array.isArray(response)) {
                response.forEach((item: any) => {
                    const signer = signers?.find(
                        (s) => s?.user?.id === item.userId
                    )
                    const signerName =
                        signer?.user?.name || `User ${item.userId}`

                    if (item.status === 'success') {
                        notification.success({
                            title: 'Success',
                            description: `Document sent back to ${signerName} successfully`,
                        })
                    } else {
                        notification.error({
                            title: 'Failed',
                            description: `${signerName}: ${item.message || 'Failed to send back'}`,
                        })
                    }
                })
            } else {
                notification.success({
                    title: 'Success',
                    description: 'Document sent back for revision',
                })
            }
            onClose()
            reset()
        } catch (error) {
            console.error('Failed to send back:', error)
        }
    }

    const getRoleInfo = (role: string) => {
        switch (role) {
            case UserRoles.STUDENT:
                return {
                    label: 'Student',
                    description:
                        'Send the document back to the student for corrections',
                    icon: GraduationCap,
                }
            case UserRoles.INDUSTRY:
                return {
                    label: 'Industry Partner',
                    description:
                        'Send the document back to the industry partner for corrections',
                    icon: Building2,
                }
            case UserRoles.SUBADMIN:
            case UserRoles.MANAGER:
                return {
                    label: 'Coordinator',
                    description:
                        'Send to the assigned coordinator overseeing this process',
                    icon: Users,
                }
            default:
                return {
                    label: role.charAt(0).toUpperCase() + role.slice(1),
                    description: `Send back to ${role}`,
                    icon: Users,
                }
        }
    }

    const recipientOptions =
        signers
            ?.filter((s) => s?.user?.role !== UserRoles.RTO)
            ?.map((signer) => {
                const info = getRoleInfo(signer?.user?.role)
                return {
                    id: signer?.user?.id,
                    label: `${info.label} (${signer?.user?.name})`,
                    description: info.description,
                    icon: info.icon,
                }
            }) || []

    const isSelected = (id: number) => {
        return selectedRecipients.includes(id)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <ShowErrorNotifications result={sendBackForRevisionResult} />
            <DialogContent className="max-w-3xl! p-0 overflow-hidden rounded-2xl border-none shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh]">
                <DialogHeader
                    className="px-6 py-5 flex flex-row items-center justify-between space-y-0"
                    style={{
                        background: 'linear-gradient(to right, #FEE2E2, white)',
                        borderBottom: '1px solid #E2E8F0',
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="p-2 rounded-xl"
                            style={{
                                background:
                                    'linear-gradient(135deg, #E63946, #DC2626)',
                            }}
                        >
                            <Send className="w-5 h-5 text-white" />
                        </div>
                        <DialogTitle
                            className="text-xl md:text-2xl font-bold"
                            style={{ color: '#0F172A' }}
                        >
                            Send Back for Revision
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <div className="overflow-y-auto flex-1 custom-scrollbar">
                    <form
                        onSubmit={handleFormSubmit(handleSubmit)}
                        className="p-6 space-y-6"
                    >
                        <div>
                            <h3
                                className="font-bold mb-3"
                                style={{ color: '#0F172A' }}
                            >
                                Document Information
                            </h3>
                            <div
                                className="rounded-xl p-4 border"
                                style={{
                                    background: '#F8FAFC',
                                    borderColor: '#E2E8F0',
                                }}
                            >
                                <p
                                    className="text-sm"
                                    style={{ color: '#64748B' }}
                                >
                                    <strong style={{ color: '#0F172A' }}>
                                        Document:
                                    </strong>{' '}
                                    {documentTitle}
                                </p>
                            </div>
                        </div>

                        <div>
                            <label
                                className={cn(
                                    'block text-sm font-bold mb-4',
                                    errors.recipients && 'text-red-500'
                                )}
                            >
                                Send back to: *
                                {errors.recipients && (
                                    <span className="text-xs font-normal ml-2">
                                        ({errors.recipients.message})
                                    </span>
                                )}
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {recipientOptions.map((option, index) => {
                                    const Icon = option.icon
                                    const selected = isSelected(option.id)

                                    return (
                                        <motion.label
                                            key={option.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={cn(
                                                'flex flex-col gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all hover:border-[#0066CC]/50',
                                                selected
                                                    ? 'border-[#0066CC] bg-[#F0F9FF]'
                                                    : 'border-[#E2E8F0] bg-white',
                                                errors.recipients &&
                                                    'border-red-200'
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className={cn(
                                                            'p-1.5 rounded-lg',
                                                            selected
                                                                ? 'bg-[#0066CC]/10'
                                                                : 'bg-gray-100'
                                                        )}
                                                    >
                                                        <Icon
                                                            className="w-4 h-4"
                                                            style={{
                                                                color: selected
                                                                    ? '#0066CC'
                                                                    : '#64748B',
                                                            }}
                                                        />
                                                    </div>
                                                    <span
                                                        className="font-bold text-sm"
                                                        style={{
                                                            color: '#0F172A',
                                                        }}
                                                    >
                                                        {option.label}
                                                    </span>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={selected}
                                                    onChange={() =>
                                                        toggleRecipient(
                                                            option.id
                                                        )
                                                    }
                                                    className="w-4 h-4 rounded border-gray-300 focus:ring-2"
                                                    style={{
                                                        accentColor: '#0066CC',
                                                    }}
                                                />
                                            </div>
                                            <p
                                                className="text-xs leading-relaxed"
                                                style={{
                                                    color: selected
                                                        ? '#1E40AF'
                                                        : '#64748B',
                                                }}
                                            >
                                                {option.description}
                                            </p>
                                        </motion.label>
                                    )
                                })}
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="reason"
                                className={cn(
                                    'block text-sm font-bold mb-2',
                                    errors.reason && 'text-red-500'
                                )}
                            >
                                Reason for sending back *
                                {errors.reason && (
                                    <span className="text-xs font-normal ml-2">
                                        ({errors.reason.message})
                                    </span>
                                )}
                            </label>
                            <textarea
                                id="reason"
                                {...register('reason')}
                                rows={3}
                                className={cn(
                                    'w-full px-4 py-3 border-2 rounded-xl focus:outline-none resize-none transition-all placeholder:text-gray-400',
                                    errors.reason
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-[#E2E8F0]'
                                )}
                                placeholder="Please provide a detailed explanation of what needs to be corrected or revised..."
                                style={{
                                    color: '#0F172A',
                                }}
                            />
                            <p
                                className="mt-2 text-[11px]"
                                style={{ color: '#94A3B8' }}
                            >
                                💡 Be specific about what needs to be changed to
                                help expedite the revision process
                            </p>
                        </div>

                        <div
                            className="rounded-xl p-4 border-2"
                            style={{
                                background: '#FEF3C7',
                                borderColor: '#FCD34D',
                            }}
                        >
                            <h4
                                className="text-xs font-bold mb-1.5 flex items-center gap-2"
                                style={{ color: '#92400E' }}
                            >
                                <AlertCircle className="w-4 h-4" />
                                Important Note
                            </h4>
                            <p className="text-xs" style={{ color: '#78350F' }}>
                                The selected recipients will be notified via
                                email and will need to review and re-sign the
                                document before it returns to you.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={onClose}
                                className="flex-1 px-4 py-3 border-2 font-semibold rounded-xl transition-all text-sm"
                                style={{
                                    borderColor: '#E2E8F0',
                                    color: '#475569',
                                }}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                disabled={sendBackForRevisionResult?.isLoading}
                                className="flex-1 px-4 py-3 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                                style={{
                                    background:
                                        'linear-gradient(135deg, #E63946, #DC2626)',
                                }}
                            >
                                {sendBackForRevisionResult?.isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Send Back
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
