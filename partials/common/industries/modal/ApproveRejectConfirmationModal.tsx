import { Button, ShowErrorNotifications } from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { useNotification } from '@hooks'
import { AdminApi, IndustryApi, RtoV2Api } from '@queries'
import { useAppSelector } from '@redux/hooks'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { AddIndustryProgramModal } from '@partials/common/IndustryProfileDetail/components/CourseManagement/modal'
import { AddSupervisorDialog } from '@partials/rto-v2/industry-detail/components/courses/modals/AddSupervisorDialog'

interface ApproveRejectConfirmationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    action: 'approved' | 'rejected'
    approval: any
}

export function ApproveRejectConfirmationModal({
    open,
    onOpenChange,
    action,
    approval,
}: ApproveRejectConfirmationModalProps) {
    const [addingSupervisorFor, setAddingSupervisorFor] = useState(false)
    const [addingStreamFor, setAddingStreamFor] = useState(false)

    const { notification } = useNotification()

    const industryDetail = useAppSelector(
        (state) => state.industry.industryDetail
    )

    const [triggerGetSupervisors, getSupervisorsResult] =
        IndustryApi.Supervisor.useLazyGetSupervisorBySectorQuery()

    const [triggerGetPrograms, getProgramsResult] =
        AdminApi.Industries.useLazyIndustryCourseProgramsListQuery()

    const [changeCourseApprovalStatus, changeCourseApprovalStatusResult] =
        RtoV2Api.Industries.statusChangeCourseFacilityChecklist()

    const approveCourse = async () => {
        const res: any = await changeCourseApprovalStatus({
            id: approval.id,
            status: 'approved',
        })
        if (res?.data) {
            notification.success({
                title: 'Status Changed',
                description: 'Status Changed Successfully to Approved!',
            })
            onOpenChange(false)
        }
    }

    const checkStreams = async () => {
        const programsRes: any = await triggerGetPrograms({
            courseId: approval?.course?.id,
            industryId: approval?.industry?.id || industryDetail?.id!,
        })

        if (!programsRes?.data?.length) {
            notification.info({
                title: 'Stream Required',
                description:
                    'Please add at least one course stream/program before approving the course.',
                dissmissTimer: 8888,
                position: 'topright',
            })
            setAddingStreamFor(true)
            onOpenChange(false)
            return
        }

        await approveCourse()
    }

    const handleConfirm = async () => {
        if (action === 'rejected') {
            const res: any = await changeCourseApprovalStatus({
                id: approval.id,
                status: 'rejected',
            })
            if (res?.data) {
                notification.success({
                    title: 'Status Changed',
                    description: 'Status Changed Successfully to Rejected!',
                })
                onOpenChange(false)
            }
            return
        }

        // Sequential Check for Approval
        const supervisorRes: any = await triggerGetSupervisors({
            indId: approval?.industry?.id || industryDetail?.id!,
            sectorId: approval?.course?.sector?.id,
        })

        if (!supervisorRes?.data?.length) {
            notification.info({
                title: 'Supervisor Required',
                description:
                    'Please add at least one supervisor before approving the course.',
                dissmissTimer: 8888,
                position: 'topright',
            })
            setAddingSupervisorFor(true)
            onOpenChange(false)
            return
        }

        await checkStreams()
    }

    return (
        <>
            <ShowErrorNotifications result={changeCourseApprovalStatusResult} />
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {action === 'approved' ? (
                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-red-500" />
                            )}
                            Confirm {action === 'approved' ? 'Approval' : 'Rejection'}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-500">
                            Are you sure you want to {action} this course approval request?
                            {action === 'rejected' && " This will notify the industry partner."}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2 flex justify-end">
                        <Button
                            variant="secondary"
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800"
                            onClick={() => onOpenChange(false)}
                            disabled={changeCourseApprovalStatusResult.isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={action === 'approved' ? 'success' : 'error'}
                            onClick={handleConfirm}
                            loading={
                                changeCourseApprovalStatusResult.isLoading ||
                                (action === 'approved' &&
                                    (getSupervisorsResult.isLoading ||
                                        getProgramsResult.isLoading))
                            }
                            disabled={
                                changeCourseApprovalStatusResult.isLoading ||
                                (action === 'approved' &&
                                    (getSupervisorsResult.isLoading ||
                                        getProgramsResult.isLoading ||
                                        getSupervisorsResult.isFetching ||
                                        getProgramsResult.isFetching))
                            }
                        >
                            Confirm {action === 'approved' ? 'Approve' : 'Reject'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {!open && (
                <>
                    <AddSupervisorDialog
                        course={approval?.course}
                        open={addingSupervisorFor}
                        onOpenChange={setAddingSupervisorFor}
                        onSuccess={() => {
                            setAddingSupervisorFor(false)
                            onOpenChange(true)
                        }}
                        sectorId={approval?.course?.sector?.id || null}
                    />

                    {addingStreamFor && (
                        <AddIndustryProgramModal
                            approval={approval}
                            industry={(approval?.industry || industryDetail) as any}
                            onCancel={() => setAddingStreamFor(false)}
                            onSuccess={() => {
                                setAddingStreamFor(false)
                                onOpenChange(true)
                            }}
                        />
                    )}
                </>
            )}
        </>
    )
}
