import React from 'react'
import { MapPin, Lock } from 'lucide-react'
import { ellipsisText } from '@utils'
import { DistanceIndicator } from './DistanceIndicator'
import { Actions } from '../contactHistoryTab/Actions'
import { MdNoAccounts } from 'react-icons/md'

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
                <div className="flex flex-col gap-y-2 justify-center items-end">
                    <Actions
                        alreadyContacted={item?.studentIndustryContact}
                        int={item?.studentIndustryContact?.[0]?.intrested}
                        contactId={item?.studentIndustryContact?.[0]?.id}
                    />
                    <div className="flex items-center gap-x-2">
                        {item?.studentIndustryContact?.length > 0 ? (
                            <span className="text-[9px] font-medium bg-green-100 text-green-500 px-3 py-1 rounded-lg">
                                Contacted
                            </span>
                        ) : (
                            <span className="text-[9px] font-medium bg-red-100 text-red-500 px-3 py-1 rounded-lg">
                                Not Contacted
                            </span>
                        )}
                        {item?.user?.emails?.length ? (
                            <span className="text-[9px] font-medium bg-indigo-100 text-indigo-500 px-3 py-1 rounded-lg">
                                Email Sent
                            </span>
                        ) : (
                            <span className="text-[9px] font-medium bg-rose-100 text-rose-700 px-3 py-1 rounded-lg">
                                No Email Sent
                            </span>
                        )}
                    </div>
                </div>
            {/* )} */}
        </div>
    )
}
