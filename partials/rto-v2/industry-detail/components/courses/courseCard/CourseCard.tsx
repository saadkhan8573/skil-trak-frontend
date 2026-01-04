import { Button } from '@components'
import { AddCourseProgramIndustry } from '@partials/common/IndustryProfileDetail/components/CourseManagement/components/AddCourseProgramIndustry'
import {
    Course,
    Course as GlobalCourse,
    Industry,
    IndustryCourseApproval,
} from '@types'
import { AnimatePresence, motion } from 'framer-motion'
import {
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    ChevronDown,
    FileCheck,
} from 'lucide-react'
import { useState } from 'react'
import { FacilityChecklistActions } from '../FacilityChecklistActions'
import { PendingCourseApproval } from './components'
import { useAppSelector } from '@redux/hooks'
import { UploadFacilityChecklistDialog } from '../modals/UploadFacilityChecklistDialog'
import { UploadCloud } from 'lucide-react'

export interface PlacementWorkflow {
    currentStep: number
    totalSteps: number
    status: string
    completedSteps: number
    remainingSteps: number
    placementSchedule: number
}

export interface HighlightedTask {
    id: number
    description: string
    confirmationMethod: 'industry' | 'sourcing' | 'direct'
    confirmed: boolean
    confirmedBy?: string
    confirmedAt?: string
}

// View Model extending Global Course to include UI-specific fields
export interface CourseViewModel extends GlobalCourse {
    programs?: string[]
    deliveryModes?: string[]
    status?: string
    students?: number
    capacity?: number
    duration?: string
    rating?: number
    courseHours?: number
    streams?: string[]
    placementWorkflow?: PlacementWorkflow
    programsAndServices?: string
    branchesAndLocations?: string
    activities?: string[]
    eligibilityNotes?: string
    agentNote?: string
    requestedBy?: string
    referenceUrl?: string
    facilityChecklistStatus?:
        | 'pending'
        | 'approved'
        | 'rejected'
        | 'signed'
        | 'awaiting-approval'
    facilityChecklistSignedDate?: string
    facilityChecklistApprovedDate?: string
    facilityChecklistApprovedBy?: string
    supervisorAdded?: boolean
    courseApprovalStatus?: 'pending' | 'approved' | 'rejected'
    highlightedTasks?: HighlightedTask[]
    approval?: any
}

interface CourseCardProps {
    approval: IndustryCourseApproval
    courseIndex: number
    industry?: Industry
    hasInitiatedESign?: boolean
}

