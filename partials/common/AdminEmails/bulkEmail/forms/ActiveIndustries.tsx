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
import { useIndustriesOptions } from '../hooks'

export const ActiveIndustries = () => {
    const { notification } = useNotification()
    const [attachmentFiles, setAttachmentFiles] = useState<any>([])
    const [template, setTemplate] = useState<any | null>(null)
    const [templateId, setTemplateId] = useState<any | null>(null)
    const [templateSubject, setTemplateSubject] = useState<any | null>(null)
    const [templateBody, setTemplateBody] = useState<any | null>(null)
    const [templateValue, setTemplateValue] = useState<any | null>(null)
    const [selectAll, setSelectAll] = useState<any | null>(null)
    const [isChecked, setIsChecked] = useState(false)

    const { industryOptions, industriesResponse } = useIndustriesOptions()

    const checkAllIndustries = () => {
        if (isChecked) {
            setSelectAll(null)
            setIsChecked(false)
        } else {
            setSelectAll(industryOptions)
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

    const getIndustriesIds = selectAll?.map((industry: any) => industry?.value)
    const industriesIds = getIndustriesIds?.map((industryId: any) => {
        const industry = industriesResponse?.data?.find(
            (industry: any) => industry.id === industryId
        )
        return industry?.user?.id
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
        const { attachment, message, industries, template, subject, industry } =
            data
        // Object.entries(rest)?.forEach(([key, value]: any) => {
        //     formData.append(key, value)
        // })
        // industry.map((industryIds: any) => {
        formData.append('industry', getIndustriesIds)
        // })
        formData.append('subject', subject)
        attachment?.forEach((attached: File) => {
            formData.append('attachment', attached)
        })
        formData.append('users', industriesIds)
        formData.append('template', templateId)
        formData.append('message', content)
        // formData.append('subject', templateSubject)
        sendBulkEmail(formData)
    }

    useEffect(() => {
        if (selectAll && selectAll?.length > 0) {
            formMethods.setValue('industry', selectAll)
        }
    }, [selectAll])
    useEffect(() => {
        if (template && template?.length > 0) {
            formMethods.setValue('subject', template)
        }
    }, [template])
    useEffect(() => {
        if (attachmentFiles) {
            formMethods.setValue('attachment', attachmentFiles)
        }
    }, [attachmentFiles])
    useEffect(() => {
        // htmlToDraftText(formMethods, templateBody, 'message')
        if (templateBody) {
            formMethods.setValue('message', templateBody)
        }
    }, [templateBody])

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
                            label={`Select Industry`}
                            name={'industry'}
                            // defaultValue={selectAll}
                            value={selectAll}
                            onChange={(e: any) => {
                                setSelectAll(e)
                            }}
                            options={industryOptions}
                            multi

                        // loading={courseLoading}
                        />
                        <Checkbox
                            name="industries"
                            label={'Select all Industries'}
                            onChange={checkAllIndustries}
                        />
                    </div>

                    {/* <div className="flex justify-between items-center"> */}
                    <Select
                        label={'Select Email Template'}
                        name={'template'}
                        options={templateOptions}
                        placeholder="Select Email Template"
                        value={templateValue}
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
