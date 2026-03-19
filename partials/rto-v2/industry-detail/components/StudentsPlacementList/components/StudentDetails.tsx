import { StatusStep } from '@partials/rto-v2/student-detail/components/StudentOverview/hooks/useStatusInfo'
import { CheckCircle, Circle, Clock, XCircle } from 'lucide-react'
import moment from 'moment'

interface StudentDetailsProps {
    workflow: StatusStep[]
}

export function StudentDetails({ workflow }: StudentDetailsProps) {
    const terminalStatuses = [
        'Cancelled',
        'Terminated',
        'Rejected',
        'No Response',
    ]
    const isTerminalActive = workflow.some(
        (step) => step.current && terminalStatuses.includes(step?.label)
    )

    const displayedWorkflow = workflow.filter(
        (step) => !terminalStatuses.includes(step?.label) || step.current
    )

    return (
        <div className="border-t border-[#E2E8F0] bg-linear-to-br from-[#F8FAFB] to-[#FFFFFF] p-3">
            <h4 className="text-xs font-bold text-[#1A2332] mb-2 flex items-center gap-1.5">
                <div className="w-0.5 h-3 bg-linear-to-b from-[#044866] to-[#0D5468] rounded-full" />
                Placement Workflow Progress
            </h4>

            {/* Workflow Steps */}
            <div className="space-y-2">
                {displayedWorkflow.map((step, index) => {
                    const isTerminal = terminalStatuses.includes(step?.label)
                    return (
                        <div
                            key={index}
                            className="relative flex items-start gap-2"
                        >
                            {/* Connector Line */}
                            {index < displayedWorkflow.length - 1 && (
                                <div className="absolute left-2.25 top-5 w-0.5 h-4 bg-[#E2E8F0]" />
                            )}

                            {/* Status Icon */}
                            <div
                                className={`w-5 h-5 rounded-lg flex items-center justify-center shadow-sm shrink-0 transition-all duration-300 ${
                                    step?.completed
                                        ? isTerminalActive
                                            ? 'bg-slate-300'
                                            : 'bg-linear-to-br from-[#10B981] to-[#059669]'
                                        : step?.current
                                          ? isTerminal
                                              ? 'bg-linear-to-br from-[#EF4444] to-[#B91C1C]'
                                              : 'bg-linear-to-br from-[#F7A619] to-[#EA580C] animate-pulse'
                                          : 'bg-linear-to-br from-[#F8FAFB] to-[#E2E8F0]'
                                }`}
                            >
                                {step?.completed ? (
                                    isTerminalActive ? (
                                        <Circle className="w-2.5 h-2.5 text-white" />
                                    ) : (
                                        <CheckCircle className="w-3 h-3 text-white" />
                                    )
                                ) : step?.current ? (
                                    isTerminal ? (
                                        <XCircle className="w-3 h-3 text-white" />
                                    ) : (
                                        <Clock className="w-3 h-3 text-white" />
                                    )
                                ) : (
                                    <Circle className="w-3 h-3 text-[#94A3B8]" />
                                )}
                            </div>

                            {/* Step Info */}
                            <div className="flex-1 pt-0.5">
                                <div className="flex items-start justify-between mb-0.5">
                                    <h5
                                        className={`text-[10px] font-medium ${
                                            step?.completed
                                                ? 'text-[#1A2332]'
                                                : step?.current
                                                  ? isTerminal
                                                      ? 'text-[#991B1B]'
                                                      : 'text-[#B45309]'
                                                  : 'text-[#94A3B8]'
                                        }`}
                                    >
                                        {step?.label}
                                    </h5>
                                    {step.date && (
                                        <span className="text-[9px] text-[#64748B] bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0]">
                                            {moment(step.date).format(
                                                'DD MMM YYYY · hh:mm A'
                                            )}
                                        </span>
                                    )}
                                </div>
                                {step?.current &&
                                    step?.label !== 'Schedule Completed' && (
                                        <p
                                            className={`text-[9px] px-1.5 py-0.5 rounded inline-block border ${
                                                isTerminal
                                                    ? 'text-[#991B1B] bg-[#FEE2E2] border-[#EF4444]/20'
                                                    : 'text-[#92400E] bg-[#FEF3C7] border-[#F7A619]/20'
                                            }`}
                                        >
                                            {isTerminal
                                                ? `❌ Request ${step?.label}`
                                                : '⚡ Currently in progress'}
                                        </p>
                                    )}
                                {!isTerminal &&
                                    !step?.completed &&
                                    !step?.current && (
                                        <p className="text-[9px] text-[#64748B]">
                                            Pending previous step completion
                                        </p>
                                    )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
