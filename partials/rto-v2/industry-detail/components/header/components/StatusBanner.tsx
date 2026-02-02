import { Ban, XCircle, Clock, Sparkles } from 'lucide-react'
import { IndustryStatus } from '../types'
import { Typography } from '@components'
import { useAppSelector } from '@redux/hooks'
import { UserStatus } from '@types'

interface StatusBannerProps {
    profileCompletion: number
    isPlacementReady: boolean
}

export function StatusBanner({
    profileCompletion,
    isPlacementReady,
}: StatusBannerProps) {
    const industryDetail = useAppSelector(
        (state) => state.industry.industryDetail
    )

    const isBlocked = industryDetail?.user?.status === UserStatus.Blocked
    const isSnoozed = industryDetail?.isSnoozed
    const snoozedStartDate = industryDetail?.snoozedAt
    const snoozedEndDate = industryDetail?.snoozedDate

    return (
        <div
            className={`relative rounded-t-xl px-4 py-2 overflow-hidden ${isBlocked
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
                                <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
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
                                        ? `Snoozed from ${new Date(
                                            snoozedStartDate
                                        ).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                        })} to ${new Date(
                                            snoozedEndDate
                                        ).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}`
                                        : 'This industry is temporarily snoozed for placements'
                                    : isPlacementReady
                                        ? 'Your industry profile is optimized and ready for placements'
                                        : `Just ${100 - profileCompletion
                                        }% more to unlock full placement capabilities`}
                        </Typography>
                    </div>
                </div>

                {/* Circular Progress Ring - Only show when not in special states */}
                {!isBlocked && !isSnoozed && (
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
                                strokeDashoffset={`${2 *
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
                )}
            </div>
        </div>
    )
}
