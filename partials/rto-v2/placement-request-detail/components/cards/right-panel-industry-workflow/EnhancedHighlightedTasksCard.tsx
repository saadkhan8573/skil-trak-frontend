import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button, Card, NoData } from '@components'
import { CheckCheck, CheckCircle2, ChevronRight, Zap } from 'lucide-react'
import { useRouter } from 'next/router'
import { RtoV2Api } from '@queries'

export const EnhancedHighlightedTasksCard = ({
    confirmTaskWithWorkplace,
    data,
}: any) => {
    const [confirmTasks, confirmTasksResult] =
        RtoV2Api.PlacementRequests.useConfirmHighlightedTask()
    const highlightedTaskConfig =
        data?.courseConfigurationDetail?.highlightedTask
    const isConfirmed = highlightedTaskConfig?.isConfirmed
    return (
        <Card noPadding className="border-0 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#F7A619] to-[#F7A619]/80 px-5 py-4">
                <div className="flex items-center gap-2.5 text-white">
                    <Zap className="h-5 w-5" />
                    <h3 className="font-semibold">Highlighted Tasks</h3>
                </div>
            </div>

            <div className="p-6 max-h-96 overflow-auto space-y-3">
                {/* SINGLE CONFIRM BUTTON */}
                {isConfirmed ? (
                    <div className="text-sm bg-emerald-50 text-emerald-800 px-4 py-3 rounded-lg border border-emerald-200">
                        <div className="flex items-center gap-2">
                            <CheckCheck className="h-4 w-4 text-emerald-600" />

                            <span className="font-medium">
                                Confirmed with Workplace
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <p className="text-slate-500 font-medium">
                                    Confirmed by:
                                </p>
                                <span className="text-slate-600">
                                    {highlightedTaskConfig?.confirmedBy?.name ??
                                        '---'}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-slate-500">Date:</span>

                                <p className="text-slate-600">
                                    {new Date(
                                        highlightedTaskConfig.updatedAt
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Button
                        variant="primary"
                        outline
                        className="w-full h-10 border-violet-300 text-violet-600 hover:bg-violet-600 hover:text-white"
                        Icon={CheckCircle2}
                        text="Confirm with Workplace"
                        loading={confirmTasksResult.isLoading}
                        disabled={confirmTasksResult.isLoading}
                        onClick={() => confirmTasks(highlightedTaskConfig.id)}
                    />
                )}
                {data?.highlightedTasks?.length ? (
                    data.highlightedTasks.map((task: string, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 hover:border-[#F7A619]/30 hover:bg-orange-50/30 transition-all"
                        >
                            <div className="p-1 bg-[#F7A619]/10 rounded-lg mt-0.5">
                                <ChevronRight className="h-4 w-4 text-[#F7A619]" />
                            </div>

                            <span className="text-slate-700 text-sm leading-relaxed">
                                {task}
                            </span>
                        </motion.div>
                    ))
                ) : (
                    <NoData text="No Highlighted Tasks Found" />
                )}
            </div>
        </Card>
    )
}
