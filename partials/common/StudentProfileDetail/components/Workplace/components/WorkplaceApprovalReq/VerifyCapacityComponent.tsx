import { Button, Card, Tooltip, TooltipPosition, Typography } from '@components'
import { UserRoles } from '@constants'
import { getUserCredentials } from '@utils'
import { ReactElement, useState } from 'react'
import { FaEnvelope } from 'react-icons/fa'
import { GiCheckMark } from 'react-icons/gi'
import {
    SkipCurrentWPApplyAnotherWPModal,
    WpConfirmCapacity,
    WpConfirmCapacityThroughtEmailModal,
} from '../../modals'

export const VerifyCapacityComponent = ({
    courseId,
    wpReqApproval,
}: {
    courseId: number
    wpReqApproval: any
}) => {
    const [modal, setModal] = useState<ReactElement | null>(null)

    const role = getUserCredentials()?.role

    const onCancel = () => setModal(null)

    const onSkipCurrentWPApplyAnotherWP = () => {
        setModal(
            <SkipCurrentWPApplyAnotherWPModal
                onCancel={onCancel}
                wpReqApproval={wpReqApproval}
            />
        )
    }

    const onWorkplaceConfirmCapacity = () => {
        setModal(
            <WpConfirmCapacity
                onCancel={onCancel}
                wpReqApproval={{ ...wpReqApproval, courseId }}
            />
        )
    }

    const onWorkplaceConfirmCapacityThroughMail = () => {
        setModal(
            <WpConfirmCapacityThroughtEmailModal
                onCancel={onCancel}
                courseId={courseId}
                wpReqApproval={wpReqApproval}
            />
        )
    }

    return (
        <>
            {modal}
            <Card noPadding>
                <div className="flex flex-col gap-y-2 items-center px-4 py-2 bg-gray-200">
                    <Typography
                        variant="label"
                        color="text-red-500"
                        block
                        medium
                        center
                    >
                        Please verify the workplace student capacity prior to
                        student placement confirmation.
                    </Typography>
                    <div className="col-span-2 flex justify-end gap-x-3">
                        <div className="relative group">
                            <Button
                                Icon={FaEnvelope}
                                variant="primaryNew"
                                text="Confirm through email"
                                disabled={
                                    // role === UserRoles.RTO ||
                                    wpReqApproval?.isEmailSent
                                }
                                onClick={onWorkplaceConfirmCapacityThroughMail}
                            />
                            {wpReqApproval?.isEmailSent && (
                                <Tooltip position={TooltipPosition.center}>
                                    Email Already been send for confirmation
                                </Tooltip>
                            )}
                        </div>
                        <Button
                            text="Verify"
                            variant="success"
                            Icon={GiCheckMark}
                            // disabled={role === UserRoles.RTO}
                            onClick={onWorkplaceConfirmCapacity}
                        />
                        <Button
                            text="Skip this workplace"
                            variant="primary"
                            // disabled={role === UserRoles.RTO}
                            onClick={onSkipCurrentWPApplyAnotherWP}
                        />
                    </div>
                </div>
            </Card>
        </>
    )
}
