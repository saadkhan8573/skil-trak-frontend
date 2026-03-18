import { useState } from 'react'
import { X } from 'lucide-react'
import { getUserCredentials } from '@utils'
import { UserRoles } from '@constants'
import {
    CancelWorkplaceModal,
    CancelWorkplaceRequestModal,
} from '../../../AllWorkplaces/modals'

interface CancelWorkplaceButtonProps {
    workplaceId: number
    canCancel: boolean
}

export const CancelWorkplaceButton = ({
    workplaceId,
    canCancel,
}: CancelWorkplaceButtonProps) => {
    const [showAdminCancelModal, setShowAdminCancelModal] = useState(false)
    const [showSubAdminCancelModal, setShowSubAdminCancelModal] =
        useState(false)

    const handleCancelClick = () => {
        if (!canCancel) return
        const role = getUserCredentials()?.role
        if (role === UserRoles.ADMIN) {
            setShowAdminCancelModal(true)
        } else if (role === UserRoles.SUBADMIN) {
            setShowSubAdminCancelModal(true)
        }
    }

    return (
        <>
            <button
                onClick={handleCancelClick}
                disabled={!canCancel}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${
                    !canCancel
                        ? 'text-slate-400 cursor-not-allowed opacity-60'
                        : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                }`}
            >
                <X className="w-3 h-3" />
                <span className="font-medium">Cancel</span>
            </button>

            <CancelWorkplaceModal
                open={showAdminCancelModal}
                onOpenChange={setShowAdminCancelModal}
                workplaceId={workplaceId}
            />

            <CancelWorkplaceRequestModal
                open={showSubAdminCancelModal}
                onOpenChange={setShowSubAdminCancelModal}
                workplaceId={workplaceId}
            />
        </>
    )
}
