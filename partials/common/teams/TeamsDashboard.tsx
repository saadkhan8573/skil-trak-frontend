import { Badge } from '@components/ui/badge'
import { Tabs, TabsContent, TabsList } from '@components/ui/tabs'
import { CommonApi } from '@queries'
import { TabsTrigger } from '@radix-ui/react-tabs'
import { Briefcase, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { TeamsHeader, TeamsStatsCard } from './components'
import { TeamMemberModal } from './modals'
import { AllTeamsTab, TeamSetupGuideTab } from './teams-tabs'

export const TeamsDashboard = () => {
    const [addMemberOpen, setAddMemberOpen] = useState(false)

    const { data, isLoading } = CommonApi.Teams.useTeamCounts()
    const TAB_LIST = [
        {
            label: 'Quick Start Guide',
            value: 'setup',
            icon: Sparkles,
            badge: null, // No badge for this tab
            component: (
                <TeamSetupGuideTab setAddMemberOpen={setAddMemberOpen} />
            ),
        },
        // {
        //     label: 'All Members',
        //     value: 'members',
        //     icon: Users,
        //     badge: (
        //         <Badge
        //             variant="secondary"
        //             className="ml-1.5 h-6 min-w-[24px] px-2 "
        //         >
        //             26
        //         </Badge>
        //     ),
        //     component: <AllTeamMembersTab />,
        // },
        {
            label: 'All Teams',
            value: 'teams',
            icon: Briefcase,
            badge: (
                <Badge
                    variant="secondary"
                    className="ml-1.5 h-6 min-w-[24px] px-2 text-primaryNew data-[state=active]:text-white"
                >
                    {data?.team ?? 0}
                </Badge>
            ),
            component: <AllTeamsTab />,
        },
    ]

    return (
        <div className="space-y-6 p-6">
            <TeamsHeader setAddMemberOpen={setAddMemberOpen} />
            <TeamsStatsCard data={data} />

            {/* Tabs */}
            <Tabs defaultValue="teams">
                <div className="border border-border/50 rounded-2xl p-6 shadow-premium-lg">
                    <TabsList className="w-full bg-white backdrop-blur-sm border border-border/60 shadow-premium-lg p-2! rounded-xl h-auto grid grid-cols-2 gap-2">
                        {TAB_LIST.map((tab) => {
                            const Icon = tab.icon
                            return (
                                <TabsTrigger
                                    value={tab.value}
                                    className="gap-2 w-full justify-center flex items-center text-primaryNew rounded-lg py-3 data-[state=active]:bg-primaryNew data-[state=active]:text-white data-[state=active]:shadow-premium transition-all hover:bg-muted/50 border border-border/60"
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{tab.label}</span>
                                    {tab.badge}
                                </TabsTrigger>
                            )
                        })}
                    </TabsList>
                    {TAB_LIST.map((tab) => (
                        <TabsContent
                            key={tab.value}
                            value={tab.value}
                            className="space-y-6"
                        >
                            {tab.component}
                        </TabsContent>
                    ))}
                </div>
            </Tabs>
            <TeamMemberModal
                addMemberOpen={addMemberOpen}
                setAddMemberOpen={setAddMemberOpen}
            />
        </div>
    )
}
