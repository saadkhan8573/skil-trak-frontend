import {
    CheckCircle,
    Clock,
    Circle,
    ChevronDown,
    ChevronUp,
    MoreVertical,
    Pause,
    XCircle,
    AlertTriangle,
    Calendar,
    ExternalLink,
} from 'lucide-react'
import { useState } from 'react'
import { WorkflowStep } from './types'
import { StudentDetails } from './StudentDetails'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@components/ui/collapsible'
import { Button } from '@components'
import { Student } from '@types'
import { useStatusInfo } from '@partials/rto-v2/student-detail/components/StudentOverview/hooks/useStatusInfo'
import { WorkplaceWorkIndustriesType } from '@redux/queryTypes'
import Link from 'next/link'
import { getUserCredentials } from '@utils'

import { UserRoles } from '@constants'

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

function getStatusCounts(workflow: WorkflowStep[]) {
    return {
        completed: workflow.filter((s) => s.status === 'completed').length,
        inProgress: workflow.filter((s) => s.status === 'in-progress').length,
        remaining: workflow.filter((s) => s.status === 'pending').length,
    }
}

export function StudentCard({ student }: StudentCardProps) {
    const role = getUserCredentials()?.role
    const [isOpen, setIsOpen] = useState(false)
    const [showActionsMenu, setShowActionsMenu] = useState(false)
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

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className={`${currentStep?.label &&
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
                        <div className="w-7 h-7 bg-gradient-to-br from-[#044866] to-[#0D5468] rounded-lg flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                            {student?.user?.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <h3 className="text-xs font-bold text-[#1A2332]">
                                    {student?.user?.name} {student?.familyName}
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
                    <div className="flex items-center gap-2">
                        <div className="text-right">
                            <div className="flex items-center gap-1.5 justify-end mb-0.5">
                                <span className={`text-[10px] font-bold ${currentStep?.label && ['Cancelled', 'Terminated', 'Rejected', 'No Response'].includes(currentStep.label)
                                    ? 'text-red-600'
                                    : 'text-[#044866]'
                                    }`}>
                                    {currentStep?.label && ['Cancelled', 'Terminated', 'Rejected', 'No Response'].includes(currentStep.label)
                                        ? 'Terminal State'
                                        : `${completedCount} of ${totalCount} steps`}
                                </span>
                                {!(currentStep?.label && ['Cancelled', 'Terminated', 'Rejected'].includes(currentStep.label)) && (
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
                            <p className={`text-[9px] ${currentStep?.label && ['Cancelled', 'Terminated', 'Rejected', 'No Response'].includes(currentStep.label)
                                ? 'text-red-500 font-bold'
                                : 'text-[#64748B]'
                                }`}>
                                {currentStep?.label}
                            </p>
                        </div>

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
                </div>

                {/* Progress Bar - Schedule/Placement Workflow */}
                <div className="mb-2">
                    <div className="h-1.5 bg-[#E8F4F8] rounded-full overflow-hidden shadow-sm">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ${currentStep?.label && ['Cancelled', 'Terminated', 'Rejected', 'No Response'].includes(currentStep.label)
                                ? 'bg-red-500'
                                : 'bg-gradient-to-r from-[#044866] to-[#0D5468]'
                                }`}
                            style={{ width: `${currentStep?.label && ['Cancelled', 'Terminated', 'Rejected', 'No Response'].includes(currentStep.label) ? 100 : progressPercent}%` }}
                        />
                    </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-1 mb-2">
                    {currentStep?.label && ['Cancelled', 'Terminated', 'Rejected', 'No Response'].includes(currentStep.label) ? (
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
                                <span>{statusArrays?.pending?.length} Remaining</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Expand Button */}
                <CollapsibleTrigger asChild>
                    <Button
                        variant="secondary"
                        outline
                        className="w-full px-2 py-1 bg-gradient-to-br from-[#F8FAFB] to-[#E8F4F8] hover:from-[#E8F4F8] hover:to-[#D1E7F0] rounded-md text-[10px] font-medium text-[#044866] transition-all duration-300 flex items-center justify-center gap-1 h-auto"
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
        </Collapsible>
    )
}
