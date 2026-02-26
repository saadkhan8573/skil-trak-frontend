import React, { useState } from 'react'
import {
    CourseOverview,
    CourseProgress,
    HighlightedTasks,
    PlacementRequest,
    PlacementRequirements,
    QuickActions,
    WorkplaceBio,
    WorkplaceTypes,
} from './components/updated'
import { getCourseById } from './components/updated/data'

export const StudentOverViewUpdated = () => {
    // State for selected course
    const [selectedCourseId, setSelectedCourseId] = useState('CHC33021')
    // State for toggling Quick Actions sections
    const [showWorkplaceTypes, setShowWorkplaceTypes] = useState(false)
    const [showPlacementRequirements, setShowPlacementRequirements] =
        useState(false)
    const [showHighlightedTasks, setShowHighlightedTasks] = useState(false)

    // Get current course data
    const currentCourse = getCourseById(selectedCourseId)
    const placementStatus =
        currentCourse?.currentStatus?.stage || 'No Active Placement'
    return (
        <div>
            <QuickActions
                showWorkplaceTypes={showWorkplaceTypes}
                setShowWorkplaceTypes={setShowWorkplaceTypes}
                showPlacementRequirements={showPlacementRequirements}
                setShowPlacementRequirements={setShowPlacementRequirements}
                showHighlightedTasks={showHighlightedTasks}
                setShowHighlightedTasks={setShowHighlightedTasks}
            />
            {showHighlightedTasks && <HighlightedTasks />}
            {showWorkplaceTypes && <WorkplaceTypes />}
            {showPlacementRequirements && (
                <PlacementRequirements selectedCourseId={selectedCourseId} />
            )}
            <CourseProgress selectedCourseId={selectedCourseId} />
            <WorkplaceBio selectedCourseId={selectedCourseId} />
            <PlacementRequest selectedCourseId={selectedCourseId} />
        </div>
    )
}
