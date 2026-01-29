import { ActionButton, StarRating, Typography } from '@components'

export const WorkplaceFeedback = ({
    onViewPlacementStartedAnswers,
    selectedWorkplace,
}: {
    onViewPlacementStartedAnswers: any
    selectedWorkplace: any
}) => {
    return (
        <>
            <ActionButton
                variant={'link'}
                onClick={() => {
                    onViewPlacementStartedAnswers(selectedWorkplace?.id)
                }}
            >
                Coordinators Feedback
            </ActionButton>
            <div className="flex items-center gap-x-1">
                <div className="flex items-center gap-x-2">
                    <StarRating
                        count={5}
                        value={selectedWorkplace?.studentFeedBacks?.[0]?.rating}
                        edit={false}
                    />
                    <Typography variant="label">
                        {selectedWorkplace?.studentFeedBacks?.[0]?.rating}
                    </Typography>
                </div>
            </div>
        </>
    )
}
