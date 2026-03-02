import { SubAdminApi } from '@queries'
import { useNotification } from '@hooks'
import { HiCheckBadge } from 'react-icons/hi2'
import { IWorkplaceIndustries } from '@redux/queryTypes'
import { ActionModal, ShowErrorNotifications } from '@components'

export const UseExistingFacilityModal = ({
    url,
    onCancel,
    workplace,
}: {
    url: string
    onCancel: () => void
    workplace: IWorkplaceIndustries | null
}) => {
    const { notification } = useNotification()
    const [sendExistingDocument, sendExistingDocumentResult] =
        SubAdminApi.Student.sendExistingDocument()

    const onConfirmUClicked = async (workplace: any) => {
        const res: any = await sendExistingDocument({
            url,
            id: Number(workplace?.id),
        })

        if (res?.data) {
            notification.success({
                title: `Facility Checklist sent`,
                description: `Facility Checklist sent successfully.`,
            })
            onCancel()
        }
    }

    return (
        <>
            <ShowErrorNotifications result={sendExistingDocumentResult} />
            <ActionModal
                input
                variant="success"
                onCancel={onCancel}
                Icon={HiCheckBadge}
                title="Are you sure!"
                actionObject={workplace}
                onConfirm={onConfirmUClicked}
                inputKey={workplace?.currentStatus}
                loading={sendExistingDocumentResult.isLoading}
                description={`You are about to use Existing Document. Do you wish to continue?`}
            />
        </>
    )
}
