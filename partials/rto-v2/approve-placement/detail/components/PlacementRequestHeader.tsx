import { Badge, Button } from '@components'
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui/tooltip'
import { WorkplaceCurrentStatus } from '@utils'
import { AlertCircle, ArrowLeft, CheckCircle2, Clock, Info } from 'lucide-react'
import { ProgressIndicator } from './ProgressIndicator'
import { RtoApprovalWorkplaceRequest } from '@types'
import { ReactElement, useState } from 'react'
import { ApprovalPlacementUserGuideModal } from '../modal'
import { useRouter } from 'next/router'

export const PlacementRequestHeader = ({
    approval,
}: {
    approval: RtoApprovalWorkplaceRequest
}) => {
    const [modal, setModal] = useState<ReactElement | null>(null)

    const router = useRouter()

    const StatusBadge = () => {
        switch (approval?.rtoApprovalStatus) {
            case 'pending':
                return <Badge Icon={Clock} text="Awaiting Your Review"></Badge>
            case 'approved':
                return <Badge Icon={CheckCircle2} text="Approved"></Badge>

            default:
                return (
                    <Badge
                        Icon={AlertCircle}
                        text="Rejected"
                        className="bg-red-500 text-white hover:bg-red-500/90 px-4 py-1.5"
                    ></Badge>
                )
        }
    }

    const onUserGuideModal = () => {
        setModal(
            <ApprovalPlacementUserGuideModal onCancel={() => setModal(null)} />
        )
    }

    return (
        <div className="bg-[#044866] text-white sticky top-0 z-40 shadow-2xl border-b-4 border-[#F7A619]">
            {modal}
            <div className="container mx-auto p-3 space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => router.back()}
                                    className="cursor-pointer p-2.5 hover:bg-white/20 rounded-lg transition-all hover:scale-105 flex-shrink-0 border border-white/20"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Go back</p>
                            </TooltipContent>
                        </Tooltip>
                        <div className="min-w-0">
                            <div className="text-xs md:text-sm text-white/90 mb-1 flex items-center gap-2">
                                Industry Profile Review
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Info className="w-3.5 h-3.5 text-white/70 hover:text-white" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                        <p>
                                            Review all workplace information and
                                            make your approval decision
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <h1 className="text-white truncate">
                                {approval?.industry?.user?.name}
                            </h1>
                            {approval?.student?.user?.name && (
                                <div className="mt-1.5 flex items-center gap-2">
                                    <span className="text-white/60 text-xs font-medium uppercase tracking-wider">
                                        Student:
                                    </span>
                                    <p className="text-xl md:text-xl font-bold text-white truncate">
                                        {approval?.student?.user?.name}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <StatusBadge />

                        <div
                            onClick={() => onUserGuideModal()}
                            className="bg-white rounded-full p-1 cursor-pointer hover:bg-white/90 transition-all"
                        >
                            <Info size={15} className="text-primaryNew" />
                        </div>
                    </div>
                </div>

                {/* Progress Indicator */}
                <div>
                    <ProgressIndicator
                        currentStep={
                            approval?.workplaceRequest?.currentStatus ===
                                WorkplaceCurrentStatus.AwaitingWorkplaceResponse
                                ? 6
                                : approval?.rtoApprovalStatus === 'approved'
                                    ? 7
                                    : 6
                        }
                    />
                </div>
            </div>
        </div>
    )
}
