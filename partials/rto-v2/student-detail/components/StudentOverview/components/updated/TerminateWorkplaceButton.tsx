import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { TerminateWorkplaceRequestModal } from '../../../AllWorkplaces/modals/TerminateWorkplaceRequestModal'

interface TerminateWorkplaceButtonProps {
    workplaceId: number
    isTerminated?: boolean
    isCancelled?: boolean
}

export const TerminateWorkplaceButton = ({
    workplaceId,
    isTerminated,
    isCancelled,
}: TerminateWorkplaceButtonProps) => {
    const [showModal, setShowModal] = useState(false)

    const isDisabled = isTerminated || isCancelled

    return (
        <>
            <div className="h-3 w-px bg-slate-300"></div>
            <button
                disabled={isDisabled}
                onClick={() => setShowModal(true)}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${
                    isDisabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                }`}
            >
                <AlertTriangle className="w-3 h-3" />
                <span className="font-medium text-[10px]">
                    {isTerminated
                        ? 'Terminated'
                        : isCancelled
                          ? 'Cancelled'
                          : 'Terminate'}
                </span>
            </button>

            <TerminateWorkplaceRequestModal
                open={showModal}
                onOpenChange={setShowModal}
                workplaceId={workplaceId}
            />
        </>
    )
}
