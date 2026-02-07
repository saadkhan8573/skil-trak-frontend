import {
    ShowErrorNotifications,
    Typography,
} from '@components'
import { useNotification } from '@hooks'
import { SubAdminApi } from '@queries'
import { useRouter } from 'next/router'
import { LiaTimesSolid } from 'react-icons/lia'
import { ComposeListingRtoMailForm } from './ComposeListingRtoMailForm'

export const ComposeListingRtoMail = ({
    onCancelComposeMail,
    rto,
}: {
    onCancelComposeMail: () => void
    rto: any
}) => {
    const router = useRouter()
    const id = router.query?.id
    const [sendMessage, sendMessageResult] =
        SubAdminApi.Rto.useComposeListingRtoMail()

    const { notification } = useNotification()

    const onSubmit = (values: any) => {
        const formData = new FormData()

        const { attachments, ...rest } = values
        Object.entries(rest)?.forEach(([key, value]: any) => {
            if (key === 'body') {
                formData.append(key, value)
            } else {
                formData.append(key, value)
            }
        })
        if (attachments && attachments?.length > 0) {
            attachments?.forEach((attched: File) => {
                formData.append('attachments', attched)
            })
        }
        // formData.append('type', 'email')

        // sendMessage(formData).then((res: any) => {
        //     if (res?.data) {
        //         notification.success({
        //             title: 'Mail Sent',
        //             description: 'Mail Sent Successfully',
        //         })
        //         onCancelComposeMail()
        //     }
        // })
        if (id) {
            sendMessage({ id, body: formData }).then((res: any) => {
                if (res?.data) {
                    notification.success({
                        title: 'Mail Sent',
                        description: 'Mail Sent Successfully',
                    })
                    onCancelComposeMail()
                }
            })
        }
    }

    //     if (id) {
    //         sendMessage({ id: id, body: body }).then((res: any) => {
    //             if (res?.data) {
    //                 notification.success({
    //                     title: 'Mail Sent',
    //                     description: 'Mail Sent Successfully',
    //                 })
    //                 onCancelComposeMail()
    //             }
    //         })
    //     }
    // }
    return (
        <>
            <ShowErrorNotifications result={sendMessageResult} />
            <div className="w-full md:w-[531px] shadow-profiles">
                <div className="bg-[#FD7A7C] px-4 py-2.5 flex items-center justify-between rounded-t-lg">
                    <Typography variant="label" color="text-white" bold>
                        New Mail
                    </Typography>
                    <LiaTimesSolid
                        className="text-white cursor-pointer"
                        onClick={() => {
                            onCancelComposeMail()
                        }}
                    />
                </div>

                {/*  */}
                <div className="bg-white pb-4">
                    <ComposeListingRtoMailForm
                        onSubmit={onSubmit}
                        result={sendMessageResult}
                        rto={rto}
                    />
                </div>
            </div>
        </>
    )
}
