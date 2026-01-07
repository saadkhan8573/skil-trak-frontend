'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import { AlertCircle, Archive } from 'lucide-react'
import { Header, TeamTabsList } from './components'
import { ActiveTicketsTab, ResolvedTicketsTab } from './tickets-tabs'
import { CommonApi } from '@queries'


export const TicketDashboard = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
   
    // Read query param: ?tab=active
    const currentTab = searchParams.get('tab') || 'active'

    const handleTabChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('tab', value)

        router.push(`?${params.toString()}`, { scroll: false })
    }
    const count = CommonApi.Teams.useAutomatedTicketsCount()

    return (
        <>
            <Header />
            <div
                className="mb-4 animate-slide-up"
                style={{ animationDelay: '0.1s' }}
            >
                <Tabs value={currentTab} onValueChange={handleTabChange}>
                    <TabsList className="flex flex-wrap items-center gap-3 bg-transparent p-0 shadow-none">
                        {/* ACTIVE */}
                        <TabsTrigger
                            value="active"
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all
                                data-[state=active]:bg-primaryNew data-[state=active]:text-white 
                                data-[state=active]:shadow-lg data-[state=active]:shadow-[#044866]/20
                                data-[state=inactive]:bg-white data-[state=inactive]:text-[#044866]
                                data-[state=inactive]:border data-[state=inactive]:border-gray-200 
                                data-[state=inactive]:hover:border-[#044866]/30
                            `}
                        >
                            <AlertCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                Active Tickets
                            </span>
                            <span className="sm:hidden">Active</span>
                            <span
                                className={`
                                    px-2 py-0.5 rounded-full text-xs
                                    data-[state=active]:bg-white/20 data-[state=active]:text-white
                                    data-[state=inactive]:bg-[#044866]/10 data-[state=inactive]:text-[#044866]
                                `}
                            >
                                {count?.data?.OPEN ?? 0}
                            </span>
                        </TabsTrigger>

                        {/* RESOLVED */}
                        <TabsTrigger
                            value="resolved"
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all
                                data-[state=active]:bg-green-600 data-[state=active]:text-white 
                                data-[state=active]:shadow-lg data-[state=active]:shadow-green-600/20
                                data-[state=inactive]:bg-white data-[state=inactive]:text-green-600
                                data-[state=inactive]:border data-[state=inactive]:border-gray-200 
                                data-[state=inactive]:hover:border-green-600/30
                            `}
                        >
                            <Archive className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                Resolved Tickets
                            </span>
                            <span className="sm:hidden">Resolved</span>
                            <span
                                className={`
                                    px-2 py-0.5 rounded-full text-xs
                                    data-[state=active]:bg-white/20 data-[state=active]:text-white
                                    data-[state=inactive]:bg-green-600/10 data-[state=inactive]:text-green-600
                                `}
                            >
                                {count?.data?.CLOSE ?? 0}
                            </span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="active">
                        <ActiveTicketsTab count={count} />
                    </TabsContent>

                    {/* <TabsContent value="resolved">
                        <ResolvedTicketsTab count={count} />
                    </TabsContent> */}
                </Tabs>
            </div>

            <TeamTabsList />
        </>
    )
}
