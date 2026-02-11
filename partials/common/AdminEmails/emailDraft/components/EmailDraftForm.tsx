import {
    Button,
    Card,
    InputRichTextEditor,
    inputRichTextEditorErrorMessage,
    ShowErrorNotifications,
    TextInput,
    Typography,
} from '@components'
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm, SubmitHandler, FieldValues } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { CommonApi } from '@queries'
import { Attachment } from '@partials/common/Notifications'
import { FileUpload } from '@hoc'
import { useNotification } from '@hooks'
import { useRouter } from 'next/router'

interface FormValues extends FieldValues {
    subject: string
    content: string
    attachment?: any[]
}

const validationSchema = yup.object({
    subject: yup.string().required('Subject is required'),
    content: yup
        .string()
        .required('Email Content is required')
        .test(
            'Content',
            'Email Content is required',
            inputRichTextEditorErrorMessage
        ),
    attachment: yup.array().optional(),
})
type Props = {}

export const EmailDraftForm = (props: Props) => {
    const router = useRouter()
    const id = router?.query?.id
    const { notification } = useNotification()
    const [attachmentFiles, setAttachmentFiles] = useState<any>([])
    const [createNewDraft, resultCreateNewDraft] =
        CommonApi.Messages.useCreateDraft()


    const onRemoveFile = (fileId: number) => {
        setAttachmentFiles((preVal: any) => [
            ...preVal?.filter((file: File) => file?.lastModified !== fileId),
        ])
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
    const formMethods = useForm<FormValues>({
        mode: 'all',
        resolver: yupResolver(validationSchema) as any,
        defaultValues: {
            subject: '',
            content: '',
            attachment: [],
        } as FormValues,
    })
    const onSubmit: SubmitHandler<FormValues> = (data) => {
        const formData = new FormData()
        const { attachment, subject, content, ...rest } = data as any
        Object.entries(rest)?.forEach(([key, value]: any) => {
            formData.append(key, value)
        })
        attachment &&
            attachment?.length > 0 &&
            attachment?.forEach((attached: File) => {
                formData.append('attachment', attached)
            })
        formData.append('subject', subject)
        formData.append('content', content)

        createNewDraft(formData)
    }

    useEffect(() => {
        if (attachmentFiles) {
            formMethods.setValue('attachment', attachmentFiles)
        }
    }, [attachmentFiles])
    useEffect(() => {
        if (resultCreateNewDraft.isSuccess) {
            notification.success({
                title: 'Email Draft Created',
                description: 'Email Draft Created Successfully',
            })
            router.back()
            formMethods.reset()
        }
    }, [resultCreateNewDraft])
    return (
        <>
            <ShowErrorNotifications result={resultCreateNewDraft} />
            <Card>
                <div className="px-2 py-4">
                    <Typography variant="h4">Create Email Draft</Typography>
                </div>

                <FormProvider {...formMethods}>
                    <form
                        className="flex flex-col"
                        onSubmit={formMethods.handleSubmit(onSubmit)}
                    >
                        <TextInput
                            label={'Subject'}
                            name={'subject'}
                            placeholder="Subject"
                        />
                        <InputRichTextEditor
                            name={'content'}
                            label={'Email Content'}
                        />
                        <ShowErrorNotifications result={resultCreateNewDraft} />
                        <div className="flex justify-between items-center py-2">
                            <FileUpload
                                onChange={(docs: FileList) => {
                                    setAttachmentFiles((preVal: any) => [
                                        ...preVal,
                                        ...docs,
                                    ])
                                }}
                                name={'attachment'}
                                component={onFileUpload}
                                multiple
                                limit={Number(1111111111)}
                            />
                            <Button
                                disabled={resultCreateNewDraft?.isLoading}
                                loading={resultCreateNewDraft?.isLoading}
                                submit
                                text="Create"
                            />
                        </div>
                    </form>
                </FormProvider>
            </Card>
        </>
    )
}
