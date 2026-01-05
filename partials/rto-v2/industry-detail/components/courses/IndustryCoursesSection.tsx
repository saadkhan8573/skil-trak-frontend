import { RtoV2Api, setIndustrySectorCapacity, SubAdminApi } from '@redux'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { useEffect, useState } from 'react'

import { EmptyData, TechnicalError } from '@components'
import { CoursesHeaderSection } from '../courses/header/CoursesHeaderSection'
import { SectorCard } from '../courses/SectorCard'
import { useCoursesData } from './hooks'
import { CoursesTabSkeleton } from '../../skeletonLoader'

export function IndustryCoursesSection() {
    const [searchQuery, setSearchQuery] = useState('')
    const [showSearch, setShowSearch] = useState(false)

    const { industryDetail: industry } = useAppSelector(
        (state) => state.industry
    )
    const { groupBySector } = useCoursesData()
    const dispatch = useAppDispatch()

    const { data: sectorCapacityData } =
        SubAdminApi.Industry.useSectorBasedCapacity(industry?.id || 0, {
            skip: !industry?.id,
        })

    useEffect(() => {
        if (sectorCapacityData) {
            dispatch(setIndustrySectorCapacity(sectorCapacityData))
        }
    }, [sectorCapacityData, dispatch])

    const coursesDetails = RtoV2Api.Industries.industryCoursesDetails(
        {
            userId: industry?.user?.id,
        },
        {
            skip: !industry?.user?.id,
        }
    )

    // Use API data directly without transformation
    const coursesData = coursesDetails?.data
        ? groupBySector(coursesDetails?.data)
        : []

    // Calculate overall statistics
    const totalCourses = coursesData.reduce(
        (acc, group) => acc + group.approvalCourses.length,
        0
    )

    const totalStudents =
        sectorCapacityData?.reduce(
            (acc: number, curr: any) => acc + (curr.enrolled || 0),
            0
        ) || 0
    const totalCapacity =
        sectorCapacityData?.reduce(
            (acc: number, curr: any) => acc + (Number(curr?.capacity) || 0),
            0
        ) || 0

    const overallCapacity =
        totalCapacity > 0
            ? Math.round((totalStudents / totalCapacity) * 100)
            : 0

    const approvedCount = coursesData.filter(
        (group) => group.sector.industryApproval?.[0]?.status === 'approved'
    ).length

    const pendingActionsCount = coursesData.filter((group) => {
        const status = group.sector.industryApproval?.[0]?.status
        return status === 'pending'
    }).length

    if (coursesDetails?.isLoading || coursesDetails?.isFetching) {
        return <CoursesTabSkeleton />
    }

    return (
        <div id="courses" className="space-y-5 px-4">
            {/* Premium Header Section */}
            <CoursesHeaderSection
                showSearch={showSearch}
                searchQuery={searchQuery}
                totalCourses={totalCourses}
                totalStudents={Number(totalStudents)}
                totalCapacity={totalCapacity}
                overallCapacity={overallCapacity}
                pendingActionsCount={pendingActionsCount}
                approvedCount={approvedCount}
                onToggleSearch={() => setShowSearch(!showSearch)}
                onSearchChange={setSearchQuery}
                existingCourses={coursesDetails?.data}
            />

            {/* Sector Cards - Enhanced Design */}
            <div id="capacity" className="space-y-3">
                {coursesDetails?.isError && <TechnicalError />}
                {coursesDetails?.isSuccess &&
                    coursesDetails?.data &&
                    coursesDetails?.data?.length > 0 ? (
                    coursesData.map((group, sectorIndex) => (
                        <SectorCard
                            key={group.sector.id}
                            sector={group}
                            sectorIndex={sectorIndex}
                        />
                    ))
                ) : (
                    <EmptyData
                        height="40vh"
                        title="No courses found"
                        description="No courses found for this industry"
                    />
                )}
            </div>
        </div>
    )
}
