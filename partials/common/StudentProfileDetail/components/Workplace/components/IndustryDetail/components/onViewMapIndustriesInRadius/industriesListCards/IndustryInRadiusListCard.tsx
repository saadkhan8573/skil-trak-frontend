import { Badge } from '@components'
import { useAppSelector } from '@redux'
import { ellipsisText, getLatLng } from '@utils'
import { MapPin } from 'lucide-react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { FaHandshakeSimple, FaHandshakeSimpleSlash } from 'react-icons/fa6'
import { Actions } from '../contactHistoryTab/Actions'
import { DistanceIndicator } from './DistanceIndicator'
import { useRouteInfo } from '@partials/rto-v2/student-detail/components/StudentOverview/hooks/useRouteInfo'

type IndustryInRadiusListCardProps = {
    item: any
    onSelect: (item: any) => void
    branch?: boolean
    isLocked?: boolean
    studentLocation?: string
}

export const IndustryInRadiusListCard = ({
    item,
    studentLocation,
    onSelect,
    branch = false,
}: IndustryInRadiusListCardProps) => {
    const handleCardClick = () => {
        // if (isLocked) return
        const selectedItem = branch ? { ...item, type: 'branch' } : item
        onSelect(selectedItem)
    }

    const isContacted = item?.studentIndustryContact?.length > 0
    const hasEmailSent = item?.user?.emails?.length > 0
    const contactData = item?.studentIndustryContact?.[0]

    const workplace = useAppSelector((state) => state.student.selectedWorkplace)
    const [preferableLatLng, setPreferableLatLng] = useState<{
        lat: number
        lng: number
    } | null>(null)

    useEffect(() => {
        const fetchLatLng = async () => {
            if (workplace?.preferableLocation) {
                try {
                    const coords = await getLatLng(workplace.preferableLocation)
                    setPreferableLatLng(coords)
                } catch (error) {
                    console.error('Error fetching latlng:', error)
                }
            }
        }
        fetchLatLng()
    }, [workplace?.preferableLocation])

    const studentLoc = preferableLatLng
        ? [String(preferableLatLng.lat), String(preferableLatLng.lng)]
        : studentLocation?.split(',')!

    const { travelInfo } = useRouteInfo({
        studentLocation: studentLoc,
        industryLocation:
            item?.activeBranch?.location?.split(',') ||
            item?.location?.split(','),
        modes: ['driving'],
    })

    const drivingInfo = travelInfo.find((info) => info.mode === 'driving')

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
                <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                        {item.user?.avatar ? (
                            <img
                                src={item.user.avatar}
                                alt={item.user.name || 'User'}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="font-semibold text-gray-600">
                                {item?.user?.name?.[0]?.toUpperCase() ??
                                    'N'}{' '}
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
                                <FaHandshakeSimple
                                    className="text-orange-500 shrink-0"
                                    size={14}
                                />
                                <span className="text-xs font-medium text-orange-600">
                                    Partner
                                </span>
                            </>
                        ) : (
                            <>
                                <FaHandshakeSimpleSlash
                                    className="text-green-600 shrink-0"
                                    size={14}
                                />
                                <span className="text-xs font-medium text-green-700">
                                    Non-Partner
                                </span>
                            </>
                        )}
                    </div>

                    {/* Location */}
                    <div
                        className="flex items-start gap-1.5 text-sm text-gray-600 mb-2"
                        title={
                            item?.activeBranch?.address || item?.addressLine1
                        }
                    >
                        <MapPin
                            className="text-red-500 shrink-0 mt-0.5"
                            size={14}
                        />
                        <span className="truncate">
                            {ellipsisText(
                                item?.activeBranch?.address ||
                                    item?.addressLine1,
                                25
                            )}
                        </span>
                    </div>

                    {/* Distance */}
                    <div className="mb-2">
                        <DistanceIndicator
                            distance={item?.distance ?? 0}
                            mode="car"
                            exactDistance={drivingInfo?.distance}
                            duration={drivingInfo?.duration}
                        />
                    </div>

                    {/* Placement Status */}
                    <div>
                        {item?.isPlacementReady ? (
                            <Badge
                                variant="primaryNew"
                                text="Placement Ready"
                                Icon={FaCheck}
                                className="whitespace-nowrap!"
                            />
                        ) : (
                            <Badge
                                variant="error"
                                text="Placement Not Ready"
                                Icon={FaTimes}
                                className="whitespace-nowrap!"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="shrink-0 ml-4">
                {/* {isLocked ? (
                    <div className="flex flex-col items-center justify-center gap-2 w-32 text-center">
                        <Lock size={28} className="text-gray-400" />
                        <span className="text-xs text-gray-500 font-medium leading-tight">
                            Complete previous industries to unlock
                        </span>
                    </div>
                ) : ( */}
                <div className="flex flex-col gap-3 items-end min-w-35">
                    {/* Actions */}
                    <Actions
                        alreadyContacted={item?.studentIndustryContact}
                        int={contactData?.intrested}
                        contactId={contactData?.id}
                    />

                    {/* Status Badges */}
                    <div className="flex flex-col gap-3 w-full">
                        {/* Contact Status */}
                        <div className="flex flex-col gap-1">
                            <span
                                className={`
                                    inline-flex justify-center
                                    text-[10px] font-semibold
                                    px-3 py-1.5 rounded-md
                                    ${
                                        isContacted
                                            ? 'bg-green-50 text-green-700 border border-green-200'
                                            : 'bg-red-50 text-red-700 border border-red-200'
                                    }
                                `}
                            >
                                {isContacted ? 'Contacted' : 'Not Contacted'}
                            </span>

                            <span className="text-[11px] text-slate-500 text-center">
                                {item?.studentIndustryContact?.length > 0
                                    ? moment(
                                          item?.studentIndustryContact?.[0]
                                              ?.updatedAt
                                      ).format('DD MMM YYYY, hh:mm A')
                                    : null}
                            </span>
                        </div>

                        {/* Email Status */}
                        <div className="flex flex-col gap-1">
                            <span
                                className={`
                                    inline-flex justify-center
                                    text-[10px] font-semibold
                                    px-3 py-1.5 rounded-md
                                    ${
                                        hasEmailSent
                                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                                    }
                                `}
                            >
                                {hasEmailSent ? 'Email Sent' : 'No Email Sent'}
                            </span>

                            <span className="text-[11px] text-slate-500 text-center">
                                {item?.user?.emails?.length > 0
                                    ? moment(
                                          item?.user?.emails?.[0]?.updatedAt
                                      ).format('DD MMM YYYY, hh:mm A')
                                    : null}
                            </span>
                        </div>
                    </div>
                </div>
                {/* )} */}
            </div>
        </div>
    )
}
