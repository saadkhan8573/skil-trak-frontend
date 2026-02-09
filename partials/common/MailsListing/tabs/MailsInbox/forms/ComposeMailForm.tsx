import {
    Button,
    InputRichTextEditor,
    inputRichTextEditorErrorMessage,
} from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { InputErrorMessage } from '../components'
import { Attachment } from '@partials/common/Notifications'
import { useEffect, useState } from 'react'
import { FileUpload } from '@hoc'

export const ComposeMailForm = ({
    result,
    onSubmit,
    senderEmail,
}: {
    senderEmail?: string
    result: any
    onSubmit: (values: any) => void
}) => {
    const [attachmentFiles, setAttachmentFiles] = useState<any>([])

    const inputClasses =
        'placeholder:text-[#686868] border-b border-secondary-dark outline-none h-8 placeholder:text-[11px] px-1.5 text-[13px] text-gray-700'
    const validationSchema = Yup.object().shape({
        receiver: Yup.string()
            .email('Invalid Email')
            .required('Must provide email'),
        subject: Yup.string().required('Must provide subject'),
        message: Yup.string()
            .ensure()
            .test('Message', 'Must Provide Message', inputRichTextEditorErrorMessage),
    })
    const methods = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'all',
        defaultValues: {
            receiver: senderEmail || '',
            subject: '',
            message: '',
        },
    })

    const onRemoveFile = (fileId: number) => {
        setAttachmentFiles((preVal: any) => [
            ...preVal?.filter((file: File) => file?.lastModified !== fileId),
        ])
    }

    useEffect(() => {
        if (result?.isSuccess) {
            methods.reset()
        }
    }, [result])

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
    return (
        <div>
            <FormProvider {...methods}>
                <form
                    className="w-full"
                    onSubmit={methods.handleSubmit(onSubmit)}
                >
                    <div className="flex flex-col px-3">
                        <input
                            {...methods.register('receiver')}
                            className={inputClasses}
                            placeholder="To"
                        />
                        <InputErrorMessage name="receiver" />
                        <input
                            {...methods.register('subject')}
                            className={inputClasses}
                            placeholder="Subject"
                        />
                        <InputErrorMessage name="subject" />

                        <div className="mt-2">
                            <InputRichTextEditor
                                name={'message'}
                                onChange={(html: string) => {
                                    // setMailContent(mail)
                                }}
                                showError={false}
                                height="h-80"
                            />
                        </div>
                        <InputErrorMessage name="message" />

                        {/*  */}
                        <div className="mt-3 flex gap-x-3 items-center justify-between">
                            <div className="min-w-32">
                                <Button
                                    submit
                                    fullWidth
                                    loading={result.isLoading}
                                    disabled={result.isLoading}
                                >
                                    Send
                                </Button>
                            </div>
                            <FileUpload
                                onChange={(docs: FileList) => {
                                    setAttachmentFiles((preVal: any) => [
                                        ...preVal,
                                        ...docs,
                                    ])
                                }}
                                showError={false}
                                name={'attachment'}
                                component={onFileUpload}
                                multiple
                                limit={Number(1111111111)}
                            />
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}
