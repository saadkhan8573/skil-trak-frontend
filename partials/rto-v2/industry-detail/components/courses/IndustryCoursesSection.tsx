import {
    RtoV2Api,
    setDeletedCourses,
    setIndustrySectorCapacity,
    SubAdminApi,
} from '@redux'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { useEffect, useState } from 'react'

import { EmptyData, TechnicalError } from '@components'
import { CoursesHeaderSection } from '../courses/header/CoursesHeaderSection'
import { SectorCard } from '../courses/SectorCard'
import { useCoursesData } from './hooks'
import { CoursesTabSkeleton } from '../../skeletonLoader'
import { CheckCircle2, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn, removeEmptyValues } from '@utils'

export function IndustryCoursesSection() {
    const [searchQuery, setSearchQuery] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const [isDeletedView, setIsDeletedView] = useState(false)

    const { industryDetail: industry } = useAppSelector(
        (state) => state.industry
    )
    const { groupBySector } = useCoursesData()
    const dispatch = useAppDispatch()

    const { data: sectorCapacityData } =
        SubAdminApi.Industry.useSectorBasedCapacity(industry?.id || 0, {
            skip: !industry?.id,
        })
    const { data: counts, isLoading: isCountsLoading } =
        RtoV2Api.Industries.getRtoIndustryDataCount(industry?.id || 0, {
            skip: !industry?.id,
        })
    console.log('sectorCapacityData', sectorCapacityData)
    useEffect(() => {
        if (sectorCapacityData) {
            dispatch(setIndustrySectorCapacity(sectorCapacityData))
        }
    }, [sectorCapacityData, dispatch])

    const coursesDetails = RtoV2Api.Industries.industryCoursesDetails(
        removeEmptyValues({
            userId: industry?.user?.id,
            isDeleted: isDeletedView,
        }),
        {
            skip: !industry?.user?.id,
        }
    )

    useEffect(() => {
        if (isDeletedView && coursesDetails?.data) {
            dispatch(setDeletedCourses(coursesDetails.data))
        }
    }, [isDeletedView, coursesDetails?.data, dispatch])

    // Use API data directly without transformation
    const coursesData = coursesDetails?.data
        ? groupBySector(coursesDetails?.data)
        : []

    // Calculate overall statistics
    const totalCourses = coursesData.reduce(
        (acc, group) => acc + group.approvalCourses.length,
        0
    )

    const totalStudents = counts?.totalStudents || 0
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

            {/* View Toggle Tabs - High Fidelity Switcher */}
            <div className="flex items-center justify-center pt-2">
                <div className="bg-slate-100/80 p-1 rounded-xl flex items-center gap-1 border border-slate-200 shadow-sm overflow-hidden relative">
                    {[
                        {
                            id: false,
                            label: 'Active Courses',
                            icon: CheckCircle2,
                            color: 'text-emerald-600',
                        },
                        {
                            id: true,
                            label: 'Removed History',
                            icon: Trash2,
                            color: 'text-rose-600',
                        },
                    ].map((tab) => {
                        const isActive = isDeletedView === tab.id
                        return (
                            <button
                                key={String(tab.id)}
                                onClick={() => setIsDeletedView(tab.id)}
                                className={cn(
                                    'relative px-6 py-2.5 rounded-lg flex items-center gap-2.5 transition-all duration-300 z-10',
                                    isActive
                                        ? 'text-slate-900 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                )}
                            >
                                <tab.icon
                                    className={cn(
                                        'w-4 h-4 transition-colors',
                                        isActive ? tab.color : 'text-slate-400'
                                    )}
                                />
                                <span className="text-[13px] font-bold whitespace-nowrap">
                                    {tab.label}
                                </span>

                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute inset-0 bg-white rounded-lg shadow-sm -z-10"
                                        transition={{
                                            type: 'spring',
                                            bounce: 0.2,
                                            duration: 0.6,
                                        }}
                                    />
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>
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
                            isDeleted={isDeletedView}
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
