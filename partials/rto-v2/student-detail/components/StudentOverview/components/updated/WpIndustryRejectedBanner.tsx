import { ReactElement, useMemo, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { IWorkplaceIndustries } from '@redux/queryTypes'
import { AuthorizedUserComponent, Button } from '@components'
import {
    IndustryRejectedWpAcceptModal,
    IndustryRejectedWpDeclineModal,
} from '@partials/common/WpCancelationRequest/modals'
import { UserRoles } from '@constants'
import { latestWpApprovalRequest } from '@partials/rto-v2'
import { useAppSelector } from '@redux'

interface WpIndustryRejectedBannerProps {
    workplace: IWorkplaceIndustries
}

export const WpIndustryRejectedBanner = ({
    workplace,
}: WpIndustryRejectedBannerProps) => {
    const [modal, setModal] = useState<ReactElement | null>(null)
    const studentDetail = useAppSelector((state) => state.student.studentDetail)

    const latestWorkplaceApprovaleRequest = useMemo(() => {
        return latestWpApprovalRequest(
            workplace?.workplaceApprovaleRequest || []
        )
    }, [workplace?.workplaceApprovaleRequest])

    const isRejectedByIndustry =
        latestWorkplaceApprovaleRequest?.isRejectedByIndustry

    if (!isRejectedByIndustry) return null

    const onCancelClicked = () => setModal(null)

    const wpReq = {
        ...latestWorkplaceApprovaleRequest,
        workplaceRequest: workplace,
        student: studentDetail,
    }

    const onApproveRequestClicked = () => {
        setModal(
            <IndustryRejectedWpAcceptModal
                wpReq={wpReq}
                onCancel={onCancelClicked}
            />
        )
    }

    const onRejectRequestClicked = () => {
        setModal(
            <IndustryRejectedWpDeclineModal
                wpReq={wpReq}
                onCancel={onCancelClicked}
            />
        )
    }

    return (
        <>
            {modal}
            <div className="flex bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5 mr-2" />
                <div className="flex flex-col gap-1.5 w-full">
                    <p className="text-xs text-red-800">
                        <span className="font-semibold">Industry Rejected</span>
                        {' — '}Industry has rejected this placement request.
                        Please take action to Approve or Reject this rejection.
                    </p>
                    <AuthorizedUserComponent roles={[UserRoles.ADMIN]}>
                        <div className="flex items-center gap-2 mt-1">
                            <Button
                                text="Approve"
                                variant="success"
                                className="h-7! px-3! text-[10px]!"
                                onClick={onApproveRequestClicked}
                            />
                            <Button
                                text="Reject"
                                variant="error"
                                className="h-7! px-3! text-[10px]!"
                                onClick={onRejectRequestClicked}
                            />
                        </div>
                    </AuthorizedUserComponent>
                </div>
            </div>
        </>
    )
}
