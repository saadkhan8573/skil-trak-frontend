import { UserRoles } from '@constants'

import { ViewQuestionsModal } from '@partials/common/StudentProfileDetail/components'
import { latestWpApprovalRequest } from '@partials/rto-v2'
import { useAppSelector } from '@redux/hooks'
import { Supervisor } from '@types'
import { getUserCredentials } from '@utils'
import { useMemo, useState } from 'react'

import {
    IWorkplaceIndustries,
    WorkplaceWorkIndustriesType,
} from '@redux/queryTypes'
import {
    CancelWorkplaceModal,
    CancelWorkplaceRequestModal,
} from '../../../AllWorkplaces/modals'
import { ResendApprovalEmailModal } from '../../modal/ResendApprovalEmailModal'
import { AbourtWorkplace } from './AbourtWorkplace'
import { IndustryApprovalCard } from './IndustryApprovalCard'
import { WorkplaceCancelModal } from './modals'
import { StudentWorkplaceComplianceChecks } from './StudentWorkplaceComplianceChecks'

import { WorkplaceIndustryInfo } from './WorkplaceIndustryInfo'
import { WorkplaceMapView } from './WorkplaceMapView'
import { WorkplaceStatuses } from './WorkplaceStatuses'

interface WorkplaceBioProps {
    onAddNew: () => void
    workplace: IWorkplaceIndustries
}

export function WorkplaceBio({ workplace, onAddNew }: WorkplaceBioProps) {
    const { studentDetail } = useAppSelector((state) => state?.student)

    const [isResendModalOpen, setIsResendModalOpen] = useState(false)
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [showAdminCancelModal, setShowAdminCancelModal] = useState(false)
    const [showSubAdminCancelModal, setShowSubAdminCancelModal] =
        useState(false)
    const [cancelComment, setCancelComment] = useState('')
    const [isCancelling, setIsCancelling] = useState(false)
    const [showViewQuestionsModal, setShowViewQuestionsModal] = useState(false)

    const latestWorkplaceApprovaleRequest = useMemo(() => {
        return latestWpApprovalRequest(
            workplace?.workplaceApprovaleRequest || []
        )
    }, [workplace?.workplaceApprovaleRequest])

    const workIndustry = workplace?.industries?.find(
        (i: WorkplaceWorkIndustriesType) => i?.applied
    )

    const industry =
        workIndustry?.industry ||
        latestWorkplaceApprovaleRequest?.industry ||
        workplace?.studentProvidedWorkplaceRequestApproval?.industry

    const supervisor: Supervisor =
        latestWorkplaceApprovaleRequest?.industry?.supervisors?.[0]

    if (!workplace) return null

    const handleCancelPlacement = () => {
        if (!cancelComment.trim()) return
        setIsCancelling(true)
        setTimeout(() => {
            setIsCancelling(false)
            setShowCancelModal(false)
            setCancelComment('')
            alert(
                'Placement cancelled. Notifications sent to industry and student.'
            )
        }, 1500)
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="flex-1 overflow-auto">
                {/* Workflow Progress - Enhanced */}
                <WorkplaceStatuses
                    workplace={workplace}
                    workIndustry={workIndustry}
                    onCancelRequested={() => {
                        const role = getUserCredentials()?.role
                        if (role === UserRoles.ADMIN) {
                            setShowAdminCancelModal(true)
                        } else if (role === UserRoles.SUBADMIN) {
                            setShowSubAdminCancelModal(true)
                        }
                        // else {
                        //     setShowCancelModal(true)
                        // }
                    }}
                />

                {/* Workplace Details - Two Column Premium Layout */}
                {industry && (
                    <>
                        <div className="p-5 bg-linear-to-br from-white via-slate-50/50 to-white border-b border-slate-200/60">
                            <div className="grid lg:grid-cols-2 gap-5">
                                {/* Left Column - Workplace Info with Cards */}
                                <WorkplaceIndustryInfo
                                    industry={industry}
                                    supervisor={supervisor}
                                    latestWorkplaceApprovaleRequest={
                                        latestWorkplaceApprovaleRequest
                                    }
                                />

                                {/* Right Column - Distance and Action Cards - Full Height Match */}
                                <div className="flex flex-col gap-2">
                                    {/* Distance Card with Animation - Compact */}
                                    <WorkplaceMapView
                                        industry={industry}
                                        distance={workIndustry?.distance || 0}
                                        student={studentDetail!}
                                    />

                                    {/* Current Stage Actions Card - Flex-1 to Fill Remaining Space */}
                                    <IndustryApprovalCard
                                        workplace={workplace}
                                        workIndustry={workIndustry!}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* About the Workplace - Premium Biography Section */}
                        <AbourtWorkplace bio={industry?.bio} />

                        {/* Compliance Checks - Compact Version */}
                        <StudentWorkplaceComplianceChecks />
                    </>
                )}
            </div>

            <WorkplaceCancelModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={handleCancelPlacement}
                comment={cancelComment}
                setComment={setCancelComment}
                isLoading={isCancelling}
            />

            <ResendApprovalEmailModal
                open={isResendModalOpen}
                onOpenChange={setIsResendModalOpen}
                approvalId={latestWorkplaceApprovaleRequest?.id}
            />

            {showViewQuestionsModal && (
                <ViewQuestionsModal
                    onCancel={() => setShowViewQuestionsModal(false)}
                    wpId={Number(workplace?.id)}
                />
            )}

            <CancelWorkplaceModal
                open={showAdminCancelModal}
                onOpenChange={setShowAdminCancelModal}
                workplaceId={Number(workplace?.id)}
            />

            <CancelWorkplaceRequestModal
                open={showSubAdminCancelModal}
                onOpenChange={setShowSubAdminCancelModal}
                workplaceId={Number(workplace?.id)}
            />
        </div>
    )
}
