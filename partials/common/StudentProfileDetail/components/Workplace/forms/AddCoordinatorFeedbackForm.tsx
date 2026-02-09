import React, { useState } from 'react'
import { feedbackQuestions } from '../modals'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { WorkplaceQuestionType } from 'redux/queryTypes'
import {
    WorkplaceFeedbackCard,
    WorkplaceQuestionCard,
} from '@partials/common/workplace'
import { InputErrorMessage } from '@components/inputs/components'
import { Button } from '@components'
import * as yup from 'yup'

export const AddCoordinatorFeedbackForm = ({
    result,
    onSubmit,
    isStartPlacement,
}: {
    result: any
    isStartPlacement: boolean
    onSubmit: (values: any) => void
}) => {
    const [questionsData, setQuestionsData] = useState<any>(
        Object.entries(feedbackQuestions).map(([key, value]: any) => ({
            question: value,
            answer: '',
            type: key,
        }))
    )

    const validationObject = () => {
        let data: any = {}
        Object.keys(feedbackQuestions).forEach((key) => {
            data[key] = yup.string().nullable().required('Required!')
        })
        return data
    }

    const validationSchema = yup.object({
        ...validationObject(),
    })

    const formMethods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
    })

    const onUpdateAnswers = (type: string, answer: string | number) => {
        formMethods.setValue(type, answer)
        formMethods.setError(type, {
            type: type,
            message: undefined,
        })
        setQuestionsData((preVal: any) => [
            ...preVal?.map((val: any) =>
                val?.type === type ? { ...val, answer } : val
            ),
        ])
    }
    return (
        <div>
            {' '}
            <FormProvider {...formMethods}>
                <form onSubmit={formMethods.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 mt-4 h-[50vh] overflow-auto custom-scrollbar">
                        {questionsData?.map(
                            (data: WorkplaceQuestionType, i: number) => (
                                <div>
                                    {data?.type === 'feedback' ? (
                                        <WorkplaceFeedbackCard
                                            index={7}
                                            data={data}
                                            title={
                                                'How would you rate the student out of 5 stars?'
                                            }
                                            onClick={(text) => {
                                                onUpdateAnswers(
                                                    data?.type,
                                                    text
                                                )
                                            }}
                                        />
                                    ) : (
                                        <WorkplaceQuestionCard
                                            title={data?.question}
                                            index={i}
                                            data={data}
                                            onClick={(text) => {
                                                onUpdateAnswers(
                                                    data?.type,
                                                    text
                                                )
                                            }}
                                        />
                                    )}
                                    <InputErrorMessage name={data?.type} />
                                </div>
                            )
                        )}
                    </div>

                    <div className="mt-7 flex items-center justify-center">
                        <Button
                            text={
                                isStartPlacement
                                    ? 'Start Placement'
                                    : 'Add Feedback'
                            }
                            variant={'primary'}
                            submit
                            loading={result.isLoading}
                            disabled={result.isLoading}
                        />
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}
