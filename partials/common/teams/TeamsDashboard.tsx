import { ConfigTabs, TabConfig } from '@components/ConfigTabs'
import { CommonApi } from '@queries'
import { Briefcase, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { TeamsHeader, TeamsStatsCard } from './components'
import { TeamMemberModal } from './modals'
import { AllTeamsTab, TeamSetupGuideTab } from './teams-tabs'

export const TeamsDashboard = () => {
    const [addMemberOpen, setAddMemberOpen] = useState(false)

    const { data } = CommonApi.Teams.useTeamCounts()
    const TAB_LIST: TabConfig[] = [
        {
            label: 'Quick Start Guide',
            value: 'setup',
            icon: Sparkles,
            component: TeamSetupGuideTab,
        },
        {
            label: 'All Teams',
            value: 'teams',
            icon: Briefcase,
            count: data?.team ?? 0,
            component: AllTeamsTab,
        },
    ]

    return (
        <div className="space-y-4 p-4">
            <TeamsHeader setAddMemberOpen={setAddMemberOpen} />
            <TeamsStatsCard data={data} />

            {/* Tabs */}
            <div className="border border-border/50 rounded-2xl p-4 shadow-premium-lg bg-white">
                <ConfigTabs
                    tabs={TAB_LIST}
                    defaultValue="teams"
                    props={{ setAddMemberOpen }}
                    tabsClasses="bg-white border-border/60 shadow-premium-lg p-1 rounded-xl grid grid-cols-2 gap-2"
                    tabsTriggerClasses="data-[state=active]:bg-primaryNew data-[state=active]:text-white data-[state=active]:shadow-premium rounded-lg py-2 transition-all hover:bg-muted/50 border border-border/60"
                />
            </div>
            <TeamMemberModal
                addMemberOpen={addMemberOpen}
                setAddMemberOpen={setAddMemberOpen}
            />
        </div>
    )
}
