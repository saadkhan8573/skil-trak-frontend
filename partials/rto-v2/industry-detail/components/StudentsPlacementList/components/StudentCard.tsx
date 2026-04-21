import {
    AuthorizedUserComponent,
    Badge,
    Button,
    Portal,
    WorldwideStudentDataRestriction,
} from '@components'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@components/ui/collapsible'
import { useStatusInfo } from '@partials/rto-v2/student-detail/components/StudentOverview/hooks/useStatusInfo'
import { WorkplaceWorkIndustriesType } from '@redux/queryTypes'
import { Student } from '@types'
import { getUserCredentials } from '@utils'
import {
    AlertTriangle,
    Calendar,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Circle,
    Clock,
    ExternalLink,
    Pause,
    Send,
    XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { StudentDetails } from './StudentDetails'

import { ActionButton } from '@components'
import { UserRoles } from '@constants'
import { DeclineStudentByIndustryModal } from '@partials/common/StudentProfileDetail/components'
import { ApproveRequestModal } from '@partials/sub-admin/workplace/modals'
import { WorkplaceCurrentStatus } from '@utils'
import moment from 'moment'
import { ReactNode } from 'react'
import { ResendEmailModal } from '../ResendEmailModal'

interface StudentCardProps {
    student: Student
}

function getStudentProfileLink(role: string, studentId: number) {
    switch (role) {
        case UserRoles.ADMIN:
            return `/portals/admin/student/${studentId}/detail`
        case UserRoles.SUBADMIN:
            return `/portals/sub-admin/students/${studentId}/detail`
        default:
            return `/portals/rto/students-and-placements/all-students/${studentId}/detail`
    }
}

export function StudentCard({ student }: StudentCardProps) {
    const role = getUserCredentials()?.role
    const [isOpen, setIsOpen] = useState(false)
    const [showActionsMenu, setShowActionsMenu] = useState(false)
    const [modal, setModal] = useState<ReactNode | null>(null)
    const workplace = student?.workplace?.[0]

    const onModalCancelClicked = () => setModal(null)

    const onApproveClicked = (wpId: number) => {
        setModal(
            <Portal>
                <ApproveRequestModal
                    workplaceId={wpId}
                    onCancel={onModalCancelClicked}
                />
            </Portal>
        )
    }
    const onClickResendEmail = (workplace: any) => {
        setModal(
            <ResendEmailModal
                workplace={workplace}
                onCancel={onModalCancelClicked}
            />
        )
    }

    const onRejectClicked = (wpId: number) => {
        setModal(
            <DeclineStudentByIndustryModal
                workplaceId={wpId}
                onCancel={onModalCancelClicked}
            />
        )
    }
    // const statusCounts = getStatusCounts(student.workflow)

    const {
        statuses,
        progressPercent,
        completedCount,
        totalCount,
        statusArrays,
        validStatus,
        currentStep,
    } = useStatusInfo({
        workplace: student?.workplace?.[0],
        workIndustry: student?.workplace?.[0]
            ?.industries?.[0] as WorkplaceWorkIndustriesType,
    })
    // ------------------- Action by Info START --------------------- //
    const industry = student?.workplace?.[0]?.industries?.[0]
    const isApproved = industry?.action === 'approved'

    const containerStyles = isApproved
        ? 'bg-green-50 border-green-200'
        : 'bg-red-50 border-red-200'

    const textStyles = isApproved ? 'text-green-600' : 'text-red-600'

    // ------------------- Action by Info END ----------------------- //

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className={`${
                currentStep?.label &&
                ['Cancelled', 'Terminated', 'Rejected', 'No Response'].includes(
                    currentStep.label
                )
                    ? 'bg-red-100 border-red-200'
                    : 'bg-white border-[#E2E8F0]'
            } border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300`}
        >
            {/* Student Header */}
            <div className="p-2">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2 flex-1">
                        {/* Avatar */}
                        <div className="w-7 h-7 `bg-gradient-to-br` from-[#044866] to-[#0D5468] rounded-lg flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                            <WorldwideStudentDataRestriction
                                anotherUserId={Number(student?.rto?.user?.id)}
                                fallbackOptions={{
                                    width: '100%',
                                    height: '100%',
                                }}
                            >
                                {student?.user?.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                            </WorldwideStudentDataRestriction>
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <h3 className="text-xs font-bold text-[#1A2332]">
                                    <WorldwideStudentDataRestriction
                                        anotherUserId={Number(
                                            student?.rto?.user?.id
                                        )}
                                        fallbackOptions={{
                                            width: '100px',
                                            height: '15px',
                                        }}
                                    >
                                        {student?.user?.name}{' '}
                                        {student?.familyName}
                                    </WorldwideStudentDataRestriction>
                                </h3>
                                <Link
                                    href={getStudentProfileLink(
                                        role,
                                        student?.id
                                    )}
                                >
                                    <ExternalLink className="w-3 h-3 text-[#64748B] hover:text-[#044866] cursor-pointer" />
                                </Link>
                            </div>
                            <p className="text-[10px] text-[#64748B] mb-0.5">
                                {student?.workplace?.[0]?.courses?.[0]?.title}
                            </p>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-semibold text-[#64748B]">
                                    🏢 RTO: {student?.rto?.user?.name}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Workflow Status - Top Right */}
                    <div>
                        <div className="flex items-center gap-2">
                            <AuthorizedUserComponent
                                excludeRoles={[UserRoles.RTO]}
                            >
                                {workplace?.currentStatus ===
                                    WorkplaceCurrentStatus.AwaitingWorkplaceResponse && (
                                    <div className="flex gap-2 mb-2">
                                        <Button
                                            Icon={Send}
                                            text={'Re-Email'}
                                            variant={'info'}
                                            onClick={() =>
                                                onClickResendEmail(workplace)
                                            }
                                        />
                                        <ActionButton
                                            variant="success"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                if (workplace?.id)
                                                    onApproveClicked(
                                                        workplace.id
                                                    )
                                            }}
                                        >
                                            Accept
                                        </ActionButton>
                                        <ActionButton
                                            variant="error"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                if (workplace?.id)
                                                    onRejectClicked(
                                                        workplace.id
                                                    )
                                            }}
                                        >
                                            Reject
                                        </ActionButton>
                                    </div>
                                )}
                            </AuthorizedUserComponent>
                            <div className="text-right">
                                <div className="flex items-center gap-1.5 justify-end mb-0.5">
                                    <span
                                        className={`text-[10px] font-bold ${
                                            currentStep?.label &&
                                            [
                                                'Cancelled',
                                                'Terminated',
                                                'Rejected',
                                                'No Response',
                                            ].includes(currentStep.label)
                                                ? 'text-red-600'
                                                : 'text-[#044866]'
                                        }`}
                                    >
                                        {currentStep?.label &&
                                        [
                                            'Cancelled',
                                            'Terminated',
                                            'Rejected',
                                            'No Response',
                                        ].includes(currentStep.label)
                                            ? 'Terminal State'
                                            : `${completedCount} of ${totalCount} steps`}
                                    </span>
                                    {!(
                                        currentStep?.label &&
                                        [
                                            'Cancelled',
                                            'Terminated',
                                            'Rejected',
                                        ].includes(currentStep.label)
                                    ) && (
                                        <>
                                            <span className="text-[10px] font-bold text-[#64748B]">
                                                •
                                            </span>
                                            <span className="text-[10px] font-bold text-[#044866]">
                                                {progressPercent}%
                                            </span>
                                        </>
                                    )}
                                </div>
                                <p
                                    className={`text-[9px] ${
                                        currentStep?.label &&
                                        [
                                            'Cancelled',
                                            'Terminated',
                                            'Rejected',
                                            'No Response',
                                        ].includes(currentStep.label)
                                            ? 'text-red-500 font-bold'
                                            : 'text-[#64748B]'
                                    }`}
                                >
                                    {currentStep?.label}
                                </p>
                            </div>

                            <CollapsibleTrigger asChild>
                                <div className="h-6 w-6 p-0 hover:bg-slate-100 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                                    {isOpen ? (
                                        <ChevronUp className="w-4 h-4 text-slate-500" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-slate-500" />
                                    )}
                                </div>
                            </CollapsibleTrigger>

                            {/* Actions Menu */}
                            <div className="relative">
                                {/* <button
                                onClick={() =>
                                    setShowActionsMenu(!showActionsMenu)
                                }
                                className="w-6 h-6 bg-[#F8FAFB] hover:bg-[#E8F4F8] rounded-md flex items-center justify-center transition-all duration-300"
                            >
                                <MoreVertical className="w-3 h-3 text-[#64748B]" />
                            </button> */}

                                {/* Actions Dropdown */}
                                {showActionsMenu && (
                                    <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-2xl border border-[#E2E8F0] overflow-hidden z-10">
                                        <button className="w-full px-3 py-1.5 text-left text-[10px] hover:bg-[#F8FAFB] transition-all flex items-center gap-1.5 text-[#64748B] hover:text-[#044866]">
                                            <Pause className="w-3 h-3" />
                                            Put On Hold
                                        </button>
                                        <button className="w-full px-3 py-1.5 text-left text-[10px] hover:bg-[#FEF3C7] transition-all flex items-center gap-1.5 text-[#92400E]">
                                            <Calendar className="w-3 h-3" />
                                            Request Extension
                                        </button>
                                        <button className="w-full px-3 py-1.5 text-left text-[10px] hover:bg-[#FEE2E2] transition-all flex items-center gap-1.5 text-[#DC2626]">
                                            <XCircle className="w-3 h-3" />
                                            Cancel Placement
                                        </button>
                                        <button className="w-full px-3 py-1.5 text-left text-[10px] hover:bg-[#FEE2E2] transition-all flex items-center gap-1.5 text-[#DC2626]">
                                            <AlertTriangle className="w-3 h-3" />
                                            Terminate Placement
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        {industry?.actionedBy && (
                            <div
                                className={`mt-2 rounded-md border px-3 py-2 text-[10px] ${containerStyles}`}
                            >
                                <div className="flex items-center gap-1 justify-between">
                                    <Badge
                                        text={'Approved By'}
                                        variant={'info'}
                                        size="xs"
                                    />
                                    <p
                                        className={`font-medium capitalize ${textStyles}`}
                                    >
                                        {industry.actionedBy?.name}
                                    </p>
                                </div>

                                <p className="mt-1 text-gray-500">
                                    {industry.actionDate
                                        ? moment(industry.actionDate).format(
                                              'DD MMM YYYY · hh:mm A'
                                          )
                                        : '—'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Progress Bar - Schedule/Placement Workflow */}
                <div className="mb-2">
                    <div className="h-1.5 bg-[#E8F4F8] rounded-full overflow-hidden shadow-sm">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ${
                                currentStep?.label &&
                                [
                                    'Cancelled',
                                    'Terminated',
                                    'Rejected',
                                    'No Response',
                                ].includes(currentStep.label)
                                    ? 'bg-red-500'
                                    : '`bg-gradient-to-r` from-[#044866] to-[#0D5468]'
                            }`}
                            style={{
                                width: `${currentStep?.label && ['Cancelled', 'Terminated', 'Rejected', 'No Response'].includes(currentStep.label) ? 100 : progressPercent}%`,
                            }}
                        />
                    </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-1 mb-2">
                    {currentStep?.label &&
                    [
                        'Cancelled',
                        'Terminated',
                        'Rejected',
                        'No Response',
                    ].includes(currentStep.label) ? (
                        <div className="flex items-center gap-1 bg-[#FEE2E2] text-[#991B1B] px-2 py-0.5 rounded-md text-[10px] font-bold border border-[#EF4444]/20">
                            <XCircle className="w-2.5 h-2.5" />
                            <span>{currentStep.label}</span>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-1 bg-[#D1FAE5] text-[#065F46] px-2 py-0.5 rounded-md text-[10px] font-medium border border-[#10B981]/20">
                                <CheckCircle className="w-2.5 h-2.5" />
                                <span>{completedCount} Completed</span>
                            </div>
                            <div className="flex items-center gap-1 bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded-md text-[10px] font-medium border border-[#F7A619]/20">
                                <Clock className="w-2.5 h-2.5" />
                                <span>1 In Progress</span>
                            </div>
                            <div className="flex items-center gap-1 bg-[#F8FAFB] text-[#64748B] px-2 py-0.5 rounded-md text-[10px] font-medium border border-[#E2E8F0]">
                                <Circle className="w-2.5 h-2.5" />
                                <span>
                                    {statusArrays?.pending?.length} Remaining
                                </span>
                            </div>
                        </>
                    )}
                </div>

                {/* Expand Button */}
                <CollapsibleTrigger asChild>
                    <Button
                        variant="secondary"
                        outline
                        className="w-full px-2 py-1 `bg-gradient-to-br` from-[#F8FAFB] to-[#E8F4F8] hover:from-[#E8F4F8] hover:to-[#D1E7F0] rounded-md text-[10px] font-medium text-[#044866] transition-all duration-300 flex items-center justify-center gap-1 h-auto"
                    >
                        {isOpen ? (
                            <>
                                <ChevronUp className="w-3 h-3" />
                                Hide Workflow Details
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-3 h-3" />
                                View Workflow Details
                            </>
                        )}
                    </Button>
                </CollapsibleTrigger>
            </div>

            {/* Expanded Workflow Details */}
            <CollapsibleContent>
                <StudentDetails workflow={statuses} />
            </CollapsibleContent>
            {modal}
        </Collapsible>
    )
}
