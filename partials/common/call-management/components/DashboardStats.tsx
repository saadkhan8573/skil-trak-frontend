import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import { CommonApi } from '@queries'
import { PlacementCall } from '@types'
import { CheckCircle, Clock, Phone } from 'lucide-react'
import { useState } from 'react'
import { AllCallList } from '../call-management-tabs'
import { CallDetailModal, TicketModal } from '../modal'

export function DashboardStats() {
    const [selectedCall, setSelectedCall] = useState<PlacementCall | null>(null)
    const [ticketModalCall, setTicketModalCall] = useState<PlacementCall | null>(null)

    const { data: statistics } = CommonApi.CallManagement.useAiCallStatistics()

    const stats = [
        {
            label: 'Total Calls',
            value: statistics?.totalCalls || 0,
            icon: Phone,
            color: 'bg-primaryNew',
            lightColor: 'bg-[#E6F2F7]',
            textColor: 'text-[#044866]',
            valueKey: 'all',
        },
        {
            label: 'Completed Placements',
            value: statistics?.resoved || 0,
            icon: CheckCircle,
            color: 'bg-primaryNew',
            lightColor: 'bg-[#E8F4F6]',
            textColor: 'text-[#0D5468]',
            valueKey: 'completed',
        },
        {
            label: 'Pending States',
            value: statistics?.pending || 0,
            icon: Clock,
            color: 'bg-primaryNew',
            lightColor: 'bg-[#E6F2F7]',
            textColor: 'text-[#044866]',
            valueKey: 'open',
        },
    ] as const

    return (
        <>
            <Tabs defaultValue="all" className="mb-5">
                <TabsList className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-transparent p-0 h-32 w-full">
                    {stats?.map((stat) => {
                        const Icon = stat.icon

                        return (
                            <TabsTrigger
                                key={stat.valueKey}
                                value={stat.valueKey}
                                className={`
                                group relative rounded-xl border-2 p-4 text-left transition-all 
                                data-[state=active]:shadow-lg
                                data-[state=active]:scale-[1.02]
                                data-[state=active]:border-transparent
                                data-[state=active]:${stat.color}
                                bg-white border-gray-200 hover:border-gray-300 hover:shadow-md
                            `}
                            >
                                <div className="relative z-10 w-full ">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-gray-600 group-data-[state=active]:text-white/80">
                                            {stat.label}
                                        </span>

                                        <div
                                            className={`
                                            p-1.5 rounded-lg
                                            group-data-[state=active]:bg-white/20
                                            ${stat.lightColor}
                                        `}
                                        >
                                            <Icon
                                                className={`
                                                w-4 h-4
                                                ${stat.textColor}
                                                group-data-[state=active]:text-white
                                            `}
                                            />
                                        </div>
                                    </div>

                                    <div className="text-3xl text-gray-900 group-data-[state=active]:text-white font-bold">
                                        {stat.value}
                                    </div>
                                </div>

                                {/* Active indicator */}
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-white/40 hidden data-[state=active]:block" />
                            </TabsTrigger>
                        )
                    })}
                </TabsList>

                {/* 
              Render these wherever you want:
              */}
                <TabsContent value="all">
                    <AllCallList />
                </TabsContent>
                <TabsContent value="completed"> <AllCallList status='completed' /></TabsContent>
                <TabsContent value="open"> <AllCallList status='pending' /></TabsContent>
            </Tabs>

            {selectedCall && (
                <CallDetailModal
                    call={selectedCall}
                    onClose={() => setSelectedCall(null)}
                />
            )}

            {/* Ticket Creation Modal */}
            {ticketModalCall && (
                <TicketModal
                    call={ticketModalCall}
                    onClose={() => setTicketModalCall(null)}
                />
            )}
        </>
    )
}
