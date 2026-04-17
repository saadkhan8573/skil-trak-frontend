'use client'
import { Permissions } from '@components'
import { usePermissionCheck } from '@components/Permissions/hooks/usePermissions'
import { ImportStudentsModal } from '@partials'
import { RtoV2Api } from '@redux'
import { PermissionType } from '@types'
import { AnimatePresence, motion } from 'framer-motion'
import {
    Bell as BellIcon,
    Briefcase,
    Building2,
    Calendar,
    CheckSquare,
    Clock,
    FileSignature,
    Flag,
    GraduationCap,
    LayoutDashboard,
    Mail,
    Send,
    Tickets,
    Upload,
    User2,
    Users,
    UserX,
    FileWarning,
    ChevronDown,
    ChevronUp,
} from 'lucide-react'
import { useRouter } from 'next/router'
import { Fragment, ReactElement, useState } from 'react'

const menuSections = (navBarCounts: {
    waitingForRto: number
    openIssues: number
    pendingSubmissions: number
    pendingSign: number
    allStudents: number
    appointments: number
    emails: number
    notification: number
    nonContactable: number
    snoozed: number
    inCompleteSubmissions?: number
    placementRequests?: number
    skiltrakFlagged?: number
}) => [
    {
        title: 'Dashboard',
        items: [
            {
                icon: LayoutDashboard,
                label: 'Dashboard',
                key: 'Dashboard',
                path: '/portals/rto/dashboard',
                // badge: '9',
                bg: 'bg-gradient-to-r from-[#044866]/10 to-[#0D5468]/10 border border-[#044866]/30 shadow-sm',
                iconBg: 'bg-gradient-to-br from-[#044866] to-[#0D5468]',
                badgeBg: 'bg-[#044866]',
                text: 'text-[#044866]',
            },
        ],
    },
    {
        title: '🚨 Action Required',
        showCount: true,
        totalCount: 40,
        items: [
            {
                icon: FileSignature,
                label: 'Sign Documents',
                key: 'Sign Documents',
                badge: navBarCounts?.pendingSign,
                bg: 'bg-red-50 hover:bg-red-100 border border-red-200',
                iconBg: 'bg-red-200 !text-red-500',
                badgeBg: 'bg-red-500',
                text: 'text-slate-700',
                path: '/portals/rto/action-required/sign-documents?tab=pending',
                permissions: [PermissionType.SIGN_DOCUMENTS],
            },
            {
                icon: CheckSquare,
                label: 'Approve Placements',
                key: 'Approve Placements',
                badge: navBarCounts?.waitingForRto,
                bg: 'bg-red-50 hover:bg-red-100 border border-red-200',
                iconBg: 'bg-red-200 !text-red-500',
                badgeBg: 'bg-red-500',
                text: 'text-slate-700',
                path: '/portals/rto/action-required/approve-placement?tab=pending',
                permissions: [PermissionType.APPROVE_PLACEMENTS],
            },
            {
                icon: Send,
                label: 'Submissions',
                key: 'Submissions',
                badge: navBarCounts?.pendingSubmissions,
                path: '/portals/rto/action-required/submissions?tab=submissions-requiring-review',
                bg: 'bg-red-50 hover:bg-red-100 border border-red-200',
                iconBg: 'bg-red-200 !text-red-500',
                badgeBg: 'bg-red-500',
                text: 'text-slate-700',
                permissions: [PermissionType.SUBMISSIONS],
            },
            {
                icon: Flag,
                label: 'Resolve Issues',
                key: 'Resolve Issues',
                path: '/portals/rto/action-required/resolve-issues?tab=open-issues',
                badge: navBarCounts?.openIssues,
                bg: 'bg-red-50 hover:bg-red-100 border border-red-200',
                iconBg: 'bg-red-200 !text-red-500',
                badgeBg: 'bg-red-500',
                text: 'text-slate-700',
                permissions: [PermissionType.RESOLVE_ISSUES],
            },
            {
                icon: UserX,
                label: 'Non Contactable',
                key: 'Non Contactable',
                path: '/portals/rto/action-required/non-contactable',
                badge: navBarCounts?.nonContactable,
                bg: 'bg-red-50 hover:bg-red-100 border border-red-200',
                iconBg: 'bg-red-200 !text-red-500',
                badgeBg: 'bg-red-500',
                text: 'text-slate-700',
            },
            {
                icon: Clock,
                label: 'Snoozed',
                key: 'Snoozed',
                path: '/portals/rto/action-required/snoozed',
                badge: navBarCounts?.snoozed,
                bg: 'bg-red-50 hover:bg-red-100 border border-red-200',
                iconBg: 'bg-red-200 !text-red-500',
                badgeBg: 'bg-red-500',
                text: 'text-slate-700',
            },
            {
                icon: FileWarning,
                label: 'Incomplete Submission',
                key: 'Incomplete Submission',
                path: '/portals/rto/action-required/incomplete-submission',
                badge: navBarCounts?.inCompleteSubmissions,
                bg: 'bg-red-50 hover:bg-red-100 border border-red-200',
                iconBg: 'bg-red-200 !text-red-500',
                badgeBg: 'bg-red-500',
                text: 'text-slate-700',
                permissions: [PermissionType.SUBMISSIONS],
            },
            {
                icon: FileWarning,
                label: 'Skiltrak Flagged Students',
                key: 'Skiltrak Flagged Students',
                path: '/portals/rto/action-required/skiltrak-flagged-students',
                badge: navBarCounts?.skiltrakFlagged,
                bg: 'bg-red-50 hover:bg-red-100 border border-red-200',
                iconBg: 'bg-red-200 !text-red-500',
                badgeBg: 'bg-red-500',
                text: 'text-slate-700',
            },
        ],
    },
    {
        title: 'Students & Placements',
        items: [
            {
                icon: Users,
                label: 'All Students',
                key: 'All Students',
                badge: navBarCounts?.allStudents,
                path: '/portals/rto/students-and-placements/all-students?tab=active',
                bg: 'hover:bg-gray-100 border border-gray-200',
                iconBg: 'bg-gray-200 !text-slate-700',
                badgeBg: 'bg-gray-200 !text-slate-700',
                text: 'text-slate-700',
                permissions: [PermissionType.ALL_STUDENTS],
            },
            {
                icon: Briefcase,
                label: 'Placement Requests',
                key: 'Placement Requests',
                path: '/portals/rto/students-and-placements/placement-requests?tab=student-need-wp',
                bg: 'hover:bg-gray-100 border border-gray-200',
                iconBg: 'bg-gray-200 !text-slate-700',
                badgeBg: 'bg-gray-200 !text-slate-700',
                text: 'text-slate-700',
                badge: navBarCounts?.placementRequests,
                permissions: [PermissionType.PLACEMENT_REQUESTS],
            },
            // {
            //     icon: Briefcase,
            //     label: 'Student Schedule',
            //     key: 'Student Schedule',
            //     path: '/portals/rto/students-and-placements/student-schedule',
            //     bg: 'hover:bg-gray-100 border border-gray-200',
            //     iconBg: 'bg-gray-200 !text-slate-700',
            //     badgeBg: 'bg-gray-200 !text-slate-700',
            //     text: 'text-slate-700',
            // },
            {
                icon: Upload,
                label: 'Import Students',
                key: 'Import Students',
                bg: 'hover:bg-gray-100 border border-gray-200',
                iconBg: 'bg-gray-200 !text-slate-700',
                badgeBg: 'bg-gray-200 !text-slate-700',
                text: 'text-slate-700',
                permissions: [PermissionType.IMPORT_STUDENTS],
            },
        ],
    },
    {
        title: 'Communications',
        items: [
            {
                icon: Mail,
                label: 'Emails',
                key: 'Emails',
                path: '/portals/rto/communications/e-mails',
                badge: navBarCounts?.emails,
                bg: 'hover:bg-gray-100 border border-gray-200',
                iconBg: 'bg-gray-200 !text-slate-700',
                badgeBg: 'bg-gray-200 !text-slate-700',
                text: 'text-slate-700',
                permissions: [PermissionType.MANAGE_EMAILS],
            },
            {
                icon: Calendar,
                label: 'Appointments',
                path: '/portals/rto/communications/appointments',
                key: 'Appointments',
                badge: navBarCounts?.appointments,
                bg: 'hover:bg-gray-100 border border-gray-200',
                iconBg: 'bg-gray-200 !text-slate-700',
                badgeBg: 'bg-gray-200 !text-slate-700',
                text: 'text-slate-700',
                permissions: [PermissionType.APPOINTMENTS],
            },
            {
                icon: BellIcon,
                label: 'Notifications',
                key: 'Notifications',
                badge: navBarCounts?.notification,
                path: '/portals/rto/communications/notifications',
                bg: 'hover:bg-gray-100 border border-gray-200',
                iconBg: 'bg-gray-200 !text-slate-700',
                badgeBg: 'bg-gray-200 !text-slate-700',
                text: 'text-slate-700',
                permissions: [PermissionType.NOTIFICATIONS],
            },
            {
                icon: Tickets,
                label: 'Tickets',
                key: 'Tickets',
                // badge: '3',
                path: '/portals/rto/communications/tickets?tab=all-tickets',
                bg: 'hover:bg-gray-100 border border-gray-200',
                iconBg: 'bg-gray-200 !text-slate-700',
                badgeBg: 'bg-gray-200 !text-slate-700',
                text: 'text-slate-700',
                permissions: [PermissionType.VIEW_ALL_TICKETS],
            },
        ],
    },
    {
        title: 'Manage',
        items: [
            // {
            //     icon: Settings,
            //     label: 'Setup for automation',
            //     key: 'Setup for automation',
            //     badge: '60%',
            //     bg: 'bg-amber-50 hover:bg-amber-100 border border-amber-300',
            //     iconBg: 'bg-amber-200 !text-amber-500',
            //     badgeBg: 'bg-gray-100 !text-slate-700',
            //     text: 'text-slate-700',
            // },
            {
                icon: Building2,
                label: 'Industries',
                key: 'Industries',
                path: '/portals/rto/manage/industries?tab=your-industries',
                bg: 'hover:bg-gray-100 border border-gray-200',
                iconBg: 'bg-gray-200 !text-slate-700',
                badgeBg: 'bg-gray-200 !text-slate-700',
                text: 'text-slate-700',
                permissions: [PermissionType.MANAGE_INDUSTRIES],
            },
            {
                icon: User2,
                label: 'Team',
                path: '/portals/rto/manage/team?tab=my-team',
                key: 'User',
                bg: 'hover:bg-gray-100 border border-gray-200',
                iconBg: 'bg-gray-200 !text-slate-700',
                badgeBg: 'bg-gray-200 !text-slate-700',
                text: 'text-slate-700',
                permissions: [PermissionType.TEAM_MANAGEMENT],
            },
            {
                icon: GraduationCap,
                label: 'Courses',
                key: 'Courses',
                path: '/portals/rto/manage/courses',
                bg: 'hover:bg-gray-100 border border-gray-200',
                iconBg: 'bg-gray-200 !text-slate-700',
                badgeBg: 'bg-gray-200 !text-slate-700',
                text: 'text-slate-700',
                permissions: [PermissionType.COURSES],
            },
        ],
    },
]

