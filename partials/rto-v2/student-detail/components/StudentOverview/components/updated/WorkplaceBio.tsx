import { UserRoles } from '@constants'

import { ViewQuestionsModal } from '@partials/common/StudentProfileDetail/components'
import { latestWpApprovalRequest } from '@partials/rto-v2'
import { useAppSelector } from '@redux/hooks'
import { Supervisor } from '@types'
import { useMemo, useState } from 'react'

import {
    IWorkplaceIndustries,
    WorkplaceWorkIndustriesType,
} from '@redux/queryTypes'
import { ResendApprovalEmailModal } from '../../modal/ResendApprovalEmailModal'
import { WorkplaceCurrentStatus } from '@utils'
import { AgreementInitiatedCard } from './AgreementInitiatedCard'
import { AbourtWorkplace } from './AbourtWorkplace'
import { IndustryApprovalCard } from './IndustryApprovalCard'
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
    const [showViewQuestionsModal, setShowViewQuestionsModal] = useState(false)

    const latestWorkplaceApprovaleRequest = useMemo(() => {
        return latestWpApprovalRequest(
            workplace?.workplaceApprovaleRequest || []
        )
    }, [workplace?.workplaceApprovaleRequest])

    const workIndustry = workplace?.industries?.find(
        (i: WorkplaceWorkIndustriesType) => i?.applied
    )

    const industryData =
        latestWorkplaceApprovaleRequest ||
        workplace?.studentProvidedWorkplaceRequestApproval ||
        workIndustry

    const industry = industryData?.industry

    const supervisor: Supervisor =
        latestWorkplaceApprovaleRequest?.industry?.supervisors?.[0]

    if (!workplace) return null

    return (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="flex-1 overflow-auto">
                {/* Workflow Progress - Enhanced */}
                <WorkplaceStatuses
                    workplace={workplace}
                    workIndustry={workIndustry}
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
                                    industryData={industryData}
                                />

                                {/* Right Column - Distance and Action Cards - Full Height Match */}
                                <div className="flex flex-col gap-2">
                                    {/* Distance Card with Animation - Compact */}
                                    <WorkplaceMapView
                                        industry={industry}
                                        distance={workIndustry?.distance || 0}
                                        student={studentDetail!}
                                        industryData={industryData}
                                        preferableLocation={
                                            workplace?.preferableLocation
                                        }
                                    />

                                    {/* Current Stage Actions Card - Flex-1 to Fill Remaining Space */}
                                    {workplace?.currentStatus ===
                                    WorkplaceCurrentStatus.AwaitingAgreementSigned ? (
                                        <AgreementInitiatedCard
                                            workplace={workplace}
                                            workplaceCurrentStatus={
                                                workplace?.currentStatus
                                            }
                                        />
                                    ) : (
                                        <IndustryApprovalCard
                                            workplace={workplace}
                                            workIndustry={workIndustry!}
                                            latestWorkplaceApprovaleRequest={
                                                latestWorkplaceApprovaleRequest
                                            }
                                        />
                                    )}
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
        </div>
    )
}
