import {
    Button,
    Select,
    ShowErrorNotifications,
    TextInput,
    Typography,
} from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNotification } from '@hooks'
import { AdminApi } from '@queries'
import { Course, DeliveryMode, Industry } from '@types'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'

export const AddIndustryCourseProgramForm = ({
    course,
    industry,
    onCancel,
    onSuccess,
}: {
    course: Course
    industry: Industry
    onCancel: () => void
    onSuccess?: () => void
}) => {
    const coursePrograms = AdminApi.Courses.courseProgramList({
        id: course?.id,
        limit: 100,
        skip: 0,
    })

    const validationSchema = yup.object({
        courseProgram: yup
            .string()
            .required('Stream (Block) is required')
            .typeError('Stream (Block) is required'),

        deliveryMode: yup
            .array()
            .of(
                yup
                    .string()
                    .oneOf(
                        Object.values(DeliveryMode),
                        'Invalid delivery mode selected'
                    )
            )
            .min(1, 'At least one delivery mode is required')
            .required('Delivery mode is required')
            .typeError('Delivery mode is required'),
    })

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'all',
    })

    const { notification } = useNotification()

    const [addProgram, addProgramResult] =
        AdminApi.Industries.addIndustryCourseProgram()

    const onSubmit = async (values: any) => {
        const res: any = await addProgram({
            ...values,
            industry: industry?.id,
        })

        if (res?.data) {
            notification.success({
                title: 'Keywords Added',
                description: 'Keywords Added Successfully',
            })
            onCancel()
            onSuccess?.()
            return
        }
        return
    }

    const programOptions = coursePrograms?.data?.data?.map((program) => ({
        label: program?.title,
        value: program?.id,
    }))

    const deliveryMode = Object.entries(DeliveryMode)?.map(
        ([label, value]) => ({
            label,
            value,
        })
    )
    return (
        <>
            <ShowErrorNotifications result={addProgramResult} />
            <FormProvider {...methods}>
                <form
                    className="w-full"
                    onSubmit={methods.handleSubmit(onSubmit)}
                >
                    <Typography
                        variant="label"
                        semibold
                        block
                        className="py-2 bg-gray-100 rounded-md w-full text-center"
                    >
                        Add Course Stream (Block)
                    </Typography>
                    <Select
                        name={'courseProgram'}
                        label={'Stream (Block)'}
                        options={programOptions}
                        onlyValue
                        loading={coursePrograms?.isLoading}
                        disabled={coursePrograms?.isLoading}
                    />

                    <Select
                        multi
                        onlyValue
                        menuPlacement="top"
                        name={'deliveryMode'}
                        label={'Delivery Mode'}
                        options={deliveryMode}
                    />

                    <div className="flex justify-end items-center gap-x-2">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                onCancel()
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            submit
                            loading={methods?.formState?.isSubmitting}
                            disabled={methods?.formState?.isSubmitting}
                        >
                            Add
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </>
    )
}
