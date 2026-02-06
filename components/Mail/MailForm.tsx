import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'

// icons
import { IoMdSend } from 'react-icons/io'

// components
import {
    ActionButton,
    Button,
    Card,
    InputRichTextEditor,
    Select,
    SelectOption,
    ShowErrorNotifications,
    TextInput,
    Typography,
} from '@components'
import { FileUpload } from '@hoc'

import { useNotification, useRewritePhrase } from '@hooks'

// functions
import { Attachment } from '@partials/common'
import { CommonApi } from '@queries'
import { AuthUtils } from '@utils'
import ClickAwayListener from 'react-click-away-listener'
import { RiShining2Fill } from 'react-icons/ri'

interface onSubmitType {
    to?: string
    cc?: string
    subject: string
    message: string
    template: any
    attachments: FileList | null
}

export const MailForm = ({
    action,
    receiverId,
    sender,
    workplaceId,
    onCancel,
}: any) => {
    // const { replyMessage, setReplyMessage, setMessage } = useMessage()
    const { notification } = useNotification()
    const [isSendDraft, setIsSendDraft] = useState<boolean>(true)
    const [sendEmailDraft, setSendEmailDraft] = useState<boolean>(true)

    const ref = useRef<HTMLDivElement>(null)
    let activeDivRef = useRef<any>(null)

    // query
    const [to, setTo] = useState(false)
    const [cc, setCc] = useState(false)
    const [attachmentFiles, setAttachmentFiles] = useState<any>([])
    const [mailContent, setMailContent] = useState<any>('')

    const [sendMessage, sendMessageResult] = CommonApi.Messages.useSendMessage()
    const [emailDraft, emailDraftResult] = CommonApi.Draft.useEmailDraft()

    const [templateAttachment, setTemplateAttachment] = useState<any>(null)

    const { onRewritePhrase, isLoading } = useRewritePhrase()

    const getEmailDraft = CommonApi.Draft.useGetEmailDraft(receiverId, {
        skip: !receiverId,
    })

    const getTemplates = CommonApi.Messages.useAllTemplates()

    const validationSchema = yup.object({
        subject: yup.string().required('Must provide subject'),
        // message: yup.string().required('Must provide message'),
    })

    const methods = useForm<onSubmitType>({
        resolver: yupResolver(validationSchema),
        mode: 'all',
    })

    useEffect(() => {
        if (getEmailDraft.isSuccess) {
            if (getEmailDraft?.data?.content) {
                methods.setValue(
                    'message',
                    getEmailDraft?.data?.content)
            }

            if (getEmailDraft?.data?.title) {
                methods.setValue('subject', getEmailDraft?.data?.title)
            }
        }
    }, [getEmailDraft.isSuccess])

    useEffect(() => {
        if (attachmentFiles) {
            methods.setValue('attachments', attachmentFiles)
        }
    }, [attachmentFiles])

    useEffect(() => {
        if (sendMessageResult.isSuccess) {
            methods.reset()
            methods.setValue('attachments', null)
            setSendEmailDraft(true)
            setAttachmentFiles([])
            notification.success({
                title: 'Email Sent',
                description: 'Email Sent Successfully',
            })
            setTemplateAttachment(null)
            onCancel()
        }
        if (sendMessageResult.isError) {
            setSendEmailDraft(true)
        }
    }, [sendMessageResult.isSuccess])

    const onRemoveFile = (fileId: number) => {
        setAttachmentFiles((preVal: any) => [
            ...preVal?.filter((file: File) => file?.lastModified !== fileId),
        ])
    }

    const templateOptions = getTemplates?.data?.length
        ? getTemplates?.data?.map((template: any) => ({
            label: template?.subject,
            value: template?.id,
        }))
        : []

    const onFixGrammerClick = async () => {
        const data = await onRewritePhrase(mailContent)

        if (data?.correctedText) {
            setMailContent(data?.correctedText)
            methods.setValue(
                'message',
                data?.correctedText
            )
        }
    }

    const onFileUpload = ({
        name,
        fileList,
    }: {
        name: string
        fileList: any
    }) => {
        return (
            <Attachment
                name={name}
                fileList={attachmentFiles}
                onRemoveFile={onRemoveFile}
            />
        )
    }

    const onSubmit = (values: onSubmitType) => {
        setIsSendDraft(false)
        setSendEmailDraft(false)
        const userCredentials = AuthUtils.getUserCredentials()
        const parent = -1
        // const parent = replyMessage?.id
        const formData = new FormData()

        const message = values?.message
        const ccEmails = values.cc
            ? values.cc
                .split(',')
                .map((email) => email.trim())
                .filter((email) => email.length > 0)
            : []

        const { attachments, ...rest } = values
        const data = {
            subject: values.subject,
            message,
            type: 'email',
            sender: userCredentials?.id,
            receiver: receiverId,
            ccUsers: ccEmails || undefined,
            oldAttachment: templateAttachment || '',
            ...(workplaceId && { workplaceId }),
            // receiver: receiverId || 64,
        }

        Object.entries(data)?.forEach(([key, value]: any) => {
            formData.append(key, value)
        })

        // attachments &&
        //     [...attachments]?.forEach((attached: File) => {
        //         formData.append('attachments', attached)
        //     })
        if (attachments) {
            const newAttachments = [...attachments].filter(
                (file) => !templateAttachment || file !== templateAttachment
            )

            newAttachments.forEach((attached: File) => {
                formData.append('attachments', attached)
            })
        }
        sendMessage(formData)
        // setReplyMessage(null)
    }

    const findTamplates = (e: SelectOption) => {
        const template = getTemplates?.data?.find(
            (template: any) => template.id === e?.value
        )
        methods.setValue('subject', template?.subject)
        methods.setValue(
            'message',
            template?.content
        )
        if (template?.file) {
            setTemplateAttachment(template.file)
            setAttachmentFiles([template.file])
        } else {
            setTemplateAttachment(null)
            setAttachmentFiles([])
        }
    }

    return (
        <>
            <ShowErrorNotifications result={sendMessageResult} />
            <div className={`sticky -top-5`}>
                <Card>
                    <div className="flex justify-end items-center gap-x-1">
                        <button
                            className="px-2 text-sm text-gray-400 hover:text-gray-600"
                            onClick={() => setCc(!cc)}
                        >
                            CC
                        </button>
                    </div>
                    <FormProvider {...methods}>
                        <form
                            className="mt-2 w-full"
                            onSubmit={methods.handleSubmit(onSubmit)}
                        >
                            {/* {replyMessage && (
                                <div className="mb-2 flex justify-between items-center">
                                    <span>
                                        Reply To :{' '}
                                        {elipiciseText(
                                            replyMessage?.message,
                                            55
                                        )}
                                    </span>
                                    <MdOutlineCancel
                                        className="cursor-pointer"
                                        onClick={() => setReplyMessage(null)}
                                    />
                                </div>
                            )} */}
                            <div>
                                {to ? (
                                    <TextInput
                                        label={'To (optional)'}
                                        name={'to'}
                                        type={'email'}
                                        placeholder={'Reciever Email...'}
                                        validationIcons
                                    />
                                ) : null}
                                {cc ? (
                                    <TextInput
                                        label={'CC (optional)'}
                                        name={'cc'}
                                        // type={'email'}
                                        placeholder={
                                            'CC Email Separate email by comma...'
                                        }
                                        helpText="Separate email by comma (,)"
                                        validationIcons
                                    />
                                ) : // <TagsInput
                                    //     label="CC (optional)"
                                    //     name="cc"
                                    //     placeholder="Add email address..."
                                    //     hint="Add multiple emails separated by comma or press Enter"
                                    //     validationIcons
                                    //     onBlur={(emails) => {
                                    //         // Convert the email tags to a comma-separated string
                                    //         const emailString = emails.join(',')
                                    //         methods.setValue('cc', emailString)

                                    //         // If you want to automatically save to draft when user leaves the field
                                    //         // if (
                                    //         //     emailString &&
                                    //         //     !ref.current?.contains(
                                    //         //         document.activeElement
                                    //         //     )
                                    //         // ) {
                                    //         //     emailDraft({
                                    //         //         receiver: receiverId,
                                    //         //         cc: emailString,
                                    //         //     })
                                    //         // }
                                    //     }}
                                    // />
                                    null}
                                <TextInput
                                    label={'Subject'}
                                    name={'subject'}
                                    placeholder={'Your Subject...'}
                                    validationIcons
                                    required
                                    onBlur={(e: any) => {
                                        if (
                                            !ref.current?.contains(
                                                e.relatedTarget
                                            )
                                        ) {
                                            emailDraft({
                                                receiver: receiverId,
                                                title: e.target.value,
                                            })
                                        }
                                    }}
                                />
                                <div className="flex justify-between items-center">
                                    <Typography variant="label">
                                        Message
                                    </Typography>
                                    <ActionButton
                                        variant="info"
                                        Icon={RiShining2Fill}
                                        text="Rewrite with AI"
                                        onClick={() => {
                                            onFixGrammerClick()
                                        }}
                                        disabled={!mailContent?.trim()}
                                        loading={isLoading}
                                    />
                                </div>
                                <ClickAwayListener
                                    onClickAway={(e: any) => {
                                        if (
                                            mailContent &&
                                            !ref.current?.contains(e.target)
                                        ) {
                                            emailDraft({
                                                receiver: receiverId,
                                                content: mailContent,
                                            })
                                        }
                                    }}
                                >
                                    <div className="mb-3">
                                        <InputRichTextEditor
                                            name={'message'}
                                            onChange={(e: any) => {
                                                setMailContent(e)
                                            }}
                                        />
                                    </div>
                                </ClickAwayListener>
                                {/* <TextArea
                                    label={'Message'}
                                    name={'message'}
                                    required
                                    rows={4}
                                    placeholder={'Your Message ...'}
                                    onBlur={(e: any) => {
                                        if (
                                            !ref.current?.contains(
                                                e.relatedTarget
                                            )
                                        ) {
                                            emailDraft({
                                                receiver: receiverId,
                                                content: e.target.value,
                                            })
                                        }
                                    }}
                                /> */}

                                <Select
                                    label={'Select Email Template'}
                                    name={'template'}
                                    options={templateOptions}
                                    placeholder="Select Email Template"
                                    onChange={findTamplates}
                                    menuPlacement="top"
                                // loading={courseLoading}
                                // value={templateValue}
                                // onChange={(e: any) => {
                                //     setTemplate(e?.label)
                                //     setTemplateId(e?.value)
                                //     findTemplate(e?.value)
                                //     setTemplateValue(e)
                                // }}
                                />

                                <div className="flex justify-between items-center gap-x-4 mt-2">
                                    {/* <UploadFile
                                        small
                                        name={'file'}
                                        touched={touched}
                                        fileupload={setFieldValue}
                                    /> */}
                                    <div ref={ref}>
                                        <FileUpload
                                            onChange={(docs: FileList) => {
                                                setAttachmentFiles(
                                                    (preVal: any) => [
                                                        ...preVal,
                                                        ...docs,
                                                    ]
                                                )
                                            }}
                                            name={'attachments'}
                                            component={onFileUpload}
                                            multiple
                                            limit={Number(1111111111)}
                                        />
                                    </div>
                                    <div id={'submitButton'}>
                                        <Button
                                            submit
                                            loading={
                                                sendMessageResult?.isLoading
                                            }
                                            disabled={
                                                sendMessageResult?.isLoading
                                            }
                                        >
                                            <div className="flex items-center gap-x-2">
                                                <span>Send</span>
                                                <IoMdSend />
                                            </div>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </FormProvider>
                </Card>
            </div>
        </>
    )
}