import { Button, TextArea } from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNotification } from '@hooks'
import { RtoV2Api } from '@queries'
import { Student } from '@types'
import { FormProvider, useForm } from 'react-hook-form'
import * as Yup from 'yup'

interface AddExpectedDelayModalProps {
    isOpen: boolean
    onClose: () => void
    student: Student
}

export const AddExpectedDelayModal = ({
    isOpen,
    onClose,
    student,
}: AddExpectedDelayModalProps) => {
    const [addExpectedDelay, { isLoading }] =
        RtoV2Api.Students.addExpectedDelay()

    const { notification } = useNotification()

    const validationSchema = Yup.object({
        expectedDelayReason: Yup.string().required('Please provide a reason'),
    })

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'all',
    })

    const onSubmit = (values: any) => {
        addExpectedDelay({
            id: student?.id,
            expectedDelayReason: values.expectedDelayReason,
        }).then((res: any) => {
            if (res?.data) {
                notification.success({
                    title: 'Delay Added',
                    description: 'Expected delay reason added successfully.',
                })
                onClose()
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-white border-none shadow-2xl p-0 overflow-hidden">
                <div className="p-6 pb-4">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-xl font-bold text-gray-900">
                            Add Expected Delay
                        </DialogTitle>
                        <DialogDescription className="text-gray-500 text-sm">
                            Please provide the reason for the expected delay for{' '}
                            {student?.user?.name}.
                        </DialogDescription>
                    </DialogHeader>

                    <FormProvider {...methods}>
                        <form className="space-y-4">
                            <TextArea
                                label={'Delay Reason'}
                                required
                                name={'expectedDelayReason'}
                                placeholder={
                                    'Enter expected delay reason details...'
                                }
                                rows={4}
                                className="resize-none border-gray-200 focus:border-primary focus:ring-primary/20"
                            />
                        </form>
                    </FormProvider>
                </div>

                <div className="flex justify-end gap-3 p-4 border-t border-gray-100 bg-gray-50/50">
                    <Button
                        text="Cancel"
                        variant="secondary"
                        onClick={onClose}
                        disabled={isLoading}
                        outline
                        className="w-24"
                    />
                    <Button
                        text="Add Delay"
                        onClick={methods.handleSubmit(onSubmit)}
                        loading={isLoading}
                        className="w-32"
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
