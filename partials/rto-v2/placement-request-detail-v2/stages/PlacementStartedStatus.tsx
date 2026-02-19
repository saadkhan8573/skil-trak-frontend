import { motion } from 'framer-motion'
import { Play } from 'lucide-react'

export const PlacementStartedStatus = () => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
    >
        <div className="relative overflow-hidden p-4 bg-linear-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/30 rounded-full -mr-16 -mt-16" />
            <div className="relative flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Play className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                    <p className="text-emerald-900 font-medium">
                        Placement In Progress
                    </p>
                    <p className="text-emerald-700 text-sm mt-1">
                        Student is actively working
                    </p>
                </div>
            </div>
        </div>
    </motion.div>
)
