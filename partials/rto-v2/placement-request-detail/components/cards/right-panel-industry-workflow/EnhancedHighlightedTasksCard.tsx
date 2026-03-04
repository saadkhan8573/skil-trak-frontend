import { Button, Card, NoData } from '@components'
import { RtoV2Api } from '@queries'
import { motion } from 'framer-motion'
import { CheckCheck, CheckCircle2, ChevronRight, Zap } from 'lucide-react'
import moment from 'moment'

export const EnhancedHighlightedTasksCard = ({ data }: any) => {
    const [confirmTasks, confirmTasksResult] =
        RtoV2Api.PlacementRequests.useConfirmHighlightedTask()
    const highlightedTaskConfig =
        data?.courseConfigurationDetail?.highlightedTask
    const isConfirmed = data?.isString
        ? Boolean(data?.courseConfigurationDetail?.highlightedTask?.isConfirmed)
        : Boolean(
              data?.highlightedTasks?.length &&
              data.highlightedTasks.every(
                  (task: any) => task.isConfirmed === true
              )
          )

    return (
        <Card noPadding className="border-0 shadow-xl overflow-hidden">
            <div className="bg-linear-to-r from-[#F7A619] to-[#F7A619]/80 px-5 py-4">
                <div className="flex items-center gap-2.5 text-white">
                    <Zap className="h-5 w-5" />
                    <h3 className="font-semibold">Highlighted Tasks</h3>
                </div>
            </div>

            <div className="p-6 max-h-96 overflow-auto space-y-3">
                {/* SINGLE CONFIRM BUTTON */}
                {/* courseHighlightedTask */}
                {data?.highlightedTasks?.length ? (
                    <>
                        {/* CONFIRM STATUS / BUTTON */}
                        {isConfirmed ? (
                            <div className="text-sm bg-emerald-50 text-emerald-800 px-4 py-3 rounded-lg border border-emerald-200">
                                <div className="flex items-center gap-2">
                                    <CheckCheck className="h-4 w-4 text-emerald-600" />
                                    <span className="font-medium">
                                        Confirmed with Workplace
                                    </span>
                                </div>
                                {data?.isString &&
                                    highlightedTaskConfig?.confirmedBy && (
                                        <div className="mt-1 text-[11px] text-emerald-700 flex items-center gap-1.5 ml-6">
                                            <span>
                                                By{' '}
                                                <span className="font-bold">
                                                    {
                                                        highlightedTaskConfig
                                                            .confirmedBy.name
                                                    }
                                                </span>
                                            </span>
                                            <span className="text-emerald-600/60">
                                                •
                                            </span>
                                            <span>
                                                {moment(
                                                    highlightedTaskConfig.updatedAt
                                                ).format('DD/MM/YYYY')}
                                            </span>
                                        </div>
                                    )}
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
                                onClick={() =>
                                    confirmTasks(
                                        data.isString
                                            ? highlightedTaskConfig.id
                                            : data.highlightedTasks[0].id // or backend-required id
                                    )
                                }
                            />
                        )}

                        {data?.isString ? (
                            <>
                                {data?.highlightedTasks?.map(
                                    (task: string, index: number) => (
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
                                    )
                                )}
                            </>
                        ) : (
                            <>
                                {!data?.isString && (
                                    <>
                                        {data?.highlightedTasks?.map(
                                            (task: any, index: number) => (
                                                <motion.div
                                                    key={task.id ?? index}
                                                    initial={{
                                                        opacity: 0,
                                                        x: -20,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    transition={{
                                                        delay: index * 0.05,
                                                    }}
                                                    className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 hover:border-[#F7A619]/30 hover:bg-orange-50/30 transition-all"
                                                >
                                                    <div className="p-1 bg-[#F7A619]/10 rounded-lg mt-0.5">
                                                        <ChevronRight className="h-4 w-4 text-[#F7A619]" />
                                                    </div>

                                                    <div className="flex-1 space-y-1">
                                                        {/* TASK STATEMENT */}
                                                        <p className="text-slate-700 text-sm leading-relaxed">
                                                            {task
                                                                ?.courseHighlightedTask
                                                                ?.statement ??
                                                                '—'}
                                                        </p>

                                                        {/* CONFIRMATION INFO */}
                                                        {task.isConfirmed && (
                                                            <div className="text-[11px] text-emerald-700 flex items-center gap-2">
                                                                <CheckCheck className="h-3 w-3" />
                                                                <span>
                                                                    Confirmed by{' '}
                                                                    <span className="font-medium">
                                                                        {task
                                                                            ?.confirmedBy
                                                                            ?.name ??
                                                                            '—'}
                                                                    </span>
                                                                </span>
                                                                <span className="text-slate-500">
                                                                    •{' '}
                                                                    {moment(
                                                                        task.updatedAt
                                                                    ).format(
                                                                        'DD/MM/YYYY'
                                                                    )}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </>
                ) : (
                    <NoData text="No Highlighted Tasks Found" />
                )}
            </div>
        </Card>
    )
}