export function CourseCard({
    approval,
    industry,
    courseIndex,
    hasInitiatedESign,
}: CourseCardProps) {
    const [isCourseExpanded, setIsCourseExpanded] = useState(true)
    const [uploadFacilityChecklist, setUploadFacilityChecklist] =
        useState(false)

    const isApproved = approval?.status === 'approved'
    const isPending = approval?.status === 'pending'
    const isRejected = approval?.status === 'rejected'

    // Facility checklist logic: by default wont be approve if file url exist
    const hasFacilityFile = !!approval?.file
    const needsApproval = hasFacilityFile && !isApproved

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: courseIndex * 0.05 }}
            className={`rounded-xl overflow-hidden transition-all duration-300 ${
                isApproved
                    ? 'bg-gradient-to-br from-[#10B981]/10 via-white to-[#059669]/10 border-2 border-[#10B981]/30 shadow-lg'
                    : needsApproval
                    ? 'bg-gradient-to-br from-[#F7A619]/10 via-white to-[#EA580C]/10 border-2 border-[#F7A619]/40 shadow-lg animate-pulse-slow'
                    : isRejected
                    ? 'bg-gradient-to-br from-[#EF4444]/5 via-white to-[#DC2626]/5 border-2 border-[#EF4444]/30'
                    : 'bg-white border border-[#E2E8F0] hover:shadow-md hover:border-[#044866]/20'
            }`}
        >
            {/* Course Header */}
            <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                        {/* Course Title & Code */}
                        <div className="flex items-center gap-2 mb-2">
                            <div
                                className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                                    isApproved
                                        ? 'bg-[#10B981]/20 text-[#10B981]'
                                        : 'bg-[#044866]/10 text-[#044866]'
                                }`}
                            >
                                {approval?.course.code}
                            </div>
                            {isApproved && (
                                <div className="px-2 py-1 bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-md text-[10px] font-bold flex items-center gap-1 shadow-md">
                                    <CheckCircle2 className="w-3 h-3" />
                                    FULLY APPROVED
                                </div>
                            )}
                            {isPending && approval?.file && (
                                <div className="px-2 py-1 bg-gradient-to-r from-[#F7A619] to-[#EA580C] text-white rounded-md text-[10px] font-bold flex items-center gap-1 shadow-md animate-pulse">
                                    <AlertCircle className="w-3 h-3" />
                                    ACTION REQUIRED
                                </div>
                            )}
                            {isPending && !approval?.file && (
                                <div className="px-2 py-1 bg-gradient-to-r from-[#F7A619] to-[#EA580C] text-white rounded-md text-[10px] font-bold flex items-center gap-1 shadow-md animate-pulse">
                                    <AlertCircle className="w-3 h-3" />
                                    PENDING
                                </div>
                            )}
                            {isRejected && (
                                <div className="px-2 py-1 bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white rounded-md text-[10px] font-bold flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    CHANGES REQUESTED
                                </div>
                            )}
                        </div>

                        <h4 className="text-sm font-bold text-[#1A2332] mb-2">
                            {approval?.course?.title}
                        </h4>

                        {/* Workflow Status Indicators */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {/* Facility Checklist Status */}
                            <div
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium ${
                                    isApproved
                                        ? 'bg-[#10B981]/10 text-[#10B981]'
                                        : needsApproval
                                        ? 'bg-[#F7A619]/20 text-[#F7A619]'
                                        : isRejected
                                        ? 'bg-[#EF4444]/10 text-[#EF4444]'
                                        : 'bg-[#64748B]/10 text-[#64748B]'
                                }`}
                            >
                                <FileCheck className="w-3 h-3" />
                                {isApproved && 'Checklist Approved'}
                                {needsApproval && 'Pending Your Approval'}
                                {isRejected && 'Checklist Rejected'}
                                {isPending && 'Awaiting E-Signature'}
                            </div>

                            {/* Programs / Streams Integration */}
                            {industry && approval && (
                                <div onClick={(e) => e.stopPropagation()}>
                                    <AddCourseProgramIndustry
                                        industry={industry}
                                        approval={approval}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Expand Button */}
                    <motion.button
                        onClick={() => setIsCourseExpanded(!isCourseExpanded)}
                        animate={{ rotate: isCourseExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                            isApproved
                                ? 'bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#10B981]'
                                : needsApproval
                                ? 'bg-[#F7A619]/10 hover:bg-[#F7A619]/20 text-[#F7A619]'
                                : 'bg-[#F8FAFB] hover:bg-[#E8F4F8] text-[#044866]'
                        }`}
                    >
                        <ChevronDown className="w-4 h-4" />
                    </motion.button>
                </div>

                {/* Action Button for Approval */}
                {isPending && (
                    <PendingCourseApproval
                        approval={approval}
                        hasInitiatedESign={hasInitiatedESign}
                    />
                )}

                {/* Success Banner for Approved Courses */}
                {isApproved && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-r from-[#10B981]/10 to-[#059669]/10 border border-[#10B981]/30 rounded-lg p-3 flex items-center gap-2"
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-lg flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-[#10B981]">
                                Course Fully Approved & Active
                            </p>
                        </div>
                        {!approval?.file && (
                            <Button
                                onClick={() => setUploadFacilityChecklist(true)}
                                className="bg-gradient-to-r from-[#044866] to-[#0D5468] text-white text-xs h-9 px-4 gap-2 shadow-lg shadow-[#044866]/30"
                            >
                                <UploadCloud className="w-3.5 h-3.5" />
                                Manual E-sign Upload
                            </Button>
                        )}
                    </motion.div>
                )}

                {/* Rejected Status */}
                {isRejected && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-r from-[#EF4444]/10 to-[#DC2626]/10 border border-[#EF4444]/30 rounded-lg p-3"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-lg flex items-center justify-center">
                                    <AlertTriangle className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-[#EF4444]">
                                        Changes Requested
                                    </p>
                                    <p className="text-[10px] text-[#DC2626]">
                                        Facility checklist requires
                                        modifications
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={() => setUploadFacilityChecklist(true)}
                                className="bg-gradient-to-r from-[#044866] to-[#0D5468] text-white text-xs h-9 px-4 gap-2 shadow-lg shadow-[#044866]/30"
                            >
                                <UploadCloud className="w-3.5 h-3.5" />
                                Manual E-sign Upload
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
                {isCourseExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden border-t border-[#E2E8F0]"
                    >
                        <div className="p-4 bg-[#F8FAFB] space-y-4">
                            {/* Programs & Services */}
                            <div>
                                <h5 className="text-xs font-bold text-[#1A2332] mb-2">
                                    Programs & Services
                                </h5>
                                <p
                                    className="text-[10px] text-[#64748B] leading-relaxed"
                                    dangerouslySetInnerHTML={{
                                        __html: approval?.description || '',
                                    }}
                                />
                            </div>

                            {/* Document Actions (if signed or approved) */}
                            {approval?.file && (
                                <FacilityChecklistActions
                                    fileUrl={approval?.file}
                                />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Modal for manual upload */}
            <UploadFacilityChecklistDialog
                open={uploadFacilityChecklist}
                approval={approval}
                onOpenChange={setUploadFacilityChecklist}
            />
        </motion.div>
    )
}
