import { Timeline, Typography, UserCreatedAt } from '@components'
import moment from 'moment'
import React from 'react'
import { ImPhone, ImPhoneHangUp } from 'react-icons/im'

export const HistoryCard = ({
    history,
    call,
}: {
    history: any
    call?: boolean
}) => {
    const today = moment()
    const startDate = today.startOf('week').format('MM-DD-YYYY')
    const endDate = today.endOf('week').format('MM-DD-YYYY')
    const createdAt = moment(history?.createdAt, 'YYYY-MM-DD')

    const isDateExist = createdAt.isBetween(startDate, endDate, 'day')
    return (
        <Timeline key={history?.id} updatedAt={history?.updatedAt}>
            <div className="grid grid-cols-3 items-center bg-white rounded-md px-3 py-1 w-full">
                <div className="text-base text-normal text-typography">
                    <span className="text-[11px] block">Task</span>
                    <div className="flex items-center gap-x-2">
                        {history?.title}

                        {call &&
                            isDateExist &&
                            (history.isAnswered ? (
                                <div className="rounded-full bg-success p-0.5">
                                    <ImPhone
                                        title={'Call Made and Answered'}
                                        className="text-white text-[10px]"
                                    />
                                </div>
                            ) : history.isAnswered === false ? (
                                <div className="rounded-full bg-red-700 p-0.5">
                                    <ImPhoneHangUp
                                        title={'Call Made and Not Answered'}
                                        className="text-white text-[10px]"
                                    />
                                </div>
                            ) : null)}
                    </div>
                </div>
                <Typography>
                    <span className="text-[11px] block">Description</span>
                    {history?.description}
                </Typography>
                <div className="ml-auto">
                    <span className="text-[11px] block">Date</span>
                    <UserCreatedAt createdAt={history?.createdAt} />
                </div>
            </div>
        </Timeline>
    )
}
