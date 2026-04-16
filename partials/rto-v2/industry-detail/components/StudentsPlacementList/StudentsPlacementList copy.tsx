import {
    Users,
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
} from 'lucide-react'
import { useState } from 'react'

interface WorkflowStep {
    name: string
    status: 'completed' | 'in-progress' | 'pending'
    date?: string
}

interface Student {
    id: string
    name: string
    course: string
    company: string
    progress: number
    completedSteps: number
    totalSteps: number
    workflow: WorkflowStep[]
}

const students: Student[] = [
    {
        id: '1',
        name: 'Sarah Mitchell',
        course: 'CHC33021 - Certificate III in Individual Support',
        company: 'TechCorp Healthcare',
        progress: 75,
        completedSteps: 6,
        totalSteps: 8,
        workflow: [
            {
                name: 'Student Added',
                status: 'completed',
                date: 'Sep 10, 2025',
            },
            {
                name: 'Request Generated',
                status: 'completed',
                date: 'Sep 10, 2025',
            },
            { name: 'RTO Approval', status: 'completed', date: 'Sep 10, 2025' },
            {
                name: 'Workplace Confirmed',
                status: 'completed',
                date: 'Sep 10, 2025',
            },
            {
                name: 'Agreement Signed',
                status: 'completed',
                date: 'Sep 10, 2025',
            },
            {
                name: 'Orientation Scheduled',
                status: 'completed',
                date: 'Sep 10, 2025',
            },
            {
                name: 'Complete Orientation',
                status: 'in-progress',
                date: undefined,
            },
            {
                name: 'Begin Placement Hours',
                status: 'pending',
                date: undefined,
            },
        ],
    },
    {
        id: '2',
        name: 'James Rodriguez',
        course: 'SIT30821 - Certificate III in Commercial Cookery',
        company: 'Gourmet Bistro Sydney',
        progress: 50,
        completedSteps: 4,
        totalSteps: 8,
        workflow: [
            {
                name: 'Student Added',
                status: 'completed',
                date: 'Sep 15, 2025',
            },
            {
                name: 'Request Generated',
                status: 'completed',
                date: 'Sep 15, 2025',
            },
            { name: 'RTO Approval', status: 'completed', date: 'Sep 16, 2025' },
            {
                name: 'Workplace Confirmed',
                status: 'completed',
                date: 'Sep 17, 2025',
            },
            {
                name: 'Agreement Signed',
                status: 'in-progress',
                date: undefined,
            },
            {
                name: 'Orientation Scheduled',
                status: 'pending',
                date: undefined,
            },
            {
                name: 'Complete Orientation',
                status: 'pending',
                date: undefined,
            },
            {
                name: 'Begin Placement Hours',
                status: 'pending',
                date: undefined,
            },
        ],
    },
    {
        id: '3',
        name: 'Emily Chen',
        course: 'ICT50220 - Diploma of Information Technology',
        company: 'TechCorp Healthcare',
        progress: 87.5,
        completedSteps: 7,
        totalSteps: 8,
        workflow: [
            {
                name: 'Student Added',
                status: 'completed',
                date: 'Aug 28, 2025',
            },
            {
                name: 'Request Generated',
                status: 'completed',
                date: 'Aug 28, 2025',
            },
            { name: 'RTO Approval', status: 'completed', date: 'Aug 29, 2025' },
            {
                name: 'Workplace Confirmed',
                status: 'completed',
                date: 'Aug 30, 2025',
            },
            {
                name: 'Agreement Signed',
                status: 'completed',
                date: 'Sep 1, 2025',
            },
            {
                name: 'Orientation Scheduled',
                status: 'completed',
                date: 'Sep 3, 2025',
            },
            {
                name: 'Complete Orientation',
                status: 'completed',
                date: 'Sep 5, 2025',
            },
            {
                name: 'Begin Placement Hours',
                status: 'in-progress',
                date: undefined,
            },
        ],
    },
    {
        id: '4',
        name: 'Michael Thompson',
        course: 'BSB50120 - Diploma of Business',
        company: 'TechCorp Healthcare',
        progress: 37.5,
        completedSteps: 3,
        totalSteps: 8,
        workflow: [
            {
                name: 'Student Added',
                status: 'completed',
                date: 'Sep 20, 2025',
            },
            {
                name: 'Request Generated',
                status: 'completed',
                date: 'Sep 20, 2025',
            },
            { name: 'RTO Approval', status: 'completed', date: 'Sep 21, 2025' },
            {
                name: 'Workplace Confirmed',
                status: 'in-progress',
                date: undefined,
            },
            { name: 'Agreement Signed', status: 'pending', date: undefined },
            {
                name: 'Orientation Scheduled',
                status: 'pending',
                date: undefined,
            },
            {
                name: 'Complete Orientation',
                status: 'pending',
                date: undefined,
            },
            {
                name: 'Begin Placement Hours',
                status: 'pending',
                date: undefined,
            },
        ],
    },
]

