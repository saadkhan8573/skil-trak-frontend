import { Badge, Button, Card, NoData } from '@components'
import { ReRunWPAutomation } from '@partials/common/StudentProfileDetail/components'
import { WPProcessMatchingLoader } from '@partials/common/StudentProfileDetail/components/Workplace/components/IndustryDetail/components/WPProcessMatchingLoader'
import { useWorkplaceHook } from '@partials/common/StudentProfileDetail/components/Workplace/hooks'
import { AgreementModal } from '@partials/rto-v2/placement-request-detail/modal'
import { motion } from 'framer-motion'
import {
    Award,
    Briefcase,
    Building2,
    Calendar,
    CalendarCheck,
    CheckCircle2,
    CheckSquare,
    Clock,
    FileCheck,
    FileSignature,
    FileText,
    Play,
    Shield,
    Sparkles,
    Target,
    User,
    XCircle,
} from 'lucide-react'
import { ReactElement, useState } from 'react'
import {
    needsWorkplaceStagesEnum,
    providedWorkplaceStagesEnum,
} from '../../workplaceStages'

export const PremiumCurrentActionsCard = ({
    isCancelled,
    isPlacementStarted,
    cancellationReason,
    currentStatus,
    setStatusNote,
    appointmentDate,

    setShowScheduleDialog,
    setPendingStatus,
    workplaceType,
    workplace,
    student,
}: any) => {
    const [modal, setModal] = useState<ReactElement | null>(null)
    const [showAppointmentDialog, setShowAppointmentDialog] = useState(false)
    const [showAgreementDialog, setShowAgreementDialog] = useState(false)
    const { autoApplyLoader } = useWorkplaceHook()
    const onCancelClicked = () => setModal(null)
    // const [refresh, refreshResult] = SubAdminApi.Student.rerunAutomation()
    const onReRunAutomation = () => {
        setModal(
            <ReRunWPAutomation
                workplace={workplace}
                onCancel={onCancelClicked}
            />
        )
    }
    const handleAgreementSigned = () => {
        setShowAgreementDialog(true)
        requestStatusChange('Agreement Signed')
    }
    const requestStatusChange = (newStatus: string) => {
        setPendingStatus(newStatus)
        setStatusNote('')
    }

    const handleAppointmentSuccessful = () => {
        requestStatusChange('Agreement Pending')
    }
    const handleCompleteSchedule = () => {
        requestStatusChange('Schedule Completed')
    }

    const handleMarkCompleted = () => {
        requestStatusChange('Completed')
    }

    const getStatusActions = () => {
        // If cancelled or placement started, show appropriate message
        if (isCancelled) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                >
                    <div className="relative overflow-hidden p-6 bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-200/30 rounded-full -mr-16 -mt-16" />
                        <div className="relative flex items-start gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <XCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-red-900 font-semibold text-lg">
                                    Placement Request Cancelled
                                </p>
                                <p className="text-red-700 text-sm mt-2">
                                    This placement request has been cancelled
                                    and no further actions can be performed.
                                </p>
                                <div className="mt-3 p-3 bg-white/60 rounded-lg border border-red-200">
                                    <p className="text-red-800 text-xs font-medium">
                                        Reason:
                                    </p>
                                    <p className="text-red-700 text-sm mt-1">
                                        {cancellationReason}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )
        }

        if (isPlacementStarted) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                >
                    <div className="relative overflow-hidden p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/30 rounded-full -mr-16 -mt-16" />
                        <div className="relative flex items-start gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <Play className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-green-900 font-semibold text-lg">
                                    Placement In Progress
                                </p>
                                <p className="text-green-700 text-sm mt-2">
                                    Student is currently active in their
                                    workplace placement. All setup actions are
                                    complete.
                                </p>
                                <div className="mt-3 flex items-center gap-2">
                                    <Badge
                                        className="bg-green-100 text-green-700 border-green-200"
                                        text="Active Placement"
                                        Icon={Clock}
                                        variant="success"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )
        }
        switch (currentStatus?.stage) {
            case needsWorkplaceStagesEnum.STUDENT_ADDED:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <div className="relative overflow-hidden p-4 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-200/30 rounded-full -mr-16 -mt-16" />
                            <div className="relative flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <User className="h-5 w-5 text-slate-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-slate-900 font-medium">
                                        Student Profile Created
                                    </p>
                                    <p className="text-slate-600 text-sm mt-1">
                                        Select workplace type to begin the
                                        placement process.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* {!workplaceType ? (
                            <div className="space-y-2">
                                <Typography
                                    variant="label"
                                    className="text-slate-700 font-medium"
                                >
                                    Select Workplace Type
                                </Typography>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        outline
                                        variant="secondary"
                                        className="h-auto py-4 flex-col gap-2 border-2 hover:border-[#044866] hover:bg-[#044866]/5"
                                        onClick={() =>
                                            handleSelectWorkplaceType('needs')
                                        }
                                    >
                                        <FileText className="h-6 w-6 text-[#044866]" />
                                        <div className="text-center">
                                            <div className="font-medium text-slate-900">
                                                Student Needs Workplace
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">
                                                Auto-match or manual search
                                            </div>
                                        </div>
                                    </Button>
                                    <Button
                                        outline
                                        variant="secondary"
                                        className="h-auto py-4 flex-col gap-2 border-2 hover:border-[#044866] hover:bg-[#044866]/5"
                                        onClick={() =>
                                            handleSelectWorkplaceType(
                                                'provided'
                                            )
                                        }
                                    >
                                        <Briefcase className="h-6 w-6 text-[#044866]" />
                                        <div className="text-center">
                                            <div className="font-medium text-slate-900">
                                                Provided Workplace
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">
                                                Student has employment
                                            </div>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    <span className="text-emerald-700 text-sm font-medium">
                                        {workplaceType === 'needs'
                                            ? 'Student Needs Workplace'
                                            : 'Provided Workplace'}{' '}
                                        Selected
                                    </span>
                                </div>
                            </div>
                        )} */}
                    </motion.div>
                )

            case needsWorkplaceStagesEnum.REQUEST_GENERATED:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        {/* useWorkplaceHook() */}
                        {workplace?.workplaceApprovaleRequest?.length === 0 ? (
                            <>
                                {autoApplyLoader ? (
                                    <WPProcessMatchingLoader />
                                ) : (
                                    <>
                                        <div className="relative overflow-hidden p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border border-[#044866]/20 rounded-xl">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#044866]/5 rounded-full -mr-16 -mt-16" />
                                            <div className="relative flex items-start gap-3">
                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                    <FileText className="h-5 w-5 text-[#044866]" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[#044866] font-medium">
                                                        Workplace Request
                                                        Created
                                                    </p>
                                                    <p className="text-[#0D5468] text-sm mt-1">
                                                        Choose how to find a
                                                        suitable industry
                                                        placement.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            className="w-full bg-gradient-to-r from-[#044866] via-[#0D5468] to-[#044866] hover:from-[#0D5468] hover:via-[#044866] hover:to-[#0D5468] text-white shadow-xl shadow-[#044866]/30 h-12 font-semibold transition-all duration-500 hover:shadow-2xl hover:shadow-[#044866]/40 hover:-translate-y-0.5"
                                            onClick={onReRunAutomation}
                                        >
                                            <Sparkles className="mr-2 h-5 w-5 animate-pulse" />{' '}
                                            Re-Run Automation
                                        </Button>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                {' '}
                                <div className="relative overflow-hidden p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-[#F7A619]/30 rounded-xl">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#F7A619]/10 rounded-full -mr-16 -mt-16" />
                                    <div className="relative flex items-start gap-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <Clock className="h-5 w-5 text-[#F7A619]" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-amber-900 font-medium">
                                                Request Generated
                                            </p>
                                            <p className="text-amber-600 text-xs mt-1">
                                                Request Generated verify
                                                industry capacity
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                )

            case needsWorkplaceStagesEnum.WAITING_FOR_RTO:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <div className="relative overflow-hidden p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-[#F7A619]/30 rounded-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F7A619]/10 rounded-full -mr-16 -mt-16" />
                            <div className="relative flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Clock className="h-5 w-5 text-[#F7A619]" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-amber-900 font-medium">
                                        Awaiting RTO Approval
                                    </p>
                                    {/* <p className="text-amber-700 text-sm mt-1">
                                        Industry: {selectedIndustry}
                                    </p> */}
                                    <p className="text-amber-600 text-xs mt-1">
                                        Request pending review
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* <Button
                            className="w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-600  shadow-xl shadow-emerald-500/30 h-12 font-semibold transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                            onClick={handleRTOApprove}
                        >
                            <ThumbsUp className="mr-2 h-5 w-5" /> RTO Approve
                        </Button>
                        <Button
                            outline
                            variant="error"
                            className="w-full border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 h-12 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-red-200"
                            onClick={() =>
                                requestStatusChange('Request Generated')
                            }
                            Icon={ThumbsDown}
                            text="RTO Reject"
                        /> */}
                    </motion.div>
                )

            case needsWorkplaceStagesEnum.WAITING_FOR_STUDENT:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <div className="relative overflow-hidden p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-[#044866]/20 rounded-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#044866]/5 rounded-full -mr-16 -mt-16" />
                            <div className="relative flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <User className="h-5 w-5 text-[#044866]" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[#044866] font-medium">
                                        Awaiting Student Approval
                                    </p>
                                    {/* <p className="text-[#0D5468] text-sm mt-1">
                                        Industry:
                                    </p> */}
                                </div>
                            </div>
                        </div>
                        {/* <Button
                            className="w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-600 text-white shadow-xl shadow-emerald-500/30 h-12 font-semibold transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                            onClick={handleStudentApprove}
                        >
                            <ThumbsUp className="mr-2 h-5 w-5" /> Student
                            Approves
                        </Button>
                        <Button
                            outline
                            variant="error"
                            className="w-full border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 h-12 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-red-200"
                            onClick={handleStudentReject}
                            Icon={ThumbsDown}
                            text="Student Rejects"
                        /> */}
                    </motion.div>
                )

            case needsWorkplaceStagesEnum.WAITING_FOR_INDUSTRY:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <div className="relative overflow-hidden p-4 bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-200/30 rounded-full -mr-16 -mt-16" />
                            <div className="relative flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Building2 className="h-5 w-5 text-violet-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-violet-900 font-medium">
                                        Awaiting Industry Confirmation
                                    </p>
                                    {/* <p className="text-violet-700 text-sm mt-1">
                                        Industry: {selectedIndustry}
                                    </p> */}
                                </div>
                            </div>
                        </div>
                        {/* {workplaceType === 'provided' && (
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-amber-900 font-medium text-sm">
                                            Proof of Employment Pending
                                        </p>
                                        <p className="text-amber-700 text-xs mt-1">
                                            Upload required before final
                                            approval
                                        </p>
                                    </div>
                                    <Button
                                        outline
                                        variant="secondary"
                                        className="h-7 text-xs border-amber-300 text-amber-700 hover:bg-amber-100"
                                        onClick={() => {
                                            setShowProofUploadDialog(true)
                                        }}
                                        Icon={Upload}
                                        text="Upload Now"
                                    />
                                </div>
                            </div>
                        )} */}
                        {/* <Button
                            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-lg shadow-emerald-600/20 h-11"
                            onClick={handleIndustryApprove}
                        >
                            <ThumbsUp className="mr-2 h-4 w-4" /> Industry
                            Approves
                        </Button>
                        <Button
                            outline
                            variant="error"
                            className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 h-11"
                            onClick={() => setShowRejectionDialog(true)}
                            Icon={ThumbsDown}
                            text="Industry Rejects"
                        /> */}
                    </motion.div>
                )

            case needsWorkplaceStagesEnum.APPOINTMENT:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <div className="relative overflow-hidden p-4 bg-gradient-to-br from-indigo-50 to-blue-50 border border-[#0D5468]/20 rounded-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0D5468]/5 rounded-full -mr-16 -mt-16" />
                            <div className="relative flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <CalendarCheck className="h-5 w-5 text-[#0D5468]" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[#0D5468] font-medium">
                                        Appointment Stage
                                    </p>
                                    {appointmentDate && (
                                        <p className="text-[#0D5468] text-sm mt-1">
                                            Scheduled: {appointmentDate}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        {!appointmentDate ? (
                            <>
                                {/* <Button
                                    className="w-full bg-gradient-to-r from-[#0D5468] to-[#044866] hover:from-[#044866] hover:to-[#0D5468] text-white shadow-lg shadow-[#0D5468]/20 h-11"
                                    onClick={() =>
                                        setShowAppointmentDialog(true)
                                    }
                                >
                                    <Calendar className="mr-2 h-4 w-4" /> Book
                                    Appointment
                                </Button>
                                <AppointmentBookingModal
                                    isOpen={showAppointmentDialog}
                                    onClose={setShowAppointmentDialog}
                                /> */}
                            </>
                        ) : (
                            <>
                                <Button
                                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-lg shadow-emerald-600/20 h-11"
                                    onClick={handleAppointmentSuccessful}
                                >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />{' '}
                                    Mark Successful
                                </Button>
                                <Button
                                    outline
                                    variant="secondary"
                                    className="w-full border-2 border-slate-200 hover:border-slate-300 h-11"
                                    onClick={() =>
                                        setShowAppointmentDialog(true)
                                    }
                                    Icon={Calendar}
                                    text="Book Appointment"
                                />
                                <Button
                                    outline
                                    variant="secondary"
                                    className="w-full border-2 border-slate-200 hover:border-slate-300 h-11"
                                    onClick={() =>
                                        setShowAppointmentDialog(true)
                                    }
                                    Icon={Calendar}
                                    text="Reschedule"
                                />
                            </>
                        )}
                    </motion.div>
                )

            case needsWorkplaceStagesEnum.AGREEMENT_PENDING:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <div className="relative overflow-hidden p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border border-[#0D5468]/20 rounded-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0D5468]/5 rounded-full -mr-16 -mt-16" />
                            <div className="relative flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <FileSignature className="h-5 w-5 text-[#0D5468]" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[#0D5468] font-medium">
                                        Agreement & Eligibility Pending
                                    </p>
                                    <p className="text-[#0D5468] text-sm mt-1">
                                        Generate or upload placement agreement
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Button
                            className="w-full bg-gradient-to-r from-[#0D5468] to-[#044866] hover:from-[#044866] hover:to-[#0D5468] text-white shadow-lg shadow-[#0D5468]/20 h-11"
                            onClick={() => setShowAgreementDialog(true)}
                        >
                            <FileSignature className="mr-2 h-4 w-4" /> Generate
                            Agreement
                        </Button>
                        {showAgreementDialog && (
                            <AgreementModal
                                open={showAgreementDialog}
                                onClose={() => setShowAgreementDialog(false)}
                                onConfirm={handleAgreementSigned}
                                workplace={workplace}
                                student={student}
                            />
                        )}
                    </motion.div>
                )
            case needsWorkplaceStagesEnum.AGREEMENT_SIGNED:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <div className="relative overflow-hidden p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/30 rounded-full -mr-16 -mt-16" />
                            <div className="relative flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <FileCheck className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-emerald-900 font-medium">
                                        Agreement Signed
                                    </p>
                                    <p className="text-emerald-700 text-sm mt-1">
                                        Confirm schedule to proceed
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Button
                            className="w-full bg-gradient-to-r from-[#044866] to-[#0D5468] hover:from-[#0D5468] hover:to-[#044866] text-white shadow-lg shadow-[#044866]/20 h-11"
                            onClick={() => setShowScheduleDialog(true)}
                        >
                            <CalendarCheck className="mr-2 h-4 w-4" /> Confirm
                            Schedule
                        </Button>
                    </motion.div>
                )
            case providedWorkplaceStagesEnum.AGREEMENT_AND_ELIGIBILITY_SIGNED:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <div className="relative overflow-hidden p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/30 rounded-full -mr-16 -mt-16" />
                            <div className="relative flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <FileCheck className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-emerald-900 font-medium">
                                        Agreement Signed
                                    </p>
                                    <p className="text-emerald-700 text-sm mt-1">
                                        Confirm schedule to proceed
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Button
                            className="w-full bg-gradient-to-r from-[#044866] to-[#0D5468] hover:from-[#0D5468] hover:to-[#044866] text-white shadow-lg shadow-[#044866]/20 h-11"
                            onClick={() => setShowScheduleDialog(true)}
                        >
                            <CalendarCheck className="mr-2 h-4 w-4" /> Confirm
                            Schedule
                        </Button>
                    </motion.div>
                )

            case needsWorkplaceStagesEnum.PLACEMENT_STARTED:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <div className="relative overflow-hidden p-4 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/30 rounded-full -mr-16 -mt-16" />
                            <div className="relative flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Play className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-emerald-900 font-medium">
                                        Placement In Progress
                                    </p>
                                    <p className="text-emerald-700 text-sm mt-1">
                                        Student is actively working
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border border-[#044866]/20 rounded-xl space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-[#044866]" />
                                    <span className="text-[#044866] font-medium text-sm">
                                        Placement Progress
                                    </span>
                                </div>
                                <span className="text-[#0D5468] text-sm font-medium">
                                    30%
                                </span>
                            </div>
                            <Progressbar value={30} size="sm" />
                            <div className="flex items-center justify-between text-xs text-slate-600">
                                <span>12 of 40 days completed</span>
                                <span>28 days remaining</span>
                            </div>
                        </div> */}
                        {/* <Button
                            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-lg shadow-emerald-600/20 h-11"
                            onClick={handleCompleteSchedule}
                        >
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Mark
                            Schedule Completed
                        </Button> */}
                    </motion.div>
                )

            case needsWorkplaceStagesEnum.SCHEDULE_COMPLETED:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <div className="relative overflow-hidden p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/30 rounded-full -mr-16 -mt-16" />
                            <div className="relative flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <CheckSquare className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-emerald-900 font-medium">
                                        Schedule Completed
                                    </p>
                                    <p className="text-emerald-700 text-sm mt-1">
                                        Collect documents and feedback
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* <Button
                            className="w-full bg-gradient-to-r from-[#044866] to-[#0D5468] hover:from-[#0D5468] hover:to-[#044866] text-white shadow-lg shadow-[#044866]/20 h-11"
                            onClick={handleMarkCompleted}
                        >
                            <Award className="mr-2 h-4 w-4" /> Mark as Completed
                        </Button> */}
                    </motion.div>
                )

            case needsWorkplaceStagesEnum.COMPLETED:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <div className="relative overflow-hidden p-5 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 border-2 border-emerald-300 rounded-xl">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-300/20 rounded-full -mr-20 -mt-20" />
                            <div className="relative flex items-start gap-3">
                                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                                    <Award className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-emerald-900 font-semibold text-lg">
                                        Placement Completed!
                                    </p>
                                    <p className="text-emerald-700 text-sm mt-1">
                                        All requirements successfully met
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )
            case needsWorkplaceStagesEnum.CANCELLED:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <div className="relative overflow-hidden p-5 bg-gradient-to-br from-red-50 via-rose-50 to-orange-50 border-2 border-red-200 rounded-xl">
                            {/* Decorative background circle */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-red-200/20 rounded-full -mr-20 -mt-20" />

                            <div className="relative flex items-start gap-4">
                                {/* Icon Container */}
                                <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-lg shadow-red-200">
                                    <XCircle className="h-6 w-6 text-white" />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-red-900 font-bold text-lg">
                                            Placement Cancelled
                                        </p>
                                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">
                                            Cancelled
                                        </span>
                                    </div>
                                    <p className="text-red-700 text-sm mt-1 leading-relaxed">
                                        This placement process has been
                                        cancelled and is no longer active.
                                        Please contact your supervisor or RTO
                                        administrator for further details.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Optional: Add a simple secondary note or action button if needed */}
                        <p className="text-slate-400 text-[11px] italic px-1">
                            Note: This record will remain in your history for
                            compliance purposes.
                        </p>
                    </motion.div>
                )
            case providedWorkplaceStagesEnum.CANCELLED:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <div className="relative overflow-hidden p-5 bg-gradient-to-br from-red-50 via-rose-50 to-orange-50 border-2 border-red-200 rounded-xl">
                            {/* Decorative background circle */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-red-200/20 rounded-full -mr-20 -mt-20" />

                            <div className="relative flex items-start gap-4">
                                {/* Icon Container */}
                                <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-lg shadow-red-200">
                                    <XCircle className="h-6 w-6 text-white" />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-red-900 font-bold text-lg">
                                            Placement Cancelled
                                        </p>
                                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">
                                            Cancelled
                                        </span>
                                    </div>
                                    <p className="text-red-700 text-sm mt-1 leading-relaxed">
                                        This placement process has been
                                        cancelled and is no longer active.
                                        Please contact your supervisor or RTO
                                        administrator for further details.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Optional: Add a simple secondary note or action button if needed */}
                        <p className="text-slate-400 text-[11px] italic px-1">
                            Note: This record will remain in your history for
                            compliance purposes.
                        </p>
                    </motion.div>
                )

            case providedWorkplaceStagesEnum.PROVIDED_WORKPLACE_REQUEST:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <div className="relative overflow-hidden p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border border-[#044866]/20 rounded-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#044866]/5 rounded-full -mr-16 -mt-16" />
                            <div className="relative flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Briefcase className="h-5 w-5 text-[#044866]" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[#044866] font-medium">
                                        Provided Workplace Request Created
                                    </p>
                                    {/* <p className="text-[#0D5468] text-sm mt-1">
                                        Search for industry and upload proof of
                                        employment.
                                    </p> */}
                                </div>
                            </div>
                        </div>
                        {/* <Button
                            className="w-full bg-gradient-to-r from-[#044866] to-[#0D5468] hover:from-[#0D5468] hover:to-[#044866] text-white shadow-lg shadow-[#044866]/20 h-11"
                            onClick={() => setShowProvidedWorkplaceDialog(true)}
                        >
                            <Building2 className="mr-2 h-4 w-4" /> Search for
                            Industry
                        </Button> */}
                    </motion.div>
                )

            case providedWorkplaceStagesEnum.INDUSTRY_ELIGIBILITY_PENDING:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <div className="relative overflow-hidden p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/30 rounded-full -mr-16 -mt-16" />
                            <div className="relative flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Shield className="h-5 w-5 text-amber-600" />
                                </div>
                                {/* <div className="flex-1">
                                    <p className="text-amber-900 font-medium">
                                        HOD Review Required
                                    </p>
                                    <p className="text-amber-700 text-sm mt-1">
                                        Awaiting HOD approval for new industry
                                    </p>
                                </div> */}
                            </div>
                        </div>
                        {/* <div className="grid grid-cols-2 gap-2">
                            <Button
                                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-lg shadow-emerald-600/20 h-10"
                                onClick={handleHODApproveIndustry}
                            >
                                <ThumbsUp className="mr-2 h-4 w-4" /> Approve
                            </Button>
                            <Button
                                outline
                                variant="error"
                                className="border-2 border-red-200 hover:border-red-300 hover:bg-red-50 text-red-700 h-10"
                                onClick={handleHODRejectIndustry}
                                Icon={ThumbsDown}
                                text="Reject"
                            />
                        </div> */}
                    </motion.div>
                )

            case providedWorkplaceStagesEnum.AGREEMENT_AND_ELIGIBILITY_PENDING:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <div className="relative overflow-hidden p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border border-[#0D5468]/20 rounded-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0D5468]/5 rounded-full -mr-16 -mt-16" />
                            <div className="relative flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <FileSignature className="h-5 w-5 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-purple-600 font-medium">
                                        Agreement & Eligibility Pending
                                    </p>
                                    <p className="text-purple-600 text-sm mt-1">
                                        Generate or upload placement agreement
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Button
                            className="w-full bg-gradient-to-r from-[#0D5468] to-[#044866] hover:from-[#044866] hover:to-[#0D5468] text-white shadow-lg shadow-[#0D5468]/20 h-11"
                            onClick={() => setShowAgreementDialog(true)}
                        >
                            <FileSignature className="mr-2 h-4 w-4" /> Generate
                            Agreement
                        </Button>
                        {showAgreementDialog && (
                            <AgreementModal
                                open={showAgreementDialog}
                                onClose={() => setShowAgreementDialog(false)}
                                onConfirm={handleAgreementSigned}
                                workplace={workplace}
                                student={student}
                            />
                        )}
                    </motion.div>
                )

            case providedWorkplaceStagesEnum.AGREEMENT_AND_ELIGIBILITY_SIGNED:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <div className="relative overflow-hidden p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/30 rounded-full -mr-16 -mt-16" />
                            <div className="relative flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <FileCheck className="h-5 w-5 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-green-900 font-medium">
                                        Agreement Signed
                                    </p>
                                    <p className="text-green-700 text-sm mt-1">
                                        Ready to start placement
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* {proofSkipped && workplaceType === 'provided' && (
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-amber-900 font-medium text-sm">
                                            Proof of Employment Pending
                                        </p>
                                        <p className="text-amber-700 text-xs mt-1">
                                            Upload required for final records
                                        </p>
                                    </div>
                                    <Button
                                        outline
                                        className="h-7 text-xs border-amber-300 text-amber-700 hover:bg-amber-100"
                                        onClick={() => {
                                            setShowProofUploadDialog(true)
                                        }}
                                    >
                                        <Upload className="h-3 w-3 mr-1" />{' '}
                                        Upload
                                    </Button>
                                </div>
                            </div>
                        )} */}
                        <Button
                            className="w-full bg-gradient-to-r from-[#044866] via-[#0D5468] to-[#044866] hover:from-[#0D5468] hover:via-[#044866] hover:to-[#0D5468] text-white shadow-xl shadow-[#044866]/30 h-12 font-semibold transition-all duration-500 hover:shadow-2xl hover:shadow-[#044866]/40 hover:-translate-y-0.5"
                            onClick={() => setShowScheduleDialog(true)}
                        >
                            <CalendarCheck className="mr-2 h-5 w-5" /> Add
                            Placement Schedule
                        </Button>
                    </motion.div>
                )

            default:
                return null
        }
    }
    return (
        <>
            {modal && modal}
            <Card
                noPadding
                className="border-0 shadow-2xl shadow-slate-200/50 overflow-hidden hover:shadow-3xl transition-shadow duration-500"
            >
                <div className="bg-gradient-to-r from-[#0D5468] via-[#044866] to-[#0D5468] px-6 py-5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
                    <div className="relative flex items-center gap-3 text-white">
                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                            <Target className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">
                                Current Stage Actions
                            </h3>
                            <p className="text-white/80 text-sm">
                                Take action to progress placement
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-7">
                    {getStatusActions() ?? (
                        <NoData text="No progress has been recorded for this placement." />
                    )}
                </div>
            </Card>
        </>
    )
}
