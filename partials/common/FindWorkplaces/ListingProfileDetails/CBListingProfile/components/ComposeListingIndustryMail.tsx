import {
    ShowErrorNotifications,
    Typography,
    draftToHtmlText,
} from '@components'
import { useNotification } from '@hooks'
import { CommonApi } from '@queries'
import { useRouter } from 'next/router'
import { LiaTimesSolid } from 'react-icons/lia'
import { ComposeListingIndustryMailForm } from './ComposeListingIndustryMailForm'
import { useState } from 'react'

export const ComposeListingIndustryMail = ({
    onCancelComposeMail,
    industry,
    workplaceId,
}: {
    onCancelComposeMail: () => void
    industry: any
    workplaceId?: any
}) => {
    const [attachmentFiles, setAttachmentFiles] = useState<any>([])
    const router = useRouter()
    const id = industry?.id || router.query?.id
    const [sendMessage, sendMessageResult] =
        CommonApi.FindWorkplace.useComposeListingIndustryMail()

    const { notification } = useNotification()

    const onSubmit = (values: any) => {
        const formData = new FormData()

        const { attachments, ...rest } = values
        if (workplaceId) {
            formData.append('workplaceId', workplaceId)
        }
        Object.entries(rest)?.forEach(([key, value]: any) => {
            formData.append(key, value)
        })
        if (attachmentFiles && attachmentFiles?.length > 0) {
            attachmentFiles?.forEach((attched: File) => {
                formData.append('attachments', attched)
            })
        }

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
    // const onSubmit = (values: any) => {
    //     const { message, subject } = values
    //     const body = {
    //         subject: subject,
    //         body: draftToHtmlText(message),
    //         // type: 'email',
    //     }

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
                    <ComposeListingIndustryMailForm
                        industry={industry}
                        onSubmit={onSubmit}
                        result={sendMessageResult}
                        setAttachmentFiles={setAttachmentFiles}
                        attachmentFiles={attachmentFiles}
                    />
                </div>
            </div>
        </>
    )
}
