import { ReactElement, useRef, useState } from 'react'
import { useNotification } from '@hooks'
import { AvailabilityForm } from '@partials/common'
import { ShowErrorNotifications } from '@components'
import { SubAdminApi, useSubAdminRequestWorkplaceMutation } from '@queries'
import { WorkplaceCreatedModal } from './modal'
import { useShowErrorNotification } from '@components/ShowErrorNotifications/useShowErrorNotification'
import { WPProcessMatchingLoader } from '@partials/common/StudentProfileDetail/components/Workplace/components/IndustryDetail/components/WPProcessMatchingLoader'

type AvailabilityProps = {
    setActive: any
    personalInfoData: any
    userId: number
    availabilities: any
    setAvailabilities: any
}
export const Availability = ({
    setActive,
    personalInfoData,
    userId,
    availabilities,
    setAvailabilities,
}: AvailabilityProps) => {
    const [isLoading, setIsLoading] = useState(false)
    // query
    const [workplaceRequest, workplaceRequestResult] =
        useSubAdminRequestWorkplaceMutation()
    const [createAutoWp, createAutoWpResult] =
        SubAdminApi.Student.createAutomatedWp()

    const [modal, setModal] = useState<ReactElement | null>(null)

    const onCancelModal = () => setModal(null)

    const showErrorNotifications = useShowErrorNotification()

    const { notification } = useNotification()
    const notificationRef = useRef(notification)
    notificationRef.current = notification

    const onSubmit = async (daysAvailability: any) => {
        await workplaceRequest({
            userId,
            ...personalInfoData,
            generalAvailabilities: daysAvailability,
        }).then((res: any) => {
            if (res?.data) {
                setModal(<WorkplaceCreatedModal onCancel={onCancelModal} />)
            }
            if (res?.error?.data) {
                showErrorNotifications(res)
                setActive(1)
            }
        })
    }

    const onSubmitBeta = async (daysAvailability: any) => {
        setIsLoading(true)
        await createAutoWp({
            userId,
            ...personalInfoData,
            generalAvailabilities: daysAvailability,
            date1: null,
            date2: null,
        }).then((res: any) => {
            if (res?.data) {
                setTimeout(() => {
                    setIsLoading(false)
                    setModal(<WorkplaceCreatedModal onCancel={onCancelModal} />)
                }, 10000)
                // setActive((active: number) => active + 1)
            }
            if (res?.error?.data) {
                showErrorNotifications(res)
                setIsLoading(false)
                setActive(1)
            }
        })
    }

    return (
        <div
            className={`${workplaceRequestResult.isSuccess ? 'opacity-0' : ''}`}
        >
            {modal}
            <ShowErrorNotifications result={createAutoWpResult} />
            <ShowErrorNotifications result={workplaceRequestResult} />
            {isLoading ? (
                <WPProcessMatchingLoader />
            ) : (
                <AvailabilityForm
                    onSubmit={onSubmit}
                    setActive={setActive}
                    onSubmitBeta={onSubmitBeta}
                    result={workplaceRequestResult}
                    autoResult={createAutoWpResult}
                    availabilities={availabilities}
                    setAvailabilities={setAvailabilities}
                />
            )}
        </div>
    )
}
