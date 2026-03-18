import { AlertTriangle } from 'lucide-react'
import { IWorkplaceIndustries } from '@redux/queryTypes'
import { WorkplaceCurrentStatus } from '@utils'

interface WorkplaceTerminationBannerProps {
    workplace: IWorkplaceIndustries
}

export const WorkplaceTerminationBanner = ({
    workplace,
}: WorkplaceTerminationBannerProps) => {
    const isTerminated = workplace?.isTerminated
    const isActuallyTerminated =
        workplace?.currentStatus === WorkplaceCurrentStatus.Terminated

    if (!isTerminated) return null

    const reason = workplace?.terminationComment

    return (
        <div className="flex bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5 mr-2" />
            <div className="flex flex-col gap-1 w-full text-left">
                <p className="text-xs text-red-800">
                    <span className="font-semibold">
                        {isActuallyTerminated
                            ? 'Workplace Terminated'
                            : 'Termination Pending'}
                    </span>
                    {' — '}
                    {isActuallyTerminated
                        ? 'This placement has been terminated and is no longer active.'
                        : 'A termination request has been sent to Admin for approval.'}
                </p>
                {reason && (
                    <p className="text-xs text-red-700 bg-red-100/50 p-1.5 rounded-md border border-red-100/50 italic wrap-break-word">
                        <span className="font-medium not-italic">Reason:</span>{' '}
                        {reason}
                    </p>
                )}
            </div>
        </div>
    )
}
