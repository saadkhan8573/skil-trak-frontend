import {
    Button,
    InputRichTextEditor,
    inputRichTextEditorErrorMessage,
    ShowErrorNotifications,
    TagInput,
    TextArea,
    Typography,
    UploadFile,
    useShowErrorNotification,
} from '@components'
import React, { useEffect, useState } from 'react'
import { SubAdminApi } from '@queries'
import { useNotification } from '@hooks'
import { LabelTag } from '@partials/student/talentPool'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { FileUpload } from '@hoc'
import Image from 'next/image'
import Link from 'next/link'
import { AddHodNote } from '@partials/common/IndustryProfileDetail/components/CourseManagement/components'

export const ApproveCourseModal = ({ onCloseModal, request }: any) => {
    const [description, setDescription] = useState('')
    const [validationError, setValidationError] = useState('')
    const [tags, setTags] = useState<any>({
        reference: request?.reference?.length ? request?.reference : [],
    })
    const [courseRequest, courseRequestResult] =
        SubAdminApi.SubAdmin.useDepartmentCourseRequest()

    const showErrorNotifications = useShowErrorNotification()

    const { notification } = useNotification()

    useEffect(() => {
        if (courseRequestResult.isSuccess) {
            notification.success({
                title: 'Course Request Approved',
                description:
                    'Add Course request for industry has been approved.',
            })
            onCloseModal()
        }
    }, [courseRequestResult.isSuccess])

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
    const validationSchema = yup.object().shape({
        description: yup
            .mixed()
            .test('Message', 'Description is required', (value: any) =>
                inputRichTextEditorErrorMessage(value)
            ),
    })
    const methods = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'all',
        defaultValues: {
            description: request?.description ?? '',
            file: request?.file,
        },
    })

    const onSubmit = async (data: any) => {
        // if (!validateForm()) return
        const { description, file } = data
        const { reference } = tags

        const formData = new FormData()
        formData.append('description', description)
        // formData.append('reference', JSON.stringify(reference))
        formData.append('reference', reference.join(','))

        if (file && Array.isArray(file) && file[0] instanceof File) {
            formData.append('file', file[0])
        } else if (request?.file) {
            formData.append('oldFile', request.file)
        }

        const res: any = await courseRequest({
            params: {
                id: request.id,
                status: 'approved',
            },
            body: formData,
        })
        if (res?.data) {
            notification.info({
                title: 'Course Description',
                description: 'Course description successfully updated.',
            })
        } else {
            showErrorNotifications({ isError: true, ...res })
        }

        // Form data processed
    }

    const submitForm = () => {
        onSubmit(methods.getValues())
    }
    return (
        <>
            <ShowErrorNotifications result={courseRequestResult} />
            <div className="flex justify-center flex-col items-center gap-4 px-8 py-4">
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
                                    {request?.course?.title} -{' '}
                                    {request?.course?.code} (
                                    {request?.course?.sector?.name})
                                </Typography>
                            </div>
                            <div className="flex flex-col gap-y-2 w-full mt-4">
                                <div className=" min-w-96">
                                    <div className="">
                                        <InputRichTextEditor name="description" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-y-2">
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
                                <AddHodNote
                                    comment={request?.hodComment}
                                    courseReqId={request?.id}
                                />
                                {request?.file && (
                                    <Typography variant="body">
                                        A file has already been uploaded for
                                        this course.&nbsp;
                                        <Link
                                            href={`https://docs.google.com/gview?url=${encodeURIComponent(
                                                request.file
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
                                    variant="success"
                                    onClick={submitForm}
                                    text="Approve"
                                    loading={courseRequestResult.isLoading}
                                    disabled={courseRequestResult.isLoading}
                                />
                            </div>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </>
    )
}
