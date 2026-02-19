import { motion } from 'framer-motion'
import { Building2 } from 'lucide-react'

export const WaitingForIndustryStatus = () => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
    >
        <div className="relative overflow-hidden p-4 bg-linear-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-200/30 rounded-full -mr-16 -mt-16" />
            <div className="relative flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Building2 className="h-5 w-5 text-violet-600" />
                </div>
                <div className="flex-1">
                    <p className="text-violet-900 font-medium">
                        Awaiting Industry Confirmation
                    </p>
                </div>
            </div>
        </div>
    </motion.div>
)
