import {
    Button,
    Select,
    ShowErrorNotifications,
    TextArea,
    Typography,
} from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNotification } from '@hooks'
import { SiteLayout } from '@layouts'
import { StudentApi } from '@queries'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as Yup from 'yup'

const DynamicPageData = () => {
    const [comment, setComment] = useState('')

    const router = useRouter()
    const { notification } = useNotification()

    const [reject, rejectResult] =
        StudentApi.Workplace.rejectIndustryFromEmail()

    useEffect(() => {
        if (rejectResult?.isSuccess) {
            notification.success({
                title: 'Industry Rejected',
                description: 'Industry Rejected Successfully!',
            })
            setComment('')
            router.push('/')
        }
    }, [rejectResult.isSuccess])
    const reasonOptions = [
        { label: 'Location is too far from my residence', value: 'too-far' },
        { label: 'Workplace preference', value: 'workplace-preference' },
        { label: 'Found my own workplace', value: 'find-own-workplace' },
        { label: 'Other', value: 'other' },
    ]

    const validationSchema = Yup.object({
        reason: Yup.string().required('Please select a reason'),

        note: Yup.string().when('reason', {
            is: 'other',
            then: (schema) => schema.required('Please specify your reason'),
            otherwise: (schema) => schema.notRequired(),
        }),
    })

    const methods = useForm({
        resolver: yupResolver(validationSchema) as any,
        mode: 'all',
        defaultValues: {
            reason: null as any,
            note: '',
        },
    })
    const selectedReason = methods.watch('reason')

    const onSubmit = (values: any) => {
        const payload = {
            id: Number(router.query.id),
            status: 'rejected',
            body: {
                comment: values.reason,
                ...(values.reason === 'other' && {
                    note: values.note,
                }),
            },
        }

        reject(payload)
    }

    return (
        <SiteLayout>
            <ShowErrorNotifications result={rejectResult} />
            <div className="max-w-7xl mx-auto py-5 md:py-10">
                <FormProvider {...methods}>
                    <form
                        className="mt-2 w-full"
                        onSubmit={methods.handleSubmit(onSubmit)}
                    >
                        <Typography variant="small">
                            Please provide a reason for rejection the selected
                            workplace.
                        </Typography>
                        <Select
                            name="reason"
                            options={reasonOptions}
                            placeholder="-- Select a reason --"
                            onlyValue
                        />
                        {selectedReason === 'other' && (
                            <TextArea
                                label="Specify your reason"
                                required
                                name="note"
                                placeholder="Enter reason..."
                                rows={5}
                            />
                        )}

                        <div className="mt-4 flex items-center justify-between">
                            <Button
                                submit
                                variant="error"
                                loading={rejectResult.isLoading}
                                disabled={rejectResult.isLoading}
                            >
                                Reject
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </SiteLayout>
    )
}

export default DynamicPageData
