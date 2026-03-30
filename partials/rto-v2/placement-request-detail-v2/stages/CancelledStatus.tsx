import { motion } from 'framer-motion'
import { XCircle } from 'lucide-react'

interface ICancelledStatusProps {
    reason: string
    title: string
}

export const CancelledStatus = ({ reason, title }: ICancelledStatusProps) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
    >
        <div className="relative overflow-hidden p-5 bg-linear-to-br from-red-50 via-rose-50 to-orange-50 border-2 border-red-200 rounded-xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-red-200/20 rounded-full -mr-20 -mt-20" />

            <div className="relative flex items-start gap-4">
                <div className="p-3 bg-linear-to-br from-red-500 to-rose-600 rounded-xl shadow-lg shadow-red-200">
                    <XCircle className="h-6 w-6 text-white" />
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <p className="text-red-900 font-bold text-lg">
                            {title}
                        </p>
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">
                            Cancelled
                        </span>
                    </div>
                    <p className="text-red-700 text-sm mt-1 leading-relaxed">
                        This placement process has been cancelled and is no
                        longer active. Please contact your supervisor or RTO
                        administrator for further details.
                    </p>
                    {reason && (
                        <div className="mt-3 p-3 bg-white/60 rounded-lg border border-red-200">
                            <p className="text-red-800 text-xs font-medium">
                                Reason:
                            </p>
                            <p className="text-red-700 text-sm mt-1">
                                {reason}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        <p className="text-slate-400 text-[11px] italic px-1">
            Note: This record will remain in your history for compliance
            purposes.
        </p>
    </motion.div>
)
