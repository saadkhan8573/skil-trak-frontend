import { useState } from 'react'
import { Collapsible, CollapsibleContent } from '@components/ui/collapsible'
import { Card } from '@components'
import { IWorkplaceIndustries } from '@redux/queryTypes'
import {
    CourseProgress,
    HighlightedTasks,
    PlacementRequirements,
    QuickActions,
    WorkplaceBio,
    WorkplaceTypes,
} from './index'

interface WorkplaceOverviewCardProps {
    workplace: IWorkplaceIndustries
    index: number
    setAddNewWorkplace: (val: boolean) => void
}

export const WorkplaceOverviewCard = ({
    workplace,
    index,
    setAddNewWorkplace,
}: WorkplaceOverviewCardProps) => {
    // Local state for toggling sections inside this specific card
    const [showWorkplaceTypes, setShowWorkplaceTypes] = useState(false)
    const [showPlacementRequirements, setShowPlacementRequirements] =
        useState(false)
    const [showHighlightedTasks, setShowHighlightedTasks] = useState(false)

    // Mutual exclusion toggle handlers per card
    const toggleWorkplaceTypes = (val: boolean) => {
        setShowWorkplaceTypes(val)
        if (val) {
            setShowPlacementRequirements(false)
            setShowHighlightedTasks(false)
        }
    }

    const togglePlacementRequirements = (val: boolean) => {
        setShowPlacementRequirements(val)
        if (val) {
            setShowWorkplaceTypes(false)
            setShowHighlightedTasks(false)
        }
    }

    const toggleHighlightedTasks = (val: boolean) => {
        setShowHighlightedTasks(val)
        if (val) {
            setShowWorkplaceTypes(false)
            setShowPlacementRequirements(false)
        }
    }

    return (
        <Card className="space-y-4 border-2! border-gray-400!">
            <QuickActions
                index={index}
                showWorkplaceTypes={showWorkplaceTypes}
                setShowWorkplaceTypes={toggleWorkplaceTypes}
                showPlacementRequirements={showPlacementRequirements}
                setShowPlacementRequirements={togglePlacementRequirements}
                showHighlightedTasks={showHighlightedTasks}
                setShowHighlightedTasks={toggleHighlightedTasks}
            />
            <Collapsible open={showHighlightedTasks}>
                <CollapsibleContent>
                    <HighlightedTasks workplace={workplace} />
                </CollapsibleContent>
            </Collapsible>
            <Collapsible open={showWorkplaceTypes}>
                <CollapsibleContent>
                    <WorkplaceTypes />
                </CollapsibleContent>
            </Collapsible>
            <Collapsible open={showPlacementRequirements}>
                <CollapsibleContent>
                    <PlacementRequirements workplaceId={workplace} />
                </CollapsibleContent>
            </Collapsible>
            <CourseProgress />
            <WorkplaceBio
                workplace={workplace}
                onAddNew={() => setAddNewWorkplace(true)}
            />
        </Card>
    )
}
