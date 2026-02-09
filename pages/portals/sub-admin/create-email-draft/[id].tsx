import { ReactElement, useEffect, useState } from 'react'
// Layouts
import { AdminLayout, SubAdminLayout } from '@layouts'
// Types
import { NextPageWithLayout } from '@types'

import { PageHeading } from '@components/headings'
import { EmailDraftForm } from '@partials/common/AdminEmails/emailDraft'
import { CommonApi } from '@queries'
import { useRouter } from 'next/router'
import {
    Button,
    Card,
    EmptyData,
    InputRichTextEditor,
    inputRichTextEditorErrorMessage,
    LoadingAnimation,
    TechnicalError,
    TextInput,
    Typography,
} from '@components'
import { FormProvider, useForm, SubmitHandler, FieldValues } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Attachment } from '@partials/common'
import { useNotification } from '@hooks'

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

const CreateEmailDraftDetail: NextPageWithLayout = () => {
    const router = useRouter()
    const id = router?.query?.id
    const { data, isLoading, isError } = CommonApi.Messages.useGetTemplate(id, {
        skip: !id,
    })
    const { notification } = useNotification()
    const [attachmentFiles, setAttachmentFiles] = useState<any>([])
    const [updateNewDraft, resultUpdateNewDraft] =
        CommonApi.Messages.useUpdateEmailDraft()
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
    const formMethods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema) as any,
        defaultValues: {
            subject: '',
            content: '',
            attachment: [],
        } as FormValues,
    })
    const onSubmit = (values: any) => {
        const formData = new FormData()
        const { attachment, subject, content, ...rest } = values as any
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

        updateNewDraft({ id: data?.id, body: formData })

    }



    useEffect(() => {
        if (attachmentFiles) {
            formMethods.setValue('attachment', attachmentFiles)
        }
    }, [attachmentFiles])

    useEffect(() => {
        if (data) {
            formMethods.setValue('subject', data?.subject)
            formMethods.setValue('content', data?.content)
        }
    }, [data])

    useEffect(() => {
        if (resultUpdateNewDraft.isSuccess) {
            notification.success({
                title: 'Email Draft Created',
                description: 'Email Draft Created Successfully',
            })
            router.push('/portals/sub-admin/email-draft')
            formMethods.reset()
        }
    }, [resultUpdateNewDraft])


    return (
        <div className='p-4'>
            <div className="mt-4 ml-4">
                <PageHeading
                    title={'Email Draft'}
                    subtitle={'Update Email Draft'}
                ></PageHeading>
            </div>
            <div className="flex justify-end px-4 py-2">
                <Button
                    text="Add New Draft"
                    onClick={() =>
                        router.push('/portals/sub-admin/create-email-draft')
                    }
                />
            </div>
            <Card>
                {isError && <TechnicalError />}
                {isLoading ? (
                    <LoadingAnimation height="h-[60vh]" />
                ) : (
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
                            <div className='flex justify-between items-center py-2'>
                                {/* <FileUpload
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
                                /> */}
                                <Button disabled={resultUpdateNewDraft?.isLoading} loading={resultUpdateNewDraft?.isLoading} submit text="Update" />
                            </div>
                        </form>
                    </FormProvider>)}
            </Card>
        </div>
    )
}

CreateEmailDraftDetail.getLayout = (page: ReactElement) => {
    return <SubAdminLayout>{page}</SubAdminLayout>
}

export default CreateEmailDraftDetail
