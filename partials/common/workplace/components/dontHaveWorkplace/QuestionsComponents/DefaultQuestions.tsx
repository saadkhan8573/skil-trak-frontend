import { TextInput, Typography } from '@components'
import { RequiredStar } from '@components/inputs/components'
import React from 'react'
import { WorkplaceQuestionCard } from '../../Questions'
import { useFormContext } from 'react-hook-form'
import { workplaceQuestionsKeys } from '@partials/common/workplace/enum'
import { workplaceQuestions } from '../questionListData'

export const DefaultQuestions = ({
    ques,
    value,
    personalInfoData,
}: {
    ques: any
    value: any
    personalInfoData: any
}) => {
    const formMethods = useFormContext()

    const updateQuestionData = (type: workplaceQuestionsKeys) =>
        personalInfoData?.questions?.find((q: any) => q?.type === type)

    return (
        <div
            className={`${ques?.fullWidth ? 'col-span-2' : ''
                } flex flex-col gap-y-2`}
        >
            <div className="flex gap-x-1">
                <Typography variant="label" semibold block>
                    {ques?.index}. {ques?.title}
                </Typography>
                {ques?.required ? <RequiredStar /> : null}
            </div>
            <div>
                <WorkplaceQuestionCard
                    customAnswers={ques?.customAnswers}
                    multipleSelection={ques?.multipleSelection}
                    height="lg:h-28"
                    title={
                        workplaceQuestions[
                        ques?.name as keyof typeof workplaceQuestions
                        ]
                    }
                    onClick={(answer: string) => {
                        formMethods.setValue(ques?.name, answer)
                    }}
                    onlyAccept={ques?.onlyAccept}
                    index={ques?.index - 1}
                    data={updateQuestionData(ques?.name)}
                    name={ques?.name}
                />
            </div>

            {(ques?.name === workplaceQuestionsKeys.currentEmploymentStatus ||
                ques?.name === workplaceQuestionsKeys.medicalCondition) &&
                value !== 'No' ? (
                <TextInput
                    label={'Provide Details'}
                    name={ques?.name}
                    placeholder={'Provide details.'}
                />
            ) : null}
        </div>
    )
}
