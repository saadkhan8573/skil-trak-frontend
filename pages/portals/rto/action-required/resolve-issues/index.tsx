import {
    ConfigTabs,
    Select,
    TabConfig,
    TextInput,
    withPermission,
} from '@components'
import { RtoLayoutV2 } from '@layouts'
import { FilteredIssues, ResolvedIssuesHistoryTab } from '@partials'
import { ActionRequiredHeader } from '@partials/rto-v2/components'
import { ProblematicStudent } from '@partials/rto/student'
import { RtoApi } from '@queries'
import { Flag, Search } from 'lucide-react'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import debounce from 'lodash/debounce'
import { PermissionType } from '@types'

const PRIORITY_OPTIONS = [
    { label: 'All Priorities', value: 'all' },
    { label: 'Critical', value: 'critical' },
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
]

const CATEGORY_OPTIONS = [
    { label: 'All Categories', value: 'all' },
    { label: 'Scheduling', value: 'scheduling' },
    { label: 'Communication', value: 'communication' },
    { label: 'Documentation', value: 'documentation' },
    { label: 'Logistics', value: 'logistics' },
    { label: 'Compliance', value: 'compliance' },
    { label: 'Capacity', value: 'capacity' },
]

const checkFilteredDataLength = (filter: any) => {
    const cleanedFilter = Object.entries(filter).reduce((acc, [key, value]) => {
        if (value && value !== '' && value !== 'all') {
            acc[key] = value
        }
        return acc
    }, {} as any)

    return Object.keys(cleanedFilter).length > 0
}

export const ResolveIssues = () => {
    const [selectedPriority, setSelectedPriority] = useState('all')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const count = RtoApi.Students.useRtoResolveIssuesStudentsCount()
    const router = useRouter()

    const handleSearchChange = useMemo(
        () =>
            debounce((value: string) => {
                setDebouncedSearch(value)
            }, 500),
        []
    )

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
        handleSearchChange(e.target.value)
    }

    const activeFilters = useMemo(() => {
        const filters: any = {}

        if (selectedPriority && selectedPriority !== 'all') {
            filters.priority = selectedPriority
        }

        if (selectedCategory && selectedCategory !== 'all') {
            filters.category = selectedCategory
        }

        if (debouncedSearch && debouncedSearch.trim() !== '') {
            filters.name = debouncedSearch.trim()
        }

        return filters
    }, [selectedPriority, selectedCategory, debouncedSearch])

    const filteredIssues = RtoApi.Students.useRtoResolveIssuesStudents(
        {
            search: `${JSON.stringify(activeFilters)
                .replaceAll('{', '')
                .replaceAll('}', '')
                .replaceAll('"', '')
                .trim()}`,
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        },
        {
            skip: !Object.keys(activeFilters).length,
        }
    )

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 50))
    }, [router])

    const tabs: TabConfig[] = [
        {
            value: 'open-issues',
            label: 'Open Issues',
            count: count?.data?.openIssues,
            component: ProblematicStudent,
        },
        {
            value: 'resolved-history',
            label: 'Resolved History',
            count: count?.data?.totalResolved,
            component: ResolvedIssuesHistoryTab,
        },
    ]

    const filteredDataLength = checkFilteredDataLength(activeFilters)

    return (
        <div>
            <ActionRequiredHeader
                icon={Flag}
                title="Resolve Issues"
                description="Address placement issues requiring coordinator attention"
                // urgentCount={count?.data?.criticalPriority || 0}
                // urgentLabel="Critical Issue(s)"
                // pendingCount={count?.data?.highPriority || 0}
                pendingLabel="High Priority"
                warningMessage="<strong>Urgent:</strong> These issues are blocking student placements and require immediate coordinator intervention. Delays in resolution may impact student progress and compliance timelines."
                gradientFrom="from-red-400/10"
                gradientTo="to-[#F7A619]/10"
                iconGradient="from-destructive to-red-600"
            />

            <div className="shadow-premium rounded-2xl bg-white mt-5">
                <div className="p-4 flex flex-col md:flex-row gap-4 w-full">
                    <div className="flex-1 relative w-1/2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1-2 h-4 w-4 text-muted-foreground" />
                        <TextInput
                            name="search"
                            placeholder="Search by student name, issue title, category..."
                            value={searchQuery}
                            onChange={handleInputChange}
                            className="pl-10 w-full"
                            showError={false}
                        />
                    </div>

                    <div className="flex gap-2 items-center w-1/2">
                        <div className="w-1/2">
                            <Select
                                name="priority"
                                defaultValue={PRIORITY_OPTIONS[0]}
                                value={PRIORITY_OPTIONS.find(
                                    (option) =>
                                        option.value === selectedPriority
                                )}
                                options={PRIORITY_OPTIONS}
                                placeholder="Priority"
                                onChange={(selectedOption: any) => {
                                    if (selectedOption) {
                                        setSelectedPriority(
                                            selectedOption.value
                                        )
                                    } else {
                                        setSelectedPriority('all')
                                    }
                                }}
                                showError={false}
                            />
                        </div>
                        <div className="w-1/2">
                            <Select
                                name="category"
                                value={CATEGORY_OPTIONS.find(
                                    (option) =>
                                        option.value === selectedCategory
                                )}
                                defaultValue={CATEGORY_OPTIONS[0]}
                                options={CATEGORY_OPTIONS}
                                placeholder="Category"
                                onChange={(selectedOption: any) => {
                                    if (selectedOption) {
                                        setSelectedCategory(
                                            selectedOption.value
                                        )
                                    } else {
                                        setSelectedCategory('all')
                                    }
                                }}
                                showError={false}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5">
                {filteredDataLength ? (
                    <FilteredIssues
                        data={filteredIssues.data}
                        isLoading={
                            filteredIssues.isLoading ||
                            filteredIssues?.isFetching
                        }
                        isError={filteredIssues.isError}
                        isSuccess={filteredIssues.isSuccess}
                        itemPerPage={itemPerPage}
                        setItemPerPage={setItemPerPage}
                        page={page}
                        setPage={setPage}
                    />
                ) : (
                    <ConfigTabs tabs={tabs} defaultValue="open-issues" />
                )}
            </div>
        </div>
    )
}

ResolveIssues.getLayout = (page: ReactElement) => {
    return (
        <RtoLayoutV2
            titleProps={{
                Icon: Flag,
                title: 'Resolve Issues',
                description: 'Address placement issues',
            }}
        >
            {page}
        </RtoLayoutV2>
    )
}

export default withPermission(ResolveIssues, {
    permissions: [PermissionType.RESOLVE_ISSUES],
})
