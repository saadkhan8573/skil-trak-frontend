'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import { AlertCircle, Archive, Activity } from 'lucide-react'
import { Header, TeamTabsList } from './components'
import {
    ActiveTicketsTab,
    ResolvedTicketsTab,
    InProgressTicketsTab,
} from './tickets-tabs'
import { CommonApi } from '@queries'
import { cn } from '@utils'

const TABS = [
    {
        value: 'active',
        label: 'Active Tickets',
        shortLabel: 'Active',
        icon: AlertCircle,
        countKey: 'ASSIGNED',
        content: ActiveTicketsTab,
        // Define specific color tokens to use in the component logic
        theme: 'primary',
    },
    {
        value: 'resolved',
        label: 'Resolved Tickets',
        shortLabel: 'Resolved',
        icon: Archive,
        countKey: 'CLOSE',
        content: ResolvedTicketsTab,
        theme: 'success',
    },
    {
        value: 'inProgress',
        label: 'In-progress Tickets',
        shortLabel: 'In-progress',
        icon: Activity,
        countKey: 'IN_PROGRESS',
        content: InProgressTicketsTab,
        theme: 'info',
    },
] as const
type TabValue = (typeof TABS)[number]['value']

export const TicketDashboard = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const count = CommonApi.Teams.useAutomatedTicketsCount()

    /* Validate query param */
    const tabParam = searchParams.get('tab') as TabValue | null

    // Use '?? undefined' to convert null, or just fall back to your default 'active'
    const currentTab: TabValue = TABS.some((t) => t.value === tabParam)
        ? (tabParam as TabValue)
        : 'active'

    const handleTabChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('tab', value)
        router.push(`?${params.toString()}`, { scroll: false })
    }
    return (
        <>
            <Header />

            <div className="mb-4 animate-slide-up">
                <Tabs value={currentTab} onValueChange={handleTabChange}>
                    <TabsList className="flex flex-wrap items-center gap-3 bg-transparent p-0 shadow-none">
                        {TABS.map(
                            ({
                                value,
                                label,
                                shortLabel,
                                icon: Icon,
                                theme,
                                countKey,
                            }) => (
                                <TabsTrigger
                                    key={value}
                                    value={value}
                                    className={cn(
                                        'group flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all border',
                                        // Primary Tab Styles
                                        theme === 'primary' &&
                                        'data-[state=active]:bg-primaryNew data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:bg-white data-[state=inactive]:text-[#044866] data-[state=inactive]:border-gray-200',
                                        // Success Tab Styles
                                        theme === 'success' &&
                                        'data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:bg-white data-[state=inactive]:text-green-600 data-[state=inactive]:border-gray-200',
                                        // Info Tab Styles
                                        theme === 'info' &&
                                        'data-[state=active]:bg-info data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:bg-white data-[state=inactive]:text-info data-[state=inactive]:border-gray-200'
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="hidden sm:inline">
                                        {label}
                                    </span>
                                    <span className="sm:hidden">
                                        {shortLabel}
                                    </span>

                                    <span
                                        className={cn(
                                            'px-2 py-0.5 rounded-full text-xs transition-colors',
                                            // Badge logic using group state
                                            'group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white',
                                            theme === 'primary' &&
                                            'group-data-[state=inactive]:bg-[#044866]/10 group-data-[state=inactive]:text-[#044866]',
                                            theme === 'success' &&
                                            'group-data-[state=inactive]:bg-green-600/10 group-data-[state=inactive]:text-green-600',
                                            theme === 'info' &&
                                            'group-data-[state=inactive]:bg-info/10 group-data-[state=inactive]:text-info'
                                        )}
                                    >
                                        {count?.data?.[countKey] ?? 0}
                                    </span>
                                </TabsTrigger>
                            )
                        )}
                    </TabsList>

                    {TABS.map(({ value, content: Content }) => (
                        <TabsContent key={value} value={value}>
                            <Content count={count} />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>

            <TeamTabsList />
        </>
    )
}