export const RtoSidebar = ({ isOpen, onClose, onNavigate, activeKey }: any) => {
    const { data: navBarCounts } = RtoV2Api.Dashboard.navBarCounts()
    const { checkPermission } = usePermissionCheck()
    const [expandedSections, setExpandedSections] = useState<
        Record<string, boolean>
    >({})

    const toggleSection = (title: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [title]: !prev[title],
        }))
    }

    const [modal, setModal] = useState<ReactElement | null>(null)
    const router = useRouter()
    const onCancel = () => setModal(null)
    const Drawer = (
        <motion.aside
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-sidebar-border flex flex-col"
            role="dialog"
            aria-modal="true"
        >
            {/* ============================= HEADER ============================= */}
            <div className="flex items-center justify-between p-4 border-b border-sidebar-border shrink-0">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white">
                        <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="font-semibold">SkilTrak</div>
                        <div className="text-xs text-muted-foreground">
                            RTO Management
                        </div>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-md hover:bg-muted/30"
                >
                    ✕
                </button>
            </div>

            {/* ============================= SCROLLABLE CONTENT ============================= */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {menuSections(navBarCounts!).map((section) => {
                    const visibleItems = section.items.filter((item: any) => {
                        if (item.permissions) {
                            return checkPermission(item.permissions)
                        }
                        return true
                    })

                    if (visibleItems.length === 0) return null

                    return (
                        <div
                            key={section.title}
                            className="hover:shadow-premium-lg"
                        >
                            <div className="flex items-center justify-between px-1 mb-2">
                                <div className="text-xs uppercase font-semibold text-muted-foreground">
                                    {section.title}
                                </div>
                                {/* {section.showCount && section.totalCount && (
                                <div className="text-[11px] bg-destructive text-white px-2 rounded">
                                    {section.totalCount}
                                </div>
                            )} */}
                            </div>

                            <ul className="space-y-1">
                                {(expandedSections[section.title]
                                    ? visibleItems
                                    : visibleItems.slice(0, 4)
                                ).map((item: any) => {
                                    const MenuItem = (
                                        <li key={item.key}>
                                            <button
                                                onClick={() =>
                                                    onNavigate?.(item.key)
                                                }
                                                className={`w-full flex justify-between items-center gap-3 p-2 rounded-xl transition ${item.bg} hover:opacity-90 cursor-pointer`}
                                            >
                                                <div className="flex items-center gap-x-2">
                                                    <div
                                                        className={`p-2 rounded-xl shrink-0 ${item.iconBg} text-white`}
                                                    >
                                                        <item.icon className="h-4 w-4" />
                                                    </div>

                                                    <span
                                                        className={`flex text-sm font-medium ${item.text}`}
                                                    >
                                                        {item.label}
                                                    </span>
                                                </div>

                                                {/* {item.badge && (
                                            <span
                                                className={`text-[11px] px-2 py-0.5 rounded-full text-white ${item.badgeBg}`}
                                            >
                                                {item.badge}
                                            </span>
                                        )} */}
                                            </button>
                                        </li>
                                    )

                                    if (item.permissions) {
                                        return (
                                            <Permissions
                                                key={item.key}
                                                permission={item.permissions}
                                            >
                                                {MenuItem}
                                            </Permissions>
                                        )
                                    }

                                    return MenuItem
                                })}
                                {visibleItems.length > 4 && (
                                    <li>
                                        <button
                                            onClick={() =>
                                                toggleSection(section.title)
                                            }
                                            className="w-full flex justify-center items-center py-2 text-[11px] font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 rounded-xl transition cursor-pointer mt-1 border border-dashed border-slate-200"
                                        >
                                            {expandedSections[section.title]
                                                ? 'Show Less'
                                                : 'Show More'}
                                            {expandedSections[section.title] ? (
                                                <ChevronUp className="h-3 w-3 ml-1" />
                                            ) : (
                                                <ChevronDown className="h-3 w-3 ml-1" />
                                            )}
                                        </button>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )
                })}
            </nav>

            {/* ============================= FOOTER ============================= */}
            <div className="p-4 border-t border-sidebar-border shrink-0">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2.5">
                        <div className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
                        </div>
                        <span>System Online</span>
                    </div>
                    <div className="text-[12px] font-semibold text-primary">
                        v1.0.3
                    </div>
                </div>
            </div>
        </motion.aside>
    )

    const onClickImportStudents = () => {
        setModal(<ImportStudentsModal onCancel={onCancel} />)
    }

    return (
        <>
            {modal}
            {/*======================== Desktop sidebar ======================= */}
            <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
                {/* ================== FIXED TOP LOGO AREA ================= */}
                <div className="p-4 border-b border-sidebar-border shrink-0">
                    <div className="flex items-center gap-3 cursor-pointer group relative">
                        <div className="relative">
                            <div className="absolute inset-0 bg-linear-to-br from-[#044866] to-[#0D5468] rounded-2xl blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
                            <div className="relative h-12 w-12 rounded-2xl bg-linear-to-br from-primaryNew to-[#0D5468] flex items-center justify-center shadow-premium group-hover:shadow-glow-primary transition-all group-hover:scale-105">
                                <GraduationCap
                                    className="h-6 w-6 text-white"
                                    strokeWidth={2.5}
                                />
                                <div className="absolute inset-0 rounded-2xl bg-linear-to-t from-white/0 to-white/20"></div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[#044866] tracking-tight">
                                SkilTrak
                            </h2>
                            <p className="text-xs text-slate-500 font-semibold tracking-wide">
                                RTO MANAGEMENT
                            </p>
                        </div>
                    </div>
                </div>

                {/* ======================= SCROLLABLE MENU SECTION ========================= */}
                <div className="flex-1 overflow-y-auto px-4 py-3 remove-scrollbar scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {menuSections(navBarCounts!).map((section, idx) => {
                        const visibleItems = section.items.filter(
                            (item: any) => {
                                if (item.permissions) {
                                    return checkPermission(item.permissions)
                                }
                                return true
                            }
                        )

                        if (visibleItems.length === 0) return null

                        return (
                            <div key={section.title}>
                                <div
                                    className={`${
                                        idx > 0
                                            ? 'pt-8 mt-3 mx-8! border-t border-sidebar-border/30'
                                            : ''
                                    } mb-1 last:mb-0`}
                                />
                                <div className="flex items-center justify-between px-1 mb-2">
                                    <div className="text-[10px] uppercase tracking-wide font-medium text-slate-500">
                                        {section.title}
                                    </div>
                                    {/* {section.showCount && section.totalCount && (
                                    <div className="text-[10px] bg-error text-white flex items-center animate-pulse justify-center text-center rounded-full size-5">
                                        {section.totalCount}
                                    </div>
                                )} */}
                                </div>

                                <ul className="space-y-2">
                                    {(expandedSections[section.title]
                                        ? visibleItems
                                        : visibleItems.slice(0, 4)
                                    ).map((item: any) => {
                                        const MenuItem = (
                                            <li
                                                key={item.key}
                                                className="cursor-pointer"
                                            >
                                                <button
                                                    onClick={() => {
                                                        if (
                                                            item.key ===
                                                            'Import Students'
                                                        ) {
                                                            onClickImportStudents()
                                                        } else if (item.path) {
                                                            router.push(
                                                                item.path
                                                            )
                                                        }
                                                        onNavigate?.(item.key)
                                                    }}
                                                    className={`w-full flex justify-between items-center p-2 rounded-md transition ${item.bg} hover:opacity-90 cursor-pointer`}
                                                >
                                                    <div className="flex items-center gap-x-2">
                                                        <div
                                                            className={`p-1.5 rounded-xl shrink-0 ${item.iconBg} text-white`}
                                                        >
                                                            <item.icon className="h-4 w-4" />
                                                        </div>

                                                        <span
                                                            className={`flex text-xs font-medium ${item.text}`}
                                                        >
                                                            {item.label}
                                                        </span>
                                                    </div>

                                                    {item.badge && (
                                                        <span
                                                            className={`text-[11px] px-2 py-0.5 rounded-full text-white ${item.badgeBg}`}
                                                        >
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </button>
                                            </li>
                                        )

                                        if (item.permissions) {
                                            return (
                                                <Permissions
                                                    key={item.key}
                                                    permission={
                                                        item.permissions
                                                    }
                                                >
                                                    {MenuItem}
                                                </Permissions>
                                            )
                                        }

                                        return MenuItem
                                    })}
                                    {visibleItems.length > 4 && (
                                        <li>
                                            <button
                                                onClick={() =>
                                                    toggleSection(section.title)
                                                }
                                                className="w-full flex justify-center items-center py-1.5 text-[11px] font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 rounded-xl transition cursor-pointer mt-1 border border-dashed border-slate-200"
                                            >
                                                {expandedSections[section.title]
                                                    ? 'Show Less'
                                                    : 'Show More'}
                                                {expandedSections[
                                                    section.title
                                                ] ? (
                                                    <ChevronUp className="h-3 w-3 ml-1" />
                                                ) : (
                                                    <ChevronDown className="h-3 w-3 ml-1" />
                                                )}
                                            </button>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )
                    })}
                </div>

                {/* ====================== FIXED FOOTER  ================== */}
                <div className="p-4 border-t border-sidebar-border shrink-0">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-2.5">
                            <div className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
                            </div>
                            <span>System Online</span>
                        </div>
                        <div className="text-[12px] font-semibold text-primary">
                            v1.0.3
                        </div>
                    </div>
                </div>
            </aside>

            {/* ============== Mobile drawer ======== */}
            <AnimatePresence>
                {isOpen && (
                    <Fragment>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            onClick={onClose}
                            className="fixed inset-0 z-30 bg-black"
                            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                        />

                        {Drawer}
                    </Fragment>
                )}
            </AnimatePresence>
        </>
    )
}
