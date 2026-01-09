import { AuthorizedUserComponent, Button, TextInput } from '@components'
import { UserRoles } from '@constants'
import { AnimatePresence, motion } from 'framer-motion'
import {
    AlertCircle,
    BookOpen,
    Filter,
    Plus,
    Search,
    Sparkles,
    TrendingUp,
    Users,
} from 'lucide-react'
import { useState } from 'react'
import { AddCourseRequestDialog } from '../modals'
import { getUserCredentials } from '@utils'

interface CoursesHeaderSectionProps {
    showSearch: boolean
    searchQuery: string
    totalCourses: number
    totalStudents: number
    totalCapacity: number
    overallCapacity: number
    onToggleSearch: () => void
    onSearchChange: (value: string) => void
    pendingActionsCount: number
    approvedCount: number
    existingCourses?: any[]
}

export function CoursesHeaderSection({
    showSearch,
    searchQuery,
    totalCourses,
    totalStudents,
    totalCapacity,
    overallCapacity,
    onToggleSearch,
    onSearchChange,
    pendingActionsCount,
    approvedCount,
    existingCourses = [],
}: CoursesHeaderSectionProps) {
    const [isAddCourseOpen, setIsAddCourseOpen] = useState(false)

    const user = getUserCredentials()
    const isLocal = process.env.NEXT_PUBLIC_NODE_ENV === 'local'
    const isAllowedUser = [4453, 78, 5714].includes(user?.id)
    const isAdmin = user?.role === UserRoles.ADMIN
    const showActionButtons = isLocal || isAllowedUser || isAdmin

    const courseCounts = [
        {
            title: 'Total Courses',
            value: totalCourses,
            icon: BookOpen,
            delay: 0.1,
            className:
                'bg-gradient-to-br from-[#044866] to-[#0D5468] text-white shadow-[#044866]/20',
            iconClass: 'bg-white/10 text-white',
            titleClass: 'text-white/80',
            valueClass: 'text-white',
            hasDecor: true,
        },
        {
            title: 'Active Students',
            value: totalStudents,
            subtext: `of ${totalCapacity} capacity`,
            icon: Users,
            delay: 0.15,
            className:
                'bg-white border-2 border-[#E2E8F0] group hover:border-[#044866]/20',
            iconClass:
                'bg-[#044866]/10 text-[#044866] group-hover:bg-[#044866]/20',
            titleClass: 'text-[#64748B]',
            valueClass: 'text-[#1A2332]',
            decorClass: 'bg-[#044866]/5 group-hover:bg-[#044866]/10',
        },
        {
            title: 'Utilization Rate',
            value: `${overallCapacity}%`,
            icon: TrendingUp,
            delay: 0.2,
            type: 'utilization',
            className: `border-2 ${
                overallCapacity >= 80
                    ? 'bg-gradient-to-br from-[#10B981]/10 to-[#059669]/10 border-[#10B981]/30 shadow-[#10B981]/10'
                    : overallCapacity >= 50
                    ? 'bg-gradient-to-br from-[#F7A619]/10 to-[#EA580C]/10 border-[#F7A619]/30 shadow-[#F7A619]/10'
                    : 'bg-white border-[#E2E8F0]'
            }`,
            iconClass:
                overallCapacity >= 80
                    ? 'bg-[#10B981]/20 text-[#10B981]'
                    : overallCapacity >= 50
                    ? 'bg-[#F7A619]/20 text-[#F7A619]'
                    : 'bg-[#64748B]/10 text-[#64748B]',
            titleClass: 'text-[#64748B]',
            valueClass:
                overallCapacity >= 80
                    ? 'text-[#10B981]'
                    : overallCapacity >= 50
                    ? 'text-[#F7A619]'
                    : 'text-[#1A2332]',
            decorClass:
                overallCapacity >= 80
                    ? 'bg-[#10B981]/10'
                    : overallCapacity >= 50
                    ? 'bg-[#F7A619]/10'
                    : 'bg-[#64748B]/5',
        },
        {
            title: 'Pending Actions',
            value: pendingActionsCount,
            subtext: 'Requires action',
            icon: AlertCircle,
            delay: 0.25,
            className:
                'bg-gradient-to-br from-[#F7A619]/10 to-[#EA580C]/10 border-2 border-[#F7A619]/30 shadow-[#F7A619]/10',
            iconClass: 'bg-[#F7A619]/20 text-[#F7A619]',
            titleClass: 'text-[#64748B]',
            valueClass: 'text-[#F7A619]',
            decorClass: 'bg-[#F7A619]/10',
            subtextClass: 'text-[#EA580C] font-medium',
        },
    ]

    return (
        <div className="space-y-4">
            {/* Main Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#1A2332] mb-1">
                        Courses & Programs
                    </h2>
                    <p className="text-sm text-[#64748B]">
                        Manage facility approvals, supervisors, and course
                        workflows
                    </p>
                </div>

                {/* <div className="flex items-center gap-2">
                    <Button
                        onClick={onToggleSearch}
                        variant="secondary"
                        className="gap-2 h-10"
                    >
                        <Search className="w-4 h-4" />
                        Search
                    </Button>
                    <Button variant="secondary" className="gap-2 h-10">
                        <Filter className="w-4 h-4" />
                        Filters
                    </Button>
                </div> */}
                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => setIsAddCourseOpen(true)}
                        className="bg-gradient-to-r from-[#044866] to-[#0D5468] hover:from-[#0D5468] hover:to-[#044866] text-white gap-2 h-10 shadow-md shadow-[#044866]/10"
                    >
                        <Plus className="w-4 h-4" />
                        Add Course
                    </Button>
                </div>
            </div>

            <AddCourseRequestDialog
                open={isAddCourseOpen}
                onOpenChange={setIsAddCourseOpen}
                existingCourses={existingCourses}
            />

            {/* Search Bar */}
            <AnimatePresence>
                {showSearch && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                            <TextInput
                                name="search"
                                value={searchQuery}
                                onChange={(e: any) =>
                                    onSearchChange(e.target.value)
                                }
                                placeholder="Search courses, codes, or programs..."
                                className="pl-10 h-11 bg-white border-[#E2E8F0] focus:border-[#044866]"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Statistics Cards */}
            <div className="grid grid-cols-4 gap-2">
                {courseCounts.map((card, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: card.delay }}
                        className={`rounded-lg p-3 shadow-lg relative overflow-hidden transition-all ${card.className}`}
                    >
                        {card.hasDecor ? (
                            <>
                                <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-8 -mb-9" />
                                <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/5 rounded-full -ml-4 -mb-4" />
                            </>
                        ) : (
                            <div
                                className={`absolute bottom-0 right-0 w-20 h-20 rounded-full -mr-8 -mb-8 transition-colors ${card.decorClass}`}
                            />
                        )}

                        <div className="relative">
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <p
                                        className={`${card.titleClass} text-xs mb-0.5 truncate`}
                                    >
                                        {card.title}
                                    </p>
                                    <p
                                        className={`text-[27px] font-bold ${card.valueClass} truncate`}
                                    >
                                        {card.value}
                                    </p>
                                </div>
                                <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${card.iconClass} shrink-0`}
                                >
                                    <card.icon className="w-4 h-4" />
                                </div>
                            </div>

                            {card.subtext && (
                                <p
                                    className={`text-[11px] mt-1 ${
                                        card.subtextClass || 'text-[#64748B]'
                                    }`}
                                >
                                    {card.subtext}
                                </p>
                            )}

                            {card.type === 'utilization' && (
                                <div className="mt-2 bg-[#E2E8F0] rounded-full h-1 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${overallCapacity}%`,
                                        }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className={`h-full rounded-full ${
                                            overallCapacity >= 80
                                                ? 'bg-gradient-to-r from-[#10B981] to-[#059669]'
                                                : overallCapacity >= 50
                                                ? 'bg-gradient-to-r from-[#F7A619] to-[#EA580C]'
                                                : 'bg-gradient-to-r from-[#64748B] to-[#475569]'
                                        }`}
                                    />
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-[#E8F4F8] to-[#F8FAFB] border border-[#044866]/10 rounded-xl p-4"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#044866] to-[#0D5468] rounded-lg flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-[#1A2332]">
                                Workflow Overview
                            </p>
                            <p className="text-xs text-[#64748B]">
                                Track facility approvals and course setup
                                progress
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-[#E2E8F0]">
                            <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                            <span className="text-xs text-[#64748B]">
                                {approvedCount} Approved
                            </span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-[#F7A619]/30">
                            <div className="w-2 h-2 rounded-full bg-[#F7A619] animate-pulse" />
                            <span className="text-xs text-[#64748B]">
                                {pendingActionsCount} Pending Review
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
