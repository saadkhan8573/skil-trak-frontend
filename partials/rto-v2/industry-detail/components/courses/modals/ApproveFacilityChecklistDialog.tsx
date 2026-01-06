import {
    Button,
    ShowErrorNotifications,
    useShowErrorNotification,
} from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { useNotification } from '@hooks'
import { RtoV2Api } from '@queries'
import { IndustryCourseApproval } from '@types'
import { AlertCircle, CheckCircle, FileCheck } from 'lucide-react'
import moment from 'moment'
import { FacilityChecklistActions } from '../FacilityChecklistActions'
import { AddSupervisorDialog } from './AddSupervisorDialog'
import { AddIndustryProgramModal } from '@partials/common/IndustryProfileDetail/components/CourseManagement/modal'
import { useState } from 'react'
import { useAppSelector } from '@redux/hooks'
import { ViewDocumentModal } from './ViewDocumentModal'
import { AdminApi, IndustryApi } from '@queries'

interface ApproveFacilityChecklistDialogProps {
    open: boolean
    approval: IndustryCourseApproval
    onOpenChange: (open: boolean) => void
}

export function ApproveFacilityChecklistDialog({
    open,
    approval,
    onOpenChange,
}: ApproveFacilityChecklistDialogProps) {
    const [addingSupervisorFor, setAddingSupervisorFor] = useState(false)
    const [addingStreamFor, setAddingStreamFor] = useState(false)

    const { notification } = useNotification()

    const showErrorNotifications = useShowErrorNotification()

    const industryDetail = useAppSelector(
        (state) => state.industry.industryDetail
    )

    const [triggerGetSupervisors, getSupervisorsResult] =
        IndustryApi.Supervisor.useLazyGetSupervisorBySectorQuery()

    const [triggerGetPrograms, getProgramsResult] =
        AdminApi.Industries.useLazyIndustryCourseProgramsListQuery()

    const [triggerGetCoursePrograms, getCourseProgramsResult] =
        AdminApi.Courses.useLazyCourseProgramListQuery()

    const [changeCourseApprovalStatus, changeCourseApprovalStatusResult] =
        RtoV2Api.Industries.statusChangeCourseFacilityChecklist()

    const approveCourse = async () => {
        try {
            const res: any = await changeCourseApprovalStatus({
                id: approval.id,
                status: 'approved',
            })
            if (res?.error) {
                showErrorNotifications({ isError: true, ...res })
                return
            }
            if (res?.data) {
                notification.success({
                    title: 'Course Approved',
                    description: 'Course Approved Successfully!',
                })
                onOpenChange(false)
            }
        } catch (error) {
            console.log({ error })
            notification.success({
                title: 'Course Approved',
                description: 'Course Approved Successfully!',
            })
            console.error('Approval Error:', error)
        }
    }

    const checkStreams = async () => {
        // First check if the course has any programs defined globally
        const courseRes: any = await triggerGetCoursePrograms({
            id: approval?.course?.id,
            limit: 100,
            skip: 0,
        })

        // If course has no programs defined, skip the industry program check
        if (!courseRes?.data?.data?.length) {
            await approveCourse()
            return
        }

        // If course has programs, check if industry has added at least one
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

    const handleApprove = async () => {
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

    const handleReject = async () => {
        try {
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
        } catch (error) {
            console.error('Rejection Error:', error)
        }
    }

    return (
        <>
            <ShowErrorNotifications result={changeCourseApprovalStatusResult} />
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#044866] to-[#0D5468] rounded-xl flex items-center justify-center">
                                <FileCheck className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg">
                                    Review Facility Checklist
                                </DialogTitle>
                                <DialogDescription className="text-xs">
                                    {approval.course.code} -{' '}
                                    {approval.course.title}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Status Banner */}
                        <div className="bg-gradient-to-r from-[#10B981]/10 to-[#059669]/10 border border-[#10B981]/20 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-lg flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-[#10B981] mb-1">
                                        Facility Checklist Signed
                                    </h4>
                                    <p className="text-xs text-[#059669] mb-2">
                                        Industry partner has reviewed and
                                        e-signed the facility checklist on{' '}
                                        {moment(approval.createdAt).fromNow()}
                                    </p>
                                    <p className="text-xs text-[#64748B]">
                                        The document is ready for your review
                                        and approval. Once approved, you'll be
                                        prompted to add supervisor details to
                                        complete the course setup.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Document Preview Section */}
                        <div className="bg-[#F8FAFB] rounded-lg p-4 border border-[#E2E8F0]">
                            <h4 className="text-sm font-bold text-[#1A2332] mb-3">
                                Document Actions
                            </h4>
                            <FacilityChecklistActions
                                fileUrl={approval?.file}
                            />
                        </div>

                        {/* Warning Notice */}
                        <div className="bg-[#FEF3C7] border border-[#F59E0B]/30 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs text-[#92400E] font-medium mb-1">
                                        Important Notice
                                    </p>
                                    <p className="text-xs text-[#92400E]">
                                        By approving this facility checklist,
                                        you confirm that the industry partner's
                                        workplace meets all requirements for
                                        student placements in this course.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 pt-2">
                            <Button
                                onClick={handleApprove}
                                loading={
                                    changeCourseApprovalStatusResult.isLoading ||
                                    getSupervisorsResult.isLoading ||
                                    getProgramsResult.isLoading ||
                                    getCourseProgramsResult.isLoading
                                }
                                disabled={
                                    changeCourseApprovalStatusResult.isLoading ||
                                    getSupervisorsResult.isLoading ||
                                    getProgramsResult.isLoading ||
                                    getCourseProgramsResult.isLoading ||
                                    getSupervisorsResult.isFetching ||
                                    getProgramsResult.isFetching ||
                                    getCourseProgramsResult.isFetching
                                }
                                className="flex-1 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white gap-2 h-10"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Approve Checklist
                            </Button>
                            <Button
                                onClick={handleReject}
                                variant="error"
                                className="flex-1 border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/10 gap-2 h-10"
                            >
                                <AlertCircle className="w-4 h-4" />
                                Reject & Request Changes
                            </Button>
                        </div>
                    </div>
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
                            industry={
                                (approval?.industry || industryDetail) as any
                            }
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
