import {
    Button,
    Checkbox,
    InputRichTextEditor,
    Select,
    ShowErrorNotifications,
    TextInput
} from '@components'
import { FileUpload } from '@hoc'
import { useNotification } from '@hooks'
import { Attachment } from '@partials/common/Notifications'
import { CommonApi } from '@queries'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useRtoOptions } from '../hooks'

export const ActiveRtos = () => {
    const { notification } = useNotification()
    const [attachmentFiles, setAttachmentFiles] = useState<any>([])
    const [template, setTemplate] = useState<any | null>(null)
    const [templateId, setTemplateId] = useState<any | null>(null)
    const [templateSubject, setTemplateSubject] = useState<any | null>(null)
    const [templateBody, setTemplateBody] = useState<any | null>(null)
    const [templateValue, setTemplateValue] = useState<any | null>(null)
    const [selectAll, setSelectAll] = useState<any | null>(null)
    const [isChecked, setIsChecked] = useState(false)

    const { rtoOptions, rtoResponse } = useRtoOptions()

    const checkAllRtos = () => {
        if (isChecked) {
            setSelectAll(null)
            setIsChecked(false)
        } else {
            setSelectAll(rtoOptions)
            setIsChecked(true)
        }
    }

    const [sendBulkEmail, resultSendBulkEmail] =
        CommonApi.Messages.useSendBulkMail()
    const getTemplates = CommonApi.Messages.useAllTemplates()

    const templateOptions = getTemplates.data?.length
        ? getTemplates?.data?.map((template: any) => ({
            label: template.subject,
            value: template.id,
        }))
        : []

    const findTemplate = (id: any) => {
        const template = getTemplates?.data?.find(
            (template: any) => template.id === id
        )
        setTemplateBody(template?.content)
        setTemplateSubject(template?.subject)
        if (template?.file) {
            setAttachmentFiles([template.file])
        } else {
            setAttachmentFiles([])
        }
    }

    const getRtosIds = selectAll?.map((rto: any) => rto?.value)
    const RtosIds = getRtosIds?.map((rtoId: any) => {
        const rto = rtoResponse?.data?.find((rto: any) => rto.id === rtoId)
        return rto?.user?.id
    })

    const formMethods = useForm({
        mode: 'all',
        // resolver: yupResolver(validationSchema),
    })
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
    const onSubmit = (data: any) => {
        const content = data?.message

        const formData = new FormData()
        const { attachment, message, rtos, template, ...rest } = data
        Object.entries(rest)?.forEach(([key, value]: any) => {
            formData.append(key, value)
        })

        attachment &&
            attachment.length > 0 &&
            attachment?.forEach((attached: File) => {
                formData.append('attachment', attached)
            })
        formData.append('users', RtosIds)
        formData.append('template', templateId)
        formData.append('message', content)
        // formData.append('subject', templateSubject)
        sendBulkEmail(formData)
    }
    useEffect(() => {
        if (selectAll && selectAll?.length > 0) {
            formMethods.setValue(
                'rto',
                selectAll?.map((rto: any) => rto?.value)
            )
        }
    }, [selectAll])
    useEffect(() => {
        if (template && template?.length > 0) {
            formMethods.setValue('subject', template)
        }
    }, [template])
    useEffect(() => {
        if (templateBody) {
            formMethods.setValue('message', templateBody)
        }
    }, [templateBody])

    useEffect(() => {
        if (attachmentFiles) {
            formMethods.setValue('attachment', attachmentFiles)
        }
    }, [attachmentFiles])
    useEffect(() => {
        if (resultSendBulkEmail.isSuccess) {
            notification.success({
                title: 'Bulk Email Sent',
                description: 'Bulk Email Sent Successfully',
            })
            formMethods.reset()
            setSelectAll(null)
            setTemplateValue(null)
            setTemplate(null)
            setTemplateId(null)
            setIsChecked(false)
            setTemplateBody(null)
        }
    }, [resultSendBulkEmail])

    return (
        <>
            <ShowErrorNotifications result={resultSendBulkEmail} />
            <FormProvider {...formMethods}>
                <form
                    className="flex flex-col"
                    onSubmit={formMethods.handleSubmit(onSubmit)}
                >
                    <div>
                        <Select
                            label={`Select RTO`}
                            name={'rto'}
                            defaultValue={selectAll}
                            value={selectAll}
                            onChange={(e: any) => {
                                setSelectAll(e)
                            }}
                            options={rtoOptions}
                            multi
                        // loading={courseLoading}
                        />
                        <Checkbox
                            name="rtos"
                            label={'Select all RTOs'}
                            onChange={checkAllRtos}
                        />
                    </div>

                    {/* <div className="flex justify-between items-center"> */}
                    <Select
                        label={'Select Email Template'}
                        name={'template'}
                        value={templateValue}
                        options={templateOptions}
                        placeholder="Select Email Template"
                        onChange={(e: any) => {
                            setTemplate(e.label)
                            setTemplateId(e.value)
                            findTemplate(e.value)
                            setTemplateValue(e)
                        }}
                    />
                    {/* <Button text={'All Templates'} /> */}
                    {/* </div> */}
                    <TextInput
                        value={template}
                        label={'Subject'}
                        name={'subject'}
                    />
                    {/* <TextArea rows={10} value={templateBody} label={'Message'} name={'message'} /> */}
                    {/* <BulkEmailEditor
                        name={'message'}
                        label={'Message'}
                        content={templateBody}
                    /> */}
                    <InputRichTextEditor
                        name={'message'}
                        label={'Message'}
                    />
                    <div className="mb-4 flex justify-between items-center">
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
                            disabled={resultSendBulkEmail?.isLoading}
                            loading={resultSendBulkEmail?.isLoading}
                            text={'Send'}
                            submit
                        />
                    </div>
                </form>
            </FormProvider>
        </>
    )
}
