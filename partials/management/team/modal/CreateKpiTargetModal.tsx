import React, { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import {
    Button,
    Select,
    ShowErrorNotifications,
    TextInput,
    Typography,
} from '@components'
import { ManagementApi } from '@queries'
import { useRouter } from 'next/router'
import { useNotification } from '@hooks'
import moment from 'moment'

const filterOptions = [
    {
        label: 'Appointments',
        value: 'appointment',
    },
    {
        label: 'Student Provided',
        value: 'studentProvided',
    },
    {
        label: 'Placement Started',
        value: 'placementStarted',
    },
    {
        label: 'Agreements uploaded',
        value: 'agreementUploaded',
    },
]
export const CreateKpiTargetModal = ({ onCancel }: any) => {
    const { notification } = useNotification()
    const [createKpiTarget, createKpiTargetResult] =
        ManagementApi.CheckKpi.useCreateKpiTargetLimit()
    const router = useRouter()
    const validationSchema = yup.object().shape({
        target: yup
            .number()
            .positive('Number cannot be negative')
            .nullable(),
        data: yup.array().min(4, 'Must select 4 statuses'),
    })
    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema) as any,
        // defaultValues: { ...editValues, body: bodyData },
    })
    useEffect(() => {
        if (createKpiTargetResult.isSuccess) {
            notification.success({
                title: 'Target Added',
                description: 'Target Added Successfully',
            })
            onCancel()
        }
    }, [createKpiTargetResult])
    const onSubmit = (values: any) => {
        // const values = {
        //     ...data,
        //     member: router.query.memberId,
        // }
        const statuses = {
            target: values.target,
            data: values?.data,
        }
        const data = statuses?.data?.map((status: any) => ({
            target: statuses?.target,
            status: status,
        }))
        const structuredData = {
            data,
            member: router.query.memberId,
        }
        createKpiTarget(structuredData)
        methods.reset()
    }
    return (
        <>
            <ShowErrorNotifications result={createKpiTargetResult} />
            <div className="pb-9 pt-10 px-5 max-w-[480px]">
                <div className="mb-8 flex justify-center">
                    <Typography
                        variant="title"
                        color="text-primaryNew"
                        uppercase
                        bold
                    >
                        Create TARGET KPIs
                    </Typography>
                </div>{' '}
                <FormProvider {...methods}>
                    <form
                        className="mt-2 w-full"
                        onSubmit={methods.handleSubmit(onSubmit)}
                    >
                        <div className="min-w-[280px]">
                            <Select
                                name="data"
                                options={filterOptions}
                                placeholder="Select Status..."
                                onlyValue
                                // onChange={(e: any) => setFilter(e || undefined)}
                                shadow="shadow-md"
                                multi
                            />
                        </div>
                        <TextInput
                            name="target"
                            label={'Total KPIs'}
                            shadow="shadow-lg"
                            type="number"
                        />
                        <div className="flex items-center gap-x-2 justify-center">
                            <Button
                                variant="primaryNew"
                                text="create"
                                loading={createKpiTargetResult.isLoading}
                                disabled={createKpiTargetResult.isLoading}
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
