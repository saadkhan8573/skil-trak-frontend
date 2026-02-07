import React from 'react'
import * as Yup from 'yup'
import {
    Modal,
    InputRichTextEditor,
    inputRichTextEditorErrorMessage,
    ShowErrorNotifications,
} from '@components'
import { RtoApi } from '@queries'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNotification } from '@hooks'
import { FormProvider, useForm } from 'react-hook-form'

export const CourseInfoModal = ({
    courseInfo,
    onCancel,
    courseId,
    userId,
}: {
    userId?: number
    courseInfo: any
    courseId: number
    onCancel: () => void
}) => {
    const [add, addResult] = RtoApi.Courses.addRtoCourseInfo()

    const { notification } = useNotification()

    const validationSchema = Yup.object({
        body: Yup.mixed().test('Message', 'Must Provide Message', (value: any) =>
            inputRichTextEditorErrorMessage(value)
        ),
    })

    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
        defaultValues: { body: courseInfo?.[0]?.info || '' },
    })

    const isCourseInfo = courseInfo && courseInfo?.length > 0

    const onSubmit = async (values: any) => {
        const courseInfo = values?.body

        const res: any = await add({
            id: courseId,
            courseInfo,
            userId,
        })

        if (res?.data) {
            isCourseInfo
                ? notification.info({
                    title: 'Course Info Updated',
                    description: 'Course Info Updated Successfully',
                })
                : notification.success({
                    title: 'Course Info Added',
                    description: 'Course Info Added Successfully',
                })
            onCancel()
        }
    }

    return (
        <div>
            <ShowErrorNotifications result={addResult} />
            <Modal
                title={isCourseInfo ? 'Edit Info' : 'Add Info'}
                onCancelClick={onCancel}
                subtitle={`${isCourseInfo ? 'Edit' : 'Add'} Course Info`}
                loading={addResult?.isLoading}
                onConfirmClick={methods.handleSubmit(onSubmit)}
            >
                <FormProvider {...methods}>
                    <form className="mt-2 w-full md:w-[600px] lg:w-[700px]">
                        <div>
                            <div className="mb-3">
                                <InputRichTextEditor
                                    name={'body'}
                                    label={
                                        isCourseInfo ? 'Edit Info' : 'Add Info'
                                    }
                                />
                            </div>
                        </div>
                    </form>
                </FormProvider>
            </Modal>
        </div>
    )
}