export function StudentsPlacementList() {
    const [expandedStudent, setExpandedStudent] = useState<string | null>(null)
    const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null)

    const toggleExpand = (studentId: string) => {
        setExpandedStudent(expandedStudent === studentId ? null : studentId)
    }

    const getStatusCounts = (workflow: WorkflowStep[]) => {
        return {
            completed: workflow.filter((s) => s.status === 'completed').length,
            inProgress: workflow.filter((s) => s.status === 'in-progress')
                .length,
            remaining: workflow.filter((s) => s.status === 'pending').length,
        }
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-[#1A2332] font-bold mb-1">
                        Placement Students
                    </h2>
                    <p className="text-xs text-[#64748B]">
                        Track student placement workflow
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <select className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#1A2332] hover:border-[#044866]/30 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#044866]/20">
                        <option>All Students (4)</option>
                        <option>In Progress (2)</option>
                        <option>Completed (1)</option>
                        <option>Pending (1)</option>
                    </select>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-4 gap-2">
                <div className="bg-linear-to-br from-[#F8FAFB] to-[#E8F4F8] rounded-lg p-2 border border-[#E2E8F0]">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-linear-to-br from-[#044866] to-[#0D5468] rounded-md flex items-center justify-center shadow-sm">
                            <Users className="w-3 h-3 text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] text-[#64748B] mb-0">
                                Total Students
                            </p>
                            <p className="text-sm font-bold text-[#1A2332]">
                                4
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-linear-to-br from-[#D1FAE5] to-[#A7F3D0] rounded-lg p-2 border border-[#10B981]/20">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-linear-to-br from-[#10B981] to-[#059669] rounded-md flex items-center justify-center shadow-sm">
                            <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] text-[#064E3B] mb-0">
                                Completed
                            </p>
                            <p className="text-sm font-bold text-[#065F46]">
                                1
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-linear-to-br from-[#FEF3C7] to-[#FDE68A] rounded-lg p-2 border border-[#F7A619]/20">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-linear-to-br from-[#F7A619] to-[#EA580C] rounded-md flex items-center justify-center shadow-sm">
                            <Clock className="w-3 h-3 text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] text-[#92400E] mb-0">
                                In Progress
                            </p>
                            <p className="text-sm font-bold text-[#B45309]">
                                2
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-linear-to-br from-[#F8FAFB] to-[#E2E8F0] rounded-lg p-2 border border-[#E2E8F0]">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-linear-to-br from-[#64748B] to-[#475569] rounded-md flex items-center justify-center shadow-sm">
                            <Circle className="w-3 h-3 text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] text-[#64748B] mb-0">
                                Pending
                            </p>
                            <p className="text-sm font-bold text-[#475569]">
                                1
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Students List */}
            <div className="space-y-2">
                {students.map((student) => {
                    const isExpanded = expandedStudent === student.id
                    const statusCounts = getStatusCounts(student.workflow)

                    return (
                        <div
                            key={student.id}
                            className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                        >
                            {/* Student Header */}
                            <div className="p-2">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-start gap-2 flex-1">
                                        {/* Avatar */}
                                        <div className="w-7 h-7 bg-linear-to-br from-[#044866] to-[#0D5468] rounded-lg flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                                            {student.name
                                                .split(' ')
                                                .map((n) => n[0])
                                                .join('')}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1">
                                            <h3 className="text-xs font-bold text-[#1A2332] mb-0.5">
                                                {student.name}
                                            </h3>
                                            <p className="text-[10px] text-[#64748B] mb-0.5">
                                                {student.course}
                                            </p>
                                            <div className="flex items-center gap-1">
                                                <span className="text-[10px] text-[#64748B]">
                                                    📍 {student.company}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions Menu */}
                                    <div className="relative">
                                        <button
                                            onClick={() =>
                                                setShowActionsMenu(
                                                    showActionsMenu ===
                                                        student.id
                                                        ? null
                                                        : student.id
                                                )
                                            }
                                            className="w-6 h-6 bg-[#F8FAFB] hover:bg-[#E8F4F8] rounded-md flex items-center justify-center transition-all duration-300"
                                        >
                                            <MoreVertical className="w-3 h-3 text-[#64748B]" />
                                        </button>

                                        {/* Actions Dropdown */}
                                        {showActionsMenu === student.id && (
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

                                {/* Progress Bar */}
                                <div className="mb-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] font-medium text-[#64748B]">
                                                Placement workflow progress
                                            </span>
                                            <span className="text-[10px] font-bold text-[#044866]">
                                                {student.completedSteps} of{' '}
                                                {student.totalSteps} steps
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-bold text-[#044866]">
                                            {student.progress}%
                                        </span>
                                    </div>
                                    <div className="h-1 bg-[#E8F4F8] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-linear-to-r from-[#044866] to-[#0D5468] rounded-full transition-all duration-1000"
                                            style={{
                                                width: `${student.progress}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Status Badges */}
                                <div className="flex items-center gap-1 mb-2">
                                    <div className="flex items-center gap-1 bg-[#D1FAE5] text-[#065F46] px-2 py-0.5 rounded-md text-[10px] font-medium border border-[#10B981]/20">
                                        <CheckCircle className="w-2.5 h-2.5" />
                                        <span>
                                            {statusCounts.completed} Completed
                                        </span>
                                    </div>
                                    {statusCounts.inProgress > 0 && (
                                        <div className="flex items-center gap-1 bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded-md text-[10px] font-medium border border-[#F7A619]/20">
                                            <Clock className="w-2.5 h-2.5" />
                                            <span>
                                                {statusCounts.inProgress} In
                                                Progress
                                            </span>
                                        </div>
                                    )}
                                    {statusCounts.remaining > 0 && (
                                        <div className="flex items-center gap-1 bg-[#F8FAFB] text-[#64748B] px-2 py-0.5 rounded-md text-[10px] font-medium border border-[#E2E8F0]">
                                            <Circle className="w-2.5 h-2.5" />
                                            <span>
                                                {statusCounts.remaining}{' '}
                                                Remaining
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Expand Button */}
                                <button
                                    onClick={() => toggleExpand(student.id)}
                                    className="w-full px-2 py-1 bg-linear-to-br from-[#F8FAFB] to-[#E8F4F8] hover:from-[#E8F4F8] hover:to-[#D1E7F0] rounded-md text-[10px] font-medium text-[#044866] transition-all duration-300 flex items-center justify-center gap-1"
                                >
                                    {isExpanded ? (
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
                                </button>
                            </div>

                            {/* Expanded Workflow Details */}
                            {isExpanded && (
                                <div className="border-t border-[#E2E8F0] bg-linear-to-br from-[#F8FAFB] to-[#FFFFFF] p-3">
                                    <h4 className="text-xs font-bold text-[#1A2332] mb-2 flex items-center gap-1.5">
                                        <div className="w-0.5 h-3 bg-linear-to-b from-[#044866] to-[#0D5468] rounded-full" />
                                        Placement Workflow Progress
                                    </h4>

                                    {/* Workflow Steps */}
                                    <div className="space-y-2">
                                        {student.workflow.map((step, index) => (
                                            <div
                                                key={index}
                                                className="relative flex items-start gap-2"
                                            >
                                                {/* Connector Line */}
                                                {index <
                                                    student.workflow.length -
                                                        1 && (
                                                    <div className="absolute left-[9px] top-5 w-0.5 h-4 bg-[#E2E8F0]" />
                                                )}

                                                {/* Status Icon */}
                                                <div
                                                    className={`w-5 h-5 rounded-lg flex items-center justify-center shadow-sm shrink-0 transition-all duration-300 ${
                                                        step.status ===
                                                        'completed'
                                                            ? 'bg-linear-to-br from-[#10B981] to-[#059669]'
                                                            : step.status ===
                                                                'in-progress'
                                                              ? 'bg-linear-to-br from-[#F7A619] to-[#EA580C] animate-pulse'
                                                              : 'bg-linear-to-br from-[#F8FAFB] to-[#E2E8F0]'
                                                    }`}
                                                >
                                                    {step.status ===
                                                    'completed' ? (
                                                        <CheckCircle className="w-3 h-3 text-white" />
                                                    ) : step.status ===
                                                      'in-progress' ? (
                                                        <Clock className="w-3 h-3 text-white" />
                                                    ) : (
                                                        <Circle className="w-3 h-3 text-[#94A3B8]" />
                                                    )}
                                                </div>

                                                {/* Step Info */}
                                                <div className="flex-1 pt-0.5">
                                                    <div className="flex items-start justify-between mb-0.5">
                                                        <h5
                                                            className={`text-[10px] font-medium ${
                                                                step.status ===
                                                                'completed'
                                                                    ? 'text-[#1A2332]'
                                                                    : step.status ===
                                                                        'in-progress'
                                                                      ? 'text-[#B45309]'
                                                                      : 'text-[#94A3B8]'
                                                            }`}
                                                        >
                                                            {step.name}
                                                        </h5>
                                                        {step.date && (
                                                            <span className="text-[9px] text-[#64748B] bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0]">
                                                                {step.date}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {step.status ===
                                                        'in-progress' && (
                                                        <p className="text-[9px] text-[#92400E] bg-[#FEF3C7] px-1.5 py-0.5 rounded inline-block border border-[#F7A619]/20">
                                                            ⚡ Currently in
                                                            progress
                                                        </p>
                                                    )}
                                                    {step.status ===
                                                        'pending' && (
                                                        <p className="text-[9px] text-[#64748B]">
                                                            Pending previous
                                                            step completion
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="mt-3 pt-3 border-t border-[#E2E8F0]">
                                        <p className="text-[9px] font-medium text-[#64748B] mb-2 uppercase tracking-wide">
                                            Quick Actions Available:
                                        </p>
                                        <div className="flex items-center gap-1 flex-wrap">
                                            <button className="px-2 py-1 bg-white hover:bg-[#F8FAFB] border border-[#E2E8F0] text-[#64748B] rounded-md text-[10px] font-medium transition-all duration-300 flex items-center gap-1">
                                                <Pause className="w-2.5 h-2.5" />
                                                On Hold
                                            </button>
                                            <button className="px-2 py-1 bg-white hover:bg-[#FEE2E2] border border-[#E2E8F0] hover:border-[#DC2626]/20 text-[#DC2626] rounded-md text-[10px] font-medium transition-all duration-300 flex items-center gap-1">
                                                <XCircle className="w-2.5 h-2.5" />
                                                Cancelled
                                            </button>
                                            <button className="px-2 py-1 bg-white hover:bg-[#FEE2E2] border border-[#E2E8F0] hover:border-[#DC2626]/20 text-[#DC2626] rounded-md text-[10px] font-medium transition-all duration-300 flex items-center gap-1">
                                                <AlertTriangle className="w-2.5 h-2.5" />
                                                Terminated
                                            </button>
                                            <button className="px-2 py-1 bg-linear-to-br from-[#044866] to-[#0D5468] hover:shadow-lg text-white rounded-md text-[10px] font-medium transition-all duration-300 flex items-center gap-1">
                                                <Calendar className="w-2.5 h-2.5" />
                                                Extension
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
