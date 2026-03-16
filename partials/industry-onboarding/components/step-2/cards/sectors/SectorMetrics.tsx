import { CheckCircle, GraduationCap, Users } from 'lucide-react'
import { Sector } from '../../types/sectorsAndCourses'
import { motion } from 'framer-motion'
import { Badge } from '@components'

interface SectorMetricsProps {
    sector: Sector
}

export const SectorMetrics: React.FC<SectorMetricsProps> = ({ sector }) => (
    <div className="px-6 pb-4">
        <div className="flex items-center gap-3">
            <motion.div
                className="bg-linear-to-r from-blue-500 to-indigo-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
                <Users className="w-5 h-5" />
                <div>
                    <div className="text-2xl font-bold leading-tight">
                        {sector.capacity}
                    </div>
                    <div className="text-xs opacity-90 font-medium">
                        Students/{sector.capacityPeriod}
                    </div>
                </div>
            </motion.div>

            <div className="flex-1 flex items-center gap-2 flex-wrap">
                <Badge className="text-xs bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100">
                    <CheckCircle className="w-3 h-3 mr-1.5" />
                    Facility Checklist Required
                </Badge>
                {sector.qualificationTitle && (
                    <Badge className="text-xs bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100">
                        <GraduationCap className="w-3 h-3 mr-1.5" />
                        {sector.qualificationTitle}
                    </Badge>
                )}
            </div>
        </div>
    </div>
)
