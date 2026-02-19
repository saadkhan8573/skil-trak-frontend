import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { Checkbox } from '@components/inputs/Checkbox'
import { Badge, Typography } from '@components'

interface PreferenceItemProps {
    id: number
    question: string
    answer: string
    category?: string
    isVerified: boolean
    isRecentlyVerified?: boolean
    onToggle: (id: number) => void
    variant?: 'default' | 'verified' | 'pending'
}

export function PreferenceItem({
    id,
    question,
    answer,
    category,
    isVerified,
    isRecentlyVerified = false,
    onToggle,
    variant = 'default',
}: PreferenceItemProps) {
    const bgClass = isVerified
        ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300 shadow-sm'
        : 'bg-gradient-to-br from-gray-50 to-gray-100/50 border-gray-200 hover:border-gray-300 hover:shadow-sm'

    const badgeVariant = isVerified ? 'success' : 'primaryNew'

    return (
        <motion.div
            key={id}
            initial={{ opacity: 0, x: -10 }}
            animate={{
                opacity: 1,
                x: 0,
                scale: isRecentlyVerified ? [1, 1.02, 1] : 1,
            }}
            transition={{
                scale: {
                    duration: 0.5,
                    repeat: isRecentlyVerified ? 2 : 0,
                },
            }}
            className={`p-4 rounded-lg border-2 transition-all cursor-pointer relative overflow-hidden ${bgClass}`}
            onClick={() => onToggle(id)}
        >
            {isRecentlyVerified && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: 1 }}
                    className="absolute inset-0 bg-linear-to-r from-emerald-400/20 via-teal-400/20 to-emerald-400/20 pointer-events-none"
                />
            )}
            <div className="flex items-start gap-3 relative z-10">
                <Checkbox
                    name={`preference-${id}`}
                    value={isVerified}
                    onChange={() => onToggle(id)}
                />
                <div className="flex-1">
                    <div className="flex items-start gap-2 mb-2">
                        <Badge
                            text={`#${id}`}
                            variant={badgeVariant}
                            size="xs"
                            className="shrink-0"
                        />
                        <Typography
                            variant="small"
                            className="text-gray-600 text-xs font-medium flex-1"
                        >
                            {question}
                        </Typography>
                        {isRecentlyVerified && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: [0, 1.2, 1] }}
                                className="shrink-0"
                            >
                                <Badge
                                    text="NEW"
                                    variant="warning"
                                    size="xs"
                                    className="text-[10px] px-2"
                                />
                            </motion.div>
                        )}
                    </div>
                    {category && variant !== 'default' && (
                        <Badge
                            text={category}
                            variant={isVerified ? 'success' : 'muted'}
                            outline
                            size="xs"
                            className="mb-2"
                        />
                    )}
                    <Typography
                        variant="small"
                        className={`ml-0 ${isVerified
                                ? 'text-emerald-900 font-medium'
                                : 'text-gray-900'
                            }`}
                    >
                        {answer}
                    </Typography>
                    {isVerified && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-1.5 mt-2 text-emerald-700"
                        >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <Typography
                                variant="small"
                                className="text-xs font-medium"
                            >
                                {isRecentlyVerified
                                    ? 'Auto-verified'
                                    : 'Verified & Matched'}
                            </Typography>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
