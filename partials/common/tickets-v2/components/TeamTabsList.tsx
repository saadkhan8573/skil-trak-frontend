import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import {
    Building2,
    ClipboardCheck,
    GraduationCap,
    Grid3x3,
    Users,
} from 'lucide-react'
import { useRouter } from 'next/router'
import {
    AllTeamsTabs,
    FilteredSupportTickets,
    IndustrySourcingTab,
    QATeamTab,
    RtoTeamTab,
    StudentServicesTab,
} from '../tickets-tabs'
import { getUserCredentials } from '@utils'
import { UserRoles } from '@constants'
import { useSubadminProfile } from '@hooks'
import { SupportTicketFilter } from './filters'
import { useEffect, useState } from 'react'
import { CommonApi } from '@queries'

export enum TAGS {
    STUDENT_SERVICES = 'student services',
    QUALITY_ASSURANCE = 'quality assurance',
    ADMIN = 'admin',
    SOURCING_TEAM = 'sourcing team',
    RTO_TEAM = 'rto team',
}
const TAG_TO_TAB_ID_MAP: Record<TAGS, string> = {
    [TAGS.STUDENT_SERVICES]: 'student-services',
    [TAGS.SOURCING_TEAM]: 'industry-sourcing',
    [TAGS.QUALITY_ASSURANCE]: 'qa',
    [TAGS.ADMIN]: 'all',
    [TAGS.RTO_TEAM]: 'rto',
}

