import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

export const WaitingForRTOStatus = () => (
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
                        Awaiting RTO Approval
                    </p>
                    <p className="text-amber-600 text-xs mt-1">
                        Request pending review
                    </p>
                </div>
            </div>
        </div>
    </motion.div>
)
