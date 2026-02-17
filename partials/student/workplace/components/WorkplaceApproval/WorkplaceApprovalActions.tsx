import { Button } from '@components'
import { ReactElement, useState } from 'react'
import { WorkplaceApprovalDeclaration, WorkplaceRejectedModal } from './modal'
import moment from 'moment'

export const WorkplaceApprovalActions = ({
    onCancel,
    declaration,
    wpApprovalId,
    dates,
    subAdminUserId,
    shouldDisableApprove,
}: {
    declaration: string
    onCancel?: () => void
    wpApprovalId: number
    dates: any
    subAdminUserId?: any
    shouldDisableApprove: boolean
}) => {
    const onCancelModal = () => setModal(null)
    const [modal, setModal] = useState<ReactElement | null>(null)

    const onApprovalClicked = (declaration: string, reqData?: any) => {
        setModal(
            <WorkplaceApprovalDeclaration
                onCancel={(val?: boolean) => {
                    if (val) {
                        onCancelModal()
                        if (onCancel) {
                            onCancel()
                        }
                    } else {
                        onCancelModal()
                    }
                }}
                rData={reqData}
                declaration={declaration}
                wpApprovalId={wpApprovalId}
                subAdminUserId={subAdminUserId}
            />
        )
    }

    const onRejectedClicked = () => {
        setModal(
            <WorkplaceRejectedModal
                onCancel={(val?: boolean) => {
                    if (val) {
                        onCancelModal()
                        if (onCancel) {
                            onCancel()
                        }
                    } else {
                        onCancelModal()
                    }
                }}
                wpApprovalId={wpApprovalId}
            />
        )
    }

    return (
        <>
            {modal}
            <div className="w-full md:w-100 flex flex-col gap-y-1 items-center justify-center mx-auto py-2">
                {Object.values(dates)?.filter((date) => {
                    if (date) {
                        return date
                    }
                })?.length > 0 ? (
                    <div className="h-10 w-full flex items-center gap-x-6">
                        {Object.entries(dates)
                            ?.filter(([_, value]: any) => {
                                if (moment(value).isValid()) {
                                    return value
                                }
                            })
                            ?.map(([key, value], i) => (
                                <Button
                                    fullHeight
                                    fullWidth
                                    onClick={() => {
                                        onApprovalClicked(declaration, {
                                            date: String(value),
                                            status: 'approved',
                                        })
                                        // setReqData({
                                        //     date: String(value),
                                        //     status: 'approved',
                                        // })
                                    }}
                                    text={`Approve With Option ${i + 1}`}
                                    variant="success"
                                />
                            ))}
                    </div>
                ) : (
                    <>
                        <div className="h-10 w-full">
                            <Button
                                fullWidth
                                fullHeight
                                onClick={() => {
                                    // onChangeStatusClicked(WPApprovalStatus.Approved)
                                    onApprovalClicked(declaration)
                                }}
                                text="Approve"
                                variant="success"
                                disabled={shouldDisableApprove}
                            />
                        </div>
                    </>
                )}
                <div className="h-10 w-full">
                    <Button
                        fullWidth
                        fullHeight
                        onClick={() => {
                            // onChangeStatusClicked(WPApprovalStatus.Rejected)
                            onRejectedClicked()
                        }}
                        text="Reject"
                        variant="error"
                    />
                </div>
            </div>
        </>
    )
}
