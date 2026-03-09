import React, { useEffect, useMemo, useState } from 'react'
import { Building2, History, Users } from 'lucide-react'
import { useRouter } from 'next/router'
import { StudentInterviewDetail } from '../StudentInterviewDetail'
import { CommonApi, SubAdminApi } from '@queries'
import {
    ContactHistory,
    ListIndustriesInRadius,
    OnViewMapFutureIndustryDetailsTab,
    OnViewMapIndustryDetailsTab,
} from '.'
import { useIndustryDetails } from './hooks/useIndustryDetails'

/* ---------------------------------------------
 * Types & Constants
 * ------------------------------------------- */

type MainTab = 'industries' | 'contact' | 'interviews'

const TABS = [
    { id: 'industries', label: 'Industries', icon: Building2 },
    { id: 'contact', label: 'Contact History', icon: History },
    { id: 'interviews', label: 'Student Interview', icon: Users },
] as const

const STORAGE_KEY = 'activeIndustryListTab'

/* ---------------------------------------------
 * Component
 * ------------------------------------------- */

export const OnViewMapTabs = ({
    workplaceId,
    workplace,
    selectedBox,
    appliedIndustry,
    setSelectedBox,
    activeIndustryListTab,
    setActiveIndustryListTab,
}: any) => {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<MainTab>('industries')

    const workplaceCourseId = workplace?.courses?.[0]?.id
    const isStudent = selectedBox?.user?.role === 'student'

    const { industryType, industryDetails } = useIndustryDetails({
        selectedBox,
        workplaceId,
        isStudent,
    })

    /* ---------------------------------------------
     * Persist active list tab
     * ------------------------------------------- */
    useEffect(() => {
        if (!activeIndustryListTab) return

        try {
            localStorage.setItem(
                `${STORAGE_KEY}_${workplaceId}`,
                activeIndustryListTab
            )
        } catch {
            // persistence failure is non-critical
        }
    }, [activeIndustryListTab, workplaceId])

    /* ---------------------------------------------
     * Handlers
     * ------------------------------------------- */

    const showIndustriesList = () => {
        setSelectedBox(null)

        router.push({ query: { ...router.query } }, undefined, {
            shallow: true,
            scroll: false,
        })
    }

    /* ---------------------------------------------
     * Render helpers
     * ------------------------------------------- */

    const renderIndustriesContent = () => {
        if (!selectedBox) {
            return (
                <ListIndustriesInRadius
                    workplaceId={workplace?.id}
                    courseId={workplaceCourseId}
                    studentLocation={workplace?.student?.location}
                    setSelectedBox={setSelectedBox}
                    activeIndustryListTab={activeIndustryListTab}
                    setActiveIndustryListTab={setActiveIndustryListTab}
                />
            )
        }

        if (industryType === 'listing') {
            return (
                <OnViewMapFutureIndustryDetailsTab
                    selectedBox={selectedBox}
                    workplace={workplace}
                    industryDetails={industryDetails}
                    appliedIndustry={appliedIndustry}
                />
            )
        }

        return (
            <OnViewMapIndustryDetailsTab
                selectedBox={selectedBox}
                workplace={workplace}
                industryDetails={industryDetails}
                appliedIndustry={appliedIndustry}
            />
        )
    }

    /* ---------------------------------------------
     * Render
     * ------------------------------------------- */

    return (
        <div className="w-full">
            {/* Tabs */}
            <div
                role="tablist"
                className="grid grid-cols-3 bg-white border-b border-gray-200 rounded-t-md"
            >
                {TABS.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        role="tab"
                        aria-selected={activeTab === id}
                        onClick={() => setActiveTab(id)}
                        className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors
                            ${
                                activeTab === id
                                    ? 'bg-primaryNew text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <Icon className="w-5 h-5" />
                        {label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div role="tabpanel" className="p-4">
                {activeTab === 'industries' && (
                    <>
                        {selectedBox && (
                            <button
                                onClick={showIndustriesList}
                                className="text-sm text-link underline mb-2"
                            >
                                View industries list
                            </button>
                        )}
                        {renderIndustriesContent()}
                    </>
                )}

                {activeTab === 'contact' && (
                    <ContactHistory wpId={workplace?.id} />
                )}

                {activeTab === 'interviews' && (
                    <StudentInterviewDetail workplaceId={Number(workplaceId)} />
                )}
            </div>
        </div>
    )
}
