import React from 'react'
import { DistanceIndicator } from './DistanceIndicator'
import { MapPin, Lock } from 'lucide-react'
import { ellipsisText } from '@utils'
import { Actions } from '../contactHistoryTab/Actions'
import { FaHandshakeSimple, FaHandshakeSimpleSlash } from 'react-icons/fa6'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { Badge } from '@components'

type IndustryInRadiusListCardProps = {
    item: any
    onSelect: (item: any) => void
    branch?: boolean
    isLocked?: boolean
}

export const IndustryInRadiusListCard = ({
    item,
    onSelect,
    branch = false,
    isLocked = false,
}: IndustryInRadiusListCardProps) => {
    const handleCardClick = () => {
        // if (isLocked) return
        const selectedItem = branch ? { ...item, type: 'branch' } : item
        onSelect(selectedItem)
    }

    const isContacted = item?.studentIndustryContact?.length > 0
    const hasEmailSent = item?.user?.emails?.length > 0
    const contactData = item?.studentIndustryContact?.[0]

    return (
        <div
            className={`
                flex items-center justify-between 
                bg-white border border-gray-200 rounded-xl shadow-sm 
                p-4 w-full transition-all hover:shadow-md
                hover:border-gray-300
            `}
        >
            {/* Left Section */}
            <div
                onClick={handleCardClick}
                className={`flex gap-4 flex-1 cursor-pointer`}
            >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                        {item.user?.avatar ? (
                            <img
                                src={item.user.avatar}
                                alt={item.user.name || 'User'}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="font-semibold text-gray-600">
                                {item?.user?.name?.[0]?.toUpperCase() ?? 'N'}
                            </span>
                        )}
                    </div>
                    {/* {isLocked && (
                        <div className="absolute inset-0 bg-gray-900/50 rounded-full flex items-center justify-center">
                            <Lock size={18} className="text-white" />
                        </div>
                    )} */}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-1">
                        <h3
                            className="font-semibold text-gray-900 truncate"
                            title={item?.user?.name}
                        >
                            {branch
                                ? `${ellipsisText(item?.user?.name, 20)} (Branch)`
                                : ellipsisText(item?.user?.name, 20)}
                        </h3>
                    </div>

                    {/* Partner Status */}
                    <div className="flex items-center gap-2 mb-2">
                        {item?.isPartner ? (
                            <>
                                <FaHandshakeSimple className="text-orange-500 flex-shrink-0" size={14} />
                                <span className="text-xs font-medium text-orange-600">Partner</span>
                            </>
                        ) : (
                            <>
                                <FaHandshakeSimpleSlash className="text-green-600 flex-shrink-0" size={14} />
                                <span className="text-xs font-medium text-green-700">Non-Partner</span>
                            </>
                        )}
                    </div>

                    {/* Location */}
                    <div
                        className="flex items-start gap-1.5 text-sm text-gray-600 mb-2"
                        title={item?.addressLine1}
                    >
                        <MapPin className="text-red-500 flex-shrink-0 mt-0.5" size={14} />
                        <span className="truncate">{ellipsisText(item?.addressLine1, 25)}</span>
                    </div>

                    {/* Distance */}
                    {/* <div className="mb-2">
                        <DistanceIndicator distance={item?.distance ?? 0} mode="car" />
                    </div> */}

                    {/* Placement Status */}
                    <div>
                        {item?.isPlacementReady ? (
                            <Badge
                                variant="primaryNew"
                                text="Placement Ready"
                                Icon={FaCheck}
                                className="!whitespace-nowrap"
                            />
                        ) : (
                            <Badge
                                variant="error"
                                text="Placement Not Ready"
                                Icon={FaTimes}
                                className="!whitespace-nowrap"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex-shrink-0 ml-4">
                {/* {isLocked ? (
                    <div className="flex flex-col items-center justify-center gap-2 w-32 text-center">
                        <Lock size={28} className="text-gray-400" />
                        <span className="text-xs text-gray-500 font-medium leading-tight">
                            Complete previous industries to unlock
                        </span>
                    </div>
                ) : ( */}
                    <div className="flex flex-col gap-3 items-end min-w-[140px]">
                        {/* Actions */}
                        <Actions
                            alreadyContacted={item?.studentIndustryContact}
                            int={contactData?.intrested}
                            contactId={contactData?.id}
                        />

                        {/* Status Badges */}
                        <div className="flex flex-col gap-1.5 w-full">
                            <span
                                className={`
                                    text-[10px] font-semibold text-center
                                    px-3 py-1.5 rounded-md
                                    ${isContacted 
                                        ? 'bg-green-50 text-green-700 border border-green-200' 
                                        : 'bg-red-50 text-red-700 border border-red-200'
                                    }
                                `}
                            >
                                {isContacted ? 'Contacted' : 'Not Contacted'}
                            </span>
                            <span
                                className={`
                                    text-[10px] font-semibold text-center
                                    px-3 py-1.5 rounded-md
                                    ${hasEmailSent 
                                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                                    }
                                `}
                            >
                                {hasEmailSent ? 'Email Sent' : 'No Email Sent'}
                            </span>
                        </div>
                    </div>
                {/* )} */}
            </div>
        </div>
    )
}