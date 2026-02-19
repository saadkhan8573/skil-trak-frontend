import { motion } from 'framer-motion'
import { User } from 'lucide-react'

export const StudentAddedStatus = () => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
    >
        <div className="relative overflow-hidden p-4 bg-linear-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-200/30 rounded-full -mr-16 -mt-16" />
            <div className="relative flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                    <User className="h-5 w-5 text-slate-600" />
                </div>
                <div className="flex-1">
                    <p className="text-slate-900 font-medium">
                        Student Profile Created
                    </p>
                    <p className="text-slate-600 text-sm mt-1">
                        Select workplace type to begin the placement process.
                    </p>
                </div>
            </div>
        </div>
    </motion.div>
)
