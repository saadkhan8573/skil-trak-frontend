import {
    ListHeader,
    CategoryFilters,
    StatsOverview,
    StudentsList,
    WaitingStudents,
} from './components'

import { ConfigTabs, TabConfig } from '@components'
import { Users, Clock } from 'lucide-react'
import { useState } from 'react'

export function StudentsPlacementList() {
    const [activeTab, setActiveTab] = useState<string>('all')

    const AllStudents = () => (
        <div className="space-y-4">
            <ListHeader />
            <CategoryFilters />
            <StatsOverview />
            <StudentsList />
        </div>
    )
    const WaitingStudentsWrapper = () => <WaitingStudents />

    const tabs: TabConfig[] = [
        {
            value: 'all',
            label: 'All Students',
            icon: Users,
            component: AllStudents,
        },
        {
            value: 'waiting_for_industry',
            label: 'Waiting for Industry',
            icon: Clock,
            component: WaitingStudentsWrapper,
        },
    ]

    return (
        <div className="space-y-4 px-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 pt-3">
                    <ConfigTabs
                        tabs={tabs}
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="!p-1 !bg-slate-100 !rounded-lg w-full"
                        tabsClasses="!p-1.5 !rounded-md"
                        tabsTriggerClasses="!py-1.5 !px-4 !text-xs !font-medium"
                    />
                </div>
            </div>
        </div>
    )
}
