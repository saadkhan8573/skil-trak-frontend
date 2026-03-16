import { motion } from 'framer-motion'

interface StatusBadgeProps {
    status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'pending':
                return {
                    label: 'Pending',
                    bg: '#F1F5F9',
                    text: '#475569',
                    border: '#CBD5E1',
                    icon: '⏱️',
                    pulse: false,
                }
            case 'student_signed':
                return {
                    label: 'Student Signed',
                    bg: '#DBEAFE',
                    text: '#1E40AF',
                    border: '#93C5FD',
                    icon: '✓',
                    pulse: false,
                }
            case 'industry_signed':
                return {
                    label: 'Industry Signed',
                    bg: '#E0E7FF',
                    text: '#4338CA',
                    border: '#C7D2FE',
                    icon: '✓',
                    pulse: false,
                }
            case 'partially_signed':
                return {
                    label: 'Partially Signed',
                    bg: '#FEF3C7',
                    text: '#92400E',
                    border: '#FCD34D',
                    icon: '⋯',
                    pulse: true,
                }
            case 'ready_for_rto':
                return {
                    label: 'Ready for Review',
                    bg: '#DBEAFE',
                    text: '#0066CC',
                    border: '#93C5FD',
                    icon: '👁️',
                    pulse: true,
                }
            case 'rto_reviewing':
                return {
                    label: 'Under Review',
                    bg: '#E0E7FF',
                    text: '#4338CA',
                    border: '#C7D2FE',
                    icon: '🔍',
                    pulse: true,
                }
            case 'completed':
                return {
                    label: 'Completed',
                    bg: '#D4F4E2',
                    text: '#00A651',
                    border: '#86EFAC',
                    icon: '✓',
                    pulse: false,
                }
            case 'sent_back_to_student':
                return {
                    label: 'Sent to Student',
                    bg: '#FEE2E2',
                    text: '#E63946',
                    border: '#FCA5A5',
                    icon: '↩',
                    pulse: true,
                }
            case 'sent_back_to_industry':
                return {
                    label: 'Sent to Industry',
                    bg: '#FEE2E2',
                    text: '#E63946',
                    border: '#FCA5A5',
                    icon: '↩',
                    pulse: true,
                }
            case 'sent_back_to_both':
                return {
                    label: 'Revision Needed',
                    bg: '#FEE2E2',
                    text: '#E63946',
                    border: '#FCA5A5',
                    icon: '↩',
                    pulse: true,
                }
            default:
                return {
                    label: 'Unknown',
                    bg: '#F1F5F9',
                    text: '#64748B',
                    border: '#CBD5E1',
                    icon: '?',
                    pulse: false,
                }
        }
    }

    const config = getStatusConfig(status)

    return (
        <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, type: 'spring' }}
            whileHover={{ scale: 1.08, y: -2 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border-2 shadow-md whitespace-nowrap relative overflow-hidden group ${config.pulse ? 'animate-pulse-subtle' : ''}`}
            style={{
                background: config.bg,
                color: config.text,
                borderColor: config.border,
            }}
        >
            {/* Shimmer effect on hover */}
            <motion.div
                className="absolute inset-0 bg-white/30 pointer-events-none"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
            />

            <motion.span
                initial={{ rotate: 0 }}
                animate={{ rotate: config.pulse ? [0, 10, -10, 0] : 0 }}
                transition={{
                    duration: 2,
                    repeat: config.pulse ? Infinity : 0,
                    ease: 'easeInOut',
                }}
                className="text-base"
            >
                {config.icon}
            </motion.span>
            <span className="relative z-10">{config.label}</span>
        </motion.span>
    )
}
