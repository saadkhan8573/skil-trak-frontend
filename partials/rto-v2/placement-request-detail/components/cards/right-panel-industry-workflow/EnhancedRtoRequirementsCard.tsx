import { Button, Card, NoData } from '@components'
import { CheckCheck, CheckCircle2, ClipboardCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { RtoV2Api } from '@queries'
export const EnhancedRtoRequirementsCard = ({
    confirmRtoReqWithWorkplace,
    data,
}: any) => {
    const [confirmTasks, confirmTasksResult] =
        RtoV2Api.PlacementRequests.useConfirmHighlightedTask()

    const differenceConfig = data?.courseConfigurationDetail?.difference
    const isConfirmed = differenceConfig?.isConfirmed

    return (
        <Card noPadding className="border-0 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-4">
                <div className="flex items-center gap-2.5 text-white">
                    <ClipboardCheck className="h-5 w-5" />
                    <h3 className="font-semibold">RTO Extra Requirements</h3>
                </div>
            </div>

            <div className="p-6 max-h-96 overflow-auto space-y-3">
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
                                    Confirmed by :
                                </p>
                                <span className="text-slate-600">
                                    {differenceConfig?.confirmedBy?.name ??
                                        '---'}
                                </span>
                            </div>
                            <div className="flex gap-1 items-center">
                                <span className="text-slate-400">Date:</span>

                                <p className="text-slate-600">
                                    {new Date(
                                        differenceConfig?.updatedAt
                                    ).toLocaleDateString() ?? '---'}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Button
                        variant="primary"
                        className="w-full h-10 border-violet-300 text-violet-600 hover:bg-violet-600 hover:text-white"
                        Icon={CheckCircle2}
                        text="Confirm with Workplace"
                        loading={confirmTasksResult.isLoading}
                        disabled={confirmTasksResult.isLoading}
                        onClick={() => confirmTasks(differenceConfig.id)}
                    />
                )}
                {data?.difference?.length ? (
                    data.difference.map((req: string, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-start gap-3 p-4 rounded-lg border border-slate-200"
                        >
                            <div className="p-1 bg-violet-100 rounded-lg mt-0.5">
                                <CheckCircle2 className="h-4 w-4 text-violet-600" />
                            </div>

                            <span className="text-slate-700 text-sm leading-relaxed">
                                {req}
                            </span>
                        </motion.div>
                    ))
                ) : (
                    <NoData text="No Extra Requirements Found" />
                )}
            </div>
        </Card>
    )
}
