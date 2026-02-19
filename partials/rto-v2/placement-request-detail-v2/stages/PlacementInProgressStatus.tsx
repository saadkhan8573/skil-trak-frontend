import { motion } from 'framer-motion'
import { Badge, Clock, Play } from 'lucide-react'

export const PlacementInProgressStatus = () => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
    >
        <div className="relative overflow-hidden p-6 bg-linear-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/30 rounded-full -mr-16 -mt-16" />
            <div className="relative flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Play className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                    <p className="text-green-900 font-semibold text-lg">
                        Placement In Progress
                    </p>
                    <p className="text-green-700 text-sm mt-2">
                        Student is currently active in their workplace
                        placement. All setup actions are complete.
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                            Active Placement
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
)
