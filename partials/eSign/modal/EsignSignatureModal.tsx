import {
    Button,
    GlobalModal,
    ShowErrorNotifications,
    Typography,
} from '@components'
import { useNotification } from '@hooks'
import { CommonApi } from '@queries'
import { jwtDecode as jwt } from 'jwt-decode'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useRef, useState } from 'react'
import { MdCancel } from 'react-icons/md'
import ReactSignatureCanvas from 'react-signature-canvas'
import { DocumentSignature } from '../components'

export const EsignSignatureModal = ({
    tab,
    action,
    onCancel,
    allSignAdded,
    customFieldsData,
    setCustomFieldsData,
    success,
}: {
    setCustomFieldsData: any
    allSignAdded: any
    tab: any
    action?: any
    success: boolean
    customFieldsData: any
    onCancel: (cancel?: boolean, isSigned?: boolean) => void
}) => {
    const router = useRouter()

    const [modal, setModal] = useState<ReactElement | null>(null)

    const ref = useRef<ReactSignatureCanvas>(null)

    const { notification } = useNotification()

    const [signDocument, signDocumentResult] = action
        ? action()
        : CommonApi.ESign.useSignDocumentByUser()

    const onClear = () => {
        ref?.current?.clear()
    }

    const setModalModal = () => setModal(null)

    useEffect(() => {
        if (signDocumentResult?.isSuccess) {
            // if (
            //     (tab && tab?.responses && tab?.responses?.length > 0) ||
            //     allSignAdded
            // ) {
            //     onCancel()
            // }
            setTimeout(() => {
                if (allSignAdded && success) {
                    // onCancel()
                    onCancel(true, true) // For the time being
                } else {
                    onCancel(true, true)
                }
            }, 700)
        }
    }, [signDocumentResult, tab, allSignAdded, success])

    const onSubmit = async () => {
        var dataURL = ref?.current?.toDataURL('image/jpg+xml')
        const token: any = router.query?.token
            ? await jwt(String(router.query?.token))
            : {}

        setCustomFieldsData((prev: any) =>
            prev?.map((p: any) =>
                p?.id === tab?.id ? { ...p, fieldValue: dataURL } : p
            )
        )
        // onCancel()

        // return
        if (!ref?.current?.isEmpty()) {
            await signDocument({
                tabId: tab?.id,
                signature: String(dataURL),
                documentId: Number(router.query?.id),
                ...(action
                    ? {
                        id: token?.id,
                    }
                    : {}),
            }).then((res: any) => {
                if (res?.data) {
                    notification.success({
                        title: 'Signed',
                        description: 'Signed',
                    })
                }
            })
        }
    }
    return (
        <GlobalModal>
            {modal}
            <ShowErrorNotifications result={signDocumentResult} />
            <div className="p-3 md:p-8">
                <div>
                    <div className="flex justify-end">
                        <MdCancel
                            onClick={() => {
                                onCancel(true)
                            }}
                            className="transition-all duration-500 text-gray-400 hover:text-black text-2xl cursor-pointer hover:rotate-90"
                        />
                    </div>
                    <Typography color="text-[#6B7280]" variant="label" medium>
                        Please sign in given here
                    </Typography>
                    <div className="mt-4">
                        <DocumentSignature ref={ref} />
                    </div>
                    <div className="flex justify-end mt-4 gap-x-2">
                        <Button onClick={onClear} variant="secondary">
                            Clear
                        </Button>
                        <Button
                            text="Sign Document"
                            onClick={() => onSubmit()}
                            loading={signDocumentResult.isLoading}
                            disabled={signDocumentResult.isLoading}
                        />
                    </div>
                </div>
            </div>
        </GlobalModal>
    )
}
