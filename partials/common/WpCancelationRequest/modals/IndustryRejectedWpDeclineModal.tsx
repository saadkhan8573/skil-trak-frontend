import { Rto } from '@types'
import { useEffect } from 'react'
import { ActionModal } from '@components'
import { HiCheckBadge } from 'react-icons/hi2'
import { useAlert, useNotification } from '@hooks'
import { AdminApi } from '@queries'
import rto from '@pages/portals/admin/rto'

export const IndustryRejectedWpDeclineModal = ({
    wpReq,
    onCancel,
}: {
    wpReq: any
    onCancel: () => void
}) => {
    const { alert } = useAlert()
    const { notification } = useNotification()
    const [onDecline, changeStatusResult] =
        AdminApi.Workplace.useChangeStatusIndustryRejectedWpReq()

    const onConfirmUClicked = async (wpReq: any) => {
        await onDecline({
            id: wpReq?.workplaceRequest?.id,
            params: { status: 'decline' },
        })
    }

    useEffect(() => {
        if (changeStatusResult.isSuccess) {
            alert.success({
                title: `Request Declined`,
                description: `Workplace Request "${wpReq?.student?.user?.name}" has been declined.`,
            })
            onCancel()
        }
        if (changeStatusResult.isError) {
            notification.error({
                title: 'Request Failed',
                description: `Your request for declining Workplace Request was failed`,
            })
        }
    }, [changeStatusResult])

    return (
        <ActionModal
            Icon={HiCheckBadge}
            variant="error"
            title="Are you sure!"
            description={`You are about to decline <em>"${wpReq?.student?.user?.name}"<em>. Do you wish to continue?`}
            onConfirm={onConfirmUClicked}
            onCancel={onCancel}
            input
            inputKey={wpReq?.student?.user?.email}
            actionObject={wpReq}
            loading={changeStatusResult.isLoading}
        />
    )
}
