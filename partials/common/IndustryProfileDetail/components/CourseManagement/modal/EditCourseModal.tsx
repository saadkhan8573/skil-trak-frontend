import {
    ActionButton,
    Button,
    InputRichTextEditor,
    inputRichTextEditorErrorMessage,
    ShowErrorNotifications,
    TagInput,
    Typography,
    UploadFile,
} from '@components'
import { useNotification } from '@hooks'
import { LabelTag } from '@partials/student/talentPool'
import { AdminApi, SubAdminApi } from '@queries'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { FileUpload } from '@hoc'
import Link from 'next/link'
import { RiShining2Fill } from 'react-icons/ri'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'

export const EditCourseModal = ({
    course,
    onCloseModal,
    courseRequestId,
}: any) => {
    const [tags, setTags] = useState<any>({
        reference: course?.reference?.length ? course?.reference : [],
    })
    const router = useRouter()
    const { notification } = useNotification()

    const [updateCourse, updateCourseResult] =
        AdminApi.Industries.useUpdateIndustryProfileCourse()
    const [generateContent, generateContentResult] =
        SubAdminApi.Industry.useGenerateDescription()

    const validationSchema = yup.object().shape({
        description: yup
            .string()
            .ensure()
            .test('Message', 'Description is required', inputRichTextEditorErrorMessage),
    })
    const methods = useForm<any>({
        resolver: yupResolver(validationSchema as any),
        mode: 'all',
        defaultValues: {
            description: course.description ?? '',
        },
    })

    useEffect(() => {
        if (updateCourseResult.isSuccess) {
            notification.success({
                title: 'Course Details Updated',
                description: 'Course details updated successfully',
            })

            onCloseModal()
            methods.reset()
        }
    }, [updateCourseResult.isSuccess])
    useEffect(() => {
        if (generateContentResult.isSuccess) {
            methods.setValue('description', generateContentResult.data?.content || generateContentResult.data)
            notification.success({
                title: 'Course content generated',
                description: 'Course content generated successfully',
            })
        }
    }, [generateContentResult.isSuccess, generateContentResult.data])

    const handleTagEnter = (name: string, newTag: string) => {
        setTags((prevTags: any) => ({
            ...prevTags,
            [name]: [...prevTags[name], newTag],
        }))
    }

    const handleRemoveTag = (name: string, tagToRemove: string) => {
        setTags((prevTags: any) => ({
            ...prevTags,
            [name]: prevTags[name].filter((tag: string) => tag !== tagToRemove),
        }))
    }

    const onSubmit = (data: any) => {
        const { description, file } = data
        const { reference } = tags

        const formData = new FormData()
        formData.append('description', description)
        formData.append('reference', reference.join(','))

        if (file && Array.isArray(file) && file[0] instanceof File) {
            formData.append('file', file[0])
        } else if (course?.file) {
            formData.append('oldFile', course?.file)
        }

        updateCourse({
            body: formData,
            id: courseRequestId,
        })
    }

    const submitForm = () => {
        onSubmit(methods.getValues())
    }

    const handleGenerateContent = () => {
        const indId = router.query.id
        const courseId = course?.course?.id
        generateContent({ indId, courseId })
    }

    return (
        <>
            <ShowErrorNotifications result={updateCourseResult} />
            <ShowErrorNotifications result={generateContentResult} />
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <div className="flex justify-center  flex-col gap-y-2 px-2 py-2">
                        <div className="flex flex-col gap-y-2 items-center">
                            <Image
                                src={'/images/industry/add-course-icon.svg'}
                                width={50}
                                height={50}
                                alt="course icon"
                            />
                            <Typography
                                variant="subtitle"
                                semibold
                                color="text-indigo-400"
                                italic
                            >
                                {' '}
                                {course?.course?.title} - {course?.course?.code}{' '}
                                ({course?.course?.sector?.name})
                            </Typography>
                        </div>
                        <div className="flex flex-col gap-y-2 w-full mt-4">
                            <div className=" min-w-96">
                                {/* <TextArea
                                    name="description"
                                    rows={5}
                                    placeholder="Enter description"
                                    required
                                /> */}
                                <div className="">
                                    <InputRichTextEditor
                                        name="description"
                                    // label="Description"
                                    // height="300px"
                                    />
                                </div>
                                {!course?.isContentVerified &&
                                    course.status !== 'pending' && (
                                        <div className="flex justify-end">
                                            <ActionButton
                                                Icon={RiShining2Fill}
                                                variant="dark"
                                                onClick={handleGenerateContent}
                                                loading={
                                                    generateContentResult.isLoading
                                                }
                                                disabled={
                                                    generateContentResult.isLoading
                                                }
                                            >
                                                Generate
                                            </ActionButton>
                                        </div>
                                    )}
                            </div>
                            <div className="min-w-64">
                                <TagInput
                                    name="reference"
                                    onTagEnter={handleTagEnter}
                                />
                                {tags?.reference?.length > 0 && (
                                    <LabelTag
                                        tagName={'reference'}
                                        tags={tags}
                                        handleRemoveTag={handleRemoveTag}
                                    />
                                )}
                            </div>
                            {course?.file && (
                                <Typography variant="body">
                                    A file has already been uploaded for this
                                    course.&nbsp;
                                    <Link
                                        href={`https://docs.google.com/gview?url=${encodeURIComponent(
                                            course?.file
                                        )}&embedded=true`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-500 underline hover:text-indigo-700"
                                    >
                                        View current file
                                    </Link>
                                </Typography>
                            )}
                            <FileUpload
                                name={'file'}
                                component={UploadFile}
                                limit={Number(1111111111)}
                            />
                        </div>
                        <div className="flex justify-center">
                            <Button
                                text={'Update'}
                                variant="info"
                                onClick={submitForm}
                                loading={updateCourseResult.isLoading}
                                disabled={updateCourseResult.isLoading}
                            />
                        </div>
                    </div>
                </form>
            </FormProvider>
        </>
    )
}
