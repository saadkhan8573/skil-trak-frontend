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
    DialogTrigger,
} from '@components/ui'
import { useNotification } from '@hooks'
import { AdminApi } from '@queries'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

export const AddSectorQuestionModal = ({
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEdit = false,
    editValues,
}: any) => {
    const router = useRouter()
    const secId = router.query.id
    const [addQuestion, addQuestionResult] =
        AdminApi.SectorClusters.useAddSectorQuestion()
    const [editQuestion, editQuestionResult] =
        AdminApi.SectorClusters.useUpdateSectorQuestion()
    const { notification } = useNotification()

    useEffect(() => {
        if (addQuestionResult.isSuccess) {
            notification.success({
                title: 'Question Added',
                description: 'Question Added Successfully',
            })
            setIsAddDialogOpen(false)
        }
    }, [addQuestionResult.isSuccess])

    useEffect(() => {
        if (editQuestionResult.isSuccess) {
            notification.success({
                title: 'Question Updated',
                description: 'Question Updated Successfully',
            })
            setIsAddDialogOpen(false)
        }
    }, [editQuestionResult.isSuccess])

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
        if (isEdit && editValues) {
            reset({
                title: editValues?.title || '',
                question: editValues?.question || '',
                example: editValues?.example || '',
            })
        } else {
            reset({
                title: '',
                question: '',
                example: '',
            })
        }
    }, [isEdit, editValues])

    const onSubmit = (data: any) => {
        const payload = {
            ...data,
            sectorId: secId,
        }
        if (isEdit) {
            editQuestion({
                id: editValues?.id,
                body: data,
            })
        } else {
            addQuestion(payload)
        }
    }
    return (
        <>
            <ShowErrorNotifications result={addQuestionResult} />
            <ShowErrorNotifications result={editQuestionResult} />
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="secondary"
                        Icon={Plus}
                        text="Add Custom Question"
                        outline
                    />
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {isEdit ? 'Edit Question' : 'Add Custom Question'}
                        </DialogTitle>
                        <DialogDescription>
                            Create a custom prerequisite question for this
                            sector
                        </DialogDescription>
                    </DialogHeader>
                    <FormProvider {...methods}>
                        <form
                            className="mt-2 w-full"
                            onSubmit={methods.handleSubmit(onSubmit)}
                        >
                            <div className=" py-4">
                                <div>
                                    <TextInput
                                        name="title"
                                        // onChange={(e: any) =>
                                        //     setNewQuestion({
                                        //         ...newQuestion,
                                        //         title: e.target.value,
                                        //     })
                                        // }
                                        label={'Question Title'}
                                        placeholder="e.g., Direct Support Environment"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <TextArea
                                        name="question"
                                        // value={newQuestion.question}
                                        // onChange={(e: any) =>
                                        //     setNewQuestion({
                                        //         ...newQuestion,
                                        //         question: e.target.value,
                                        //     })
                                        // }
                                        label={'Question'}
                                        placeholder="Enter the question text..."
                                        rows={3}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <TextArea
                                        name="example"
                                        // value={newQuestion.examples}
                                        // onChange={(e: any) =>
                                        //     setNewQuestion({
                                        //         ...newQuestion,
                                        //         examples: e.target.value,
                                        //     })
                                        // }
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
                                    onClick={() => setIsAddDialogOpen(false)}
                                    outline
                                    text="Cancel"
                                />
                                <Button
                                    text={
                                        isEdit
                                            ? 'Update Question'
                                            : 'Add Question'
                                    }
                                    variant="primaryNew"
                                    submit
                                    loading={
                                        isEdit
                                            ? editQuestionResult.isLoading
                                            : addQuestionResult.isLoading
                                    }
                                />
                            </DialogFooter>
                        </form>
                    </FormProvider>
                </DialogContent>
            </Dialog>
        </>
    )
}
