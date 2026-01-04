import { EmptyData, TechnicalError } from '@components'
import { RtoV2Api, setIndustryDetail, setNavigationTarget } from '@redux'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { scrollToSection } from '@utils'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { AnalyticsDashboard } from './components/AnalyticsDashboard'
import { OperationalModules } from './components/OperationalModules'
import { PlacementChecklist } from './components/PlacementChecklist'
import { ProfileEssentials } from './components/ProfileEssentials'
import { IndustryInfoMessage, IndustryProfileHeader } from './components'
import {
    AnalyticsSkeleton,
    ChecklistSkeleton,
    EssentialsSkeleton,
    HeaderSkeleton,
    OperationalSkeleton,
} from './skeletonLoader'

export const IndustryProfileDetail = () => {
    const operationalModulesRef = useRef<HTMLDivElement>(null)

    const dispatch = useAppDispatch()

    const router = useRouter()

    const industryDetail = RtoV2Api.Industries.getRtoIndustryDetail(
        Number(router.query.id),
        {
            skip: !router.query?.id,
            refetchOnMountOrArgChange: true,
        }
    )

    useEffect(() => {
        if (industryDetail?.isSuccess && industryDetail?.data) {
            dispatch(setIndustryDetail(industryDetail?.data))
        }
    }, [industryDetail?.isSuccess, industryDetail?.data])

    const navigationTarget = useAppSelector(
        (state) => state.industry.navigationTarget
    )

    useEffect(() => {
        if (navigationTarget) {
            const { tab, section } = navigationTarget

            if (tab) {
                // Scroll to operational modules first if a tab is specified
                if (operationalModulesRef.current) {
                    // Find the scrollable container
                    const scrollContainer = document.getElementById(
                        'main-content-scroll'
                    )

                    if (scrollContainer) {
                        const containerRect =
                            scrollContainer.getBoundingClientRect()
                        const elementRect =
                            operationalModulesRef.current.getBoundingClientRect()
                        const relativeTop = elementRect.top - containerRect.top
                        const scrollOffset = 100 // Offset for navbar

                        scrollContainer.scrollTo({
                            top:
                                scrollContainer.scrollTop +
                                relativeTop -
                                scrollOffset,
                            behavior: 'smooth',
                        })
                    }
                }
            }

            if (section) {
                // Wait for potential tab switch animation/render
                setTimeout(
                    () => {
                        scrollToSection(section)
                        // Clear the target after small delay to allow re-navigation if clicked again
                        dispatch(setNavigationTarget(null))
                    },
                    tab ? 500 : 100
                )
            } else if (tab) {
                // If only tab, clear after scroll
                setTimeout(() => {
                    dispatch(setNavigationTarget(null))
                }, 500)
            }
        }
    }, [navigationTarget, dispatch])

    return (
        <div>
            {industryDetail?.isError && <TechnicalError />}
            {industryDetail?.isLoading ? (
                <div className="w-full mx-auto space-y-6">
                    <HeaderSkeleton />
                    <AnalyticsSkeleton />
                    <EssentialsSkeleton />
                    <ChecklistSkeleton />
                    <OperationalSkeleton />
                </div>
            ) : industryDetail?.isSuccess && industryDetail?.data ? (
                <div className="w-full mx-auto space-y-6">
                    <IndustryProfileHeader />
                    <IndustryInfoMessage
                        industryUserId={industryDetail.data.user.id}
                    />
                    <AnalyticsDashboard />
                    <ProfileEssentials />
                    <PlacementChecklist />
                    <div ref={operationalModulesRef}>
                        <OperationalModules />
                    </div>
                </div>
            ) : (
                industryDetail?.isSuccess && (
                    <EmptyData
                        title={'No Industry Found'}
                        description={'No Industry Found on your request'}
                    />
                )
            )}
        </div>
    )
}