export const TeamTabsList = () => {
    const [filters, setFilters] = useState<any>()
    const [itemPerPage, setItemPerPage] = useState(30)
    const [page, setPage] = useState(1)
    const router = useRouter()
    const tabName = router.query.tab
    const teamTabQuery = router.query.teamTab as string
    const role = getUserCredentials()?.role

    const buildSearchParams = (filter: any) => {
        if (!filter || typeof filter !== 'object') {
            return {}
        }

        return Object.fromEntries(
            Object.entries(filter).filter(
                ([_, value]) =>
                    value !== '' && value !== null && value !== undefined
            )
        )
    }

    const searchParams = buildSearchParams(filters ?? {})

    // Build search string with : instead of =
    const searchString = Object.entries(searchParams)
        .map(([key, value]) => `${key}:${value}`)
        .join(',')

    const { data, isLoading, isFetching, isError } =
        CommonApi.Teams.useAutomatedTickets({
            search: searchString || undefined,
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        })

    const subadmin = useSubadminProfile()
    const getAllowedTabIdsForSubadmin = (supportTeam: any[] = []) => {
        const tabIds = new Set<string>()

        supportTeam.forEach((team) => {
            team.tags?.forEach((tag: string) => {
                const normalizedTag = tag.toLowerCase() as TAGS
                const tabId = TAG_TO_TAB_ID_MAP[normalizedTag]
                if (tabId) {
                    tabIds.add(tabId)
                }
            })
        })

        return Array.from(tabIds)
    }
    const allowedSubadminTabIds =
        role === UserRoles.SUBADMIN
            ? getAllowedTabIdsForSubadmin(subadmin?.supportTeam)
            : []

    const teamTabs = [
        {
            id: 'all',
            label: 'All Teams',
            icon: Grid3x3,
            element: <AllTeamsTabs />,
        },
        {
            id: 'student-services',
            label: 'Student Services',
            icon: GraduationCap,
            element: <StudentServicesTab />,
        },
        {
            id: 'industry-sourcing',
            label: 'Industry Sourcing',
            icon: Building2,
            element: <IndustrySourcingTab />,
        },
        {
            id: 'rto',
            label: 'RTO Team',
            icon: ClipboardCheck,
            element: <RtoTeamTab />,
        },
        {
            id: 'qa',
            label: 'QA Team',
            icon: Users,
            element: <QATeamTab />,
        },
    ]

    const visibleTabs = teamTabs.filter((tab) => {
        if (role === UserRoles.ADMIN) return true

        if (role === UserRoles.RTO) {
            return tab.id === 'rto'
        }

        if (role === UserRoles.SUBADMIN) {
            return allowedSubadminTabIds.includes(tab.id)
        }

        return false
    })

    const defaultTab =
        role === UserRoles.ADMIN
            ? 'all'
            : role === UserRoles.RTO
            ? 'rto'
            : visibleTabs[0]?.id

    // Use teamTab from URL query if exists, otherwise use defaultTab
    const [activeTeamTab, setActiveTeamTab] = useState(
        teamTabQuery || defaultTab
    )

    // Update activeTeamTab when query changes
    useEffect(() => {
        if (teamTabQuery) {
            setActiveTeamTab(teamTabQuery)
        }
    }, [teamTabQuery])

    const handleTeamTabChange = (value: string) => {
        setActiveTeamTab(value)
        // Reset page to 1 when switching team tabs and update URL
        router.push(
            {
                pathname: router.pathname,
                query: { ...router.query, teamTab: value, page: 1 }, // ✅ Reset page to 1
            },
            undefined,
            { shallow: true }
        )
    }

    const hasActiveFilters = (filters?: Record<string, any>) => {
        if (!filters) return false

        return Object.values(filters).some(
            (value) =>
                value !== '' &&
                value !== null &&
                value !== undefined &&
                value !== 'all'
        )
    }

    return (
        <>
            <Tabs
                value={activeTeamTab}
                onValueChange={handleTeamTabChange}
                className="w-full mt-6"
            >
                <SupportTicketFilter
                    activeFilters={filters}
                    onFilterChange={setFilters}
                />
                {hasActiveFilters(filters) ? (
                    <>
                        <FilteredSupportTickets
                            isLoading={isLoading || isFetching}
                            data={data}
                            isError={isError}
                            setPage={setPage}
                            itemPerPage={itemPerPage}
                            setItemPerPage={setItemPerPage}
                        />
                    </>
                ) : (
                    <>
                        <TabsList className="flex flex-wrap gap-3 bg-transparent p-0 shadow-none">
                            {visibleTabs.map((tab) => {
                                const Icon = tab.icon
                                return (
                                    <TabsTrigger
                                        key={tab.id}
                                        value={tab.id}
                                        className={`
                                            group relative z-30 flex items-center gap-2 px-3 py-5 rounded-xl text-sm transition-all duration-300

                                            /* ACTIVE */
                                            data-[state=active]:bg-primary 
                                            data-[state=active]:text-white 
                                            data-[state=active]:shadow-lg 
                                            data-[state=active]:shadow-primary/20 
                                            data-[state=active]:scale-105

                                            /* INACTIVE */
                                            data-[state=inactive]:bg-white 
                                            data-[state=inactive]:text-primaryNew
                                            data-[state=inactive]:shadow 
                                            data-[state=inactive]:border 
                                            data-[state=inactive]:border-gray-200
                                            data-[state=inactive]:hover:bg-gray-50
                                        `}
                                    >
                                        <div
                                            className={`
                                                absolute inset-0 rounded-lg blur opacity-30 
                                                bg-[#F7A619] 
                                                hidden
                                                data-[state=active]:block
                                            `}
                                        ></div>

                                        <div className="relative z-10 flex items-center gap-2">
                                            <Icon
                                                className={`
                                                    w-4 h-4 transition-transform duration-300
                                                    data-[state=active]:scale-110
                                                    group-hover:scale-110
                                                `}
                                            />
                                            <span>{tab.label}</span>
                                        </div>

                                        <div
                                            className={`
                                                absolute bottom-0 left-0 right-0 h-0.5 bg-[#044866] rounded-full 
                                                transform scale-x-0 transition-transform duration-300
                                                group-hover:scale-x-100
                                                data-[state=active]:hidden
                                            `}
                                        ></div>
                                    </TabsTrigger>
                                )
                            })}
                        </TabsList>

                        {visibleTabs.map((tab) => (
                            <TabsContent
                                key={tab.id}
                                value={tab.id}
                                className="mt-4"
                            >
                                <div className="p-4 border rounded-lg bg-white shadow-sm">
                                    <h2 className="text-lg capitalize font-semibold text-[#044866]">
                                        {tab.label} - {tabName}
                                    </h2>
                                    <div className="py-4">{tab.element}</div>
                                </div>
                            </TabsContent>
                        ))}
                    </>
                )}
            </Tabs>
        </>
    )
}
