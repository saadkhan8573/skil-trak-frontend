import { Button } from '@components'
import { CheckCircle, Clock, X } from 'lucide-react'
import { useState } from 'react'
import {
    IWorkplaceIndustries,
    WorkplaceWorkIndustriesType,
} from '@redux/queryTypes'
import { useStatusInfo } from '../../hooks/useStatusInfo'
import { WorkplaceApproveModal, WorkplaceRejectModal } from './modals'

import { STATUS_CONTENT } from './statusMapping'

interface IndustryApprovalCardProps {
    workplace: IWorkplaceIndustries
    workIndustry: WorkplaceWorkIndustriesType
}

export const IndustryApprovalCard = ({
    workplace,
    workIndustry,
}: IndustryApprovalCardProps) => {
    const [showApproveModal, setShowApproveModal] = useState(false)
    const [showRejectModal, setShowRejectModal] = useState(false)

    const { statuses, currentStep } = useStatusInfo({
        workplace: workplace as any,
        workIndustry: workIndustry as WorkplaceWorkIndustriesType,
    })

    const workflowSteps = statuses.map((status) => ({
        label: status.label,
        status: status.completed
            ? 'completed'
            : status.current
              ? 'current'
              : 'pending',
    }))

    const approvalId = workplace?.latestPendingApproval?.id
    const currentStatusContent = currentStep?.label
        ? STATUS_CONTENT[currentStep.label]
        : null

    return (
        <>
            <div className="relative group/action overflow-hidden rounded-lg bg-linear-to-br from-purple-50 via-white to-purple-50 border border-[#6B46C1]/30 shadow-md hover:shadow-xl transition-all duration-500 flex-1 flex flex-col">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent translate-x-[-200%] group-hover/action:translate-x-[200%] transition-transform duration-1000"></div>

                <div className="relative flex flex-col h-full p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-2.5 flex-1">
                            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#6B46C1] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-purple-500/40 group-hover/action:scale-110 transition-transform shrink-0">
                                <Clock className="w-4.5 h-4.5 text-white animate-pulse" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-500 mb-1">
                                    Take action to progress placement
                                </p>
                                <p className="text-sm font-bold text-[#6B46C1] mb-2">
                                    {currentStatusContent?.title ||
                                        currentStep?.label ||
                                        'Awaiting Industry Confirmation'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            {workflowSteps.find(
                                (s) => s.label === 'Waiting for Industry'
                            )?.status === 'current' && (
                                <>
                                    <Button
                                        onClick={() =>
                                            setShowApproveModal(true)
                                        }
                                        className="h-8 px-3 text-xs bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all"
                                    >
                                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                        Approve
                                    </Button>
                                    <Button
                                        variant="error"
                                        outline
                                        onClick={() => setShowRejectModal(true)}
                                        className="h-8 px-3 text-xs border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300"
                                    >
                                        <X className="w-3.5 h-3.5 mr-1" />
                                        Reject
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="grow flex items-end">
                        <p className="text-xs text-slate-600 leading-relaxed">
                            {currentStatusContent?.description ||
                                'Follow the progress of your placement request'}
                        </p>
                    </div>
                </div>
            </div>

            <WorkplaceApproveModal
                isOpen={showApproveModal}
                onClose={() => setShowApproveModal(false)}
                id={approvalId}
            />

            <WorkplaceRejectModal
                isOpen={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                id={approvalId}
            />
        </>
    )
}
