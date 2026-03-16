import {
    Building2,
    ChevronDown,
    CheckCircle,
    Calendar,
    MapPin,
    FileText,
    Loader2,
    AlertCircle,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppSelector } from '@redux/hooks'
import { CommonApi } from '@queries'

export function BusinessVerfication() {
    const [isExpanded, setIsExpanded] = useState(false)
    const industryDetail = useAppSelector(
        (state) => state.industry.industryDetail
    )
    const abnInProfile = industryDetail?.abn

    const getAbnDetails = CommonApi.FindWorkplace.useGetAbnDetails(
        abnInProfile!,
        {
            skip: !abnInProfile,
        }
    )

    const formatABN = (abn: string) => {
        if (!abn) return ''
        return abn.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4')
    }

    return (
        <div className="bg-linear-to-br from-[#FAFBFC] to-white rounded-xl border-2 border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-md transition-all">
            {/* Header */}
            <div className="bg-linear-to-r from-[#044866]/5 to-[#0D5468]/5 px-4 py-3 border-b border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#044866] to-[#0D5468] flex items-center justify-center shadow-md">
                            <Building2 className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-[#1A2332] text-sm">
                                Business Verification
                            </h3>
                            <p className="text-[9px] text-[#64748B]">
                                Verified via Australian Business Register (ABR)
                            </p>
                        </div>
                    </div>
                    {getAbnDetails?.data?.status === 'Active' &&
                        !getAbnDetails?.isLoading && (
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-[#10B981]/10 rounded-full border border-[#10B981]/30">
                                <CheckCircle className="w-3 h-3 text-[#10B981]" />
                                <span className="text-[9px] font-semibold text-[#10B981]">
                                    Verified
                                </span>
                            </div>
                        )}
                </div>
            </div>

            {/* Content Area */}
            <div className="px-4 py-4">
                <AnimatePresence mode="wait">
                    {getAbnDetails?.isLoading || getAbnDetails?.isFetching ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="py-12 flex flex-col items-center justify-center gap-3"
                        >
                            <Loader2 className="w-10 h-10 text-[#044866] animate-spin" />
                            <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">
                                Verifying Details...
                            </p>
                        </motion.div>
                    ) : getAbnDetails?.data ? (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-3"
                        >
                            {/* Summary Card */}
                            <div className="rounded-lg bg-white border-2 border-[#E2E8F0] p-3 hover:border-[#044866]/20 transition-colors shadow-xs">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-linear-to-br from-[#044866] to-[#0D5468] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                                        <Building2 className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[9px] text-[#044866] uppercase tracking-widest font-bold mb-1">
                                            Registered Entity
                                        </p>
                                        <p className="text-sm text-[#1A2332] font-extrabold mb-1 leading-tight break-words">
                                            {getAbnDetails?.data?.legalName ||
                                                getAbnDetails?.data
                                                    ?.businessName}
                                        </p>
                                        <p className="text-[11px] text-[#64748B]">
                                            ABN:{' '}
                                            <span className="font-bold text-[#044866]">
                                                {formatABN(
                                                    getAbnDetails?.data?.abn
                                                )}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="w-full text-xs py-2.5 h-auto font-bold border-2 border-[#E2E8F0] rounded-lg hover:bg-[#F9FAFB] hover:border-[#044866]/30 transition-all flex items-center justify-center gap-2 text-[#475569] shadow-xs active:scale-[0.98]"
                            >
                                <FileText className="w-4 h-4" />
                                {isExpanded ? 'Hide' : 'View'} Verification Full
                                Details
                                <motion.div
                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </motion.div>
                            </button>

                            {/* Details Panel */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-2 space-y-2">
                                            <DetailItem
                                                icon={CheckCircle}
                                                label="ABN Status"
                                                value={
                                                    getAbnDetails?.data?.status
                                                }
                                                active={
                                                    getAbnDetails?.data
                                                        ?.status === 'Active'
                                                }
                                            />
                                            <DetailItem
                                                icon={Building2}
                                                label="Entity Type"
                                                value={
                                                    getAbnDetails?.data
                                                        ?.entityType ||
                                                    'Private Company'
                                                }
                                            />
                                            <DetailItem
                                                icon={Calendar}
                                                label="Registration"
                                                value={`Since ${getAbnDetails?.data?.since || getAbnDetails?.data?.registeredSince || 'Unavailable'}`}
                                            />
                                            <DetailItem
                                                icon={MapPin}
                                                label="Location"
                                                value={
                                                    getAbnDetails?.data?.area ||
                                                    getAbnDetails?.data
                                                        ?.location ||
                                                    getAbnDetails?.data
                                                        ?.address ||
                                                    'NSW, Australia'
                                                }
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-6"
                        >
                            <div className="w-16 h-16 mx-auto rounded-2xl bg-linear-to-br from-[#FEF2F2] to-[#FFF5F5] flex items-center justify-center mb-4 shadow-sm">
                                <AlertCircle className="w-8 h-8 text-[#EF4444]" />
                            </div>
                            <p className="text-sm font-bold text-[#1A2332] mb-1">
                                {getAbnDetails?.isError
                                    ? 'Verification Error'
                                    : 'Verification Unavailable'}
                            </p>
                            <p className="text-[13px] text-[#64748B] px-4 leading-relaxed">
                                {getAbnDetails?.error ? (
                                    <span className="text-red-500 font-medium">
                                        {(getAbnDetails?.error as any)?.data
                                            ?.message ||
                                            (getAbnDetails?.error as any)
                                                ?.message ||
                                            'An unexpected error occurred during verification.'}
                                    </span>
                                ) : abnInProfile ? (
                                    `Could not find verified registration for ABN ${abnInProfile}`
                                ) : (
                                    'No ABN provided in this industry profile for verification.'
                                )}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

function DetailItem({
    icon: Icon,
    label,
    value,
    active,
}: {
    icon: any
    label: string
    value: string
    active?: boolean
}) {
    return (
        <div
            className={`rounded-lg p-3 border-2 flex items-center gap-3 transition-colors ${
                active
                    ? 'bg-[#10B981]/5 border-[#10B981]/20 hover:border-[#10B981]/40'
                    : 'bg-[#F8FAFB] border-[#E2E8F0] hover:border-[#CBD5E1]'
            }`}
        >
            <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-xs ${
                    active
                        ? 'bg-[#10B981] text-white'
                        : 'bg-white text-[#64748B]'
                }`}
            >
                <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[9px] text-[#64748B] uppercase tracking-wider font-bold">
                    {label}
                </p>
                <p
                    className={`text-xs font-bold truncate ${
                        active ? 'text-[#065F46]' : 'text-[#1A2332]'
                    }`}
                >
                    {value}
                </p>
            </div>
        </div>
    )
}
