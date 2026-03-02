import { Button, Typography } from '@components'
import { IWorkplaceIndustries } from '@redux/queryTypes'
import { WorkplaceCurrentStatus } from '@utils'
import { Plus, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { StudentOverviewSkeleton } from '../../skeletonLoader'
import { ApplyWorkplaceOverview } from './components'
import { PlacementRequest, WorkplaceOverviewCard } from './components/updated'

export const StudentOverViewUpdated = ({
    sortedWorkplaces,
    isLoading,
}: {
    sortedWorkplaces: IWorkplaceIndustries[]
    isLoading?: boolean
}) => {
    // State for toggling Quick Actions sections
    const [addNewWorkplace, setAddNewWorkplace] = useState(false)

    const terminalStatuses = [
        WorkplaceCurrentStatus.Completed,
        WorkplaceCurrentStatus.Cancelled,
    ]

    const activeWorkplaces = useMemo(() => {
        return (
            sortedWorkplaces?.filter(
                (wp) => !terminalStatuses.includes(wp?.currentStatus)
            ) || []
        )
    }, [sortedWorkplaces])

    const nonActiveWorkplaces = useMemo(() => {
        return (
            sortedWorkplaces?.filter((wp) =>
                terminalStatuses.includes(wp?.currentStatus)
            ) || []
        )
    }, [sortedWorkplaces])

    return (
        <div className="space-y-3">
            {isLoading ? (
                <StudentOverviewSkeleton />
            ) : (
                <>
                    {true && (
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primaryNew/10 rounded-lg">
                                    <Sparkles className="w-4 h-4 text-primaryNew" />
                                </div>
                                <div>
                                    <Typography
                                        variant="small"
                                        className="font-medium text-slate-900"
                                    >
                                        Need another placement?
                                    </Typography>
                                    <Typography
                                        variant="small"
                                        className="text-slate-500 text-[11px]"
                                    >
                                        Create a new workplace request to start
                                        a new journey.
                                    </Typography>
                                </div>
                            </div>
                            <Button
                                variant="primaryNew"
                                onClick={() => setAddNewWorkplace(true)}
                                className="h-8"
                            >
                                <Plus className="w-3.5 h-3.5 mr-1.5" />
                                Create Workplace
                            </Button>
                        </div>
                    )}
                    {!addNewWorkplace &&
                    activeWorkplaces &&
                    activeWorkplaces?.length > 0 ? (
                        activeWorkplaces?.map((workplace, index) => (
                            <WorkplaceOverviewCard
                                key={workplace.id}
                                index={index}
                                workplace={workplace}
                                setAddNewWorkplace={setAddNewWorkplace}
                            />
                        ))
                    ) : addNewWorkplace ? (
                        <ApplyWorkplaceOverview
                            firstWorkplace={
                                activeWorkplaces?.[0] as IWorkplaceIndustries
                            }
                            handleAddNewWorkplace={() =>
                                setAddNewWorkplace(false)
                            }
                        />
                    ) : (
                        <ApplyWorkplaceOverview
                            firstWorkplace={null}
                            handleAddNewWorkplace={() => {}}
                        />
                    )}
                    {!addNewWorkplace && (
                        <PlacementRequest
                            nonActiveWorkplaces={nonActiveWorkplaces}
                        />
                    )}
                </>
            )}
        </div>
    )
}
