import { ConfigTabs, LoadingAnimation, TabConfig } from '@components'
import { RtoV2Api } from '@redux'
import { debounce } from 'lodash'
import { Building2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { IndustryCounts, IndustryFilterBar, IndustryHeader } from './component'
import { AddIndustryModal } from './modals'
import {
    ArchivedIndustries,
    NonPartnerIndustries,
    SkiltrakNetwork,
    YourPartnerIndustries,
} from './tabs'

export const RtoUpdatedIndustries = () => {
    const [addIndustryOpen, setAddIndustryOpen] = useState(false)
    const [filters, setFilters] = useState({
        searchTerm: '',
        courseId: 'all',
        filterStatus: 'all',
        stateFilter: 'all',
        placementReady: 'all',
    })

    const industries = RtoV2Api.Industries.getAllIndustriesList({
        search: '',
        skip: 0,
        limit: 1,
    })

    const [debouncedSearch, setDebouncedSearch] = useState(filters.searchTerm)

    const updateDebouncedSearch = useCallback(
        debounce((value) => {
            setDebouncedSearch(value)
        }, 500),
        []
    )

    useEffect(() => {
        updateDebouncedSearch(filters.searchTerm)
        return () => updateDebouncedSearch.cancel()
    }, [filters.searchTerm, updateDebouncedSearch])

    const handleFilterChange = (name: string, value: any) => {
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const baseFilter = {
        ...(debouncedSearch && { name: debouncedSearch }),
        ...(filters.courseId !== 'all' && { courseId: filters.courseId }),
        ...(filters.filterStatus !== 'all' && {
            status: filters.filterStatus,
        }),
        ...(filters.stateFilter !== 'all' && { state: filters.stateFilter }),
        ...(filters.placementReady !== 'all' && {
            placementReady: filters.placementReady,
        }),
    }

    const tabs: TabConfig[] = [
        {
            value: 'partner-industries',
            label: 'Your Partner Industries',
            icon: Building2,
            component: () => <YourPartnerIndustries baseFilter={baseFilter} />,
        },
        {
            value: 'non-partner-industries',
            label: 'Non-Partner Industries',
            icon: Building2,
            component: () => <NonPartnerIndustries baseFilter={baseFilter} />,
        },
        // {
        //     value: 'pending-industries',
        //     label: 'Pending Industries',
        //     icon: Building2,
        //     component: () => <PendingIndustriesTab baseFilter={baseFilter} />,
        // },
        {
            value: 'skiltrak-network',
            label: 'Skiltrak Network',
            icon: Building2,
            component: () => <SkiltrakNetwork />,
        },
        {
            value: 'archived-industries',
            label: 'Archived Industries',
            icon: Building2,
            component: () => <ArchivedIndustries baseFilter={baseFilter} />,
        },
    ]

    return (
        <div className="space-y-4 animate-fade-in">
            <IndustryHeader />
            <IndustryCounts />
            <div className="bg-white p-4 rounded-xl border border-border/50 shadow-sm">
                <IndustryFilterBar
                    {...filters}
                    onFilterChange={handleFilterChange}
                />
            </div>

            {/* <TabNavigation tabs={tabs}>
                {({ header, element }: any) => (
                    <div>
                        <div>{header}</div>
                        <div className="mt-4">{element}</div>
                    </div>
                )}
            </TabNavigation> */}

            {industries.isLoading ? (
                <LoadingAnimation />
            ) : industries?.data &&
              industries?.data?.data?.length > 0 &&
              industries?.isSuccess ? (
                <ConfigTabs
                    tabs={tabs}
                    className="!rounded-none"
                    tabsClasses="!rounded-md !p-1"
                    tabsTriggerClasses="py-1.5 !rounded-md"
                />
            ) : (
                <SkiltrakNetwork />
            )}

            {addIndustryOpen && (
                <AddIndustryModal onClose={() => setAddIndustryOpen(false)} />
            )}
        </div>
    )
}
