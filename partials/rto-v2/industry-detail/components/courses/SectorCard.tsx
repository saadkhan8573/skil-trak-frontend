import { IndustryApi, RtoV2Api } from '@queries'
import { Industry, IndustryCourseApproval } from '@types'
import { AnimatePresence, motion } from 'framer-motion'
import {
    AlertCircle,
    BookOpen,
    CheckCircle2,
    ChevronDown,
    Sparkles,
    Trash2,
    UserCheck,
    Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { CourseCard } from './courseCard/CourseCard'
import {
    CancelInitiatedEsignModal,
    SectorCapacityModal,
    SupervisorsModal,
} from './modals'

const sectorStatusColorMap: Record<string, string> = {
    approved: 'bg-gradient-to-r from-[#10B981] to-[#059669]',
    rejected: 'bg-gradient-to-r from-red-500 to-red-700',
    pending: 'bg-gradient-to-r from-[#F7A619] to-[#EA580C]',
}

import { setIndustrySupervisors } from '@redux'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { cn } from '@utils'
import { CourseViewModel } from './courseCard/CourseCard'
import { IndustrySectorGroup } from './hooks'

interface SectorCardProps {
    sector: IndustrySectorGroup
    sectorIndex: number
}

export function SectorCard({ sector, sectorIndex }: SectorCardProps) {
    const [showSupervisorsModal, setShowSupervisorsModal] = useState(false)
    const [showCapacityModal, setShowCapacityModal] = useState(false)
    const [showCancelEsignModal, setShowCancelEsignModal] = useState(false)
    const [isSectorExpanded, setisSectorExpanded] = useState(true)

    const dispatch = useAppDispatch()

    const { industrySectorCapacity, industryDetail: industry } = useAppSelector(
        (state) => state.industry
    )

    const { data: initiatedESign } =
        RtoV2Api.Industries.getIndustryInitiatedESign(
            {
                id: industry?.id || 0,
                sectorId: sector.sector.id,
            },
            {
                skip: !industry?.id,
            }
        )

    const sectorCapacity = industrySectorCapacity?.find(
        (s: any) => s.sector.id === sector.sector.id
    )

    const industryApproval = sector?.sector?.industryApproval?.[0]

    // Fetch supervisor data from API
    const { data: supervisorsData, isSuccess } =
        IndustryApi.Supervisor.getSupervisorBySector(
            {
                sectorId: sector.sector.id,
                indId: industry?.id || 0,
            },
            {
                skip: !industry?.id,
            }
        )

    useEffect(() => {
        if (isSuccess && supervisorsData) {
            dispatch(
                setIndustrySupervisors({
                    [sector.sector.id]: supervisorsData,
                })
            )
        }
    }, [isSuccess, supervisorsData])

    // Calculate sector statistics
    const totalStudents = Number(sectorCapacity?.enrolled || 0)
    const totalCapacity = Number(sectorCapacity?.capacity || 0)
    const utilizationRate =
        totalCapacity > 0
            ? Math.round((totalStudents / totalCapacity) * 100)
            : 0

    // Calculate approval status
    const approvedCourses = sector.approvalCourses.filter(
        (approval: IndustryCourseApproval) => approval.status === 'approved'
    ).length
    const pendingApprovalCourses = sector.approvalCourses.filter(
        (approval: IndustryCourseApproval) =>
            approval.file && approval.status !== 'approved'
    ).length
    const hasPendingActions = pendingApprovalCourses > 0
    const sectorApproved = approvedCourses > 0

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectorIndex * 0.1 }}
            className={`rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                sectorApproved
                    ? 'bg-gradient-to-br from-[#10B981]/5 via-white to-[#059669]/5 border-[#10B981]/30 shadow-lg shadow-[#10B981]/10'
                    : hasPendingActions
                    ? 'bg-gradient-to-br from-[#F7A619]/5 via-white to-[#EA580C]/5 border-[#F7A619]/40 shadow-lg shadow-[#F7A619]/10'
                    : 'bg-white border-[#E2E8F0] hover:shadow-xl hover:border-[#044866]/20'
            }`}
        >
            {/* Sector Header */}
            <div
                onClick={() => setisSectorExpanded(!isSectorExpanded)}
                className="cursor-pointer p-5 relative"
            >
                {/* Status Indicator Strip */}
                <div
                    className={`absolute top-0 left-0 right-0 h-1 ${
                        sectorApproved
                            ? 'bg-gradient-to-r from-[#10B981] via-[#059669] to-[#10B981]'
                            : hasPendingActions
                            ? 'bg-gradient-to-r from-[#F7A619] via-[#EA580C] to-[#F7A619]'
                            : 'bg-gradient-to-r from-[#044866] via-[#0D5468] to-[#044866]'
                    }`}
                />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        {/* Sector Icon */}
                        <div
                            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg relative ${
                                sectorApproved
                                    ? 'bg-gradient-to-br from-[#10B981] to-[#059669]'
                                    : hasPendingActions
                                    ? 'bg-gradient-to-br from-[#F7A619] to-[#EA580C]'
                                    : `bg-gradient-to-br from-blue-500 to-blue-600`
                            }`}
                        >
                            <span className="drop-shadow-lg">📚</span>
                            {sectorApproved && (
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                                </div>
                            )}
                            {hasPendingActions && (
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md animate-pulse">
                                    <AlertCircle className="w-4 h-4 text-[#F7A619]" />
                                </div>
                            )}
                        </div>

                        {/* Sector Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-bold text-[#1A2332]">
                                    {sector.sector.name}
                                </h3>
                                <>
                                    <div
                                        className={cn(
                                            'px-2.5 py-1 text-white rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md uppercase',
                                            sectorStatusColorMap[
                                                industryApproval?.status ||
                                                    'pending'
                                            ] || sectorStatusColorMap.pending
                                        )}
                                    >
                                        <CheckCircle2 className="w-3 h-3" />
                                        {industryApproval?.status}
                                    </div>
                                    {/* View Supervisors Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setShowSupervisorsModal(true)
                                        }}
                                        className="px-2.5 py-1.5 bg-gradient-to-br from-[#044866] to-[#0D5468] text-white rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all"
                                        title="View Supervisors"
                                    >
                                        <UserCheck className="w-3.5 h-3.5" />
                                        {supervisorsData?.length || 0}{' '}
                                        {(supervisorsData?.length || 0) === 1
                                            ? 'Supervisor'
                                            : 'Supervisors'}
                                    </motion.button>
                                    {initiatedESign && !hasPendingActions && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setShowCancelEsignModal(true)
                                            }}
                                            className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all border border-red-400/30"
                                            title="Cancel E-sign"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            CANCEL E-SIGN
                                        </motion.button>
                                    )}
                                </>

                                {hasPendingActions && !sectorApproved && (
                                    <div className="px-2.5 py-1 bg-gradient-to-r from-[#F7A619] to-[#EA580C] text-white rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md animate-pulse">
                                        <AlertCircle className="w-3 h-3" />
                                        {pendingApprovalCourses} PENDING
                                        APPROVAL
                                    </div>
                                )}
                            </div>

                            {/* Metrics */}
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-1.5">
                                    <div
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                            sectorApproved
                                                ? 'bg-[#10B981]/10'
                                                : 'bg-[#044866]/10'
                                        }`}
                                    >
                                        <BookOpen
                                            className={`w-4 h-4 ${
                                                sectorApproved
                                                    ? 'text-[#10B981]'
                                                    : 'text-[#044866]'
                                            }`}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#64748B]">
                                            Courses
                                        </p>
                                        <p className="text-sm font-bold text-[#1A2332]">
                                            {sector.approvalCourses.length}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <div
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                            sectorApproved
                                                ? 'bg-[#10B981]/10'
                                                : 'bg-[#044866]/10'
                                        }`}
                                    >
                                        <Users
                                            className={`w-4 h-4 ${
                                                sectorApproved
                                                    ? 'text-[#10B981]'
                                                    : 'text-[#044866]'
                                            }`}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#64748B]">
                                            Students
                                        </p>
                                        <div className="flex items-center gap-1">
                                            <p className="text-sm font-bold text-[#1A2332]">
                                                {totalStudents}/{totalCapacity}
                                            </p>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setShowCapacityModal(true)
                                                }}
                                                className="w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-[#044866] transition-colors"
                                                title="Manage Capacity"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                </svg>
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <div
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                            utilizationRate >= 80
                                                ? 'bg-[#10B981]/10'
                                                : utilizationRate >= 50
                                                ? 'bg-[#F7A619]/10'
                                                : 'bg-[#64748B]/10'
                                        }`}
                                    >
                                        <Sparkles
                                            className={`w-4 h-4 ${
                                                utilizationRate >= 80
                                                    ? 'text-[#10B981]'
                                                    : utilizationRate >= 50
                                                    ? 'text-[#F7A619]'
                                                    : 'text-[#64748B]'
                                            }`}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#64748B]">
                                            Utilization
                                        </p>
                                        <p className="text-sm font-bold text-[#1A2332]">
                                            {utilizationRate}%
                                        </p>
                                    </div>
                                </div>

                                {approvedCourses > 0 && (
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#64748B]">
                                                Approved
                                            </p>
                                            <p className="text-sm font-bold text-[#10B981]">
                                                {approvedCourses}/
                                                {sector.approvalCourses.length}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Expand Button */}
                        <motion.button
                            animate={{ rotate: isSectorExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                sectorApproved
                                    ? 'bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#10B981]'
                                    : hasPendingActions
                                    ? 'bg-[#F7A619]/10 hover:bg-[#F7A619]/20 text-[#F7A619]'
                                    : 'bg-[#F8FAFB] hover:bg-[#E8F4F8] text-[#044866]'
                            }`}
                        >
                            <ChevronDown className="w-5 h-5" />
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Courses List */}
            <AnimatePresence>
                {isSectorExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 space-y-3">
                            {sector.approvalCourses.map(
                                (approval, courseIndex) => (
                                    <CourseCard
                                        approval={approval}
                                        key={approval.course.id}
                                        courseIndex={courseIndex}
                                        industry={industry as Industry}
                                        hasInitiatedESign={!!initiatedESign}
                                    />
                                )
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Supervisors Modal */}
            <SupervisorsModal
                isOpen={showSupervisorsModal}
                onClose={() => setShowSupervisorsModal(false)}
                supervisors={supervisorsData || []}
                sectorName={sector.sector.name}
                sectorId={sector.sector.id}
            />

            {/* Capacity Modal */}
            <SectorCapacityModal
                isOpen={showCapacityModal}
                onClose={() => setShowCapacityModal(false)}
                industryId={industry?.id || 0}
                sectorId={sector.sector.id}
                sectorName={sector.sector.name}
            />

            {/* Cancel E-sign Modal */}
            <CancelInitiatedEsignModal
                isOpen={showCancelEsignModal}
                onClose={() => setShowCancelEsignModal(false)}
                industryId={industry?.id || 0}
                sectorId={sector.sector.id}
                sectorName={sector.sector.name}
                esignData={initiatedESign}
            />
        </motion.div>
    )
}
