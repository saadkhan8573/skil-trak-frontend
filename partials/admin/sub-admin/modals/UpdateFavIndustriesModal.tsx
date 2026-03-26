import { ActionModal, ShowErrorNotifications } from '@components'
import { useNotification } from '@hooks'
import { AdminApi } from '@queries'
import { SubAdmin } from '@types'
import { HiCheckBadge } from 'react-icons/hi2'

export const UpdateFavIndustriesModal = ({
    subAdmin,
    onCancel,
}: {
    subAdmin: SubAdmin
    onCancel: () => void
}) => {
    const { notification } = useNotification()

    const [update, updateResult] = AdminApi.SubAdmins.updateFavIndustries()

    const onConfirmUClicked = async (subAdmin: SubAdmin) => {
        const res: any = await update(subAdmin?.id)

        if (res?.data) {
            notification.success({
                title: `Updated Fav Industries`,
                description: `Fav Industries Updated.`,
            })
            onCancel()
        }
    }

    return (
        <>
            <ShowErrorNotifications result={updateResult} />
            <ActionModal
                Icon={HiCheckBadge}
                variant="success"
                title="Transfer Fav Industries to Team"
                description={`You are about to transfer the favorite industries of this coordinator to their team coordinators. Are you sure you want to continue?`}
                onConfirm={onConfirmUClicked}
                onCancel={onCancel}
                input
                inputKey={subAdmin.user.email}
                actionObject={subAdmin}
                loading={updateResult.isLoading}
                confirmText="Confirm Transfer"
            />
        </>
    )
}
