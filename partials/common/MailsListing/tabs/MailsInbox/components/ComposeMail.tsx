import {
    ShowErrorNotifications,
    Typography,
} from '@components'
import { useNotification } from '@hooks'
import { CommonApi } from '@queries'
import { LiaTimesSolid } from 'react-icons/lia'
import { ComposeMailForm } from '../forms'

export const ComposeMail = ({
    parentId,
    senderEmail,
    onCancelComposeMail,
}: {
    onCancelComposeMail: () => void
    parentId?: any
    senderEmail?: string
}) => {
    const [sendMessage, sendMessageResult] =
        CommonApi.Messages.sendCustomEmail()

    const { notification } = useNotification()

    const onSubmit = (values: any) => {
        const formData = new FormData()

        const { attachment, ...rest } = values
        Object.entries(rest)?.forEach(([key, value]: any) => {

            formData.append(key, value)
        })
        if (attachment && attachment?.length > 0) {
            attachment?.forEach((attched: File) => {
                formData.append('attachment', attched)
            })
        }
        if (parentId) {
            formData.append('parent', parentId)
        }
        formData.append('type', 'email')

        sendMessage(formData).then((res: any) => {
            if (res?.data) {
                notification.success({
                    title: 'Mail Sent',
                    description: 'Mail Sent Successfully',
                })
                onCancelComposeMail()
            }
        })
    }
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
                    <ComposeMailForm
                        onSubmit={onSubmit}
                        result={sendMessageResult}
                        senderEmail={senderEmail}
                    />
                </div>
            </div>
        </>
    )
}
