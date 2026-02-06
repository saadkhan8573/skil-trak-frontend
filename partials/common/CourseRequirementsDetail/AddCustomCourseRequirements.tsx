import {
    Button,
    InputRichTextEditor,
    ShowErrorNotifications,
    Typography,
} from '@components'
import React, { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { RtoApi } from '@queries'
import * as yup from 'yup'
import { useNotification } from '@hooks'

export const AddCustomCourseRequirements = ({
    onCloseModal,
    courseId,
    initialRequirements,
}: {
    onCloseModal?: () => void
    courseId?: any
    initialRequirements?: string
}) => {
    const [submitCustomReq, submitCustomReqResult] =
        RtoApi.Courses.useAddRtoCustomCourseRequirements()
    const { notification } = useNotification()

    const isEditMode = initialRequirements !== undefined

    useEffect(() => {
        if (submitCustomReqResult.isSuccess) {
            notification.success({
                title: isEditMode
                    ? 'Course Requirements Updated'
                    : 'Course Requirements Added',
                description: isEditMode
                    ? 'Custom Course Requirements Updated Successfully'
                    : 'Custom Course Requirements Added Successfully',
            })
            onCloseModal?.()
        }
    }, [submitCustomReqResult.isSuccess])

    const validationSchema = yup.object({
        requirements: yup.string().required('Required'),
    })

    const methods = useForm({
        mode: 'all',
        defaultValues: {
            requirements: initialRequirements || '',
        },
    })

    const onSubmit = async (values: any) => {
        const { requirements } = values

        // Simple empty check (optional, yup might handle it)
        if (!requirements || requirements === '<p></p>' || requirements.trim() === '') {
            methods.setError('requirements', {
                type: 'manual',
                message: 'Must add requirements',
            })
            return
        }

        const body = { requirements }

        await submitCustomReq({
            body,
            id: courseId,
        })
    }

    return (
        <div className="space-y-6">
            <ShowErrorNotifications result={submitCustomReqResult} />
            <Typography variant="title">
                {isEditMode ? 'Edit' : 'Add'} Custom Course Requirements
            </Typography>
            <FormProvider {...methods}>
                <form
                    className="space-y-6"
                    onSubmit={methods.handleSubmit(onSubmit)}
                >
                    <InputRichTextEditor
                        label="Requirement"
                        name="requirements"
                        height="h-64"
                    />
                    <Button
                        submit
                        disabled={submitCustomReqResult.isLoading}
                        loading={submitCustomReqResult.isLoading}
                        text={
                            isEditMode
                                ? 'Update Requirement'
                                : 'Add Custom Requirement'
                        }
                    />
                </form>
            </FormProvider>
        </div>
    )
}
