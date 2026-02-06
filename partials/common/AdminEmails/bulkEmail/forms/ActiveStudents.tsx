import {
    Button,
    Checkbox,
    InputRichTextEditor,
    inputRichTextEditorErrorMessage,
    Select,
    ShowErrorNotifications,
    TextInput,
} from '@components'
import { FileUpload } from '@hoc'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNotification } from '@hooks'
import { Attachment } from '@partials/common/Notifications'
import { CommonApi } from '@queries'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { ToStudentCard } from '../components/ToStudentCard'
import {
    useCoursesOptions,
    useIndustriesOptions,
    useRtoOptions,
    useStudentsOptions,
} from '../hooks'
type Props = {
    selectedUser: any
    setSelectedUser: any
    selectedStudent: any
    setSelectedStudent: any
}

export const ActiveStudents = ({
    selectedUser,
    setSelectedUser,
    selectedStudent,
    setSelectedStudent,
}: Props) => {
    const { notification } = useNotification()
    const [attachmentFiles, setAttachmentFiles] = useState<any>([])
    const [template, setTemplate] = useState<any | null>(null)
    const [templateId, setTemplateId] = useState<any | null>(null)
    const [templateBody, setTemplateBody] = useState<any | null>(null)
    const [templateSubject, setTemplateSubject] = useState<any | null>(null)
    const [selectAll, setSelectAll] = useState<any | null>(null)
    const [isChecked, setIsChecked] = useState(false)
    const [industryIds, setIndustryIds] = useState<any>([])
    const [rtoIds, setRtoIds] = useState<any>([])
    const [courseIds, setCourseIds] = useState<any>([])

    const [templateValue, setTemplateValue] = useState<any>(null)

    // Ids
    const getRtoIds = rtoIds.map((rto: any) => rto.value).join(',')
    const getCourseIds = courseIds.map((course: any) => course.value).join(',')
    const getIndustriesIds = industryIds
        .map((industry: any) => industry.value)
        .join(',')

    const isWithWorkplace =
        selectedStudent === 'With Workplace'
            ? 1
            : selectedStudent === 'Without Workplace'
                ? 2
                : undefined

    const { studentsOptions, bulkMailStudentsResponse } = useStudentsOptions({
        getCourseIds,
        getRtoIds,
        getIndustriesIds,
        isWithWorkplace,
    })
    const { rtoOptions, rtoResponse } = useRtoOptions()
    const { coursesOptions, coursesResponse } = useCoursesOptions()
    const { industryOptions, industriesResponse } = useIndustriesOptions()

    const [sendBulkEmail, resultSendBulkEmail] =
        CommonApi.Messages.useSendBulkMail()

    const checkAllStudents = () => {
        if (isChecked) {
            setSelectAll(null)
            setIsChecked(false)
        } else {
            setSelectAll(studentsOptions)
            setIsChecked(true)
        }
    }

    // Templates List
    const getTemplates = CommonApi.Messages.useAllTemplates()
    const templateOptions = getTemplates?.data?.length
        ? getTemplates?.data?.map((template: any) => ({
            label: template?.subject,
            value: template?.id,
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
    // Courses List

    const getStudentIds = selectAll?.map((student: any) => student?.value)
    const studentsIds =
        getStudentIds?.map((studentId: any) => {
            const student = bulkMailStudentsResponse?.data?.find(
                (student: any) => student.id === studentId
            )
            return student?.user?.id
        }) || null

    const toStudent = [
        {
            text: 'All Students',
            icon: '/images/icons/students.png',
        },
        {
            text: 'With Workplace',
            icon: '/images/icons/workplace.png',
        },
        {
            text: 'Without Workplace',
            icon: '/images/icons/no-workplace.png',
        },
    ]

    const validationSchema = yup.object({
        student: yup
            .array()
            .min(1, 'Must select at least 1 Student')
            .required(),
        message: yup
            .mixed()
            .test('Message', 'Must Provide Message', (value) =>
                inputRichTextEditorErrorMessage(value)
            ),
    })
    const formMethods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
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
        const {
            attachment,
            message,
            student,
            rtos,
            industries,
            course,
            students,
            template,
            ...rest
        } = data
        Object.entries(rest)?.forEach(([key, value]: any) => {
            formData.append(key, value)
        })

        attachment &&
            attachment?.length > 0 &&
            attachment?.forEach((attached: File) => {
                formData.append('attachment', attached)
            })
        formData.append('users', studentsIds || '')
        formData.append('template', templateId || '')
        formData.append('message', content)

        sendBulkEmail(formData)
        // sendBulk({ users: studentsIds, template: templateId })
    }
    // useEffect(() => {
    //     if (selectAll && selectAll?.length > 0) {
    //         formMethods.setValue('student', selectAll)
    //     }
    // }, [selectAll])
    useEffect(() => {
        if (template && template?.length > 0) {
            formMethods.setValue('subject', template)
        }
    }, [template])
    useEffect(() => {
        if (templateBody && templateBody?.length > 0) {
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
                description:
                    resultSendBulkEmail?.data?.message ||
                    'Bulk Email Sent Successfully',
                dissmissTimer: 6500,
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

    useEffect(() => {
        if (templateBody) {
            formMethods.setValue('message', templateBody)
        }
    }, [templateBody])
    return (
        <>
            <ShowErrorNotifications result={resultSendBulkEmail} />
            <FormProvider {...formMethods}>
                <form
                    className="flex flex-col"
                    onSubmit={formMethods.handleSubmit(onSubmit)}
                >
                    {selectedUser?.sendTo === 'Student' && (
                        <div className="py-4 flex justify-between items-center gap-x-3">
                            {toStudent.map(({ text, icon }: any) => (
                                <ToStudentCard
                                    key={text}
                                    text={text}
                                    icon={icon}
                                    selected={selectedStudent}
                                    onClick={() => {
                                        setSelectedStudent(text)
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    <div className="grid gap-x-4 grid-cols-2">
                        <Select
                            label={'Search by RTO'}
                            name={'rtos'}
                            options={rtoOptions}
                            loading={rtoResponse?.isLoading}
                            disabled={rtoResponse?.isLoading}
                            multi
                            onChange={(e: any) => {
                                setRtoIds(e)
                            }}
                        />
                        {selectedStudent !== 'Without Workplace' && (
                            <Select
                                label={'Search by Industry'}
                                name={'industries'}
                                options={industryOptions}
                                loading={industriesResponse?.isLoading}
                                disabled={industriesResponse?.isLoading}
                                multi
                                onChange={(e: any) => {
                                    setIndustryIds(e)
                                }}
                            />
                        )}

                        {/* <Select
                            label={'Search by Batch/Class'}
                            name={'batch'}
                            defaultValue={courseOptions}
                            value={courseValues}
                            options={[
                                {
                                    label: 'Course 1',
                                    value: 'course-1',
                                },
                                {
                                    label: 'Course 2',
                                    value: 'course-2',
                                },
                            ]}
                            multi
                        loading={courseLoading}
                        onChange={(e: any) => {
                            setCourseValues(e)
                        }}
                        /> */}
                        <Select
                            label={'Search by Course'}
                            name={'course'}
                            options={coursesOptions}
                            loading={coursesResponse?.isLoading}
                            disabled={coursesResponse?.isLoading}
                            multi
                            // loading={courseLoading}
                            onChange={(e: any) => {
                                setCourseIds(e)
                            }}
                        />
                    </div>

                    <Select
                        label={`Select Student`}
                        name={'student'}
                        // defaultValue={selectAll}
                        value={selectAll}
                        options={studentsOptions}
                        multi
                        // loading={courseLoading}
                        onChange={(e: any) => {
                            setSelectAll(e)
                        }}
                    />

                    <Checkbox
                        name="students"
                        label={'Select all Students'}
                        onChange={checkAllStudents}
                        defaultChecked={isChecked}
                    />

                    <Select
                        label={'Select Email Template'}
                        name={'template'}
                        options={templateOptions}
                        placeholder="Select Email Template"
                        value={templateValue}
                        onChange={(e: any) => {
                            setTemplate(e?.label)
                            setTemplateId(e?.value)
                            findTemplate(e?.value)
                            setTemplateValue(e)
                        }}
                    />

                    <TextInput label={'Subject'} name={'subject'} />

                    <InputRichTextEditor
                        name={'message'}
                        label={'Message'}
                    />
                    <div className="my-4 flex justify-between items-center">
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
