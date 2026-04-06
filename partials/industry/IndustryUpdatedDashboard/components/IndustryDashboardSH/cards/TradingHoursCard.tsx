import React from 'react'
import { TimingCard } from './TimingCard'
import { Button, Typography } from '@components'
import { useContextBar } from '@hooks'
import { AddShiftsCB } from '../contextBar'
import { TimingBreakCard } from './TimingBreakCard'

export const TradingHoursCard = ({
    workingHoursTime,
    industryAvailableHours,
}: {
    workingHoursTime: any
    industryAvailableHours: any
}) => {
    const contextBar = useContextBar()
    return (
        <div className="bg-[#24556D] p-3.5 rounded-[10px]">
            <div className="flex justify-between items-center">
                <Typography capitalize color={'text-white'}>
                    trading hours
                </Typography>
                <Button
                    text={
                        industryAvailableHours?.data &&
                        industryAvailableHours?.data?.length > 0
                            ? 'Edit Shifts'
                            : 'Add Shifts'
                    }
                    onClick={() => {
                        contextBar.show(false)
                        contextBar.setTitle('Add Shifts')
                        contextBar.setContent(
                            <AddShiftsCB
                                industryAvailableHours={
                                    industryAvailableHours?.data
                                }
                            />
                        )
                    }}
                    disabled={!industryAvailableHours?.isSuccess}
                />
            </div>

            {/*  */}
            <div className="pt-3">
                <div className="bg-[#FFFFFFCC] rounded border border-white grid grid-cols-7">
                    {workingHoursTime?.map((timing: any) => (
                        <div key={timing?.day}>
                            <div className="py-2.5 flex justify-center border-r border-b border-white">
                                <Typography variant="small" capitalize>
                                    {timing?.day?.substring(0, 3)}
                                </Typography>
                            </div>
                            <div className="w-full h-[68px] flex justify-center items-center">
                                <TimingCard timing={timing} />
                            </div>
                            <div className="w-full rounded-b h-[72px] flex justify-center items-center">
                                <TimingBreakCard timing={timing} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
