import { Card, ConfigTabs, TabConfig } from '@components'
import { RtoApi } from '@queries'
import { FileText, School } from 'lucide-react'
import { ActionRequiredHeader, Title } from '../components'
import { ApprovedPlacement } from './ApprovedPlacement'
import { PendingPlacement } from './PendingPlacement'
import { RejectedPlacement } from './RejectedPlacement'

export const RtoWpApprovalPlacements = () => {
    const count = RtoApi.Workplace.wpApprovalRequestCount()

    const tabs: TabConfig[] = [
        {
            value: 'pending',
            label: 'Pending',
            count: count?.data?.pending || 0,
            component: PendingPlacement,
        },
        {
            value: 'approved',
            label: 'Approved',
            count: count?.data?.approved || 0,
            component: ApprovedPlacement,
        },
        {
            value: 'rejected',
            label: 'Rejected',
            count: count?.data?.rejected || 0,
            component: RejectedPlacement,
        },
    ]

    return (
        <div className="space-y-4">
            <ActionRequiredHeader
                icon={School}
                title="Placement Approvals"
                description="Review student-approved placements and verify workplace eligibility"
                urgentCount={count?.data?.pending || 0}
                urgentLabel="Waiting For RTO Approval"
                warningMessage="<strong>Your Task:</strong> Students have already approved these placements. Review workplace eligibility and course requirements before sending to industry for interview arrangement."
                gradientFrom="primaryNew"
                gradientTo="primaryNew"
                iconGradient="from-primaryNew to-primaryNew"
            />

            <Card
                noPadding
                className="border border-border/50 shadow-premium-lg"
            >
                <div className="border-b p-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <Title
                            Icon={FileText}
                            title="Placement Management"
                            description="View, filter, and manage all placement requests"
                        />
                    </div>
                </div>

                <div>
                    <ConfigTabs tabs={tabs} defaultValue="pending" />
                </div>
            </Card>
        </div>
    )
}
