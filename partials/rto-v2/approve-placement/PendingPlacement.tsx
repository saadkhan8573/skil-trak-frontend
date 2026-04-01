import { ConfigTabs, TabConfig } from '@components'
import { RtoApi } from '@queries'
import { ClipboardCheck, FileSignature } from 'lucide-react'
import { useState } from 'react'
import { ReadyForApprovalPlacement } from './ReadyForApprovalPlacement'
import { RtoFacilityChecklistPending } from './RtoFacilityChecklistPending'

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
            value: 'rto_facility_checklist_pending',
            label: 'Rto Facility Checklist Pending',
            icon: FileSignature,
            count: count?.data?.pending_s4 || 0,
            component: RtoFacilityChecklistPending,
        },
    ]

    return (
        <div className="space-y-4 animate-fade-in">
            <ConfigTabs tabs={tabs} value={subTab} onValueChange={setSubTab} />
        </div>
    )
}
