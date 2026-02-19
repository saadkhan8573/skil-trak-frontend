import { useEffect } from 'react'
import { ActionModal } from '@components'
import { HiCheckBadge } from 'react-icons/hi2'
import { useAlert, useNotification } from '@hooks'
import { RtoV2Api } from '@queries'

export const ResendEmailModal = ({
    workplace,
    onCancel,
}: {
    workplace: any
    onCancel: () => void
}) => {
    const { alert } = useAlert()
    const { notification } = useNotification()
    const [onAccept, changeStatusResult] =
        RtoV2Api.Industries.useResendEmailIndustryAwaitingStudent()

    const onConfirmUClicked = async () => {
        await onAccept(workplace?.id)
    }

    useEffect(() => {
        if (changeStatusResult.isSuccess) {
            alert.success({
                title: `Email Resent`,
                description: `Email resent successfully`,
            })
            onCancel()
        }
        if (changeStatusResult.isError) {
            notification.error({
                title: 'Request Failed',
                description: `Your request for resending email was failed`,
            })
        }
    }, [changeStatusResult])

    return (
        <ActionModal
            Icon={HiCheckBadge}
            variant="success"
            title="Are you sure!"
            description={`You are about to resend email . Do you wish to continue?`}
            onConfirm={onConfirmUClicked}
            onCancel={onCancel}
            input
            inputKey={workplace?.id}
            actionObject={workplace}
            loading={changeStatusResult.isLoading}
        />
    )
}
