import { motion } from 'framer-motion'
import { Award } from 'lucide-react'

export const CompletedStatus = () => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
    >
        <div className="relative overflow-hidden p-5 bg-linear-to-br from-emerald-50 via-teal-50 to-green-50 border-2 border-emerald-300 rounded-xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-300/20 rounded-full -mr-20 -mt-20" />
            <div className="relative flex items-start gap-3">
                <div className="p-3 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                    <Award className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                    <p className="text-emerald-900 font-semibold text-lg">
                        Placement Completed!
                    </p>
                    <p className="text-emerald-700 text-sm mt-1">
                        All requirements successfully met
                    </p>
                </div>
            </div>
        </div>
    </motion.div>
)
