import {
    Button,
    ShowErrorNotifications,
    TextArea,
    TextInput,
} from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/ui'
import { useNotification } from '@hooks'
import { AdminApi } from '@queries'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

export const EditSectorQuestionModal = ({
    isEditDialogOpen,
    setIsEditDialogOpen,
    editValues,
}: any) => {
    const [editQuestion, editQuestionResult] =
        AdminApi.SectorClusters.useUpdateSectorQuestion()
    const { notification } = useNotification()
    const methods = useForm({
        mode: 'all',
        defaultValues: {
            title: '',
            question: '',
            example: '',
        },
    })

    const { reset } = methods

    useEffect(() => {
        if (editQuestionResult.isSuccess) {
            notification.success({
                title: 'Question Updated',
                description: 'Question Updated Successfully',
            })
            setIsEditDialogOpen(false)
        }
    }, [editQuestionResult.isSuccess])

    useEffect(() => {
        if (isEditDialogOpen && editValues) {
            reset({
                title: editValues.title || '',
                question: editValues.question || '',
                example: editValues.example || '',
            })
        }
    }, [isEditDialogOpen, editValues])

    const onSubmit = (data: any) => {
        editQuestion({ id: editValues?.id, body: data })
    }

    return (
        <>
            <ShowErrorNotifications result={editQuestionResult} />
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Question</DialogTitle>
                        <DialogDescription>
                            Update the prerequisite question for this sector
                        </DialogDescription>
                    </DialogHeader>
                    <FormProvider {...methods}>
                        <form
                            className="mt-2 w-full"
                            onSubmit={methods.handleSubmit(onSubmit)}
                        >
                            <div className="py-4">
                                <div>
                                    <TextInput
                                        name="title"
                                        label={'Question Title'}
                                        placeholder="e.g., Direct Support Environment"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <TextArea
                                        name="question"
                                        label={'Question'}
                                        placeholder="Enter the question text..."
                                        rows={3}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <TextArea
                                        name="example"
                                        label={'Examples (Optional)'}
                                        placeholder="e.g., Examples: hoists, mobility aids..."
                                        rows={2}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="error"
                                    onClick={() => setIsEditDialogOpen(false)}
                                    outline
                                    text="Cancel"
                                />
                                <Button
                                    text="Update Question"
                                    variant="primaryNew"
                                    submit
                                    loading={editQuestionResult.isLoading}
                                />
                            </DialogFooter>
                        </form>
                    </FormProvider>
                </DialogContent>
            </Dialog>
        </>
    )
}
