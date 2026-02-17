import { TextInput, Typography } from '@components'
import React, { useEffect } from 'react'
import { setKey } from 'react-geocode'
import { useFormContext } from 'react-hook-form'
import { workplaceQuestions } from '../../questionListData'
import { WeekDays } from './WeekDays'

export const DaysQuestions = ({
    ques,
    index,
    textTypeLength,
}: {
    ques: any
    index: number
    textTypeLength: number
}) => {
    const formMethods = useFormContext()

    const date1 = formMethods.watch('supervisorMeetingDate1')
    const date2 = formMethods.watch('supervisorMeetingDate2')

    useEffect(() => {
        setKey(process.env.NEXT_PUBLIC_MAP_KEY as string)
    }, [])

    return (
        <>
            <div
                className={`${ques?.fullWidth ? 'col-span-2' : ''
                    } flex flex-col gap-y-1`}
            >
                <div>
                    <Typography variant="label" semibold block>
                        {ques?.index}. {ques?.title}
                    </Typography>

                    <Typography variant="label" block>
                        {
                            workplaceQuestions[
                            ques?.name as keyof typeof workplaceQuestions
                            ]
                        }
                    </Typography>
                </div>
                {ques?.inputValues?.length > 0 && (
                    <div
                        className={`grid grid-cols-1 ${ques?.inputValues?.length > 1
                                ? 'lg:grid-cols-2'
                                : 'lg:grid-cols-1'
                            } gap-3`}
                    >
                        {ques?.inputValues?.map((inp: any, idx: number) => {
                            const disableDay =
                                inp?.name === 'supervisorMeetingDate1'
                                    ? date2
                                    : inp?.name === 'supervisorMeetingDate2'
                                        ? date1
                                        : ''
                            return (
                                <div key={inp?.name} className="mt-1">
                                    <Typography variant="label" medium>
                                        {inp?.label}
                                    </Typography>
                                    <WeekDays
                                        onClick={(day: string) =>
                                            formMethods.setValue(inp?.name, day)
                                        }
                                        selectedDay={formMethods.watch(
                                            inp?.name
                                        )}
                                        disabledDay={disableDay}
                                    />
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </>
    )
}
