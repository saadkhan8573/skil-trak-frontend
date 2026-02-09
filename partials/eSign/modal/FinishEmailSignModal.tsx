import { ActionModal, ShowErrorNotifications } from '@components'
import { UserRoles } from '@constants'
import { useNotification } from '@hooks'
import { CommonApi } from '@queries'
import { jwtDecode as jwt } from 'jwt-decode'

import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { IoWarningOutline } from 'react-icons/io5'

export const FinishEmailSignModal = ({
    onCancel,
    decodeDataId,
    customFieldsData,
}: {
    onCancel?: Function
    decodeDataId: number
    customFieldsData: any
}) => {
    const [decodeData, setDecodeData] = useState<any>(null)
    const { notification } = useNotification()
    const router = useRouter()

    const token = router.query.token as string
    useEffect(() => {
        if (!token) return

        try {
            const decoded = jwt(token)
            setDecodeData(decoded)
        } catch (error) {
            console.error('Invalid token', error)
        }
    }, [token])
    const [addCustomFieldsData, addCustomFieldsDataResult] =
        CommonApi.ESign.addEmailCustomFieldData()
    const onConfirmUClicked = () => {
        addCustomFieldsData({
            documentId: Number(router.query?.id),
            tabsResponse: customFieldsData
                ?.filter((data: any) => data?.isCustom && data?.fieldValue)
                ?.map((tab: any) => ({
                    tab: tab?.id,
                    data: tab?.fieldValue,
                })),
            id: Number(decodeDataId),
        }).then((res: any) => {
            if (res?.data) {
                notification.success({
                    title: 'Document Sign',
                    description:
                        'Document signed has been Finished successfully',
                })
                // onCancel()
                router.push('/')
            }
        })
    }

    return (
        <>
            <ShowErrorNotifications result={addCustomFieldsDataResult} />
            <div className="relative z-11111111">
                <ActionModal
                    Icon={IoWarningOutline}
                    variant="success"
                    title="Are you sure!"
                    description={`${decodeData?.role === UserRoles?.RTO
                        ? 'Please review the e-sign document before finishing. Once completed, the document will be approved.'
                        : 'You are about to finish Esign Do you wish to continue?'
                        }`}
                    onConfirm={onConfirmUClicked}
                    // onCancel={onCancel}
                    input
                    inputKey={customFieldsData}
                    actionObject={customFieldsData}
                    loading={addCustomFieldsDataResult.isLoading}
                />
            </div>
        </>
    )
}
