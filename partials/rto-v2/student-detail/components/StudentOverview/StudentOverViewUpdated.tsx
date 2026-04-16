import { Plus, Sparkles } from 'lucide-react'
import { useAppDispatch } from '@redux/hooks'
import { setSelectedWorkplace } from '@redux'
import { WorkplaceCurrentStatus } from '@utils'
import { Button, Typography } from '@components'
import { useMemo, useState, useEffect } from 'react'
import { ApplyWorkplaceOverview } from './components'
import { IWorkplaceIndustries } from '@redux/queryTypes'
import { StudentOverviewSkeleton } from '../../skeletonLoader'
import { PlacementRequest, WorkplaceOverviewCard } from './components/updated'

export const StudentOverViewUpdated = ({
    isLoading,
    sortedWorkplaces,
}: {
    isLoading?: boolean
    sortedWorkplaces: IWorkplaceIndustries[]
}) => {
    const dispatch = useAppDispatch()

    const [addNewWorkplace, setAddNewWorkplace] = useState(false)

    const terminalStatuses = [
        WorkplaceCurrentStatus.Completed,
        WorkplaceCurrentStatus.Cancelled,
        WorkplaceCurrentStatus.Rejected,
        WorkplaceCurrentStatus.RejectedByStudent,
        WorkplaceCurrentStatus.RejectedByIndustry,
        WorkplaceCurrentStatus.RejectedByRto,
        WorkplaceCurrentStatus.NoResponse,
        WorkplaceCurrentStatus.Terminated,
    ]

    // Active in-progress statuses — from request generated through to before agreement signed
    const activeInProgressStatuses = [
        WorkplaceCurrentStatus.Applied,
        WorkplaceCurrentStatus.CaseOfficerAssigned,
        WorkplaceCurrentStatus.Interview,
        WorkplaceCurrentStatus.IndustryEligibility,
        WorkplaceCurrentStatus.AwaitingWorkplaceResponse,
        WorkplaceCurrentStatus.AwaitingStudentResponse,
        WorkplaceCurrentStatus.AwaitingRtoResponse,
        WorkplaceCurrentStatus.AppointmentBooked,
        WorkplaceCurrentStatus.AwaitingAgreementSigned,
        WorkplaceCurrentStatus.AgreementSigned,
    ]

    const activeWorkplaces = useMemo(() => {
        const inProgress =
            sortedWorkplaces?.filter(
                (wp) => !terminalStatuses.includes(wp?.currentStatus)
            ) || []

        if (inProgress.length > 0) {
            return inProgress
        }

        const completed =
            sortedWorkplaces?.filter(
                (wp) => wp?.currentStatus === WorkplaceCurrentStatus.Completed
            ) || []

        if (completed.length > 0) {
            return completed
        }

        const terminated =
            sortedWorkplaces?.filter(
                (wp) => wp?.currentStatus === WorkplaceCurrentStatus.Terminated
            ) || []

        if (terminated.length > 0) {
            return terminated.slice(0, 1)
        }

        return (
            sortedWorkplaces
                ?.filter(
                    (wp) =>
                        wp?.currentStatus === WorkplaceCurrentStatus.Cancelled
                )
                .slice(0, 1) || []
        )
    }, [sortedWorkplaces, terminalStatuses])

    const nonActiveWorkplaces = useMemo(() => {
        const activeIds = activeWorkplaces?.map((wp) => wp.id) || []
        return (
            sortedWorkplaces?.filter(
                (wp) =>
                    terminalStatuses.includes(wp?.currentStatus) &&
                    !activeIds.includes(wp.id)
            ) || []
        )
    }, [sortedWorkplaces, terminalStatuses, activeWorkplaces])

    // Show create button only when no workplace is currently in an active/in-progress state
    const canCreateNewWorkplace = useMemo(() => {
        return !sortedWorkplaces?.some((wp) =>
            activeInProgressStatuses.includes(wp?.currentStatus)
        )
    }, [sortedWorkplaces])

    useEffect(() => {
        const activeWorkplace = sortedWorkplaces?.find((wp) =>
            activeInProgressStatuses.includes(wp?.currentStatus)
        )
        if (activeWorkplace) {
            dispatch(setSelectedWorkplace(activeWorkplace))
        }
    }, [sortedWorkplaces, dispatch])

    return (
        <div className="space-y-3">
            {isLoading ? (
                <StudentOverviewSkeleton />
            ) : (
                <>
                    {canCreateNewWorkplace && !addNewWorkplace && (
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
                                        Want to generate a workplace request?
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
