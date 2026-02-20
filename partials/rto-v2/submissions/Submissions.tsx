import { ConfigTabs, TabConfig } from '@components'
import { FileText } from 'lucide-react'
import { RtoApi } from '@queries'
import { ActionRequiredHeader } from '../components'
import { ReviewCompleted } from './ReviewCompleted'
import { SubmissionsRequiringReview } from './SubmissionsRequiringReview'

export const Submissions = () => {
    const count = RtoApi.Submissions.getRtoSubmissionsCount()

    const tabs: TabConfig[] = [
        {
            value: 'submissions-requiring-review',
            label: 'Submissions Requiring Review',
            count: count.data?.pending || 0,
            component: SubmissionsRequiringReview,
        },
        {
            value: 'review-completed',
            label: 'Review Completed',
            count: count.data?.competent || 0,
            component: ReviewCompleted,
        },
    ]

    return (
        <div>
            <ActionRequiredHeader
                icon={FileText}
                title="Student Submissions"
                description="Review placement completion reports and assessment portfolios"
                urgentCount={count.data?.pending}
                urgentLabel="Pending"
                warningMessage="<strong>Action Required:</strong> Student submissions contain placement completion reports and assessment evidence that require coordinator review and approval before final grades can be assigned."
                gradientFrom="primary"
                gradientTo="primaryNew"
                iconGradient="from-primary to-primary-light"
            />

            <ConfigTabs
                tabs={tabs}
                defaultValue="submissions-requiring-review"
            />
        </div>
    )
}
