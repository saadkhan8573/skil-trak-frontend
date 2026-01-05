import { ShowErrorNotifications, TextArea, TextInput } from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { Button } from '@components/buttons'
import { useNotification } from '@hooks'
import { CommonApi } from '@queries'
import { getDate } from '@utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as Yup from 'yup'

interface ExtendStudentExpiryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    studentId: number | undefined
    currentExpiryDate: Date | string
}

interface FormValues {
    expiryDate: Date
    comment: string
}

export const ExtendStudentExpiryDialog = ({
    open,
    onOpenChange,
    studentId,
    currentExpiryDate,
}: ExtendStudentExpiryDialogProps) => {
    const { notification } = useNotification()

    const [updateExpiryDate, updateExpiryDateResult] =
        CommonApi.Expiry.useExpiryDate()

    useEffect(() => {
        if (updateExpiryDateResult.isSuccess) {
            notification.success({
                title: 'Expiry Date Extended',
                description: 'Student expiry date has been updated successfully',
            })
            onOpenChange(false)
        }
    }, [updateExpiryDateResult.isSuccess])

    const validationSchema = Yup.object({
        expiryDate: Yup.string().required('New expiry date is required'),
        comment: Yup.string().required('Comment is required'),
    })

    const methods = useForm<FormValues>({
        resolver: yupResolver(validationSchema),
        mode: 'all',
    })

    const onSubmit = (values: FormValues) => {
        updateExpiryDate({ id: studentId, body: values })
    }

    return (
        <>
            <ShowErrorNotifications result={updateExpiryDateResult} />
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Extend Student Expiry Date</DialogTitle>
                        <DialogDescription>
                            Update the course completion deadline for this
                            student. Please provide a reason for the extension.
                        </DialogDescription>
                    </DialogHeader>

                    <FormProvider {...methods}>
                        <form
                            onSubmit={methods.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <TextInput
                                label="New Expiry Date"
                                name="expiryDate"
                                type="date"
                                placeholder="Select new expiry date"
                                min={getDate()}
                                showError={false}
                            />
                            <TextArea
                                name="comment"
                                label="Reason for Extension"
                                placeholder="Provide a detailed reason for extending the deadline..."
                                rows={4}
                                showError={false}
                            />

                            <DialogFooter>
                                <Button
                                    variant="secondary"
                                    onClick={() => onOpenChange(false)}
                                    disabled={updateExpiryDateResult.isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    submit
                                    loading={updateExpiryDateResult.isLoading}
                                    disabled={updateExpiryDateResult.isLoading}
                                    className="bg-gradient-to-r from-[#044866] to-[#0D5468] hover:from-[#0D5468] hover:to-[#044866]"
                                >
                                    Extend Deadline
                                </Button>
                            </DialogFooter>
                        </form>
                    </FormProvider>
                </DialogContent>
            </Dialog>
        </>
    )
}
