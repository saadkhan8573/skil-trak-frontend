import React, { useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@components/ui/dialog'
import {
    Button,
    InputRichTextEditor,
    inputRichTextEditorErrorMessage,
} from '@components'
import { Edit, X, Save } from 'lucide-react'
import { useNotification } from '@hooks'
import { CommonApi } from '@queries'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Controller, FormProvider, useForm } from 'react-hook-form'

interface EditTicketMessageModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    message: any
    replyId: any
}

export const EditTicketMessageModal = ({
    open,
    onOpenChange,
    message,
    replyId,
}: EditTicketMessageModalProps) => {
    const { notification } = useNotification()
    const [updateReply, { isLoading, isSuccess }] =
        CommonApi.Tickets.useUpdateReply()

    const validationSchema = yup.object().shape({
        message: yup
            .string()
            .ensure()
            .test(
                'Message',
                'Must Provide Message',
                inputRichTextEditorErrorMessage
            ),
    })

    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
        defaultValues: {
            message: message?.message || '',
        },
    })

    const onSubmit = async (values: any) => {
        try {
            const res: any = await updateReply({
                id: replyId,
                message: values.message,
            })

            if (res?.error) {
                notification.error({
                    title: 'Update Failed',
                    description:
                        res.error?.data?.message ||
                        'There was an error updating the reply.',
                })
                return
            }

            notification.success({
                title: 'Reply Updated',
                description: 'Reply Updated Successfully',
            })
            onOpenChange(false)
        } catch (error) {
            notification.error({
                title: 'Update Failed',
                description: 'Something went wrong. Please try again.',
            })
        }
    }

    useEffect(() => {
        if (open) {
            methods.reset({ message: message?.message || '' })
        }
    }, [open, message])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl! flex flex-col overflow-hidden">
                <DialogHeader className="shrink-0">
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <div className="h-10 w-10 rounded-lg bg-linear-to-br from-primaryNew to-primaryNew/80 flex items-center justify-center text-white">
                            <Edit className="h-5 w-5" />
                        </div>
                        <span>Edit your reply</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1">
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(onSubmit)}>
                            <InputRichTextEditor
                                name={'message'}
                                label="Message"
                                height="h-64"
                            />
                        </form>
                    </FormProvider>
                </div>

                <DialogFooter className="shrink-0 gap-2 border-t pt-4">
                    <Button
                        onClick={() => onOpenChange(false)}
                        variant="secondary"
                        Icon={X}
                        text="Cancel"
                        disabled={isLoading}
                    />
                    <Button
                        onClick={methods.handleSubmit(onSubmit)}
                        variant="primaryNew"
                        disabled={isLoading}
                        loading={isLoading}
                        Icon={Save}
                        text="Update"
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
