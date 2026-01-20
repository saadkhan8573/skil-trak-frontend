import { Badge, LoadingAnimation, Modal, NoData, Typography } from '@components'
import {
    WorkplaceAnswerEnum,
    WorkplaceQuestionCard,
    workplaceQuestions,
    workplaceQuestionsKeys,
} from '@partials/common/workplace'
import { SubAdminApi } from '@queries'
import moment from 'moment'
import React, { ReactNode } from 'react'
import { WorkplaceQuestionType } from 'redux/queryTypes'

export const ViewQuestionsModal = ({
    wpId,
    onCancel,
}: {
    wpId: number
    onCancel: () => void
}) => {
    const workplaceAnswers = SubAdminApi.Workplace.useStudentWorkplaceAnswers(
        wpId,
        {
            skip: !wpId,
        }
    )

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
    return (
        <Modal
            title="View Answers"
            subtitle="View Workplace Answers"
            showActions={false}
            onCancelClick={onCancel}
        >
            {workplaceAnswers.isError ? (
                <NoData
                    text="There is some technical issue, try refresh the page!"
                    isError
                />
            ) : null}
            {workplaceAnswers.isLoading ? (
                <LoadingAnimation size={60} height="h-full" />
            ) : workplaceAnswers?.data && workplaceAnswers?.data?.length > 0 ? (
                <div className="max-w-5xl max-h-[70vh] custom-scrollbar overflow-auto pb-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        {workplaceAnswers?.data?.map(
                            (data: WorkplaceQuestionType, i: number) => {
                                if (
                                    data?.question ===
                                    workplaceQuestions[
                                        workplaceQuestionsKeys.suburb
                                    ]
                                ) {
                                    const suburb = JSON.parse(data?.answer)
                                    return (
                                        <WorkplaceQuestionUpdatedCard
                                            data={data}
                                            index={i}
                                        >
                                            <div className="flex items-center gap-x-1">
                                                <Typography variant={'label'}>
                                                    Answer:
                                                </Typography>
                                                {Object.entries(suburb)?.map(
                                                    ([key, value]: any) => (
                                                        <div className="flex items-center gap-x-1">
                                                            <Typography
                                                                variant={
                                                                    'small'
                                                                }
                                                                capitalize
                                                            >
                                                                {key}:
                                                            </Typography>
                                                            <Badge
                                                                text={value}
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
                                        workplaceQuestionsKeys.supervisorMeeting
                                    ]
                                ) {
                                    const supervisorMeeting = JSON.parse(
                                        data?.answer
                                    )
                                    const meeting = {
                                        supervisorMeetingDate1:
                                            'Supervisor Meeting Date 1',
                                        supervisorMeetingDate2:
                                            'Supervisor Meeting Date 2',
                                    }

                                    return (
                                        <WorkplaceQuestionUpdatedCard
                                            data={data}
                                            index={i}
                                        >
                                            <div className="flex items-start gap-x-3">
                                                <Typography variant={'label'}>
                                                    Answer:
                                                </Typography>
                                                <div className="flex flex-col gap-y-1">
                                                    {Object.entries(
                                                        supervisorMeeting
                                                    )?.map(
                                                        ([key, value]: any) => (
                                                            <div className="flex items-center gap-x-1">
                                                                <Typography
                                                                    variant={
                                                                        'small'
                                                                    }
                                                                    capitalize
                                                                >
                                                                    {
                                                                        meeting[
                                                                            key as keyof typeof meeting
                                                                        ]
                                                                    }
                                                                </Typography>

                                                                <Badge
                                                                    text={value}
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
                                        workplaceQuestionsKeys.possession
                                    ]
                                ) {
                                    return (
                                        <WorkplaceQuestionUpdatedCard
                                            data={data}
                                            index={i}
                                        >
                                            <div className="flex items-start gap-x-1.5">
                                                <Typography variant={'label'}>
                                                    Answer:
                                                </Typography>
                                                <div className="flex-grow flex flex-wrap gap-1">
                                                    {data?.answer
                                                        ?.split(',')
                                                        ?.map(
                                                            (
                                                                possession: any
                                                            ) => (
                                                                <Badge
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
                                        data={data}
                                        index={i}
                                    />
                                )
                            }
                        )}
                    </div>
                </div>
            ) : workplaceAnswers.isSuccess ? (
                <NoData text="There is no Answers Provided availability!" />
            ) : null}
        </Modal>
    )
}
