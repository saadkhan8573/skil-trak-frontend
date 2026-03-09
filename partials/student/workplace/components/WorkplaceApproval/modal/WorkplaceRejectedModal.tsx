import {
    Modal,
    Select,
    ShowErrorNotifications,
    TextArea,
    Typography,
} from '@components'
import { useNotification } from '@hooks'
import { SubAdminApi } from '@queries'
import { useEffect, useState } from 'react'
import { WPApprovalStatus } from '../enum'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useForm } from 'react-hook-form'
import { FcCancel } from 'react-icons/fc'
import * as Yup from 'yup'
import { WorkplaceProgressModal } from '@partials/rto-v2/student-detail/modals'

interface onSubmitType {
    reason: string | null
    note?: string
}

export const WorkplaceRejectedModal = ({
    onCancel,
    wpApprovalId,
}: {
    wpApprovalId: number
    onCancel: (val?: boolean) => void
}) => {
    const [changeStatus, changeStatusResult] =
        SubAdminApi.Workplace.changeWpReqStatus()

    const { notification } = useNotification()
    const [showProgress, setShowProgress] = useState(false)
    const [apiError, setApiError] = useState<any>(null)

    const validationSchema = Yup.object({
        reason: Yup.string()
            .nullable()
            .required('Please select a reason for rejection'),
        note: Yup.string().when('reason', {
            is: 'other',
            then: (schema) =>
                schema.required('Please specify the rejection reason'),
            otherwise: (schema) => schema.notRequired(),
        }),
    })

    const reasonOptions = [
        { label: 'Location is too far from my residence', value: 'too-far' },
        { label: 'Found my own workplace', value: 'find-own-workplace' },
        { label: 'Other', value: 'other' },
    ]

    const methods = useForm<onSubmitType>({
        resolver: yupResolver(validationSchema),
        mode: 'all',
        defaultValues: { reason: null, note: '' },
    })

    const selectedReason = methods.watch('reason')

    const onSubmit = async (values: onSubmitType) => {
        try {
            setApiError(null)
            setShowProgress(true)
            await changeStatus({
                id: wpApprovalId,
                body: {
                    comment: values.reason,
                    ...(values.reason === 'other' && {
                        note: values.note,
                    }),
                },
                status: WPApprovalStatus.Rejected,
            }).unwrap()
        } catch (error) {
            setApiError(error)
        }
    }

    const handleProgressComplete = () => {
        setShowProgress(false)
        if (changeStatusResult.isSuccess) {
            notification.success({
                title: 'Status Changed',
                description: 'Rejected successfully',
            })
            onCancel(true)
        } else if (apiError) {
            notification.error({
                title: 'Operation Failed',
                description:
                    apiError?.data?.message ||
                    apiError?.message ||
                    'Something went wrong',
            })
            onCancel(false)
        }
    }

    return (
        <>
            <div>
                {/* <ShowErrorNotifications result={changeStatusResult} /> */}

                <Modal
                    title={'Reason for Rejection'}
                    subtitle={''}
                    onConfirmClick={methods.handleSubmit(onSubmit)}
                    onCancelClick={onCancel}
                    loading={false}
                    titleIcon={FcCancel}
                >
                    <FormProvider {...methods}>
                        <form className="w-full">
                            <Typography variant="small">
                                Please provide a reason for rejection the
                                selected workplace.
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
                        </form>
                    </FormProvider>
                </Modal>
                <WorkplaceProgressModal
                    open={showProgress}
                    onComplete={handleProgressComplete}
                />
            </div>
        </>
    )
}
