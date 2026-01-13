import React from 'react'
import { Result } from '@constants'
import { motion } from 'framer-motion'
import { Award, XCircle, RotateCcw, Clock } from 'lucide-react'

interface AssessmentResultBadgeProps {
    result: any
    className?: string
}

export const AssessmentResultBadge: React.FC<AssessmentResultBadgeProps> = ({
    result,
    className = ""
}) => {
    const getResultBadge = () => {
        switch (result?.result) {
            case Result.Competent:
                return {
                    label: 'Competent',
                    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
                    darkColor: 'bg-emerald-500/30 text-emerald-300 border-emerald-500/50',
                    icon: Award,
                }
            case Result.NotCompetent:
                return {
                    label: 'Not Competent',
                    color: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
                    darkColor: 'bg-rose-500/30 text-rose-300 border-rose-500/50',
                    icon: XCircle,
                }
            case Result.ReOpened:
                return {
                    label: 'Re-Opened',
                    color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
                    darkColor: 'bg-amber-500/30 text-amber-300 border-amber-500/50',
                    icon: RotateCcw,
                }
            case Result.Pending:
                return {
                    label: 'Verification Pending',
                    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
                    darkColor: 'bg-blue-500/30 text-blue-300 border-blue-500/50',
                    icon: Clock,
                }
            default:
                return null
        }
    }

    const badge = getResultBadge()
    if (!badge) return null

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl border backdrop-blur-md transition-all ${className} ${badge.color} shadow-sm`}
        >
            <div className={`p-1.5 rounded-lg ${badge.color} border border-current opacity-80`}>
                <badge.icon size={18} />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Result Status</span>
                <span className="font-bold whitespace-nowrap text-sm">{badge.label}</span>
            </div>
        </motion.div>
    )
}
