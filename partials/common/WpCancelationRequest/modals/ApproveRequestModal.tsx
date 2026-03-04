import { ActionModal, ShowErrorNotifications } from '@components'
import { AdminApi } from '@queries'
import { IoWarningOutline } from 'react-icons/io5'
import { CancelationRequestEnum } from '../enum'
import { useNotification } from '@hooks'

export const ApproveRequestModal = ({
    onCancel,
    wpRequest,
}: {
    wpRequest: any
    onCancel: () => void
}) => {
    const { notification } = useNotification()

    const [changeStatus, changeStatusResult] =
        AdminApi.Workplace.changeStatusCancelationReq()

    const onConfirmClicked = () => {
        changeStatus({
            id: wpRequest?.id,
            status: CancelationRequestEnum.Approved,
        }).then((res: any) => {
            if (res?.data) {
                notification.success({
                    title: `Request Approved`,
                    description: `Request has been approved successfully.`,
                })
                onCancel()
            }
        })
    }

    console.log({ wpRequest })
    return (
        <>
            <ShowErrorNotifications result={changeStatusResult} />
            <ActionModal
                Icon={IoWarningOutline}
                variant="primary"
                title="Are you sure!"
                description={`You are about to approve <em>"${wpRequest?.workplaceRequest?.student?.user?.name}"<em>. Do you wish to continue?`}
                onConfirm={onConfirmClicked}
                onCancel={onCancel}
                input
                inputKey={wpRequest?.user?.email}
                actionObject={wpRequest}
                loading={changeStatusResult.isLoading}
            />
        </>
    )
}
