'use client'
import { Button, Typography } from '@components'
import { UserRoles } from '@constants'
import {
    CancelWorkplaceModal,
    CancelWorkplaceRequestModal,
} from '@partials/rto-v2/student-detail/components/AllWorkplaces/modals'
import { RtoV2Api } from '@queries'
import { getUserCredentials, WorkplaceCurrentStatus } from '@utils'
import { motion } from 'framer-motion'
import { Building2, Shield } from 'lucide-react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { ApproveIndustryEligibilityModal } from '../modal'

export const ProvidedIndustryEligibilityStatus = ({
    workplace,
    setModal,
    onCancelModal,
}: {
    workplace?: any
    setModal?: (modal: React.ReactElement | null) => void
    onCancelModal?: (reason: string) => void
}) => {
    const [showApproveModal, setShowApproveModal] = useState(false)
    const router = useRouter()
    const role = getUserCredentials()?.role

    const wpId = router?.query?.id

    const industryFallbackId =
        workplace?.studentProvidedWorkplaceRequestApproval?.industry?.id ||
        workplace?.industries?.find((i: any) => i?.applied)?.industry?.id

    const { data } =
        RtoV2Api.PlacementRequests.useStudentPlacementIndustryDetails(wpId, {
            skip: !wpId,
        })

    const wpApprovalStatus = workplace?.workplaceApprovaleRequest?.filter(
        (req: any) =>
            req.status !== 'rejected' && req.rtoApprovalStatus !== 'rejected'
    )
    const workplaceIndustry =
        workplace?.industries && workplace?.industries?.length > 0
            ? data
            : wpApprovalStatus && wpApprovalStatus?.length > 0
              ? wpApprovalStatus?.[0]?.industry
              : null

    const approvalReq = wpApprovalStatus?.[0]

    const workplaceEligibilityIndustry =
        workplace?.currentStatus === WorkplaceCurrentStatus.IndustryEligibility
            ? data
            : null
    const industry = workplaceEligibilityIndustry || workplaceIndustry

    const industryId = industry?.id || industryFallbackId

    const handleReject = () => {
        const onCancelClick = () => setModal?.(null)
        const onSuccess = (reason: string) => {
            if (onCancelModal) {
                onCancelModal(reason)
            }
            setModal?.(null)
        }

        if (role === UserRoles.ADMIN) {
            setModal?.(
                <CancelWorkplaceModal
                    open={true}
                    onOpenChange={onCancelClick}
                    workplaceId={Number(wpId)}
                    onSuccess={onSuccess}
                />
            )
        } else {
            setModal?.(
                <CancelWorkplaceRequestModal
                    open={true}
                    onOpenChange={onCancelClick}
                    workplaceId={Number(wpId)}
                    onSuccess={onSuccess}
                />
            )
        }
    }

    const handleProceed = () => {
        if (!industryId) return

        switch (role) {
            case UserRoles.ADMIN:
                router.push(`/portals/admin/industry/${industryId}`)
                break
            case UserRoles.SUBADMIN:
                router.push(`/portals/sub-admin/users/industries/${industryId}`)
                break
            case UserRoles.RTO:
                router.push(
                    `/portals/rto/manage/industries/${industryId}/detail`
                )
                break
            default:
                break
        }
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
            >
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    {/* Header */}
                    <div className="bg-linear-to-r from-amber-500/10 to-orange-500/10 px-5 py-4 border-b border-amber-200/50">
                        <div className="flex items-center gap-2.5 text-amber-900">
                            <Shield className="h-5 w-5 text-amber-600" />
                            <h3 className="font-semibold text-[15px]">
                                Industry Eligibility Review
                            </h3>
                        </div>
                        <Typography
                            variant="small"
                            className="text-amber-700/80 mt-1 block"
                        >
                            Review the industry details provided by the student
                            to confirm their eligibility.
                        </Typography>
                    </div>

                    {workplaceEligibilityIndustry && (
                        <div className="p-5">
                            {/* Industry Profile Basic Info */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#044866] to-[#0D5468] flex items-center justify-center shadow-md">
                                        <Building2 className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Typography
                                                variant="title"
                                                className="text-[#044866]"
                                            >
                                                {industry?.user?.name ??
                                                    'Loading...'}{' '}
                                                {approvalReq?.location
                                                    ? '(Branch)'
                                                    : ''}
                                            </Typography>
                                        </div>
                                        <Typography
                                            variant="small"
                                            className="text-slate-500"
                                        >
                                            Provided Industry
                                        </Typography>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-center items-center gap-2">
                                <Button
                                    variant="error"
                                    outline
                                    onClick={handleReject}
                                >
                                    Reject And Cancel
                                </Button>
                                <Button
                                    variant="success"
                                    onClick={() => setShowApproveModal(true)}
                                >
                                    Approve and Validate
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            <ApproveIndustryEligibilityModal
                open={showApproveModal}
                onOpenChange={setShowApproveModal}
                onProceed={handleProceed}
            />
        </>
    )
}
