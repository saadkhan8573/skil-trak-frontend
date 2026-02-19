import { motion } from 'framer-motion'
import { Briefcase } from 'lucide-react'

export const ProvidedWorkplaceRequestStatus = () => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
    >
        <div className="relative overflow-hidden p-4 bg-linear-to-br from-blue-50 to-cyan-50 border border-[#044866]/20 rounded-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#044866]/5 rounded-full -mr-16 -mt-16" />
            <div className="relative flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Briefcase className="h-5 w-5 text-[#044866]" />
                </div>
                <div className="flex-1">
                    <p className="text-[#044866] font-medium">
                        Provided Workplace Request Created
                    </p>
                </div>
            </div>
        </div>
    </motion.div>
)
