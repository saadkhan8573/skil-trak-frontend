import { Rto } from '@types'
import { useEffect } from 'react'
import { ActionModal } from '@components'
import { HiCheckBadge } from 'react-icons/hi2'
import { useAlert, useNotification } from '@hooks'
import { AdminApi } from '@queries'
import rto from '@pages/portals/admin/rto'

export const IndustryRejectedWpAcceptModal = ({
    wpReq,
    onCancel,
}: {
    wpReq: any
    onCancel: () => void
}) => {
    const { alert } = useAlert()
    const { notification } = useNotification()
    const [onAccept, changeStatusResult] =
        AdminApi.Workplace.useChangeStatusIndustryRejectedWpReq()

    const onConfirmUClicked = async (wpReq: any) => {
        await onAccept({
            id: wpReq?.workplaceRequest?.id,
            params: { status: 'accept' },
        })
    }

    useEffect(() => {
        if (changeStatusResult.isSuccess) {
            alert.success({
                title: `Request Accepted`,
                description: `Workplace Request "${wpReq?.student?.user?.name}" has been accepted.`,
            })
            onCancel()
        }
        if (changeStatusResult.isError) {
            notification.error({
                title: 'Request Failed',
                description: `Your request for accepting Workplace Request was failed`,
            })
        }
    }, [changeStatusResult])

    return (
        <ActionModal
            Icon={HiCheckBadge}
            variant="success"
            title="Are you sure!"
            description={`You are about to accept <em>"${wpReq?.student?.user?.name}"<em>. Do you wish to continue?`}
            onConfirm={onConfirmUClicked}
            onCancel={onCancel}
            input
            inputKey={wpReq?.student?.user?.email}
            actionObject={wpReq}
            loading={changeStatusResult.isLoading}
        />
    )
}
