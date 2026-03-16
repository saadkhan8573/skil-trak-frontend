import { Badge, Button } from '@components'
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui'
import { RtoV2Api } from '@queries'
import { useAppSelector } from '@redux'
import { ConfirmationSource } from '@types'
import { motion } from 'framer-motion'
import { CheckCircle2, CheckSquare, Circle, Mail, Phone, X } from 'lucide-react'
import { useState } from 'react'
import { ConfirmHighlightedTasksModal } from '../../modals/ConfirmHighlightedTasksModal'

interface HighlightedTaskItemProps {
    task: any
    index: number
    onRefresh: () => void
    isDeleted?: boolean
    isSelected?: boolean
    onToggleSelection?: () => void
}

export function HighlightedTaskItem({
    task,
    index,
    onRefresh,
    isDeleted,
    isSelected,
    onToggleSelection,
}: HighlightedTaskItemProps) {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

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
                onClick={() => {
                    if (!confirmationDetail?.isConfirmed && !task.deletedAt && !isDeleted && onToggleSelection) {
                        onToggleSelection()
                    }
                }}
                className={`p-2.5 rounded-lg border transition-all duration-200 group border-gray-400/80 ${isSelected
                    ? 'border-[#044866] bg-[#044866]/5 shadow-sm ring-1 ring-[#044866]/20'
                    : 'border-gray-100 bg-white/60 hover:shadow-sm'
                    } ${(!confirmationDetail?.isConfirmed && !task.deletedAt && !isDeleted) ? 'cursor-pointer' : ''}`}
            >
                {/* Top Section: Statement */}
                <div className="flex items-start gap-2.5">
                    {(!confirmationDetail || !confirmationDetail.isConfirmed) && !task.deletedAt && !isDeleted && (
                        <div className="mt-0.5 shrink-0">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-[#044866] border-[#044866]' : 'border-gray-300'}`}>
                                {isSelected && <CheckSquare className="w-3 h-3 text-white" />}
                            </div>
                        </div>
                    )}

                    {confirmationDetail?.isConfirmed && (
                        <div className="mt-0.5 shrink-0">
                            <div className="w-4 h-4 rounded-full flex items-center justify-center bg-linear-to-br from-[#10B981] to-[#059669] shadow-sm">
                                <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                            </div>
                        </div>
                    )}

                    {!confirmationDetail && !task.deletedAt && !isDeleted && !isSelected && (
                        <div className="mt-0.5 shrink-0">
                            <div className="w-4 h-4 rounded-full flex items-center justify-center bg-gray-100">
                                <Circle className="w-2.5 h-2.5 text-gray-400" />
                            </div>
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <p className={`text-[12px] leading-tight font-semibold line-clamp-2 ${isSelected ? 'text-[#044866]' : 'text-gray-800'}`}>
                            {task.statement}
                        </p>
                    </div>

                    {(!confirmationDetail || !confirmationDetail.isConfirmed) && !task.deletedAt && !isDeleted && (
                        <div className="flex items-center gap-1 ml-auto">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Badge
                                        variant="primaryNew"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setIsConfirmModalOpen(true)
                                        }}
                                        Icon={CheckSquare}
                                        text='Confirm Task'
                                    />
                                </TooltipTrigger>
                                <TooltipContent>Confirm this task</TooltipContent>
                            </Tooltip>
                        </div>
                    )}
                </div>

                {/* Bottom Section: Compact Details */}
                {confirmationDetail && (
                    <div className="flex items-center gap-2 pt-1 border-t border-gray-100/50">
                        <Badge
                            variant={confirmationDetail.isConfirmed ? "success" : "error"}
                            className="uppercase tracking-wider font-bold text-[8px] px-1.5 py-0 h-4"
                        >
                            {confirmationDetail.isConfirmed ? 'Confirmed' : 'Not Available'}
                        </Badge>

                        <div className="flex items-center flex-wrap gap-1.5 text-[10px] text-gray-500 min-w-0">
                            {confirmationDetail.isConfirmed && (
                                <>
                                    <span>via</span>
                                    {confirmationDetail.confirmationSource === ConfirmationSource.EMAIL ? (
                                        <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded transition-colors group-hover:bg-blue-100">
                                            <Mail className="w-2.5 h-2.5" />
                                            <span className="font-medium">Email</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded transition-colors group-hover:bg-orange-100">
                                            <Phone className="w-2.5 h-2.5" />
                                            <span className="font-medium">Phone</span>
                                        </div>
                                    )}
                                    <span className="text-gray-400">by:</span>
                                    <span className="font-bold text-[#044866]">
                                        {confirmationDetail.confirmedBy?.name?.split(' ')[0] || 'Admin'}
                                    </span>
                                </>
                            )}
                            {!confirmationDetail.isConfirmed && (
                                <>
                                    <span className="text-gray-400">by:</span>
                                    <span className="font-bold text-gray-600">
                                        {confirmationDetail.confirmedBy?.name?.split(' ')[0] || 'Admin'}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                )}
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
