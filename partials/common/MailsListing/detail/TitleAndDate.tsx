import moment from 'moment'
import React, { useState } from 'react'
import { InitialAvatar, Typography } from '@components'

import { MdOutlineArrowDropDown } from 'react-icons/md'
import { HiOutlineReply } from 'react-icons/hi'

export const TitleAndDate = ({ mailDetail }: { mailDetail: any }) => {
    const [showDropdownOptions, setShowDropdownOptions] =
        useState<boolean>(false)

    const shortDetail = [
        {
            text: 'from',
            data: `${mailDetail?.sender?.role === 'admin'
                    ? `Admin`
                    : mailDetail?.sender?.name
                } (${mailDetail?.sender?.email === 'admin.stagging@skiltrak.com'
                    ? 'admin.stagging@skiltrak.com'
                    : mailDetail?.sender?.email === 'admin@skiltrak.com.au'
                        ? 'admin@skiltrak.com.au'
                        : mailDetail?.sender?.email
                })`,
        },
        {
            text: 'to',
            data: `${mailDetail?.receiver?.name} (${mailDetail?.receiver?.email})`,
        },
        {
            text: 'date',
            data: moment(mailDetail?.createdAt).format('MMM DD YYYY hh:mm'),
        },
        {
            text: 'subject',
            data: mailDetail?.subject,
        },
    ]

    return (
        <div className="flex items-center justify-between">
            <div className="my-5 flex items-center gap-x-2">
                {mailDetail?.sender?.name && (
                    <InitialAvatar name={mailDetail?.sender?.name} large />
                )}
                <div>
                    <div className="flex items-center gap-x-2">
                        <Typography medium>
                            <span className="text-label">
                                {mailDetail?.sender?.name}
                            </span>
                        </Typography>
                        {/* <Typography variant="small" color={'text-gray-500'}>
                            {'<'}
                            {mailDetail?.receiver?.email}
                            {'>'}
                        </Typography> */}
                    </div>
                    <div>
                        <div className={'flex items-center gap-x-1'}>
                            <Typography variant="small" color={'text-gray-500'}>
                                to me
                            </Typography>
                            {/* <OutsideClickHandler
                                onOutsideClick={() => {
                                    setShowDropdownOptions(false)
                                }}
                            >
                                <div className={'relative'}>
                                    <MdOutlineArrowDropDown
                                        className={'text-lg cursor-pointer'}
                                        onClick={() => {
                                            setShowDropdownOptions(
                                                !showDropdownOptions
                                            )
                                        }}
                                    />
                                    <div
                                        className={`${
                                            showDropdownOptions
                                                ? 'max-h-44 p-3 shadow-[0px_0px_7px_1px_rgba(0,0,0,0.20)]'
                                                : 'max-h-0'
                                        } overflow-hidden transition-all duration-300 absolute top-full left-2 bg-white w-96 mt-1 rounded`}
                                    >
                                        <div className="w-full flex flex-col">
                                            <div>
                                                {shortDetail?.map((detail) => (
                                                    <div
                                                        className={
                                                            'flex items-center gap-x-1'
                                                        }
                                                    >
                                                        <Typography variant="small">
                                                            {detail?.text} :
                                                        </Typography>
                                                        <Typography
                                                            variant="small"
                                                            medium
                                                        >
                                                            {detail?.data}
                                                        </Typography>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </OutsideClickHandler> */}
                        </div>
                    </div>
                </div>
            </div>

            {/*  */}
            <div className="flex items-center gap-x-6">
                <Typography variant={'small'}>
                    {moment(mailDetail?.createdAt).format('MMM DD YYYY hh:mm')}
                </Typography>
                <HiOutlineReply />
            </div>
        </div>
    )
}
