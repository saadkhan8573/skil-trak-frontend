import { Check, CheckCircle2, X, XCircle } from 'lucide-react'
import { Button } from '@components'
import React, { ReactElement, useState } from 'react'
import { RtoApprovalWorkplaceRequest } from '@types'
import { ApproveWpApprovalRequest, RejectWpApprovalRequest } from '../../modals'
import { RtoV2Api } from '@queries'
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui/tooltip'

export const PlacementActions = ({
    approval,
}: {
    approval: RtoApprovalWorkplaceRequest
}) => {
    const [modal, setModal] = useState<ReactElement | null>(null)

    const onCancelModal = () => setModal(null)

    const onApprove = (wpAppReq: RtoApprovalWorkplaceRequest) => {
        setModal(
            <ApproveWpApprovalRequest
                wpAppReq={wpAppReq}
                onCancel={onCancelModal}
            />
        )
    }

    const onReject = (wpAppReq: RtoApprovalWorkplaceRequest) => {
        setModal(
            <RejectWpApprovalRequest
                wpAppReq={wpAppReq}
                onCancel={onCancelModal}
            />
        )
    }

    // Check if RTO checklist file exists
    const courseId = Number(approval?.workplaceRequest?.courses?.[0]?.id)
    const studentId = Number(approval?.student?.id)
    const industryUserId = Number(approval?.industry?.user?.id)

    const getRtoCourseChecklist =
        RtoV2Api.ApprovalRequest.getRtoCourseChecklist(
            { courseId, studentId, industryUserId },
            {
                skip: !courseId || !studentId || !industryUserId,
            }
        )

    const file =
        getRtoCourseChecklist?.data?.url ||
        getRtoCourseChecklist?.data?.studentResponse?.[0]?.files?.[0]?.file ||
        getRtoCourseChecklist?.data?.files?.[0]

    const hasFile = !!file
    const isDisabled = !file || getRtoCourseChecklist?.isLoading
    const tooltipMessage = 'No RTO Facility Checklist found'

    return (
        <>
            {modal}
            <Tooltip>
                <TooltipTrigger asChild>
                    <div>
                        <Button
                            onClick={() => onApprove(approval)}
                            variant="success"
                            className="h-12"
                            fullWidth
                            disabled={isDisabled}
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            <CheckCircle2 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                            <span>Approve Workplace</span>
                        </Button>
                    </div>
                </TooltipTrigger>
                {!hasFile && !getRtoCourseChecklist?.isLoading && (
                    <TooltipContent>
                        <p>{tooltipMessage}</p>
                    </TooltipContent>
                )}
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <div>
                        <Button
                            onClick={() => onReject(approval)}
                            variant="error"
                            outline
                            className="w-full border-2 border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 h-12 transition-all group"
                            disabled={isDisabled}
                        >
                            <XCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                            Reject Workplace
                        </Button>
                    </div>
                </TooltipTrigger>
                {!hasFile && !getRtoCourseChecklist?.isLoading && (
                    <TooltipContent>
                        <p>{tooltipMessage}</p>
                    </TooltipContent>
                )}
            </Tooltip>
        </>
    )
}
