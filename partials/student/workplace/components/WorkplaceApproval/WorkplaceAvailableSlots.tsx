import { Typography } from '@components'
import moment from 'moment'
import React from 'react'

export const initialSchedule = [
    {
        day: 'monday',
        openingTime: '09:00',
        closingTime: '17:00',
        break: false,
        breakStart: null,
        breakEnd: null,
        dayOn: false,
    },
    {
        day: 'tuesday',
        openingTime: '09:00',
        closingTime: '17:00',
        break: false,
        breakStart: null,
        breakEnd: null,
        dayOn: false,
    },
    {
        day: 'wednesday',
        openingTime: '09:00',
        closingTime: '17:00',
        break: false,
        breakStart: null,
        breakEnd: null,
        dayOn: false,
    },
    {
        day: 'thursday',
        openingTime: '09:00',
        closingTime: '17:00',
        break: false,
        breakStart: null,
        breakEnd: null,
        dayOn: false,
    },
    {
        day: 'friday',
        openingTime: '09:00',
        closingTime: '17:00',
        break: false,
        breakStart: null,
        breakEnd: null,
        dayOn: false,
    },
    {
        day: 'saturday',
        openingTime: '09:00',
        closingTime: '17:00',
        break: false,
        breakStart: null,
        breakEnd: null,
        dayOn: false,
    },
    {
        day: 'sunday',
        openingTime: '09:00',
        closingTime: '17:00',
        break: false,
        breakStart: null,
        breakEnd: null,
        dayOn: false,
    },
]

export const WorkplaceAvailableSlots = ({
    workingHours,
}: {
    workingHours: any
}) => {
    const mergeScheduleData = initialSchedule.map((schedule) => {
        const updated = workingHours?.find(
            (upd: any) => upd?.day === schedule?.day
        )
        return updated ? updated : schedule
    })

    return (
        <div className=" flex flex-col h-full">
            <Typography variant="label" medium>
                Trading Hours
            </Typography>
            <div className="border border-[#D5D5D5] rounded-[10px] px-2.5 py-2 flex flex-col gap-y-1.5 grow">
                <div className="bg-[#F7910F26] rounded-[5px] py-[5px] grid grid-cols-7">
                    {['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'].map(
                        (day) => (
                            <h5
                                key={day}
                                className="text-center text-sm text-[#24556D]"
                            >
                                {day}
                            </h5>
                        )
                    )}
                </div>
                <div className="py-[5px] grid grid-cols-7 gap-x-2 grow">
                    {mergeScheduleData?.map((data, index) =>
                        data?.dayOn ? (
                            <div
                                key={index}
                                className="bg-[#F7910F26] rounded-md py-2.5 w-full flex flex-col gap-y-0.5 items-center"
                            >
                                <p className="text-xs text-[#24556D]">
                                    {moment(data?.openingTime, 'hh:mm').format(
                                        'hha'
                                    )}
                                </p>
                                <p className="text-xs text-[#24556D]">-</p>
                                <p className="text-xs text-[#24556D]">
                                    {moment(data?.closingTime, 'hh:mm').format(
                                        'hha'
                                    )}
                                </p>
                            </div>
                        ) : (
                            <div
                                key={index}
                                className="bg-[#BF000026] rounded-md py-2.5 w-full flex flex-col gap-y-0.5 justify-center items-center"
                            >
                                <p className="text-xs text-[#24556D]">
                                    Off Day
                                </p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}
