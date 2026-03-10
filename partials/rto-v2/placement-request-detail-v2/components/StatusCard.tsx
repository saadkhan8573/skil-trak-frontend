import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface IStatusCardProps {
    children: ReactNode
    gradient: string
    borderColor: string
}

export const StatusCard = ({
    children,
    gradient,
    borderColor,
}: IStatusCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
    >
        <div
            className={`relative overflow-hidden p-4 bg-linear-to-br ${gradient} border ${borderColor} rounded-xl`}
        >
            {/* Decorative background circle */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16" />

            {children}
        </div>
    </motion.div>
)