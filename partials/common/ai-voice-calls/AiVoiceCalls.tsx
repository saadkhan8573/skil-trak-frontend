import { ConfigTabs, TabConfig } from '@components/ConfigTabs'
import { Calendar, Users } from 'lucide-react'
import { ScheduledCallsTab, StudentsToCallTab } from './tabs'

export const AiVoiceCalls = () => {

    const tabs: TabConfig[] = [
        {
            value: 'students',
            label: 'Students to Call',
            icon: Users,
            component: StudentsToCallTab,
            // count: studentsToCallCount?.data?.pagination?.totalItems || 0
        },
        {
            value: 'scheduled',
            label: 'Scheduled Calls',
            icon: Calendar,
            component: ScheduledCallsTab,
            // count: scheduledCallsCount?.data?.pagination?.totalItems || 0
        },
    ]

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Voice Calls</h1>
                <p className="text-sm text-gray-500">Manage student communications and scheduled automated calls.</p>
            </div>

            <ConfigTabs
                tabs={tabs}
                defaultValue="students"
                tabsClasses="!mb-6 !py-1 !rounded"
                tabsTriggerClasses='!py-1 !rounded'
            />
        </div>
    )
}
