import { Activity, useState } from 'react'
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
import { checkJsxVisibility, getUserCredentials, WorkplaceCurrentStatus } from '@utils'
import { WorkplaceCancellationBanner } from './WorkplaceCancellationBanner'

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
    const role = getUserCredentials()?.role

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

    const activeInProgressStatuses = [
        WorkplaceCurrentStatus.AppointmentBooked,
        WorkplaceCurrentStatus.AwaitingAgreementSigned,
        WorkplaceCurrentStatus.AgreementSigned,
        WorkplaceCurrentStatus.PlacementStarted,
        WorkplaceCurrentStatus.Completed,
    ]

    return (
        <Card className="space-y-4 border-2! border-gray-400! relative">
            <QuickActions
                index={index}
                showWorkplaceTypes={showWorkplaceTypes}
                setShowWorkplaceTypes={toggleWorkplaceTypes}
                showPlacementRequirements={showPlacementRequirements}
                setShowPlacementRequirements={togglePlacementRequirements}
                showHighlightedTasks={showHighlightedTasks}
                setShowHighlightedTasks={toggleHighlightedTasks}
            />
            <WorkplaceCancellationBanner workplace={workplace} role={role} />
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
            <Activity
                mode={checkJsxVisibility(
                    activeInProgressStatuses.includes(workplace.currentStatus)
                )}
            >
                <CourseProgress />
            </Activity>
            <WorkplaceBio
                workplace={workplace}
                onAddNew={() => setAddNewWorkplace(true)}
            />
        </Card>
    )
}
