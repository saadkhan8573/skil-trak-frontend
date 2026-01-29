import {
    Button,
    ShowErrorNotifications,
    TextArea,
    Typography,
} from '@components'
import { UserRoles } from '@constants'
import { useNotification } from '@hooks'
import { CommonApi } from '@queries'
import { getUserCredentials } from '@utils'
import React, { useEffect, useState } from 'react'
import { BiSolidMessageRounded } from 'react-icons/bi'
import { FcGraduationCap } from 'react-icons/fc'
import { GiRoundStar } from 'react-icons/gi'
import { StarRating } from './StarRating'

export const RateCoordinatorModal = ({
    userId,
    onCloseModal,
}: {
    userId: number
    onCloseModal?: any
}) => {
    const [review, setReview] = useState<string>('')
    const [rating, setRating] = React.useState<number>(0)
    const { notification } = useNotification()
    const [submitFeedback, resultSubmitFeedback] =
        CommonApi.Feedback.submitCoordinatorFeedback()
    const userRole = getUserCredentials()?.role

    const onCancel = () => {
        setReview('')
        setRating(0)
        onCloseModal()
    }
    const onDescription = (e: any) => {
        setReview(e.target.value)
    }

    const onSubmit = () => {
        submitFeedback({
            rating: rating,
            review: review,
            reviewFor: userId,
        })
    }

    useEffect(() => {
        if (resultSubmitFeedback.isSuccess) {
            notification.success({
                title: 'Feedback submitted successfully',
                description: 'Thank you for your feedback!',
            })
            onCloseModal()
        }
    }, [resultSubmitFeedback.isSuccess])

    return (
        <>
            <ShowErrorNotifications result={resultSubmitFeedback} />
            <div className="flex flex-col gap-y-4 mt-4 min-w-[36rem] p-8">
                <div className="flex flex-col gap-y-2">
                    <Typography variant="title">
                        Rate Your SkilTrak Placement Coordinator
                    </Typography>
                    {userRole === UserRoles.STUDENT ? (
                        <div className="flex items-center gap-x-2">
                            <div className="">
                                <FcGraduationCap />
                            </div>
                            <Typography variant="small" color="text-gray-500">
                                Student Feedback Form
                            </Typography>
                        </div>
                    ) : (
                        <div className="flex items-center gap-x-2">
                            <div className="">
                                <FcGraduationCap />
                            </div>
                            <Typography variant="xs" color="text-gray-500">
                                Industry Feedback Form
                            </Typography>
                        </div>
                    )}
                </div>
                <div className="mt-4 mb-2">
                    <div className="flex items-center gap-x-2 justify-center">
                        <div className="">
                            <GiRoundStar className="text-yellow-500" />
                        </div>
                        <Typography variant="body">
                            How would you rate your coordinator?
                        </Typography>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-y-2">
                        <StarRating
                            rating={rating}
                            onRatingChange={setRating}
                        />
                        {rating > 0 && (
                            <p className="text-sm text-muted-foreground">
                                {rating === 1
                                    ? 'Poor'
                                    : rating === 2
                                        ? 'Fair'
                                        : rating === 3
                                            ? 'Good'
                                            : rating === 4
                                                ? 'Very Good'
                                                : 'Excellent'}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-y-2">
                    <div className="flex items-center gap-x-2">
                        <BiSolidMessageRounded className={'text-gray-500'} />
                        <Typography variant="small">
                            Tell us about your placement experience (optional)
                        </Typography>
                    </div>
                    <TextArea
                        name="description"
                        onChange={(e: any) => onDescription(e)}
                        showError={false}
                    />
                    <div className="flex items-center justify-center gap-x-2 w-full mt-4">
                        <Button
                            text="Cancel"
                            variant="secondary"
                            outline
                            fullWidth
                            onClick={onCancel}
                        />
                        <Button
                            text="Submit Rating"
                            variant="primaryNew"
                            fullWidth
                            loading={resultSubmitFeedback.isLoading}
                            disabled={resultSubmitFeedback.isLoading}
                            onClick={onSubmit}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
