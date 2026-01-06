import { useState } from 'react'
import { Button } from '@components'
import { useNotification } from '@hooks'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Building2, CheckCircle, User, X } from 'lucide-react'

interface ConfirmHighlightedTasksModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (method: 'industry' | 'sourcing' | 'direct') => void
    isLoading?: boolean
}

export function ConfirmHighlightedTasksModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
}: ConfirmHighlightedTasksModalProps) {
    const [selectedMethod, setSelectedMethod] = useState<
        'industry' | 'sourcing' | 'direct' | null
    >(null)
    const { notification } = useNotification()
    const handleConfirm = () => {
        if (!selectedMethod) {
            notification.error({
                title: 'Please select a confirmation method',
                description: 'Please select a confirmation method',
            })
            return
        }
        onConfirm(selectedMethod)
        onClose()
        setSelectedMethod(null)
    }

    if (!isOpen) return null

    const confirmationMethods = [
        {
            id: 'industry' as const,
            title: 'Industry Partner',
            description: 'Confirmed directly with workplace supervisor',
            icon: Building2,
            color: 'from-[#044866] to-[#0D5468]',
            bgColor: 'bg-[#044866]/10',
            textColor: 'text-[#044866]',
        },
        {
            id: 'sourcing' as const,
            title: 'Sourcing Team',
            description: 'Confirmed through internal sourcing team',
            icon: User,
            color: 'from-[#F7A619] to-[#EA580C]',
            bgColor: 'bg-[#F7A619]/10',
            textColor: 'text-[#F7A619]',
        },
        {
            id: 'direct' as const,
            title: 'Direct Contact',
            description: 'Confirmed through direct communication',
            icon: CheckCircle,
            color: 'from-[#10B981] to-[#059669]',
            bgColor: 'bg-[#10B981]/10',
            textColor: 'text-[#10B981]',
        },
    ]

    return (
        <AnimatePresence>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="task-confirmation-title"
            >
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    aria-hidden="true"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="relative bg-gradient-to-br from-[#F7A619] to-[#EA580C] px-6 py-5">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        <div className="relative flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                                        <AlertCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2
                                            id="task-confirmation-title"
                                            className="text-xl font-bold text-white"
                                        >
                                            Confirm Highlighted Tasks
                                        </h2>
                                        <p className="text-sm text-white/80 mt-0.5">
                                            Select confirmation method to verify tasks
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all"
                                aria-label="Close dialog"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Confirmation Details */}
                        <div className="bg-gradient-to-br from-[#F8FAFB] to-white rounded-xl p-4 border-2 border-[#E2E8F0] mb-6">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F7A619] to-[#EA580C] flex items-center justify-center flex-shrink-0">
                                    <AlertCircle className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-[#64748B] uppercase tracking-wide font-semibold mb-1">
                                        Confirmation Required
                                    </p>
                                    <p className="text-sm text-[#1A2332] font-medium">
                                        You are confirming that the highlighted tasks have been verified.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Confirmation Methods */}
                        <div className="space-y-3 mb-6">
                            <p className="text-xs font-bold text-[#1A2332] uppercase tracking-wide mb-3">
                                Select Confirmation Method
                            </p>
                            {confirmationMethods.map((method) => {
                                const Icon = method.icon
                                const isSelected = selectedMethod === method.id
                                return (
                                    <motion.button
                                        key={method.id}
                                        onClick={() =>
                                            setSelectedMethod(method.id)
                                        }
                                        whileHover={{ scale: 1.02, x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full text-left rounded-xl p-4 border-2 transition-all duration-300 ${isSelected
                                                ? `bg-gradient-to-br ${method.bgColor} border-[#F7A619] shadow-lg`
                                                : 'bg-white border-[#E2E8F0] hover:border-[#F7A619]/30 hover:shadow-md'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center shadow-md`}
                                            >
                                                <Icon className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p
                                                    className={`text-sm font-bold mb-0.5 ${isSelected
                                                            ? method.textColor
                                                            : 'text-[#1A2332]'
                                                        }`}
                                                >
                                                    {method.title}
                                                </p>
                                                <p className="text-xs text-[#64748B]">
                                                    {method.description}
                                                </p>
                                            </div>
                                            {isSelected && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="w-6 h-6 rounded-full bg-[#F7A619] flex items-center justify-center"
                                                >
                                                    <CheckCircle
                                                        className="w-4 h-4 text-white"
                                                        fill="currentColor"
                                                    />
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.button>
                                )
                            })}
                        </div>

                        {/* Info Note */}
                        <div className="bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] rounded-lg p-3 border border-[#BFDBFE] mb-6">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-[#1E40AF]">
                                    This confirmation will be recorded with your
                                    name and timestamp for compliance tracking.
                                </p>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex items-center justify-end gap-3">
                            <Button
                                onClick={onClose}
                                className="px-4 py-2 bg-white border-2 border-[#E2E8F0] text-[#64748B] font-bold rounded-lg hover:bg-[#F8FAFB] hover:border-[#CBD5E1] transition-all"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                disabled={!selectedMethod || isLoading}
                                loading={isLoading}
                                className={`px-4 py-2 font-bold rounded-lg transition-all ${selectedMethod
                                        ? 'bg-gradient-to-br from-[#F7A619] to-[#EA580C] text-white shadow-lg hover:shadow-xl'
                                        : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
                                    }`}
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Confirm Tasks
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
