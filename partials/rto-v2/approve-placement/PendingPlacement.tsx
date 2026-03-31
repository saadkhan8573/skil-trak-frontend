import { ConfigTabs, TabConfig } from '@components'
import { RtoApi } from '@queries'
import { ClipboardCheck, FileSignature } from 'lucide-react'
import { useState } from 'react'
import { ReadyForApprovalPlacement } from './ReadyForApprovalPlacement'
import { Schedule4Pending } from './Schedule4Pending'

export const PendingPlacement = () => {
    const [subTab, setSubTab] = useState('ready_for_approval')
    const count = RtoApi.Workplace.wpApprovalRequestCount()

    const tabs: TabConfig[] = [
        {
            value: 'ready_for_approval',
            label: 'Ready for Approval',
            icon: ClipboardCheck,
            count: count?.data?.ready_for_approval || 0,
            component: ReadyForApprovalPlacement,
        },
        {
            value: 'schedule_4_pending',
            label: 'Schedule 4 Pending',
            icon: FileSignature,
            count: count?.data?.pending_s4 || 0,
            component: Schedule4Pending,
        },
    ]

    return (
        <div className="space-y-4 animate-fade-in">
            <ConfigTabs tabs={tabs} value={subTab} onValueChange={setSubTab} />
        </div>
    )
}
