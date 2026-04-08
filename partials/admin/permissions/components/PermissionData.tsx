import React, { useState } from 'react'
import {
    Shield,
    FileSignature,
    CheckCircle2,
    Users,
    MapPin,
    Calendar,
    Upload,
    Mail,
    MessageSquare,
    CalendarDays,
    Headphones,
    Bell,
    Settings,
    Building2,
    GraduationCap,
    Database,
    BarChart3,
    CreditCard,
    Sparkles,
    Phone,
    Lock,
    Save,
    RefreshCw,
    Download,
    Zap,
    Send,
    Flag,
    Contact,
    Video,
    Activity,
    UserCog,
    AlertCircle,
} from 'lucide-react'
import { Card, Button, Badge, Typography, ConfigTabs } from '@components'
import { Switch } from '@components/inputs'
import { useNotification } from '@hooks/useNotification'
import { AdminHeader } from './AdminHeader'
import { PermissionCard } from './PermissionCard'

import { Permission, FeatureUnlock, RTOStats } from './tabs/types'
import { OverviewTab } from './tabs/OverviewTab'
import { PermissionsTab } from './tabs/PermissionsTab'
import { TeamPermissionsTab } from './tabs/TeamPermissionsTab'
import { FeaturesTab } from './tabs/FeaturesTab'
import { BillingTab } from './tabs/BillingTab'
import { AdvancedTab } from './tabs/AdvancedTab'

