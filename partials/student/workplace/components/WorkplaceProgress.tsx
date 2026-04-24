import { Typography } from '@components'
import React, { Fragment } from 'react'

export const WorkplaceProgress = ({
    activeNumber,
    progressNumber,
}: {
    activeNumber: number
    progressNumber: number
}) => {
    return (
        <div className="flex items-center justify-center gap-x-[18px]">
            {[...Array(progressNumber)].map((_, i) => (
                <Fragment key={i}>
                    <div
                        className={`${
                            activeNumber >= i + 1
                                ? 'bg-[#F7910F]'
                                : 'bg-[#EFF0F6]'
                        } min-w-[34px] min-h-[34px] rounded-full flex items-center justify-center`}
                    >
                        <Typography
                            medium
                            color={
                                activeNumber >= i + 1
                                    ? 'text-white'
                                    : 'text-[#6F6C90]'
                            }
                        >
                            {i + 1}
                        </Typography>
                    </div>
                    {i !== progressNumber - 1 ? (
                        <div className="bg-[#EFF0F6] h-1.5 w-24 rounded-full relative">
                            <div
                                className={`absolute top-0 left-0 ${
                                    activeNumber >= i + 2
                                        ? 'w-full'
                                        : activeNumber >= i + 1
                                          ? 'w-1/2'
                                          : 'w-0'
                                } h-full bg-[#F7910F] rounded-full`}
                            ></div>
                        </div>
                    ) : null}
                </Fragment>
            ))}
        </div>
    )
}
