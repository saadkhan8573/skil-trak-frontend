import { EmptyData, LoadingAnimation, StarRating, Typography } from '@components'
import { WorkplaceQuestionCard } from '@partials/common'
import { StudentFeedbackType } from '@partials/common/StudentProfileDetail/components/Workplace/enum'
import { CommonApi } from '@queries'
import { WorkplaceQuestionType } from 'redux/queryTypes'

export const IndustryFeedback = () => {
    const feedback = CommonApi.Feedback.useStudentFeedbackList({
        type: StudentFeedbackType.INDUSTRY_FEEDBACK,
    })
    return (
        <div className="mt-4">
            {feedback.isLoading ? (
                <LoadingAnimation />
            ) : feedback?.data && feedback?.data?.length > 0 ? (
                <div>
                    <div>
                        <Typography>Rating</Typography>
                        <div className="flex items-center gap-x-2">
                            <StarRating
                                count={5}
                                value={feedback?.data?.[0]?.rating}
                                edit={false}
                                size={24}
                                activeColor={'#ffd700'}
                            />
                            <Typography variant="label">
                                {feedback?.data?.[0]?.rating}
                            </Typography>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {feedback?.data?.map((fb: any) =>
                            fb?.questions
                                ?.slice(0, -1)
                                ?.map(
                                    (
                                        data: WorkplaceQuestionType,
                                        i: number
                                    ) => (
                                        <div>
                                            <WorkplaceQuestionCard
                                                title={data?.question}
                                                index={i}
                                                data={data}
                                                showOnlyAnswer
                                            />
                                        </div>
                                    )
                                )
                        )}
                    </div>
                </div>
            ) : (
                <EmptyData description="No Feedback was found!" />
            )}
        </div>
    )
}
