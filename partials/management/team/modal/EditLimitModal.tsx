import React, { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, ShowErrorNotifications, TextInput, Typography } from '@components'
import { ManagementApi } from '@queries'
import { useNotification } from '@hooks'
export const EditLimitModal = ({ onCancel, targetId }: any) => {
    const [updateKpiTarget, updateKpiTargetResult] =
        ManagementApi.CheckKpi.useUpdateKpiTargetLimit()
    const { notification } = useNotification()
    const validationSchema = yup.object().shape({
        target: yup
            .number()
            .positive('Number cannot be negative')
            .nullable(),
    })
    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
        // defaultValues: { ...editValues, body: bodyData },
    })
    useEffect(() => {
        if (updateKpiTargetResult.isSuccess) {
            notification.success({
                title: 'KPI Target Limit Updated',
                description: 'KPI Target Limit Updated Successfully',
            })
            methods.reset()
            onCancel()
        }
    }, [updateKpiTargetResult])
    const onSubmit = (data: any) => {
        // setTeamMembers([...teamMembers, data])
        const values = {
            body: data,
            id: targetId,
        }
        updateKpiTarget(values)

    }

    return (
        <>
            <ShowErrorNotifications result={updateKpiTargetResult} />
            <div className="pb-9 pt-10 px-5">
                <div className="mb-8 flex justify-center">
                    <Typography
                        variant="title"
                        color="text-primaryNew"
                        uppercase
                        bold
                    >
                        EDIT TARGET KPIs
                    </Typography>
                </div>{' '}
                <FormProvider {...methods}>
                    <form
                        className="mt-2 w-full"
                        onSubmit={methods.handleSubmit(onSubmit)}
                    >
                        <TextInput
                            name="target"
                            label={'Total KPIs'}
                            shadow="shadow-lg"
                            type="number"
                        />
                        <div className="flex items-center justify-center gap-x-2">
                            <Button
                                variant="primaryNew"
                                text="update"
                                loading={updateKpiTargetResult.isLoading}
                                disabled={updateKpiTargetResult.isLoading}
                                submit
                            />
                            <Button
                                variant="error"
                                text="cancel"
                                onClick={onCancel}
                            />
                        </div>
                    </form>
                </FormProvider>
            </div>
        </>
    )
}
