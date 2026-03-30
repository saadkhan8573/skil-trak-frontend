import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { Typography } from '@components'
import { CommonApi } from '@queries'
import { processSubmission } from '@partials/common/StudentProfileDetail/feedbackForm/utils/getAnswersWithQuestions'
import { ViewPlacementFeedbackModal as FeedbackContent } from '@partials/common/StudentProfileDetail/feedbackForm/modals/ViewPlacementFeedbackModal'
import { Award, Loader2 } from 'lucide-react'

interface ViewPlacementFeedbackModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    userId: number
}

export const ViewPlacementFeedbackModal = ({
    open,
    onOpenChange,
    userId,
}: ViewPlacementFeedbackModalProps) => {
    const { data, isLoading } = CommonApi.Feedback.useGetPlacementFeedback(
        { userId },
        { skip: !userId || !open }
    )

    const processedFeedback = processSubmission(data || [])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl! p-0 overflow-hidden flex flex-col max-h-[92vh]">
                <style jsx global>{`
                    [data-slot='dialog-content'] > button {
                        color: white !important;
                        opacity: 0.8;
                    }
                    [data-slot='dialog-content'] > button:hover {
                        opacity: 1;
                    }
                `}</style>

                {/* Header */}
                <DialogHeader className="bg-primaryNew px-6 py-4 text-left shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                            <Award size={18} className="text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-white text-lg leading-tight">
                                Placement Feedback
                            </DialogTitle>
                            <Typography
                                variant="small"
                                className="text-white/80"
                            >
                                View submitted placement feedback
                            </Typography>
                        </div>
                    </div>
                </DialogHeader>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
                            <Loader2 size={20} className="animate-spin" />
                            <span className="text-sm">
                                Loading feedback...
                            </span>
                        </div>
                    ) : processedFeedback && processedFeedback.length > 0 ? (
                        <FeedbackContent feedbackData={processedFeedback} />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                            <Award size={40} className="text-gray-300" />
                            <Typography
                                variant="label"
                                className="text-gray-500"
                            >
                                No feedback found
                            </Typography>
                            <Typography
                                variant="small"
                                className="text-gray-400"
                            >
                                No placement feedback has been submitted yet.
                            </Typography>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
