import React from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { Button, TextInput } from '@components'

export const AddInsuaranceTypeForm = ({
    data,
    result,
    onSubmit,
}: {
    data?: string
    result: any
    onSubmit: (values: any) => void
}) => {
    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required'),
    })

    const methods = useForm<any>({
        mode: 'all',
        resolver: yupResolver(validationSchema),
        defaultValues: {
            title: data,
        },
    })

    return (
        <div>
            {' '}
            <FormProvider {...methods}>
                <form
                    className="mt-2 w-full"
                    onSubmit={methods.handleSubmit(onSubmit)}
                >
                    <TextInput name="title" placeholder="Add Ttile here..." />
                    <div className="flex justify-end">
                        <Button
                            submit
                            text={data ? 'Edit Type' : 'Add Type'}
                            variant={data ? 'info' : 'primary'}
                            loading={result?.isLoading}
                            disabled={result?.isLoading}
                        />
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}
