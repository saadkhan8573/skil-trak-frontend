import { Checkbox, ShowErrorNotifications, Typography } from '@components'
import { Result } from '@constants'
import { useMaulallyReopenSubmissionRequestMutation } from '@redux'
import React from 'react'

export const ManualAssessmentSubmission = ({
    result,
    totalResultsCount,
}: {
    result: any
    totalResultsCount: number
}) => {
    const [manullyReopenSubmission, manuallyReopenSubmissionResult] =
        useMaulallyReopenSubmissionRequestMutation()

    const onManuallyReopen = (event: any) => {
        manullyReopenSubmission(result?.id)
    }
    return (
        <div>
            <ShowErrorNotifications result={manuallyReopenSubmissionResult} />
            {totalResultsCount >= 3 &&
                result?.result !== Result.Pending &&
                !result?.isManualSubmission && (
                    <div className="mt-5 flex flex-col gap-y-1">
                        <Typography variant={'small'}>
                            Student Has Submitted 3 times, now you can manually
                            reopen the submit request on request on Student
                        </Typography>
                        <Checkbox
                            label={'Manual Re Open'}
                            name={'manualReOpen'}
                            loading={manuallyReopenSubmissionResult?.isLoading}
                            onChange={(e: any) => {
                                onManuallyReopen(e)
                                // setManualReOpen(e.target.checked)
                            }}
                        />
                    </div>
                )}
        </div>
    )
}