export const SkilTrakAdminPage = () => {
    const { notification } = useNotification()
    const [selectedRTO, setSelectedRTO] = useState(
        'Melbourne Training Institute'
    )
    const rtoOptions = [
        {
            label: 'Melbourne Training Institute',
            value: 'Melbourne Training Institute',
        },
        { label: 'Sydney Technical School', value: 'Sydney Technical School' },
        { label: 'Brisbane Academy', value: 'Brisbane Academy' },
        { label: 'Perth Education Center', value: 'Perth Education Center' },
    ]
    const [searchQuery, setSearchQuery] = useState('')
    const [showDisabledOnly, setShowDisabledOnly] = useState(false)
    const [expandedSections, setExpandedSections] = useState<string[]>(['all'])

    // RTO Statistics
    const [rtoStats] = useState<RTOStats>({
        totalUsers: 245,
        activeStudents: 187,
        industryPartners: 12,
        pendingActions: 22,
        storageUsed: 45.2,
        storageLimit: 100,
        monthlyApiCalls: 2340,
        apiCallLimit: 10000,
    })

    // Dashboard permissions
    const [dashboardPermissions, setDashboardPermissions] = useState<
        Permission[]
    >([
        {
            id: 'sign-docs',
            label: 'Sign Documents',
            description: 'Ability to e-sign placement and compliance documents',
            enabled: true,
            type: 'all',
            icon: FileSignature,
            category: 'core',
        },
        {
            id: 'approve-placements',
            label: 'Approve Placements',
            description: 'Review and approve student placement requests',
            enabled: true,
            type: 'permission',
            icon: CheckCircle2,
            category: 'core',
        },
        {
            id: 'submissions',
            label: 'Submissions',
            description: 'View and manage student work submissions',
            enabled: true,
            type: 'permission',
            icon: Send,
            category: 'core',
        },
        {
            id: 'resolve-issues',
            label: 'Resolve Issues',
            description: 'Handle and resolve placement and student issues',
            enabled: true,
            type: 'all',
            icon: Flag,
            category: 'core',
        },
    ])

    // Students & Placements permissions
    const [studentsPermissions, setStudentsPermissions] = useState<
        Permission[]
    >([
        {
            id: 'all-students',
            label: 'All Students',
            description: 'View and manage all student records',
            enabled: true,
            type: 'all',
            icon: Users,
            category: 'core',
        },
        {
            id: 'placement-requests',
            label: 'Placement Requests',
            description: 'Manage incoming placement requests',
            enabled: true,
            type: 'permission',
            icon: MapPin,
            category: 'core',
        },
        {
            id: 'student-schedule',
            label: 'Student Schedule',
            description: 'View and manage student placement schedules',
            enabled: false,
            type: 'permission',
            icon: Calendar,
            category: 'premium',
        },
        {
            id: 'import-students',
            label: 'Import Students',
            description: 'Bulk import student data via CSV/Excel',
            enabled: true,
            type: 'all',
            icon: Upload,
            category: 'core',
        },
    ])

    // Communications permissions
    const [communicationsPermissions, setCommPermissions] = useState<
        Permission[]
    >([
        {
            id: 'emails',
            label: 'Emails',
            description: 'Send and manage email communications',
            enabled: true,
            type: 'all',
            icon: Mail,
            category: 'core',
        },
        {
            id: 'auto-email-reminders',
            label: 'Auto Email Reminders',
            description: 'Automated reminder emails for deadlines',
            enabled: true,
            type: 'toggle',
            icon: Mail,
            category: 'automation',
        },
        {
            id: 'text-messages',
            label: 'Text Messages (SMS)',
            description: 'Send SMS notifications to students',
            enabled: true,
            type: 'toggle',
            icon: MessageSquare,
            category: 'premium',
        },
        {
            id: 'appointments',
            label: 'Appointments',
            description: 'Schedule and manage appointments',
            enabled: true,
            type: 'all',
            icon: CalendarDays,
            category: 'core',
        },
        {
            id: 'auto-support',
            label: 'Auto Support Tickets',
            description: 'Automated support ticket creation',
            enabled: true,
            type: 'permission',
            icon: Headphones,
            category: 'automation',
        },
        {
            id: 'notifications',
            label: 'Notifications',
            description: 'System and push notifications',
            enabled: true,
            type: 'all',
            icon: Bell,
            category: 'core',
        },
        {
            id: 'video-calls',
            label: 'Video Calls',
            description: 'Integrated video calling for appointments',
            enabled: true,
            type: 'permission',
            icon: Video,
            category: 'premium',
        },
    ])

    // Manage permissions
    const [managePermissions, setManagePermissions] = useState<Permission[]>([
        {
            id: 'automation-setup',
            label: 'Setup for Automation',
            description: 'Configure automation rules and workflows',
            enabled: true,
            type: 'permission',
            icon: Zap,
            category: 'automation',
        },
        {
            id: 'industries',
            label: 'Industries Management',
            description: 'Add, edit, and manage industry partners',
            enabled: true,
            type: 'permission',
            icon: Building2,
            category: 'core',
        },
        {
            id: 'team',
            label: 'Team Management',
            description: 'Manage staff members and permissions',
            enabled: true,
            type: 'permission',
            icon: UserCog,
            category: 'core',
        },
        {
            id: 'courses',
            label: 'Courses Management',
            description: 'Configure courses and qualifications',
            enabled: true,
            type: 'permission',
            icon: GraduationCap,
            category: 'core',
        },
        {
            id: 'contacts',
            label: 'Contacts Management',
            description: 'Manage contact directory',
            enabled: true,
            type: 'permission',
            icon: Contact,
            category: 'core',
        },
    ])

    // More Tools permissions
    const [moreToolsPermissions, setMoreToolsPermissions] = useState<
        Permission[]
    >([
        {
            id: 'data-storage',
            label: 'Data Storage',
            description: 'File storage and document management',
            enabled: true,
            type: 'all',
            icon: Database,
            category: 'core',
        },
        {
            id: 'reports',
            label: 'Reports & Analytics',
            description: 'Generate and export reports',
            enabled: true,
            type: 'permission',
            icon: BarChart3,
            category: 'core',
        },
        {
            id: 'support',
            label: 'Support Center',
            description: 'Access to support and help resources',
            enabled: true,
            type: 'all',
            icon: Headphones,
            category: 'core',
        },
        {
            id: 'settings',
            label: 'Settings',
            description: 'System and account settings',
            enabled: true,
            type: 'all',
            icon: Settings,
            category: 'core',
        },
    ])

    // Package settings
    const [packageSettings, setPackageSettings] = useState({
        organizationType: 'RTO',
        pricingTier: 'Professional',
        aiCallsAddon: true,
        adminSupportAddon: false,
        networkCreditsTopup: 500,
        customBranding: true,
        whiteLabel: false,
        apiAccess: true,
    })

    // Feature unlocks based on industry network
    const [featureUnlocks, setFeatureUnlocks] = useState<FeatureUnlock[]>([
        {
            id: 'ai-search',
            feature: 'AI Search',
            description: 'Smart search powered by AI',
            requiredPartners: 5,
            currentPartners: 12,
            unlocked: true,
            benefit: 'Find students, placements, and records instantly',
        },
        {
            id: 'talent-pool',
            feature: 'Talent Pool Network & Jobs Page',
            description: 'Share students with partner industries',
            requiredPartners: 10,
            currentPartners: 12,
            unlocked: true,
            benefit: 'Increase placement opportunities by 300%',
        },
        {
            id: 'student-schedule',
            feature: 'Student Schedule',
            description: 'Advanced scheduling and calendar',
            requiredPartners: 15,
            currentPartners: 12,
            unlocked: false,
            benefit: '3 more partners needed - Better time management',
        },
        {
            id: 'chatbot',
            feature: 'AI Chatbot',
            description: '24/7 automated student support',
            requiredPartners: 30,
            currentPartners: 12,
            unlocked: false,
            benefit: '18 more partners needed - Reduce support workload by 60%',
        },
        {
            id: 'bulk-matching',
            feature: 'Bulk Students Matching',
            description: 'AI-powered bulk placement matching',
            requiredPartners: 40,
            currentPartners: 12,
            unlocked: false,
            benefit: '28 more partners needed - Match 100+ students in minutes',
        },
    ])

    // AI Calling settings
    const [aiCallingEnabled, setAiCallingEnabled] = useState(true)
    const [aiCallingLimit, setAiCallingLimit] = useState(100)
    const [aiCallingRate] = useState(10) // AUD per hour
    const [aiCallingStages, setAiCallingStages] = useState([
        { id: 'initial-contact', label: 'Initial Contact', enabled: true },
        { id: 'follow-up', label: 'Follow-up Call', enabled: true },
        {
            id: 'placement-reminder',
            label: 'Placement Reminder',
            enabled: true,
        },
        {
            id: 'feedback-collection',
            label: 'Feedback Collection',
            enabled: false,
        },
        { id: 'completion-check', label: 'Completion Check-in', enabled: true },
    ])

    // Industry listing
    const [industryListingEnabled, setIndustryListingEnabled] = useState(true)
    const [industryListingSectors, setIndustryListingSectors] = useState([
        { sector: 'Healthcare', enabled: true, costPerMonth: 49 },
        { sector: 'IT & Technology', enabled: true, costPerMonth: 49 },
        { sector: 'Hospitality', enabled: true, costPerMonth: 49 },
        { sector: 'Business Services', enabled: false, costPerMonth: 49 },
        { sector: 'Construction', enabled: false, costPerMonth: 49 },
    ])

    // Partner Sharing Settings
    const [sharingPartnersEnabled, setSharingPartnersEnabled] = useState(true)
    const [autoShareNewPartners, setAutoShareNewPartners] = useState(true)
    const [shareStudentData, setShareStudentData] = useState(false)
    const [sharePlacementData, setSharePlacementData] = useState(true)

    // Other permissions - Comprehensive list
    const [otherPermissions, setOtherPermissions] = useState([
        {
            id: 'allow-logbook',
            label: 'Allow Logbook',
            description: 'Digital logbook tracking',
            enabled: true,
            category: 'student-features',
        },
        {
            id: 'allow-update',
            label: 'Allow Update',
            description: 'Update student and placement info',
            enabled: true,
            category: 'core',
        },
        {
            id: 'allow-new-dashboard',
            label: 'Allow New Dashboard',
            description: 'Access to latest dashboard version',
            enabled: true,
            category: 'interface',
        },
        {
            id: 'allow-auto-complete',
            label: 'Allow Auto Complete',
            description: 'AI-powered form completion',
            enabled: true,
            category: 'automation',
        },
        {
            id: 'allow-workplace-approval',
            label: 'Allow Workplace Request Approval',
            description: 'Approve new workplaces',
            enabled: true,
            category: 'approvals',
        },
        {
            id: 'allow-partial-submission',
            label: 'Allow Partial Submission',
            description: 'Students can submit work in progress',
            enabled: true,
            category: 'student-features',
        },
        {
            id: 'can-view-payment',
            label: 'Can View Payment Status',
            description: 'View financial transactions',
            enabled: true,
            category: 'billing',
        },
        {
            id: 'allow-schedule-email',
            label: 'Allow Schedule Email',
            description: 'Schedule emails for future delivery',
            enabled: true,
            category: 'communications',
        },
        {
            id: 'allow-auto-fetch',
            label: 'Allow Auto-fetch Checklist',
            description: 'Automatic checklist population',
            enabled: true,
            category: 'automation',
        },
        {
            id: 'allow-student-need-workplace',
            label: 'Allow Student Need Workplace',
            description: 'Students can request placement help',
            enabled: true,
            category: 'student-features',
        },
        {
            id: 'allow-student-own-workplace',
            label: 'Allow Student Own Workplace',
            description: 'Students can suggest own workplace',
            enabled: true,
            category: 'student-features',
        },
        {
            id: 'allow-archive',
            label: 'Archive',
            description: 'Archive old records',
            enabled: true,
            category: 'data-management',
        },
        {
            id: 'allow-block',
            label: 'Block',
            description: 'Block problematic users/industries',
            enabled: false,
            category: 'security',
        },
        {
            id: 'invoice-permission',
            label: 'Invoice Permission',
            description: 'Generate and send invoices',
            enabled: true,
            category: 'billing',
        },
        {
            id: 'allow-change',
            label: 'Allow Change',
            description: 'Modify core settings',
            enabled: true,
            category: 'core',
        },
        {
            id: 'auto-report-permissions',
            label: 'Auto Report Generation',
            description: 'Automated report creation',
            enabled: true,
            category: 'automation',
        },
        {
            id: 'self-payment',
            label: 'Self Payment',
            description: 'Students can make payments directly',
            enabled: true,
            category: 'billing',
        },
        {
            id: 'allow-export-data',
            label: 'Allow Data Export',
            description: 'Export data in various formats',
            enabled: true,
            category: 'data-management',
        },
        {
            id: 'allow-bulk-actions',
            label: 'Allow Bulk Actions',
            description: 'Perform actions on multiple records',
            enabled: true,
            category: 'efficiency',
        },
        {
            id: 'allow-custom-fields',
            label: 'Allow Custom Fields',
            description: 'Create custom data fields',
            enabled: true,
            category: 'customization',
        },
        {
            id: 'allow-api-access',
            label: 'Allow API Access',
            description: 'External system integration',
            enabled: true,
            category: 'integration',
        },
        {
            id: 'allow-webhooks',
            label: 'Allow Webhooks',
            description: 'Real-time data notifications',
            enabled: false,
            category: 'integration',
        },
        {
            id: 'allow-duplicate-detection',
            label: 'Duplicate Detection',
            description: 'Prevent duplicate entries',
            enabled: true,
            category: 'data-quality',
        },
        {
            id: 'allow-data-validation',
            label: 'Data Validation',
            description: 'Enforce data quality rules',
            enabled: true,
            category: 'data-quality',
        },
    ])

    const toggleSection = (section: string) => {
        if (section === 'all') {
            setExpandedSections(expandedSections.length > 0 ? [] : ['all'])
        } else {
            setExpandedSections((prev) =>
                prev.includes(section)
                    ? prev.filter((s) => s !== section)
                    : [...prev, section]
            )
        }
    }

    const togglePermission = (
        permissions: Permission[],
        setter: React.Dispatch<React.SetStateAction<Permission[]>>,
        id: string
    ) => {
        setter(
            permissions.map((p) =>
                p.id === id ? { ...p, enabled: !p.enabled } : p
            )
        )
    }

    const toggleOtherPermission = (id: string) => {
        setOtherPermissions(
            otherPermissions.map((p) =>
                p.id === id ? { ...p, enabled: !p.enabled } : p
            )
        )
    }

    const handleSaveChanges = () => {
        notification.success({
            title: 'Settings Saved',
            description: `All permissions and settings for ${selectedRTO} have been updated.`,
        })
    }

    const handleResetDefaults = () => {
        notification.info({
            title: 'Settings Reset',
            description:
                'All permissions have been restored to their default values.',
        })
    }

    const handleExportConfig = () => {
        notification.success({
            title: 'Configuration Exported',
            description: 'Settings have been exported as JSON file.',
        })
    }

    const getAllPermissions = () => {
        return [
            ...dashboardPermissions,
            ...studentsPermissions,
            ...communicationsPermissions,
            ...managePermissions,
            ...moreToolsPermissions,
        ]
    }

    const getPermissionStats = () => {
        const all = getAllPermissions()
        const enabledCount = all.filter((p) => p.enabled).length
        const total = all.length
        const percentage =
            total > 0 ? Math.round((enabledCount / total) * 100) : 0

        return { enabledCount, total, percentage }
    }

    const stats = getPermissionStats()

    const renderPermissionCard = (
        permission: Permission,
        permissions: Permission[],
        setter: React.Dispatch<React.SetStateAction<Permission[]>>
    ) => {
        const handleToggle = (toggled: Permission) => {
            setter(
                permissions.map((p) => (p.id === permission.id ? toggled : p))
            )
        }

        return (
            <PermissionCard
                key={permission.id}
                permission={permission}
                onToggle={handleToggle}
            />
        )
    }

    const adminProps: any = {
        selectedRTO,
        setSelectedRTO,
        searchQuery,
        setSearchQuery,
        showDisabledOnly,
        setShowDisabledOnly,
        expandedSections,
        toggleSection,
        rtoStats,
        stats,
        dashboardPermissions,
        setDashboardPermissions,
        studentsPermissions,
        setStudentsPermissions,
        communicationsPermissions,
        setCommPermissions,
        managePermissions,
        setManagePermissions,
        moreToolsPermissions,
        setMoreToolsPermissions,
        packageSettings,
        setPackageSettings,
        featureUnlocks,
        setFeatureUnlocks,
        aiCallingEnabled,
        setAiCallingEnabled,
        aiCallingLimit,
        setAiCallingLimit,
        aiCallingRate,
        aiCallingStages,
        setAiCallingStages,
        industryListingEnabled,
        setIndustryListingEnabled,
        industryListingSectors,
        setIndustryListingSectors,
        sharingPartnersEnabled,
        setSharingPartnersEnabled,
        autoShareNewPartners,
        setAutoShareNewPartners,
        shareStudentData,
        setShareStudentData,
        sharePlacementData,
        setSharePlacementData,
        otherPermissions,
        toggleOtherPermission,
        handleSaveChanges,
        handleResetDefaults,
        handleExportConfig,
        renderPermissionCard,
        permissionGroups: [
            { id: 'core', label: 'Core', count: 95 },
            { id: 'premium', label: 'Premium', count: 45 },
            { id: 'automation', label: 'Automation', count: 70 },
            { id: 'security', label: 'Security', count: 100 },
        ],
    }

    const tabsConfig = [
        {
            label: 'Overview',
            value: 'overview',
            icon: Activity,
            component: OverviewTab,
        },
        {
            label: 'Permissions',
            value: 'permissions',
            icon: Shield,
            component: PermissionsTab,
        },
        {
            label: 'Team Permissions',
            value: 'team-permissions',
            icon: UserCog,
            component: TeamPermissionsTab,
        },
        {
            label: 'Features',
            value: 'features',
            icon: Sparkles,
            component: FeaturesTab,
        },
        {
            label: 'Billing',
            value: 'billing',
            icon: CreditCard,
            component: BillingTab,
        },
        {
            label: 'Advanced',
            value: 'advanced',
            icon: Settings,
            component: AdvancedTab,
        },
    ]

    return (
        <div className="space-y-6 animate-fade-in pb-24">
            {/* Header */}
            <AdminHeader
                selectedRTO={selectedRTO}
                setSelectedRTO={setSelectedRTO}
                rtoOptions={rtoOptions}
                rtoStats={rtoStats}
                handleExportConfig={handleExportConfig}
                handleResetDefaults={handleResetDefaults}
                handleSaveChanges={handleSaveChanges}
            />

            {/* Content Tabs */}
            <ConfigTabs tabs={tabsConfig} props={adminProps} />

            {/* Sticky Save Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t-2 border-border/60 shadow-2xl py-4 transition-all hover:py-5">
                <div className="max-w-1400px mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                            <span className="text-sm font-bold tracking-tight">
                                Auto-save Enabled
                            </span>
                        </div>
                        <Badge
                            outline
                            variant="muted"
                            className="bg-muted/50 border-border/40 font-mono text-[10px]"
                        >
                            Last Backup: 5 mins ago
                        </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="primary"
                            outline
                            onClick={handleResetDefaults}
                            className="h-12 px-6 border-2 font-bold"
                        >
                            Restore Defaults
                        </Button>
                        <Button
                            variant="primary"
                            className="h-12 px-10 shadow-lg hover:shadow-xl transition-all font-bold"
                            onClick={handleSaveChanges}
                        >
                            <Save className="h-5 w-5 mr-3" />
                            Apply Global Configuration
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
