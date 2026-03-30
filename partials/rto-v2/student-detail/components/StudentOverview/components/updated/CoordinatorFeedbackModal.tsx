import { Badge, LoadingAnimation, NoData, Typography } from '@components'
import {
    WorkplaceQuestionCard,
    workplaceQuestions,
    workplaceQuestionsKeys,
} from '@partials/common/workplace'
import { SubAdminApi } from '@queries'
import moment from 'moment'
import { ReactNode } from 'react'
import { WorkplaceQuestionType } from '@redux/queryTypes'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'

const WorkplaceQuestionUpdatedCard = ({
    data,
    index,
    children,
}: {
    index: number
    data: any
    children?: ReactNode
}) => {
    return (
        <div className="flex flex-col h-full">
            <WorkplaceQuestionCard
                title={data?.question}
                data={data}
                showOnlyAnswer
                index={index}
                height="lg:h-auto lg:min-h-28"
            >
                {children}
            </WorkplaceQuestionCard>
        </div>
    )
}

interface CoordinatorFeedbackModalProps {
    wpId: number
    open: boolean
    onOpenChange: (open: boolean) => void
}

export const CoordinatorFeedbackModal = ({
    wpId,
    open,
    onOpenChange,
}: CoordinatorFeedbackModalProps) => {
    const workplacePlacementAnswers =
        SubAdminApi.Workplace.useStudentPlacementAnswers(wpId, {
            skip: !wpId || !open,
            refetchOnMountOrArgChange: true,
        })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl! p-0 overflow-hidden flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-primaryNew px-6 py-3 text-left shrink-0 relative">
                    <DialogTitle className="text-white text-xl">
                        View Answers
                    </DialogTitle>
                    <Typography variant="small" className="text-white">
                        View Workplace Answers
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

                <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar">
                    {workplacePlacementAnswers.isError ? (
                        <NoData
                            text="There is some technical issue, try refresh the page!"
                            isError
                        />
                    ) : null}
                    {workplacePlacementAnswers.isLoading ? (
                        <LoadingAnimation size={60} height="h-64" />
                    ) : workplacePlacementAnswers?.data?.questions &&
                      workplacePlacementAnswers?.data?.questions?.length > 0 ? (
                        <div className="pb-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                {workplacePlacementAnswers?.data?.questions?.map(
                                    (
                                        data: WorkplaceQuestionType,
                                        i: number
                                    ) => {
                                        if (
                                            data?.question ===
                                            workplaceQuestions[
                                                workplaceQuestionsKeys.suburb
                                            ]
                                        ) {
                                            const suburb = data?.answer
                                                ? JSON.parse(data?.answer)
                                                : {}
                                            return (
                                                <WorkplaceQuestionUpdatedCard
                                                    key={i}
                                                    data={data}
                                                    index={i}
                                                >
                                                    <div className="flex items-center gap-x-1">
                                                        <Typography
                                                            variant={'label'}
                                                        >
                                                            Answer:
                                                        </Typography>
                                                        {Object.entries(
                                                            suburb
                                                        )?.map(
                                                            ([
                                                                key,
                                                                value,
                                                            ]: any) => (
                                                                <div
                                                                    key={key}
                                                                    className="flex items-center gap-x-1"
                                                                >
                                                                    <Typography
                                                                        variant={
                                                                            'small'
                                                                        }
                                                                        capitalize
                                                                    >
                                                                        {key}:
                                                                    </Typography>
                                                                    <Badge
                                                                        text={
                                                                            value
                                                                        }
                                                                        variant={
                                                                            'success'
                                                                        }
                                                                    />
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </WorkplaceQuestionUpdatedCard>
                                            )
                                        }
                                        if (
                                            data?.question ===
                                            workplaceQuestions[
                                                workplaceQuestionsKeys
                                                    .supervisorMeeting
                                            ]
                                        ) {
                                            const supervisorMeeting =
                                                data?.answer
                                                    ? JSON.parse(data?.answer)
                                                    : {}
                                            return (
                                                <WorkplaceQuestionUpdatedCard
                                                    key={i}
                                                    data={data}
                                                    index={i}
                                                >
                                                    <div className="flex items-start gap-x-3">
                                                        <Typography
                                                            variant={'label'}
                                                        >
                                                            Answer:
                                                        </Typography>
                                                        <div className="flex flex-col gap-y-1">
                                                            {Object.entries(
                                                                supervisorMeeting
                                                            )?.map(
                                                                ([
                                                                    key,
                                                                    value,
                                                                ]: any) => (
                                                                    <div
                                                                        key={
                                                                            key
                                                                        }
                                                                        className="flex items-center gap-x-1"
                                                                    >
                                                                        <Typography
                                                                            variant={
                                                                                'small'
                                                                            }
                                                                            capitalize
                                                                        >
                                                                            {
                                                                                key
                                                                            }
                                                                        </Typography>
                                                                        <Badge
                                                                            text={moment(
                                                                                value
                                                                            ).format(
                                                                                'DD MMM YYYY'
                                                                            )}
                                                                            variant={
                                                                                'success'
                                                                            }
                                                                        />
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </WorkplaceQuestionUpdatedCard>
                                            )
                                        }
                                        if (
                                            data?.question ===
                                            workplaceQuestions[
                                                workplaceQuestionsKeys
                                                    .possession
                                            ]
                                        ) {
                                            return (
                                                <WorkplaceQuestionUpdatedCard
                                                    key={i}
                                                    data={data}
                                                    index={i}
                                                >
                                                    <div className="flex items-start gap-x-1.5">
                                                        <Typography
                                                            variant={'label'}
                                                        >
                                                            Answer:
                                                        </Typography>
                                                        <div className="grow flex flex-wrap gap-1">
                                                            {data?.answer
                                                                ?.split(',')
                                                                ?.map(
                                                                    (
                                                                        possession: any,
                                                                        idx: number
                                                                    ) => (
                                                                        <Badge
                                                                            key={
                                                                                idx
                                                                            }
                                                                            text={
                                                                                possession
                                                                            }
                                                                            variant={
                                                                                'success'
                                                                            }
                                                                        />
                                                                    )
                                                                )}
                                                        </div>
                                                    </div>
                                                </WorkplaceQuestionUpdatedCard>
                                            )
                                        }
                                        return (
                                            <WorkplaceQuestionUpdatedCard
                                                key={i}
                                                data={data}
                                                index={i}
                                            />
                                        )
                                    }
                                )}
                            </div>
                        </div>
                    ) : workplacePlacementAnswers.isSuccess ? (
                        <NoData text="There is no Answers Provided availability!" />
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    )
}
