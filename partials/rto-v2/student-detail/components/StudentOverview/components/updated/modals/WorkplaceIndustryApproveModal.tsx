import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@components/ui/dialog'
import { Button, ShowErrorNotifications } from '@components'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { SubAdminApi } from '@queries'
import { WpAppRequEnum } from '@partials/rto/wpApprovalReq/enum'
import { useNotification } from '@hooks'
import { useAppDispatch } from '@redux/hooks'
import { setIndustryDetail } from '@redux/slice/industry.slice'
import { FaGraduationCap } from 'react-icons/fa'
import { InterviewAvailability } from '@partials/rto-v2/industry-detail'
import {
    IWorkplaceIndustries,
    WorkplaceWorkIndustriesType,
} from '@redux/queryTypes'

interface WorkplaceIndustryApproveModalProps {
    isOpen: boolean
    onClose: () => void
    workplace: IWorkplaceIndustries
    workIndustry: WorkplaceWorkIndustriesType
}

export function WorkplaceIndustryApproveModal({
    isOpen,
    onClose,
    workplace,
    workIndustry,
}: WorkplaceIndustryApproveModalProps) {
    const { notification } = useNotification()
    const dispatch = useAppDispatch()
    const [showAvailabilityModal, setShowAvailabilityModal] = useState(false)
    const [changeStatus, changeStatusResult] =
        SubAdminApi.Workplace.updateWpIndustryStatus()

    const handleConfirm = async () => {
        if (!workplace?.id) return

        // Send industry detail to slice initially
        if (workIndustry?.industry) {
            dispatch(setIndustryDetail(workIndustry.industry))
        }

        try {
            const res: any = await changeStatus({
                id: workplace.id,
                status: WpAppRequEnum.ACCEPT,
            }).unwrap()

            if (res) {
                notification.success({
                    title: 'Approved',
                    description: 'Placement approved successfully.',
                })
                onClose()
            }
        } catch (error: any) {
            const errorData = error?.data
            const errorMessage = errorData?.message || errorData?.messaage

            if (
                errorMessage?.includes('No interview availability found') ||
                errorData?.type === 'INTERVIEW_AVAILABILITY_MISSING'
            ) {
                setShowAvailabilityModal(true)
                return
            }

            notification.error({
                title: 'Error',
                description: 'Failed to approve placement.',
            })
        }
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <ShowErrorNotifications result={changeStatusResult} />
                <DialogContent className="max-w-lg p-0 overflow-hidden border-none rounded-2xl">
                    <DialogHeader className="relative bg-linear-to-r from-green-500 to-green-600 px-6 py-4 rounded-t-2xl overflow-hidden space-y-0">
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
                        <div className="relative flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left">
                                <DialogTitle className="text-xl font-bold text-white">
                                    Approve Placement Request
                                </DialogTitle>
                                <p className="text-green-100 text-sm mt-0.5">
                                    This action requires confirmation
                                </p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="px-6 space-y-4">
                        <div className="bg-linear-to-br from-amber-50 to-orange-50 border-l-4 border-orange-400 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-orange-400 flex items-center justify-center shrink-0">
                                    <AlertTriangle className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-orange-900 mb-1">
                                        Important Notice
                                    </h4>
                                    <p className="text-xs text-orange-800 leading-relaxed">
                                        By approving this placement request:
                                    </p>
                                    <ul className="mt-2 space-y-1 text-xs text-orange-800">
                                        <li className="flex items-start gap-2">
                                            <span className="text-orange-500 mt-0.5">
                                                •
                                            </span>
                                            <span>
                                                The workplace will be{' '}
                                                <strong>
                                                    added to student account
                                                </strong>
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-orange-500 mt-0.5">
                                                •
                                            </span>
                                            <span>
                                                This action{' '}
                                                <strong>
                                                    cannot be undone
                                                </strong>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="px-6 py-4 bg-slate-50 rounded-b-2xl flex items-center justify-end gap-2 border-t border-slate-200">
                        <Button
                            outline
                            onClick={onClose}
                            disabled={changeStatusResult?.isLoading}
                            className="px-4 py-2 text-sm border-slate-300 hover:bg-slate-100"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={changeStatusResult?.isLoading}
                            className={`px-4 py-2 text-sm bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${changeStatusResult?.isLoading ? 'cursor-wait' : ''}`}
                        >
                            {changeStatusResult?.isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                    Approving...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Confirm Approval
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={showAvailabilityModal}
                onOpenChange={setShowAvailabilityModal}
            >
                <DialogContent className="max-w-3xl! max-h-[90vh] bg-[#F8FAFC] border-none shadow-2xl p-0 flex flex-col overflow-hidden">
                    <DialogHeader className="bg-primaryNew p-6 border-b border-white/10 rounded-t-lg shrink-0">
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
                            workplaceId={workplace?.id}
                            onSuccess={() => {
                                setShowAvailabilityModal(false)
                                // Retry the approval after setting availability
                                handleConfirm()
                            }}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
