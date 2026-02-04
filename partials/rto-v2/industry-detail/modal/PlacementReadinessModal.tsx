import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X,
    CheckCircle2,
    Circle,
    AlertCircle,
    ChevronDown,
    ChevronUp,
} from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@components/ui/dialog'
import { Button } from '@components'
import { ScrollArea } from '@components/ui/scroll-area'
import { useAppDispatch } from '@redux/hooks'
import { setNavigationTarget } from '@redux'

export interface ChecklistTask {
    id: string
    title: string
    description: string
    completed: boolean
    optional?: boolean
    sectionId?: string | null
    icon?: any
    color?: string
    status?: string
    targetTab?: string
    targetSection?: string
}


interface PlacementReadinessModalProps {
    isOpen: boolean
    onClose: () => void
    tasks: ChecklistTask[]
}

export function PlacementReadinessModal({
    isOpen,
    onClose,
    tasks,
}: PlacementReadinessModalProps) {
    const dispatch = useAppDispatch()
    const [showDetails, setShowDetails] = useState(true)
    const [taskList, setTaskList] = useState(tasks || [])

    const completedTasks = taskList.filter((task) => task.completed).length
    const totalTasks = taskList.length
    const progressPercentage = (completedTasks / totalTasks) * 100

    const handleCompleteTask = (task: ChecklistTask) => {
        // Navigate to the section/tab
        dispatch(
            setNavigationTarget({
                tab: task.targetTab,
                section: task.targetSection,
            })
        )
        // Close the modal
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                showCloseButton={false}
                className="max-w-2xl w-full max-h-[90vh] overflow-hidden p-0 gap-0 bg-white rounded-2xl shadow-2xl border-0"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#044866] to-[#0D5468] px-6 py-3 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
                    </div>
                    <div className="relative">
                        <div className="flex items-start justify-between mb-1">
                            <div className="flex-1">
                                <DialogTitle className="text-white text-lg font-bold">
                                    Placement Readiness Checklist
                                </DialogTitle>
                                <DialogDescription className="text-white/80 text-sm">
                                    Complete these steps to become placement
                                    ready
                                </DialogDescription>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all text-white"
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </div>
                </div>
                <ScrollArea className="max-h-[55vh]">
                    {/* Progress Overview */}
                    <div className="px-6 py-3 bg-gradient-to-br from-[#F8FAFB] to-white border-b border-[#E2E8F0]">
                        <div className="flex items-center gap-6">
                            {/* Circular Progress */}
                            <div className="relative">
                                <svg className="w-24 h-24 transform -rotate-90">
                                    <circle
                                        cx="48"
                                        cy="48"
                                        r="40"
                                        stroke="#E2E8F0"
                                        strokeWidth="8"
                                        fill="none"
                                    />
                                    <motion.circle
                                        cx="48"
                                        cy="48"
                                        r="40"
                                        stroke="url(#gradient)"
                                        strokeWidth="8"
                                        fill="none"
                                        strokeLinecap="round"
                                        initial={{ strokeDasharray: '0 251.2' }}
                                        animate={{
                                            strokeDasharray: `${(progressPercentage / 100) *
                                                251.2
                                                } 251.2`,
                                        }}
                                        transition={{
                                            duration: 1,
                                            ease: 'easeOut',
                                        }}
                                    />
                                    <defs>
                                        <linearGradient
                                            id="gradient"
                                            x1="0%"
                                            y1="0%"
                                            x2="100%"
                                            y2="100%"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#044866"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#10B981"
                                            />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold text-[#044866]">
                                        {Math.round(progressPercentage)}%
                                    </span>
                                </div>
                            </div>

                            {/* Progress Details */}
                            <div className="flex-1">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <h3 className="text-lg font-bold text-[#1A2332]">
                                        Your Progress
                                    </h3>
                                    <span className="text-sm text-[#64748B]">
                                        <span className="font-bold text-[#044866]">
                                            {completedTasks}
                                        </span>{' '}
                                        / {totalTasks}
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="relative h-2 bg-[#E2E8F0] rounded-full overflow-hidden mb-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${progressPercentage}%`,
                                        }}
                                        transition={{
                                            duration: 1,
                                            ease: 'easeOut',
                                        }}
                                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#044866] via-[#0D5468] to-[#10B981] rounded-full"
                                    />
                                    {/* Progress markers */}
                                    <div className="absolute inset-0 flex items-center justify-between px-1">
                                        {[0, 25, 50, 75, 100].map((marker) => (
                                            <div
                                                key={marker}
                                                className="w-0.5 h-full bg-white/30"
                                                style={{
                                                    opacity:
                                                        marker === 0 ||
                                                            marker === 100
                                                            ? 0
                                                            : 1,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Labels */}
                                <div className="flex items-center justify-between text-xs text-[#64748B] mb-3">
                                    <span>0%</span>
                                    <span>25%</span>
                                    <span>50%</span>
                                    <span>75%</span>
                                    <span>100%</span>
                                </div>

                                {/* Encouragement */}
                                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#10B981]/10 to-[#059669]/10 border border-[#10B981]/20 rounded-lg">
                                    <AlertCircle className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                                    <p className="text-xs text-[#059669] font-medium">
                                        {progressPercentage === 100
                                            ? "Congratulations! You're placement ready!"
                                            : "Keep going! You're doing great."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Toggle Details Button */}
                        <Button
                            onClick={() => setShowDetails(!showDetails)}
                            variant="primaryNew"
                            className="mt-4"
                            outline
                            fullWidth
                        >
                            {showDetails ? (
                                <>
                                    <ChevronUp className="w-4 h-4" />
                                    Hide Details
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="w-4 h-4" />
                                    Show Details
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Task List */}

                    <AnimatePresence>
                        {showDetails && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            // className="overflow-hidden"
                            >
                                <div className="px-6 py-4 ">
                                    <div className="space-y-2">
                                        {taskList.map((task, index) => (
                                            <motion.div
                                                key={task.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{
                                                    delay: index * 0.05,
                                                }}
                                                className={`p-3 rounded-xl border transition-all ${task.completed
                                                    ? 'bg-gradient-to-r from-[#10B981]/10 to-[#059669]/10 border-[#10B981]/30'
                                                    : 'bg-white border-[#E2E8F0] hover:border-[#044866]/30 hover:shadow-md'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    {/* Status Icon */}
                                                    <div
                                                        className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${task.completed
                                                            ? 'bg-gradient-to-br from-[#10B981] to-[#059669]'
                                                            : 'bg-[#E2E8F0]'
                                                            }`}
                                                    >
                                                        {task.completed ? (
                                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                                        ) : (
                                                            <Circle className="w-4 h-4 text-[#64748B]" />
                                                        )}
                                                    </div>

                                                    {/* Task Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2 mb-0.5">
                                                            <h4
                                                                className={`text-sm font-bold ${task.completed
                                                                    ? 'text-[#059669]'
                                                                    : 'text-[#1A2332]'
                                                                    }`}
                                                            >
                                                                {task.title}
                                                                {task.optional && (
                                                                    <span className="ml-2 px-2 py-0.5 bg-[#F7A619]/10 text-[#F7A619] rounded-full text-xs font-medium">
                                                                        Optional
                                                                    </span>
                                                                )}
                                                            </h4>
                                                            {task.completed ? (
                                                                <Button
                                                                    variant="secondary"
                                                                    outline
                                                                    onClick={() =>
                                                                        handleCompleteTask(
                                                                            task
                                                                        )
                                                                    }
                                                                    className="px-3 py-1 text-[10px] h-auto rounded-lg border-[#10B981]/30 text-[#059669] hover:bg-[#10B981]/10"
                                                                >
                                                                    View Section
                                                                </Button>
                                                            ) : (
                                                                <motion.button
                                                                    whileHover={{
                                                                        scale: 1.05,
                                                                    }}
                                                                    whileTap={{
                                                                        scale: 0.95,
                                                                    }}
                                                                    onClick={() =>
                                                                        handleCompleteTask(
                                                                            task
                                                                        )
                                                                    }
                                                                    className="px-3 py-1 bg-gradient-to-br from-[#044866] to-[#0D5468] text-white rounded-lg text-xs font-medium hover:shadow-md transition-all whitespace-nowrap"
                                                                >
                                                                    Complete
                                                                    Task
                                                                </motion.button>
                                                            )}
                                                        </div>
                                                        <p
                                                            className={`text-xs ${task.completed
                                                                ? 'text-[#059669]/70'
                                                                : 'text-[#64748B]'
                                                                }`}
                                                        >
                                                            {task.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </ScrollArea>

                {/* Footer */}
                <div className="px-6 py-2 bg-[#F8FAFB] border-t border-[#E2E8F0] flex items-center justify-between">
                    <p className="text-xs text-[#64748B]">
                        Complete all tasks to unlock placement opportunities
                    </p>
                    <Button
                        onClick={onClose}
                        className="px-4 py-2 bg-gradient-to-br from-[#044866] to-[#0D5468] text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all h-auto"
                    >
                        Continue
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
