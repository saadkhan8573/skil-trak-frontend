import { useState } from 'react'
import { ActionModal } from './ActionModal'

// components
import { useShowErrorNotification } from '@components'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'

// query
import { SubAdminApi } from '@queries'
import { FaGraduationCap } from 'react-icons/fa'
import { HiCheckBadge } from 'react-icons/hi2'

// hooks
import { useNotification } from '@hooks'
import { useAppDispatch } from '@redux/hooks'
import { InterviewAvailability } from '@partials/rto-v2/industry-detail'

export const ApproveRequestModal = ({
    onCancel,
    workplaceId,
}: {
    workplaceId: number
    onCancel: () => void
}) => {
    const { notification } = useNotification()
    const dispatch = useAppDispatch()
    const showErrorNotifications = useShowErrorNotification()
    const [showAvailabilityModal, setShowAvailabilityModal] = useState(false)

    const [updateStatus, updateStatusResult] =
        SubAdminApi.Workplace.updateWpIndustryStatus()

    const handleApprove = async () => {
        try {
            await updateStatus({
                id: Number(workplaceId),
                status: 'accept',
            }).unwrap()

            notification.success({
                title: 'Workplace Approved',
                description: 'Workplace Approved Successfully',
            })
            onCancel()
        } catch (error: any) {
            const errorData = error?.data
            const errorMessage = errorData?.message || errorData?.messaage

            if (
                errorMessage?.includes('No interview availability found') ||
                errorData?.type === 'INTERVIEW_AVAILABILITY_MISSING'
            ) {
                showErrorNotifications({ isError: true, error })
                setShowAvailabilityModal(true)
                return
            }

            // Show other errors
            showErrorNotifications({ isError: true, error })
        }
    }

    return (
        <div>
            <ActionModal
                Icon={HiCheckBadge}
                variant={'primary'}
                title={'Are you sure'}
                subtitle={'You want to Approve this workplace'}
                onCancel={onCancel}
                onConfirm={handleApprove}
                loading={updateStatusResult?.isLoading}
            />

            <Dialog
                open={showAvailabilityModal}
                onOpenChange={setShowAvailabilityModal}
            >
                <DialogContent className="max-w-3xl! max-h-[90vh] bg-[#F8FAFC] border-none shadow-2xl p-0 flex flex-col">
                    <DialogHeader className="bg-primaryNew p-6 border-b border-white/10 rounded-t-lg `flex-shrink-0`">
                        <DialogTitle className="text-xl font-bold text-white flex items-center gap-3">
                            <FaGraduationCap className="w-6 h-6 opacity-80" />
                            Setup Interview Availability
                        </DialogTitle>
                        <p className="text-white/70 text-sm mt-1">
                            Please set up interview availability to proceed with
                            approval
                        </p>
                    </DialogHeader>

                    <div className="p-6 overflow-y-auto flex-1">
                        <InterviewAvailability
                            isTemporary
                            workplaceId={workplaceId}
                            onSuccess={() => {
                                setShowAvailabilityModal(false)
                                // Retry the approval after setting availability
                                handleApprove()
                            }}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
