import { RequiredPlacementDocuments } from '../RequiredPlacementDocuments'
import { EligibleWpTypes } from '../egilible-wp-types'
import { SupervisorRequirements } from '../supervision-requirements'
import { AIDifferences } from './AIDifferences'
import { AIHighlightedTasks } from './AIHighlightedTasks'
import { AdminPlacementRequirements } from './AdminPlacementRequirements'
import { CourseStreams } from './CourseStreams'
import { RtoPlacementRequirements } from './RtoPlacementRequirements'

export const PlacementRequirementsConfiguration = ({ course }: any) => {
    return (
        <div className="space-y-4">
            <RequiredPlacementDocuments course={course} />
            <CourseStreams course={course} />
            {/* <LogbookSummaryDisplay course={course} /> */}
            {/* TGA Admin Placement Requirements */}
            <AdminPlacementRequirements course={course} />
            {/* RTO Placement Requirements */}
            <RtoPlacementRequirements course={course} />
            {/* AI Differences */}
            <AIDifferences course={course} />
            {/* AI-Extracted Highlighted Tasks */}
            <AIHighlightedTasks course={course} />
            <EligibleWpTypes courseId={course?.id} />
            <SupervisorRequirements course={course} />
        </div>
    )
}
