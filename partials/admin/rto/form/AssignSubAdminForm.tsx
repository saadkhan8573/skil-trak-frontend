import { Button, Select, TextArea, TextInput, Typography } from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { AdminApi } from '@queries'
import { Course, Sector, SubAdmin, UserStatus } from '@types'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'

interface FormProps {
    onSubmit: any
    edit?: boolean
    initialValues?: Course
    result: any
}

export const AssignSubAdminForm = ({
    edit,
    result,
    onSubmit,
    initialValues,
}: FormProps) => {
    const subAdmins = AdminApi.SubAdmins.useListQuery({
        search: `status:${UserStatus.Approved},isAssociatedWithRto:${false}`,
        skip: 0,
        limit: 10000,
    })

    const validationSchema = yup.object({})

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: initialValues,
        mode: 'all',
    })

    const subAdminOptions = subAdmins?.isSuccess
        ? subAdmins.data?.data.map((s: SubAdmin) => ({
              label: s?.user?.name,
              value: s?.id,
          }))
        : []

    return (
        <FormProvider {...methods}>
            <form
                className="mt-2 w-full"
                onSubmit={methods.handleSubmit(onSubmit)}
            >
                <div className={'flex flex-col gap-y-2'}>
                    <Typography variant={'muted'} color={'text-gray-400'}>
                        Select Sub Admin
                    </Typography>

                    <Select
                        name={'subAdmins'}
                        label={'Sub Admins'}
                        options={subAdminOptions}
                        loading={subAdmins.isLoading}
                        multi
                    />

                    <div className="flex">
                        <Button
                            submit
                            text="Assign"
                            loading={result.isLoading}
                            disabled={result.isLoading}
                        />
                    </div>
                </div>
            </form>
        </FormProvider>
    )
}
