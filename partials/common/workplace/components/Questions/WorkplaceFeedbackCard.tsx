import { StarRating, Typography } from '@components'
import classNames from 'classnames'
import { useEffect, useState } from 'react'

enum WorkplaceAnswerEnum {
    Yes = 'Yes',
    No = 'No',
}

const answersData = [WorkplaceAnswerEnum.No, WorkplaceAnswerEnum.Yes]

export const WorkplaceFeedbackCard = ({
    data,
    index,
    title,
    onClick,
    showOnlyAnswer,
}: {
    data: any
    index: number
    title: string
    showOnlyAnswer?: boolean
    onClick?: (value: number) => void
}) => {
    const [answer, setAnswer] = useState<number>(0)

    useEffect(() => {
        if (data?.answer) {
            setAnswer(data?.answer)
        }
    }, [data])

    const numberClasses = classNames({
        'bg-[#BF0000]': answer < 3,
        'bg-[#30AF22]': answer >= 3,
        'bg-muted-dark': !answer,
    })

    return (
        <div className="border border-dashed border-[#A5A3A9] p-2.5 h-auto lg:h-[104px] rounded-[10px] flex flex-col justify-between">
            <div className="flex items-start gap-x-4">
                <div
                    className={`mt-1 min-w-6 min-h-6 w-fit flex justify-center items-center ${numberClasses}  rounded-full`}
                >
                    <Typography variant="small" color="text-white">
                        0{index + 1}
                    </Typography>
                </div>
                <Typography medium>
                    <span className="text-[15px]">{title}</span>
                </Typography>
            </div>

            {/*  */}
            <div className="flex items-center gap-x-6 px-10">
                <StarRating
                    count={5}
                    value={answer}
                    onChange={(e) => {
                        setAnswer(e)
                        if (onClick) {
                            onClick(e)
                        }
                    }}
                    size={19}
                    activeColor={'#ffd700'}
                />
            </div>
        </div>
    )
}
