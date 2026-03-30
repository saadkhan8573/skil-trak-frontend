import { ShowErrorNotifications, Typography } from '@components'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { useNotification } from '@hooks'
import { AddCoordinatorFeedbackForm } from '@partials/common/StudentProfileDetail/components/Workplace/forms'
import { CommonApi, useStartPlacementMutation } from '@queries'
import { Course } from '@types'
import Image from 'next/image'

export const feedbackQuestions = {
    professionalism:
        'Does the student demonstrate professionalism and courtesy in their interactions?',
    commitments:
        'Is the student punctual and reliable in meeting deadlines and commitments?',
    industrypartners:
        'Does the student communicate effectively and promptly with coordinators and industry partners?',
    guidelines:
        'Does the student follow instructions and guidelines provided by coordinators and industry partners?',
    clarification:
        'Is the student proactive in seeking assistance or clarification when needed?',
    skills: 'Does the student demonstrate adaptability and willingness to learn new tasks and skills?',
    behaviour:
        "Are there any specific areas where the student's behaviour or general process could be improved?",
    feedback: 'How would you rate the student out of 5 stars?',
}

export const AddFeedbackModal = ({
    course,
    id,
    student,
    open,
    onOpenChange,
    wpId,
    industryId,
    isStartPlacement = true,
}: {
    wpId: number
    industryId: number
    course: Course
    id: any
    student: any
    open: boolean
    onOpenChange: (open: boolean) => void
    isStartPlacement?: boolean
}) => {
    const { notification } = useNotification()

    const [addFeedback, addFeedbackResult] =
        CommonApi.Feedback.useStudentFeedback()
    const [startPlacement, startPlacementResult] = useStartPlacementMutation()

    const onHandleSubmit = async (values: any) => {
        try {
            let questions: { question: string; answer: string }[] = []
            Object.entries(feedbackQuestions).forEach(([key, value]: any) =>
                questions.push({
                    question: value,
                    answer: values[key],
                })
            )
            const res: any = await addFeedback({
                rating: Number(values?.feedback),
                course: course?.id,
                questions,
                student: student?.id,
                workplaceRequest: wpId,
                industry: industryId,
            })
            if (res?.data) {
                if (!isStartPlacement) {
                    notification.success({
                        title: 'Feedback Added!',
                        description: 'Feedback Added Successfully!',
                    })
                    onOpenChange(false)
                }
                if (isStartPlacement) {
                    const placementRes: any = await startPlacement(id)
                    if (placementRes?.data) {
                        notification.success({
                            title: 'Feedback Added!',
                            description: 'Feedback Added Successfully!',
                        })
                        onOpenChange(false)
                    }
                }
            }
        } catch (error) {
            notification.error({
                title: 'Something went wrong!',
                description:
                    'An unexpected error occurred. Please try again.',
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl! p-0 overflow-hidden flex flex-col max-h-[95vh]">
                <ShowErrorNotifications result={addFeedbackResult} />
                <ShowErrorNotifications result={startPlacementResult} />

                <DialogHeader className="bg-primaryNew px-6 py-3 text-left shrink-0 relative">
                    <DialogTitle className="text-white text-xl">
                        Add Feedback
                    </DialogTitle>
                    <Typography variant="small" className="text-white">
                        Provide student assessment feedback
                    </Typography>
                    <style jsx global>{`
                        [data-slot='dialog-content'] > button {
                            color: white !important;
                            opacity: 0.8;
                        }
                        [data-slot='dialog-content'] > button:hover {
                            opacity: 1;
                        }
                    `}</style>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 md:px-10 custom-scrollbar">
                    <div className="flex flex-col gap-y-4 items-center mb-6">
                        <Image
                            src={'/images/feedback/feedback.png'}
                            alt={'Feedback'}
                            width={64}
                            height={64}
                            className="w-16 h-16"
                        />
                        <Typography
                            variant="label"
                            center
                            className="text-gray-600 max-w-2xl"
                        >
                            Your input regarding the student's behaviour and
                            general process is highly appreciated. Kindly
                            provide your feedback by answering the following
                            questions with "Yes" or "No" responses:
                        </Typography>
                    </div>

                    <AddCoordinatorFeedbackForm
                        isStartPlacement={isStartPlacement}
                        onSubmit={onHandleSubmit}
                        result={
                            addFeedbackResult?.isLoading
                                ? addFeedbackResult
                                : startPlacementResult
                        }
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
