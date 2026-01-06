import {
    CheckCircle,
    Clock,
    Circle,
    Pause,
    XCircle,
    AlertTriangle,
    Calendar,
} from 'lucide-react'
import { WorkflowStep } from './types'

interface StudentDetailsProps {
    workflow: {
        label: string
        completed: boolean
        current: boolean
        date: string
    }[]
}

export function StudentDetails({ workflow }: StudentDetailsProps) {
    return (
        <div className="border-t border-[#E2E8F0] bg-gradient-to-br from-[#F8FAFB] to-[#FFFFFF] p-3">
            <h4 className="text-xs font-bold text-[#1A2332] mb-2 flex items-center gap-1.5">
                <div className="w-0.5 h-3 bg-gradient-to-b from-[#044866] to-[#0D5468] rounded-full" />
                Placement Workflow Progress
            </h4>

            {/* Workflow Steps */}
            <div className="space-y-2">
                {workflow.map((step, index) => (
                    <div
                        key={index}
                        className="relative flex items-start gap-2"
                    >
                        {/* Connector Line */}
                        {index < workflow.length - 1 && (
                            <div className="absolute left-[9px] top-5 w-0.5 h-4 bg-[#E2E8F0]" />
                        )}

                        {/* Status Icon */}
                        <div
                            className={`w-5 h-5 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 transition-all duration-300 ${
                                step?.completed
                                    ? 'bg-gradient-to-br from-[#10B981] to-[#059669]'
                                    : step?.current
                                    ? 'bg-gradient-to-br from-[#F7A619] to-[#EA580C] animate-pulse'
                                    : 'bg-gradient-to-br from-[#F8FAFB] to-[#E2E8F0]'
                            }`}
                        >
                            {step?.completed ? (
                                <CheckCircle className="w-3 h-3 text-white" />
                            ) : step?.current ? (
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
                                        step?.completed
                                            ? 'text-[#1A2332]'
                                            : step?.current
                                            ? 'text-[#B45309]'
                                            : 'text-[#94A3B8]'
                                    }`}
                                >
                                    {step?.label}
                                </h5>
                                {step.date && (
                                    <span className="text-[9px] text-[#64748B] bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0]">
                                        {step.date}
                                    </span>
                                )}
                            </div>
                            {step?.current && (
                                <p className="text-[9px] text-[#92400E] bg-[#FEF3C7] px-1.5 py-0.5 rounded inline-block border border-[#F7A619]/20">
                                    ⚡ Currently in progress
                                </p>
                            )}
                            {!step?.completed && !step?.current && (
                                <p className="text-[9px] text-[#64748B]">
                                    Pending previous step completion
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
