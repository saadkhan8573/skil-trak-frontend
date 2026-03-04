import { useState, ReactElement, Activity } from 'react'
import { Clock } from 'lucide-react'
import { IWorkplaceIndustries } from '@redux/queryTypes'
import { AuthorizedUserComponent, Button } from '@components'
import {
    ApproveRequestModal,
    RejectRequestModal,
} from '@partials/common/WpCancelationRequest/modals'
import { UserRoles } from '@constants'
import { checkJsxVisibility } from '@utils'
import { useAppSelector } from '@redux'

interface WorkplaceCancellationBannerProps {
    workplace: IWorkplaceIndustries
    role: string
}

export const WorkplaceCancellationBanner = ({
    workplace,
    role,
}: WorkplaceCancellationBannerProps) => {
    const [modal, setModal] = useState<ReactElement | null>(null)

    const studentDetail = useAppSelector((state) => state.student.studentDetail)

    const hasCancelledRequests = (workplace?.cancelledRequests?.length ?? 0) > 0

    if (!hasCancelledRequests) return null

    const onCancelClicked = () => setModal(null)

    const onApproveRequestClicked = (wpRequest: any) => {
        setModal(
            <ApproveRequestModal
                wpRequest={wpRequest}
                onCancel={onCancelClicked}
            />
        )
    }

    const onRejectRequestClicked = (wpRequest: any) => {
        setModal(
            <RejectRequestModal
                wpRequest={wpRequest}
                onCancel={onCancelClicked}
            />
        )
    }

    const cancelledRequest = workplace?.cancelledRequests?.[0]

    return (
        <>
            {modal}
            <div className="flex bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5 mr-2" />
                <div className="flex flex-col gap-1.5 w-full">
                    <p className="text-xs text-amber-800">
                        <span className="font-semibold">
                            Cancellation Pending
                        </span>
                        {' — '}A cancellation request has been sent to Admin for
                        approval.
                    </p>
                    {cancelledRequest?.comment && (
                        <p className="text-xs text-amber-700 bg-amber-100/50 p-1.5 rounded-md border border-amber-100/50 italic wrap-break-word">
                            <span className="font-medium not-italic">
                                Reason:
                            </span>{' '}
                            {cancelledRequest?.comment}
                        </p>
                    )}
                    <Activity
                        mode={checkJsxVisibility(
                            cancelledRequest?.status === 'pending'
                        )}
                    >
                        <AuthorizedUserComponent roles={[UserRoles.ADMIN]}>
                            <div className="flex items-center gap-2 mt-1">
                                <Button
                                    text="Approve"
                                    variant="success"
                                    className="h-7! px-3! text-[10px]!"
                                    onClick={() => {
                                        if (cancelledRequest) {
                                            onApproveRequestClicked({
                                                ...cancelledRequest,
                                                workplaceRequest: {
                                                    ...workplace,
                                                    student: studentDetail,
                                                },
                                            })
                                        }
                                    }}
                                />
                                <Button
                                    text="Reject"
                                    variant="error"
                                    className="h-7! px-3! text-[10px]!"
                                    onClick={() => {
                                        if (cancelledRequest) {
                                            onRejectRequestClicked({
                                                ...cancelledRequest,
                                                workplaceRequest: {
                                                    ...workplace,
                                                    student: studentDetail,
                                                },
                                            })
                                        }
                                    }}
                                />
                            </div>
                        </AuthorizedUserComponent>
                    </Activity>
                </div>
            </div>
        </>
    )
}
