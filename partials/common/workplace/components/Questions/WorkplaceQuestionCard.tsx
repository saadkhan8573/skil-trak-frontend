import { Badge, Typography } from '@components'
import { RequiredStar } from '@components/inputs/components'
import classNames from 'classnames'
import { ReactNode, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { FaCircleCheck } from 'react-icons/fa6'

export enum WorkplaceAnswerEnum {
    Yes = 'Yes',
    No = 'No',
}

const answersData = [WorkplaceAnswerEnum.No, WorkplaceAnswerEnum.Yes]

export const WorkplaceQuestionCard = ({
    data,
    name,
    index,
    title,
    height,
    onClick,
    children,
    required,
    onlyAccept,
    customAnswers,
    showOnlyAnswer,
    multipleSelection,
}: {
    data: any
    index: number
    title: string
    name?: string
    height?: string
    required?: boolean
    children?: ReactNode
    onlyAccept?: boolean
    customAnswers?: string[]
    showOnlyAnswer?: boolean
    multipleSelection?: boolean
    onClick?: (value: string) => void
}) => {
    const [answer, setAnswer] = useState<any>(null)

    const formContext = useFormContext()

    const error =
        formContext &&
        formContext.getFieldState(String(name)).error !== undefined

    useEffect(() => {
        if (data?.answer) {
            if (multipleSelection) {
                setAnswer(Array.isArray(data.answer) ? data.answer : data.answer.split(','))
            } else {
                setAnswer(data.answer)
            }
        }
    }, [data])

    const isYesActive =
        answer === WorkplaceAnswerEnum.Yes ||
        (answer &&
            answer !== WorkplaceAnswerEnum.No &&
            !multipleSelection &&
            !customAnswers)

    const numberClasses = classNames({
        'bg-[#BF0000]': WorkplaceAnswerEnum.No === answer,
        'bg-[#30AF22]': isYesActive,
        'bg-muted-dark':
            !answer ||
            (answer !== WorkplaceAnswerEnum.No && !isYesActive),
    })

    const answerIconClasses = (text: string, type?: string) => {
        const isActive =
            multipleSelection && Array.isArray(answer)
                ? answer.includes(text)
                : customAnswers
                ? text === answer
                : (text === WorkplaceAnswerEnum.Yes && isYesActive) ||
                  (text === WorkplaceAnswerEnum.No &&
                      answer === WorkplaceAnswerEnum.No)

        return classNames({
            'text-[#BF0000]': text === WorkplaceAnswerEnum.No && isActive,
            'text-[#30AF22]': text !== WorkplaceAnswerEnum.No && isActive,
            'text-secondary-dark': !isActive,
        })
    }

    const selectAnswers = customAnswers
        ? customAnswers
        : onlyAccept
        ? [WorkplaceAnswerEnum.Yes]
        : answersData

    return (
        <div>
            <div
                className={`grow  border-dashed ${
                    error ? 'border-2 border-error' : 'border border-[#A5A3A9]'
                }  p-2.5 h-auto ${
                    height ? height : 'lg:h-[104px]'
                }  rounded-[10px] flex flex-col justify-between`}
            >
                <div className="flex items-start gap-x-4">
                    <div
                        className={`mt-1 min-w-6 min-h-6 w-fit flex justify-center items-center ${numberClasses}  rounded-full`}
                    >
                        <Typography variant="small" color="text-white">
                            {index < 9 ? 0 : null}
                            {index + 1}
                        </Typography>
                    </div>
                    <Typography medium variant="label">
                        {title}
                    </Typography>
                    {required && <RequiredStar />}
                </div>

                {/*  */}
                <div className="flex items-center flex-wrap gap-x-6 gap-y-2.5 px-10">
                    {children ? (
                        children
                    ) : showOnlyAnswer ? (
                        <div className="flex items-center gap-x-1">
                            <Typography variant={'label'}>Answer:</Typography>
                            <Badge
                                text={data?.answer}
                                variant={
                                    data?.answer === WorkplaceAnswerEnum.No
                                        ? 'error'
                                        : 'success'
                                }
                            />
                        </div>
                    ) : (
                        selectAnswers?.map((text: string) => (
                            <div
                                key={text}
                                className="flex items-center gap-x-2.5 cursor-pointer"
                                onClick={() => {
                                    const ans = multipleSelection
                                        ? answer?.includes(text)
                                            ? answer?.filter(
                                                  (a: any) => a !== text
                                              )
                                            : answer && answer?.length > 0
                                            ? [...answer, text]
                                            : [text]
                                        : null
                                    setAnswer(multipleSelection ? ans : text)
                                    if (onClick) {
                                        onClick(multipleSelection ? ans : text)
                                    }
                                }}
                            >
                                <FaCircleCheck
                                    size={19}
                                    className={
                                        multipleSelection
                                            ? answer?.includes(text)
                                                ? 'text-[#30AF22]'
                                                : answerIconClasses(text)
                                            : answerIconClasses(text)
                                    }
                                />
                                <Typography variant="label">
                                    <span className="whitespace-pre">
                                        {text}
                                    </span>
                                </Typography>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
