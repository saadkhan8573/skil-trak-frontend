import React from 'react'
import { MapPin, Lock } from 'lucide-react'
import { ellipsisText } from '@utils'
import { DistanceIndicator } from './DistanceIndicator'
import { Actions } from '../contactHistoryTab/Actions'
import { MdNoAccounts } from 'react-icons/md'
import moment from 'moment'

type FutureIndustryInRadiusListCardProps = {
    item: any
    onSelect: any
    isLocked?: boolean
}

export const FutureIndustryInRadiusListCard = ({
    item,
    onSelect,
    isLocked = false,
}: FutureIndustryInRadiusListCardProps) => {
    return (
        <div className={`flex items-center justify-between w-full `}>
            {/* Left Section */}
            <div
                onClick={() => {
                    // if (isLocked) return
                    onSelect?.({
                        ...item,
                        type: 'futureIndustry',
                    })
                }}
                className={`flex gap-3 cursor-pointer`}
            >
                {/* Placeholder Avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center relative">
                    {/* {isLocked && (
                        <div className="absolute inset-0 bg-gray-900/40 rounded-full flex items-center justify-center">
                            <Lock size={16} className="text-white" />
                        </div>
                    )} */}
                    <span className="text-sm font-bold text-gray-600">
                        {item?.businessName?.[0] ?? 'N'}
                    </span>
                </div>

                {/* Info */}
                <div>
                    <div className="flex items-center gap-x-2">
                        <h3
                            className="font-semibold text-sm text-gray-800"
                            title={item?.businessName}
                        >
                            {ellipsisText(item?.businessName, 15)}
                        </h3>

                        {!item?.signedUp && (
                            <div className="flex items-center gap-x-2 whitespace-nowrap">
                                <MdNoAccounts className="text-blue-700" />
                                <span className="text-xs text-blue-700 font-bold">
                                    Not Signed Up
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="text-sm text-gray-500 flex flex-col">
                        <span
                            title={item?.addressLine1}
                            className="flex items-center gap-1 text-sm cursor-pointer"
                        >
                            <MapPin className="text-red-500" size={14} />{' '}
                            {ellipsisText(item?.address, 20)}
                        </span>

                        <DistanceIndicator
                            distance={item?.distance ?? 0}
                            mode="walking"
                        />
                    </div>
                </div>
            </div>

            {/* Right Section: Contacted Status or Lock */}
            {/* {isLocked ? (
                <div className="flex flex-col items-center justify-center gap-2">
                    <Lock size={24} className="text-gray-400" />
                    <span className="text-xs text-gray-500 font-medium text-center">
                        Complete previous
                        <br />
                        industries to unlock
                    </span>
                </div>
            ) : ( */}
            <div className="flex flex-col gap-y-3 justify-center items-end">
                <Actions
                    alreadyContacted={item?.studentIndustryContact}
                    int={item?.studentIndustryContact?.[0]?.intrested}
                    contactId={item?.studentIndustryContact?.[0]?.id}
                />

                <div className="flex flex-col gap-3 w-fit items-end">
                    {/* Contact Status */}
                    <div className="flex flex-col gap-1 items-end">
                        <span
                            className={`
                    inline-flex justify-center
                    text-[10px] font-semibold
                    px-3 py-1.5 rounded-md
                    ${
                        item?.studentIndustryContact?.length > 0
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                    }
                `}
                        >
                            {item?.studentIndustryContact?.length > 0
                                ? 'Contacted'
                                : 'Not Contacted'}
                        </span>

                        {item?.studentIndustryContact?.length > 0 && (
                            <span className="text-[11px] text-slate-500 text-right">
                                {moment(
                                    item?.studentIndustryContact?.[0]?.updatedAt
                                ).format('DD MMM YYYY, hh:mm A')}
                            </span>
                        )}
                    </div>

                    {/* Email Status */}
                    <div className="flex flex-col gap-1 items-end">
                        <span
                            className={`
                    inline-flex justify-center
                    text-[10px] font-semibold
                    px-3 py-1.5 rounded-md
                    ${
                        item?.user?.emails?.length > 0
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }
                `}
                        >
                            {item?.user?.emails?.length > 0
                                ? 'Email Sent'
                                : 'No Email Sent'}
                        </span>

                        {item?.user?.emails?.length > 0 && (
                            <span className="text-[11px] text-slate-500 text-right">
                                {moment(
                                    item?.user?.emails?.[0]?.updatedAt
                                ).format('DD MMM YYYY, hh:mm A')}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            {/* )} */}
        </div>
    )
}
