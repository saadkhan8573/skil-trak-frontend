import { CheckCircle2, Circle, CheckSquare } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge, Button, Card } from '@components'
import { useState } from 'react'
import { ConfirmHighlightedTasksModal } from '../../modals/ConfirmHighlightedTasksModal'
import { useAppSelector } from '@redux'

interface HighlightedTasksProps {
    tasks?: { statement: string }[]
    title?: string
    courseId?: number
    isConfirmed?: boolean
}

export function HighlightedTasks({
    tasks,
    title = 'Course Highlights',
    courseId,
    isConfirmed,
}: HighlightedTasksProps) {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

    if (!tasks || tasks.length === 0) {
        return null
    }

    const industryId = useAppSelector(
        (state) => state.industry.industryDetail?.id
    )

    return (
        <>
            <Card className="space-y-3 border !border-gray-300">
                <h5 className="text-[13px] font-bold text-[#1A2332] flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-[#044866] to-[#0D5468] rounded-full" />
                    {title}{' '}
                    <Badge variant={isConfirmed ? 'success' : 'warning'}>
                        {isConfirmed ? 'Confirmed' : 'Pending'}
                    </Badge>
                </h5>
                <div className="space-y-2">
                    {tasks.map((task, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-start gap-2.5 group"
                        >
                            <div className="mt-0.5 flex-shrink-0">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-sm">
                                    <CheckCircle2 className="w-3 h-3 text-white" />
                                </div>
                            </div>
                            <p className="text-[13px] text-gray-600 leading-relaxed group-hover:text-[#1A2332] transition-colors">
                                {task.statement}
                            </p>
                        </motion.div>
                    ))}
                </div>
                {isConfirmed ? (
                    <Button variant="success">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Highlighted Tasks Confirmed
                    </Button>
                ) : (
                    courseId && (
                        <div className="flex justify-end">
                            <Button
                                onClick={() => setIsConfirmModalOpen(true)}
                                variant="primaryNew"
                            >
                                <CheckSquare className="w-3.5 h-3.5" />
                                Confirm Tasks
                            </Button>
                        </div>
                    )
                )}
            </Card>

            {courseId && (
                <ConfirmHighlightedTasksModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    courseId={courseId}
                    industryId={industryId!}
                />
            )}
        </>
    )
}
