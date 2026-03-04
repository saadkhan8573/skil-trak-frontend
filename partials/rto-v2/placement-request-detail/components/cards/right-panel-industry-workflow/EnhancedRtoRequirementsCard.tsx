import { Button, Card, NoData, ShowErrorNotifications } from '@components'
import {
    CheckCheck,
    CheckCircle2,
    ChevronRight,
    ClipboardCheck,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { RtoV2Api } from '@queries'
import moment from 'moment'
import { useNotification } from '@hooks'

export const EnhancedRtoRequirementsCard = ({ data }: any) => {
    const { notification } = useNotification()
    const [confirmTasks, confirmTasksResult] =
        RtoV2Api.PlacementRequests.useConfirmHighlightedTask()

    const differenceConfig = data?.courseConfigurationDetail?.difference
    const isConfirmed = data?.isString
        ? Boolean(data?.courseConfigurationDetail?.difference?.isConfirmed)
        : Boolean(
              data?.differences?.length &&
              data.differences.every((task: any) => task.isConfirmed === true)
          )

    const handleConfirm = async () => {
        try {
            const response: any = await confirmTasks(differenceConfig.id)
            if (response?.data) {
                notification.success({
                    title: 'Confirmed Successfully',
                    description:
                        'RTO Extra Requirements confirmed successfully',
                })
            }
        } catch (error) {
            console.error('Confirmation error:', error)
        }
    }

    return (
        <Card noPadding className="border-0 shadow-xl overflow-hidden">
            <ShowErrorNotifications result={confirmTasksResult} />
            <div className="bg-linear-to-r from-violet-600 to-purple-600 px-5 py-4">
                <div className="flex items-center gap-2.5 text-white">
                    <ClipboardCheck className="h-5 w-5" />
                    <h3 className="font-semibold">RTO Extra Requirements</h3>
                </div>
            </div>

            <div className="p-6 max-h-96 overflow-auto space-y-3">
                {data?.differences?.length ? (
                    <>
                        {isConfirmed ? (
                            <div className="text-sm bg-emerald-50 text-emerald-800 px-4 py-3 rounded-lg border border-emerald-200">
                                <div className="flex items-center gap-2">
                                    <CheckCheck className="h-4 w-4 text-emerald-600" />
                                    <span className="font-medium">
                                        Confirmed with Workplace
                                    </span>
                                </div>
                                {data?.isString &&
                                    differenceConfig?.confirmedBy && (
                                        <div className="mt-1 text-[11px] text-emerald-700 flex items-center gap-1.5 ml-6">
                                            <span>
                                                By{' '}
                                                <span className="font-bold">
                                                    {
                                                        differenceConfig
                                                            .confirmedBy.name
                                                    }
                                                </span>
                                            </span>
                                            <span className="text-emerald-600/60">
                                                •
                                            </span>
                                            <span>
                                                {moment(
                                                    differenceConfig.updatedAt
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
                                onClick={handleConfirm}
                            />
                        )}

                        {data?.isString ? (
                            <>
                                {data?.differences?.map(
                                    (req: string, index: number) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 hover:border-violet-300 hover:bg-violet-50/30 transition-all"
                                        >
                                            <div className="p-1 bg-violet-100 rounded-lg mt-0.5">
                                                <ChevronRight className="h-4 w-4 text-violet-600" />
                                            </div>

                                            <span className="text-slate-700 text-sm leading-relaxed">
                                                {req}
                                            </span>
                                        </motion.div>
                                    )
                                )}
                            </>
                        ) : (
                            <>
                                {data?.differences?.map(
                                    (task: any, index: number) => (
                                        <motion.div
                                            key={task.id ?? index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 hover:border-violet-300 hover:bg-violet-50/30 transition-all"
                                        >
                                            <div className="p-1 bg-violet-100 rounded-lg mt-0.5">
                                                <ChevronRight className="h-4 w-4 text-violet-600" />
                                            </div>

                                            <div className="flex-1 space-y-1">
                                                <p className="text-slate-700 text-sm leading-relaxed">
                                                    {task?.courseDifference
                                                        ?.statement ?? '—'}
                                                </p>

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
                ) : (
                    <NoData text="No Extra Requirements Found" />
                )}
            </div>
        </Card>
    )
}
