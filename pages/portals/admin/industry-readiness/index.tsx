import { AdminLayout } from '@layouts'
import { ReadinessHome, StudentForecast } from '@partials'
import { NextPageWithLayout } from '@types'
import { ReactElement, useEffect, useMemo } from 'react'
import { Home, Calendar, Map, TrendingUp, Table } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { IndustryReadinessTableContainer } from '@partials/admin/industry-readiness/tabs/industry-readiness-table'

const IndustryReadiness: NextPageWithLayout = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const activeTab = searchParams.get('tab') || 'home'

    const tabItems = useMemo(
        () => [
            // {
            //     value: 'home',
            //     label: 'Home',
            //     icon: <Home className="w-4 h-4 mr-2" />,
            //     content: <ReadinessHome />,
            // },
            // {
            //     value: 'timeline',
            //     label: 'Timeline',
            //     icon: <Calendar className="w-4 h-4 mr-2" />,
            //     content: <div>Timeline Content</div>,
            // },
            // {
            //     value: 'map',
            //     label: 'Map',
            //     icon: <Map className="w-4 h-4 mr-2" />,
            //     content: <div>Map View</div>,
            // },
            {
                value: 'forecast',
                label: 'Forecast',
                icon: <TrendingUp className="w-4 h-4 mr-2" />,
                content: <StudentForecast />,
            },
            {
                value: 'table',
                label: 'Table',
                icon: <Table className="w-4 h-4 mr-2" />,
                content: <IndustryReadinessTableContainer />,
            },
        ],
        []
    )

    const handleTabChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('tab', value)
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

    return (
        <div className="p-0">
            <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full"
            >
                <div className="border-b bg-white px-5 py-2">
                    <TabsList className="bg-transparent h-auto p-0 gap-2">
                        {tabItems.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="data-[state=active]:bg-[#004a61] data-[state=active]:text-white rounded-md px-4 py-2 text-sm font-medium transition-all border border-transparent hover:bg-slate-100 data-[state=active]:hover:bg-[#004a61]"
                            >
                                {tab.icon}
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {tabItems.map((tab) => (
                    <TabsContent
                        key={tab.value}
                        value={tab.value}
                        className="p-5 mt-0 outline-none"
                    >
                        {tab.content}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}

IndustryReadiness.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default IndustryReadiness
