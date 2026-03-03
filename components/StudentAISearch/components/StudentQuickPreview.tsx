import { Badge, Button, InitialAvatar } from '@components'
import { Student } from '@types'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Hash, Mail } from 'lucide-react'
import { useRouter } from 'next/router'
import { searchAiUrls } from '../urls'
import { ellipsisText, getUserCredentials } from '@utils'

interface StudentQuickPreviewProps {
    link?: string
    student: Student
}

export function StudentQuickPreview({ student }: StudentQuickPreviewProps) {
    const router = useRouter()

    const role = getUserCredentials()?.role

    const urls = searchAiUrls(role, student?.id)

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="group relative overflow-hidden rounded-md border-2 border-border bg-card shadow-lg transition-all hover:border-primaryNew hover:shadow-xl"
        >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-linear-to-br from-primaryNew/5 via-transparent to-primaryNew/5 opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="relative p-6">
                {/* Header */}
                <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <InitialAvatar
                            large
                            name={student?.user?.name || 'S'}
                            imageUrl={student?.user?.avatar}
                        />

                        <div>
                            <h3 className="text-xl">
                                {student?.user?.name} {student?.familyName}
                            </h3>
                            {student?.studentStatus ? (
                                <Badge
                                    className="mt-1"
                                    variant="secondary"
                                    text={student?.studentStatus}
                                />
                            ) : null}
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Hash className="h-4 w-4" />
                        <span className="text-foreground">
                            {ellipsisText(student?.studentId, 8)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="text-foreground">
                            {student?.user?.email}
                        </span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <BookOpen className="min-h-4 min-w-4" />
                        <div className="flex flex-wrap gap-2">
                            {student?.courses?.map((course) => (
                                <Badge
                                    text={course?.title}
                                    variant="primaryNew"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Button
                        fullWidth
                        onClick={() => {
                            router.push(urls?.detail + '')
                        }}
                        variant="primaryNew"
                        className="mt-6 h-12"
                    >
                        <span>View Full Profile</span>
                        <motion.div
                            animate={{ x: [0, 4, 0] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        >
                            <ArrowRight className="h-4 w-4" />
                        </motion.div>
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    )
}
