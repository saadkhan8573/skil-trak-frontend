import { Ban, XCircle, Clock, Sparkles, Check } from 'lucide-react'
import { IndustryStatus } from '../types'
import { Typography, Badge, Permissions } from '@components'
import { useAppSelector } from '@redux/hooks'
import { PermissionType, UserStatus } from '@types'
import { useState } from 'react'
import { PlacementReadyModal } from '../modals'
import moment from 'moment'

interface StatusBannerProps {
    profileCompletion: number
    isProfileComplete: boolean
}

export function StatusBanner({
    profileCompletion,
    isProfileComplete,
}: StatusBannerProps) {
    console.log({ isProfileComplete })
    const [showPlacementReadyModal, setShowPlacementReadyModal] =
        useState(false)
    const industryDetail = useAppSelector(
        (state) => state.industry.industryDetail
    )

    const isBlocked = industryDetail?.user?.status === UserStatus.Blocked
    const isSnoozed = industryDetail?.isSnoozed
    const snoozedStartDate = industryDetail?.snoozedAt
    const snoozedEndDate = industryDetail?.snoozedDate
    const isPlacementReady = industryDetail?.isPlacementReady

    return (
        <div
            className={`relative rounded-t-xl px-4 py-2 overflow-hidden ${
                isBlocked
                    ? 'bg-linear-to-r from-[#EF4444] via-[#DC2626] to-[#EF4444]'
                    : isSnoozed
                      ? 'bg-linear-to-r from-[#F7A619] via-[#EA580C] to-[#F7A619]'
                      : isPlacementReady
                        ? 'bg-linear-to-r from-[#10B981] via-[#059669] to-[#10B981]'
                        : 'bg-linear-to-r from-[#F7A619] via-[#EA580C] to-[#F7A619]'
            } bg-size-[200%_100%] animate-gradient`}
        >
            {/* Animated Shimmer Effect */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-shimmer" />

            <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <div className="w-6 h-6 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center shadow-2xl border border-white/30">
                            {isBlocked ? (
                                <Ban className="w-3 h-3 text-white" />
                            ) : isSnoozed ? (
                                <Clock className="w-3 h-3 text-white" />
                            ) : isPlacementReady ? (
                                <Check
                                    className="w-3 h-3 text-white"
                                    strokeWidth={3}
                                />
                            ) : (
                                <Sparkles className="w-3 h-3 text-white" />
                            )}
                        </div>
                    </div>
                    <div>
                        <Typography variant="title" color={'text-white'} bold>
                            {isBlocked
                                ? '🚫 Industry Blocked'
                                : isSnoozed
                                  ? '💤 Industry Snoozed'
                                  : isPlacementReady
                                    ? '✓ Placement Ready'
                                    : '⚡ Complete Your Profile'}
                        </Typography>
                        <Typography variant="label" color={'text-white/95'}>
                            {isBlocked
                                ? 'This industry is currently blocked and cannot accept placements'
                                : isSnoozed
                                  ? snoozedStartDate && snoozedEndDate
                                      ? `Snoozed from ${moment(
                                            snoozedStartDate
                                        ).format('MMM D')} to ${moment(
                                            snoozedEndDate
                                        ).format('MMM D, YYYY')}`
                                      : 'This industry is temporarily snoozed for placements'
                                  : isPlacementReady
                                    ? 'Your industry profile is optimized and ready for placements'
                                    : `Just ${
                                          100 - profileCompletion
                                      }% more to unlock full placement capabilities`}
                        </Typography>
                    </div>
                </div>

                {/* Circular Progress Ring - Only show when not in special states */}
                {!isBlocked && !isSnoozed && (
                    <div className="flex items-center gap-4">
                        {/* Placement Ready Information or Action Badge */}
                        {industryDetail?.placementReadyBy ? (
                            <div className="flex flex-col items-end leading-tight">
                                <div className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg border border-white/30 shadow-sm">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                    <span className="text-white text-xs font-bold whitespace-nowrap uppercase tracking-tight">
                                        Ready by{' '}
                                        {industryDetail.placementReadyBy.name}
                                    </span>
                                </div>
                                <span className="text-white/90 text-[10px] mt-1 mr-1 font-bold uppercase tracking-wider">
                                    {moment(
                                        industryDetail.placementReadyAt
                                    ).format('MMM D, YYYY')}
                                </span>
                            </div>
                        ) : (
                            isProfileComplete && (
                                <Permissions
                                    permission={
                                        PermissionType.CAN_PERFORM_INDUSTRY_ACTIONS
                                    }
                                >
                                    <Badge
                                        text="Placement Ready"
                                        variant="success"
                                        Icon={Sparkles}
                                        size="sm"
                                        shape="pill"
                                        className="bg-white! text-green-600! shadow-md hover:scale-110 transition-transform cursor-pointer px-4 py-1.5 font-bold"
                                        onClick={() =>
                                            setShowPlacementReadyModal(true)
                                        }
                                    />
                                </Permissions>
                            )
                        )}

                        <div className="relative w-12 h-12">
                            <svg className="w-12 h-12 transform -rotate-90">
                                <circle
                                    cx="24"
                                    cy="24"
                                    r="19"
                                    stroke="white"
                                    strokeOpacity="0.2"
                                    strokeWidth="3"
                                    fill="none"
                                />
                                <circle
                                    cx="24"
                                    cy="24"
                                    r="19"
                                    stroke="white"
                                    strokeWidth="3"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 19}`}
                                    strokeDashoffset={`${
                                        2 *
                                        Math.PI *
                                        19 *
                                        (1 - profileCompletion / 100)
                                    }`}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 drop-shadow-lg"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white font-bold text-[10px]">
                                    {profileCompletion}%
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showPlacementReadyModal && industryDetail && (
                <PlacementReadyModal
                    industryId={industryDetail.id}
                    industryName={industryDetail.businessName || ''}
                    onCancel={() => setShowPlacementReadyModal(false)}
                />
            )}
        </div>
    )
}
