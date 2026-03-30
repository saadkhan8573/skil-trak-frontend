import { RtoV2Api, CommonApi, setNavigationTarget } from '@redux'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { AnalyticsCard, AnalyticsHeader } from './components'
import { Calendar, Clock, Layers, Star, Users } from 'lucide-react'
import { AnalyticsSkeleton } from '../../skeletonLoader'
import { CoursesQuickView } from '../CoursesQuickView'

import { MasonryGrid } from '@components'

export function AnalyticsDashboard() {
    const { industryDetail: industry } = useAppSelector(
        (state) => state.industry
    )

    const { data: counts, isLoading: isCountsLoading } =
        RtoV2Api.Industries.getRtoIndustryDataCount(industry?.id || 0, {
            skip: !industry?.id,
        })

    const overAllRating =
        CommonApi.Feedback.useOverAllIndustryRatingsFromStudent(
            { id: industry?.id || 0 },
            {
                skip: !industry?.id,
            }
        )

    if (isCountsLoading || overAllRating?.isLoading) {
        return <AnalyticsSkeleton />
    }

    const analyticsCards = [
        {
            title: 'Students',
            value: counts?.totalStudents || 0,
            icon: Users,
            gradient: 'from-[#044866] to-[#0D5468]',
            trend: 'up',
            percentage: 0,
            color: '#044866',
            targetTab: 'students',
        },
        {
            title: 'Pending',
            value: counts?.pending || 0,
            icon: Clock,
            gradient: 'from-[#F7A619] to-[#EA580C]',
            trend: 'neutral',
            color: '#F7A619',
            targetTab: 'students',
        },
        {
            title: 'Interviews',
            value: counts?.interview || 0,
            icon: Calendar,
            gradient: 'from-[#8B5CF6] to-[#7C3AED]',
            trend: 'neutral',
            color: '#8B5CF6',
            targetTab: 'students',
        },
        {
            title: 'Capacity',
            value: `${counts?.totalEnrolledStudents || 0}/${
                counts?.totalSectorCapacity || 0
            }`,
            icon: Layers,
            gradient: 'from-[#0D5468] to-[#044866]',
            trend: 'neutral',
            showBar: true,
            percentage: counts?.totalSectorCapacity
                ? Math.round(
                      (counts.totalEnrolledStudents /
                          counts.totalSectorCapacity) *
                          100
                  )
                : 0,
            color: '#0D5468',
            targetTab: 'courses',
        },
        // {
        //     title: 'Response Time',
        //     value: '2.4hrs',
        //     change: '-0.8hrs',
        //     changeText: 'improvement',
        //     icon: Timer,
        //     gradient: 'from-[#14B8A6] to-[#0D9488]',
        //     trend: 'up',
        //     percentage: 25,
        //     color: '#14B8A6',
        // },
        {
            title: 'Rating',
            value: overAllRating?.data?.averageRating || 0,
            change: overAllRating?.data?.totalFeedbacks || '0',
            changeText: `${
                (Number(overAllRating?.data?.averageRating) / 5) * 100
            }% positive`,
            icon: Star,
            gradient: 'from-[#F7A619] to-[#F59E0B]',
            trend: 'up',
            percentage: 2.1,
            color: '#F7A619',
        },
        {
            title: 'Waiting For RTO',
            value: counts?.waitingForRtoCount || 0,
            icon: Calendar,
            gradient: 'from-[#8B5CF6] to-[#7C3AED]',
            trend: 'neutral',
            color: '#8B5CF6',
            targetTab: 'students',
        },
    ]

    const dispatch = useAppDispatch()

    return (
        <div className="space-y-6">
            {/* Section Header - Enhanced */}
            <AnalyticsHeader />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left Side: Stats Cards - Spans 2 columns on LG using MasonryGrid */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2.5">
                    {analyticsCards.map((card, index) => (
                        <div
                            key={index}
                            className="cursor-pointer"
                            onClick={() => {
                                if (
                                    (card as any).targetTab ||
                                    (card as any).targetSection
                                ) {
                                    dispatch(
                                        setNavigationTarget({
                                            tab: (card as any).targetTab,
                                            section: (card as any)
                                                .targetSection,
                                        })
                                    )
                                }
                            }}
                        >
                            <AnalyticsCard card={card as any} index={index} />
                        </div>
                    ))}
                </div>

                {/* Right Side: Courses Quick View - Spans 1 column on LG */}
                <CoursesQuickView />
            </div>
        </div>
    )
}
