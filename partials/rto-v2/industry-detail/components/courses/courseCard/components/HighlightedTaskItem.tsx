import { Badge, Button } from '@components'
import { RtoV2Api } from '@queries'
import { useAppSelector } from '@redux'
import { ConfirmationSource } from '@types'
import { motion } from 'framer-motion'
import { CheckCircle2, CheckSquare, Circle, Mail, Phone } from 'lucide-react'
import { useState } from 'react'
import { ConfirmHighlightedTasksModal } from '../../modals/ConfirmHighlightedTasksModal'

interface HighlightedTaskItemProps {
    task: any
    index: number
    onRefresh: () => void
    isDeleted?: boolean
}

export function HighlightedTaskItem({
    task,
    index,
    onRefresh,
    isDeleted,
}: HighlightedTaskItemProps) {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

    const [confirmHighlightedTask, confirmHighlightedTaskResult] =
        RtoV2Api.Industries.useConfirmHighlightedTask()

    const industryId = useAppSelector(
        (state) => state.industry.industryDetail?.id
    )

    const confirmationDetail = task.industryHighlightedTasks?.[0]


    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl border border-gray-100 bg-white/50 space-y-2 hover:shadow-sm transition-shadow"
            >
                {/* Top Section: Statement */}
                <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                        <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center shadow-sm ${confirmationDetail
                                ? confirmationDetail.isConfirmed
                                    ? 'bg-gradient-to-br from-[#10B981] to-[#059669]'
                                    : 'bg-gradient-to-br from-red-500 to-red-600'
                                : 'bg-gray-100'
                                }`}
                        >
                            {confirmationDetail ? (
                                confirmationDetail.isConfirmed ? (
                                    <CheckCircle2 className="w-3 h-3 text-white" />
                                ) : (
                                    <Circle className="w-3 h-3 text-white" />
                                )
                            ) : (
                                <Circle className="w-3 h-3 text-gray-400" />
                            )}
                        </div>
                    </div>
                    <p className="text-[13.5px] text-gray-800 leading-relaxed font-semibold">
                        {task.statement}
                    </p>
                </div>

                {/* Bottom Section: Actions/Details */}
                <div className="flex flex-col gap-3 border-t border-gray-50">
                    {(!confirmationDetail || !confirmationDetail.isConfirmed) && !task.deletedAt && !isDeleted ? (
                        <div className="flex flex-col gap-2 pt-3">
                            <Button
                                onClick={() => setIsConfirmModalOpen(true)}
                                variant="primaryNew"
                                className="w-full h-9 text-[11px] gap-2 shadow-sm rounded-lg"
                            >
                                <CheckSquare className="w-3.5 h-3.5" />
                                {confirmationDetail ? 'Confirm Task (Now Available)' : 'Confirm This Task'}
                            </Button>
                        </div>
                    ) : null}

                    {confirmationDetail && (
                        <div className={`flex flex-col gap-3 ${!confirmationDetail.isConfirmed ? 'bg-gray-50/50 p-2 rounded-xl border border-gray-100' : 'pt-2'}`}>
                            <div className="flex items-center justify-between">
                                <Badge
                                    variant={confirmationDetail.isConfirmed ? "success" : "error"}
                                    className="uppercase tracking-wider font-bold text-[9px] px-2"
                                >
                                    {confirmationDetail.isConfirmed ? 'Confirmed' : 'Not Available'}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[11px]">
                                {confirmationDetail.isConfirmed && (
                                    <div className="flex flex-col gap-1 p-2 rounded-lg bg-gray-50 border border-gray-100">
                                        <span className="text-gray-400 font-medium uppercase text-[9px]">Source</span>
                                        {confirmationDetail.confirmationSource === ConfirmationSource.EMAIL ? (
                                            <div className="flex items-center gap-1.5 text-blue-600 font-bold">
                                                <Mail className="w-3 h-3" />
                                                Email
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-orange-600 font-bold">
                                                <Phone className="w-3 h-3" />
                                                Phone
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className={`flex flex-col gap-1 p-2 rounded-lg bg-gray-50 border border-gray-100 ${!confirmationDetail.isConfirmed ? 'col-span-2' : ''}`}>
                                    <span className="text-gray-400 font-medium uppercase text-[9px]">
                                        {confirmationDetail.isConfirmed ? 'Confirmed By' : 'Marked By'}
                                    </span>
                                    <span className="capitalize font-bold text-gray-700 truncate">
                                        {confirmationDetail.confirmedBy?.name || 'Admin'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {isConfirmModalOpen && (
                <ConfirmHighlightedTasksModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => {
                        setIsConfirmModalOpen(false)
                        onRefresh()
                    }}
                    taskId={task.id}
                    industryId={industryId!}
                    confirmationDetailId={confirmationDetail?.id}
                    showNotAvailable={!confirmationDetail}
                />
            )}
        </>
    )
}
