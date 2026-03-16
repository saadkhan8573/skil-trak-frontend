import React, { useState } from 'react'
import {
    AlertCircle,
    Award,
    BookOpen,
    Building2,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    GraduationCap,
    Users,
    X,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Badge, Button, Card, Select, Switch, TextInput } from '@components'
import { Label } from '@components/ui/label'
import { Collapsible, CollapsibleContent } from '@components/ui'
import {
    industryChecks,
    mockCourses,
    qualificationHierarchy,
} from '../mockData'
import { IndustryCheckInfoModal } from '../modal/IndustryCheckInfoModal'
import { SectorEligibilityModal } from '../modal/SectorEligibilityModal'

interface IndustryCheck {
    id: string
    name: string
    icon?: string
    description?: string
    required: boolean
    showToStudents: boolean
}

interface Sector {
    id: string
    name: string
    workplaceTypes: string
    supervisorName: string
    supervisorLevel: string
    qualificationTitle: string
    industryChecks: IndustryCheck[]
    capacity: number
    capacityPeriod: string
    eligibilityChecks: {
        directSupport: boolean
        supervision: boolean
        equipmentResources: boolean
    }
    coursePrerequisites?: {
        [courseId: string]: {
            directSupport: boolean
            supervision: boolean
            equipmentResources: boolean
        }
    }
    confirmed?: boolean
}

const availableSectors = [
    {
        name: 'Community Services',
        icon: '🏠',
        color: '#044866',
        bgColor: 'rgba(4, 72, 102, 0.05)',
    },
    {
        name: 'Disability',
        icon: '♿',
        color: '#0D5468',
        bgColor: 'rgba(13, 84, 104, 0.05)',
    },
    {
        name: 'Mental Health',
        icon: '🧠',
        color: '#044866',
        bgColor: 'rgba(4, 72, 102, 0.05)',
    },
    {
        name: 'Health Care',
        icon: '⚕️',
        color: '#0D5468',
        bgColor: 'rgba(13, 84, 104, 0.05)',
    },
    {
        name: 'Individual Support',
        icon: '🤝',
        color: '#044866',
        bgColor: 'rgba(4, 72, 102, 0.05)',
    },
]

const qualificationLevels = [
    { value: 'Cert III', label: 'Certificate III', icon: '🥉' },
    { value: 'Cert IV', label: 'Certificate IV', icon: '🥈' },
    { value: 'Diploma', label: 'Diploma', icon: '🥇' },
    { value: 'Bachelor', label: 'Bachelor Degree', icon: '🏆' },
    { value: 'Other', label: 'Other', icon: '📜' },
]

export const SectorsCard = ({
    data,
    onChange,
    errors,
    handleAddSector,
}: any) => {
    const [expandedSector, setExpandedSector] = useState<string | null>(
        data.sectors.length > 0 ? data.sectors[0].id : null
    )
    const [selectedIndustryCheck, setSelectedIndustryCheck] = useState<
        string | null
    >(null)
    const [eligibilityDialogOpen, setEligibilityDialogOpen] = useState(false)
    const [confirmedSectorId, setConfirmedSectorId] = useState<string>('')
    const getSectorConfig = (sectorName: string) => {
        return (
            availableSectors.find((s) => s.name === sectorName) ||
            availableSectors[0]
        )
    }
    const toggleSectorExpansion = (sectorId: string) => {
        // Keep all sectors expanded by default - users can still collapse if needed
        setExpandedSector((prev) => {
            if (prev === sectorId) return null
            return sectorId
        })
    }
    const removeSector = (sectorId: string) => {
        onChange({
            ...data,
            sectors: data.sectors.filter((s: any) => s.id !== sectorId),
        })
        setExpandedSector((prev) => {
            if (prev === sectorId) return null
            return prev
        })
    }
    const updateSector = (sectorId: string, updates: Partial<Sector>) => {
        onChange({
            ...data,
            sectors: data.sectors.map((s: any) =>
                s.id === sectorId ? { ...s, ...updates } : s
            ),
        })
    }
    const getIndustryCheckInfo = (checkId: string) => {
        return industryChecks.find((c) => c.id === checkId)
    }
    const updateIndustryCheck = (
        sectorId: string,
        checkId: string,
        field: 'required' | 'showToStudents',
        value: boolean
    ) => {
        const sector = data.sectors.find((s: any) => s.id === sectorId)
        if (!sector) return

        const updatedChecks = sector.industryChecks.map((check: any) =>
            check.id === checkId ? { ...check, [field]: value } : check
        )

        updateSector(sectorId, { industryChecks: updatedChecks })
    }
    const canSupervise = (supervisorLevel: string, courseLevel: string) => {
        const supervisorRank =
            qualificationHierarchy[
                supervisorLevel as keyof typeof qualificationHierarchy
            ] || 0
        const courseRank =
            qualificationHierarchy[
                courseLevel as keyof typeof qualificationHierarchy
            ] || 0
        return supervisorRank >= courseRank
    }

    const getFilteredCoursesForSector = (
        sectorName: string,
        supervisorLevel: string
    ) => {
        return mockCourses.filter((course: any) => {
            const matchesSector = course.sector === sectorName
            const canSuperviseCourse = supervisorLevel
                ? canSupervise(supervisorLevel, course.level)
                : true
            return matchesSector && canSuperviseCourse
        })
    }
    const getCoursePrerequisites = (sectorId: string, courseId: string) => {
        const sector = data.sectors.find((s: any) => s.id === sectorId)
        if (!sector || !sector.coursePrerequisites) {
            return {
                directSupport: false,
                supervision: false,
                equipmentResources: false,
            }
        }
        return (
            sector.coursePrerequisites[courseId] || {
                directSupport: false,
                supervision: false,
                equipmentResources: false,
            }
        )
    }

    const updateCoursePrerequisite = (
        sectorId: string,
        courseId: string,
        field: 'directSupport' | 'supervision' | 'equipmentResources',
        value: boolean
    ) => {
        const sector = data.sectors.find((s: any) => s.id === sectorId)
        if (!sector) return

        const currentCoursePrereqs = sector.coursePrerequisites || {}
        const currentCourseCheck = currentCoursePrereqs[courseId] || {
            directSupport: false,
            supervision: false,
            equipmentResources: false,
        }

        updateSector(sectorId, {
            coursePrerequisites: {
                ...currentCoursePrereqs,
                [courseId]: {
                    ...currentCourseCheck,
                    [field]: value,
                },
            },
        })
    }

    const isSectorFullyConfigured = (sector: Sector) => {
        // Check if all eligibility checks are YES (from first sector)
        const eligibilityPassed =
            data.sectors.length > 0 &&
            data.sectors[0].eligibilityChecks.directSupport &&
            data.sectors[0].eligibilityChecks.supervision &&
            data.sectors[0].eligibilityChecks.equipmentResources

        // Check if supervisor details are filled
        const supervisorFilled =
            sector.supervisorName.trim() !== '' &&
            sector.supervisorLevel !== '' &&
            sector.qualificationTitle.trim() !== ''

        // Check if capacity is set (should be at least 1)
        const capacitySet = sector.capacity >= 1

        // Check if at least one course is available for this supervisor
        const hasAvailableCourses = sector.supervisorLevel
            ? getFilteredCoursesForSector(sector.name, sector.supervisorLevel)
                  .length > 0
            : false

        return (
            eligibilityPassed &&
            supervisorFilled &&
            capacitySet &&
            hasAvailableCourses
        )
    }

    const handleConfirmSector = (sectorId: string) => {
        const sector = data.sectors.find((s: any) => s.id === sectorId)
        if (sector && isSectorFullyConfigured(sector)) {
            // Mark sector as confirmed
            updateSector(sectorId, { confirmed: true })

            // toast.success(`✅ ${sector.name} sector confirmed and ready!`)
            setConfirmedSectorId(sectorId)

            // Check if we should show eligibility dialog for any confirmed sector
            const shouldShowDialog =
                sector.name === 'Community Services' ||
                sector.name === 'Disability' ||
                sector.name === 'Mental Health' ||
                sector.name === 'Health Care' ||
                sector.name === 'Individual Support'

            if (shouldShowDialog) {
                setEligibilityDialogOpen(true)
            }
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Card className="border-0 shadow-xl bg-linear-to-br from-white to-gray-50/30 hover-lift">
                <div
                    className="rounded-t-xl"
                    style={{
                        background: `linear-gradient(135deg, rgba(4, 72, 102, 0.08) 0%, rgba(13, 84, 104, 0.05) 100%)`,
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                            style={{
                                background: `linear-gradient(135deg, #044866 0%, #0D5468 100%)`,
                            }}
                        >
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="gradient-text text-xl">
                                Industry Sectors Configuration
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                🏢 Set up sectors where you can provide quality
                                professional placements
                            </p>
                        </div>
                    </div>
                </div>
                <div className="space-y-8 p-8">
                    {/* Active Sectors */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-base font-semibold">
                                    Your Active Sectors
                                </Label>
                                <p className="text-xs text-muted-foreground mt-1">
                                    ✅ All sectors shown expanded - configure
                                    details for each sector below
                                </p>
                            </div>
                            <Badge
                                variant="secondary"
                                className="px-3 py-1"
                                // style={{
                                //     backgroundColor:
                                //         'rgba(4, 72, 102, 0.1)',
                                //     color: '#044866',
                                //     borderColor: '#044866',
                                // }}
                            >
                                {data.sectors.length} Configured
                            </Badge>
                        </div>

                        <AnimatePresence>
                            {data.sectors.map((sector: any, index: any) => {
                                const sectorConfig = getSectorConfig(
                                    sector.name
                                )
                                const isExpanded = expandedSector === sector.id

                                // Ensure eligibilityChecks exists with default values
                                const eligibilityChecks =
                                    sector.eligibilityChecks || {
                                        directSupport: false,
                                        supervision: false,
                                        equipmentResources: false,
                                    }

                                return (
                                    <motion.div
                                        key={sector.id}
                                        initial={{
                                            opacity: 0,
                                            scale: 0.95,
                                            y: 20,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                            y: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            scale: 0.95,
                                            y: -20,
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="relative"
                                    >
                                        <div
                                            className="border-2 rounded-2xl shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm"
                                            style={{
                                                borderColor: `${sectorConfig.color}20`,
                                                backgroundColor:
                                                    sectorConfig.bgColor,
                                            }}
                                        >
                                            {/* Sector Header */}
                                            <div className="bg-white/80 backdrop-blur-sm border-b border-white/20">
                                                {/* Top Row - Icon, Name, Status, Actions */}
                                                <div className="p-6 pb-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center gap-4 flex-1">
                                                            <div
                                                                className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg"
                                                                style={{
                                                                    backgroundColor:
                                                                        sectorConfig.color,
                                                                }}
                                                            >
                                                                {
                                                                    sectorConfig.icon
                                                                }
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    <h3 className="text-xl font-bold text-foreground">
                                                                        {
                                                                            sector.name
                                                                        }
                                                                    </h3>
                                                                    {sector.confirmed && (
                                                                        <motion.div
                                                                            initial={{
                                                                                scale: 0,
                                                                            }}
                                                                            animate={{
                                                                                scale: 1,
                                                                            }}
                                                                            className="bg-linear-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5"
                                                                        >
                                                                            <CheckCircle className="w-4 h-4" />
                                                                            <span className="text-xs font-semibold uppercase tracking-wide">
                                                                                Confirmed
                                                                            </span>
                                                                        </motion.div>
                                                                    )}
                                                                </div>
                                                                {sector.supervisorName && (
                                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                        <Award
                                                                            className="w-4 h-4"
                                                                            style={{
                                                                                color: sectorConfig.color,
                                                                            }}
                                                                        />
                                                                        <span className="font-medium">
                                                                            Supervisor:{' '}
                                                                            {
                                                                                sector.supervisorName
                                                                            }
                                                                        </span>
                                                                        {sector.supervisorLevel && (
                                                                            <>
                                                                                <span className="text-gray-300">
                                                                                    •
                                                                                </span>
                                                                                <span
                                                                                    className="font-semibold"
                                                                                    style={{
                                                                                        color: sectorConfig.color,
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        sector.supervisorLevel
                                                                                    }
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="dark"
                                                                onClick={() =>
                                                                    toggleSectorExpansion(
                                                                        sector.id
                                                                    )
                                                                }
                                                                className="hover:bg-white/50"
                                                                title={
                                                                    isExpanded
                                                                        ? 'Collapse sector details'
                                                                        : 'Expand sector details'
                                                                }
                                                            >
                                                                {isExpanded ? (
                                                                    <ChevronDown className="w-4 h-4 text-primary" />
                                                                ) : (
                                                                    <ChevronRight className="w-4 h-4" />
                                                                )}
                                                            </Button>

                                                            <Button
                                                                variant="error"
                                                                onClick={() =>
                                                                    removeSector(
                                                                        sector.id
                                                                    )
                                                                }
                                                                className="hover:bg-red-50 hover:text-red-600"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Bottom Row - Metrics */}
                                                <div className="px-6 pb-4">
                                                    <div className="flex items-center gap-3">
                                                        <motion.div
                                                            className="bg-linear-to-r from-blue-500 to-indigo-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3"
                                                            whileHover={{
                                                                scale: 1.02,
                                                            }}
                                                            transition={{
                                                                type: 'spring',
                                                                stiffness: 400,
                                                                damping: 10,
                                                            }}
                                                        >
                                                            <Users className="w-5 h-5" />
                                                            <div>
                                                                <div className="text-2xl font-bold leading-tight">
                                                                    {
                                                                        sector.capacity
                                                                    }
                                                                </div>
                                                                <div className="text-xs opacity-90 font-medium">
                                                                    Students/
                                                                    {
                                                                        sector.capacityPeriod
                                                                    }
                                                                </div>
                                                            </div>
                                                        </motion.div>

                                                        <div className="flex-1 flex items-center gap-2 flex-wrap">
                                                            <Badge className="text-xs bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100">
                                                                <CheckCircle className="w-3 h-3 mr-1.5" />
                                                                Facility
                                                                Checklist
                                                                Required
                                                            </Badge>
                                                            {sector.qualificationTitle && (
                                                                <Badge className="text-xs bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100">
                                                                    <GraduationCap className="w-3 h-3 mr-1.5" />
                                                                    {
                                                                        sector.qualificationTitle
                                                                    }
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Sector Details - Always visible by default */}
                                            <Collapsible open={isExpanded}>
                                                <CollapsibleContent>
                                                    <div className="p-6 space-y-6 bg-white/60 backdrop-blur-sm">
                                                        {/* Course Prerequisites - Only show for FIRST sector */}
                                                        {index === 0 && (
                                                            <div className="bg-linear-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-6 space-y-4">
                                                                <div className="flex items-center gap-3 mb-4">
                                                                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                                                                        📋
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <h3 className="font-bold text-lg gradient-text">
                                                                            COURSE
                                                                            PREREQUISITES
                                                                        </h3>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            Evaluate
                                                                            these
                                                                            criteria
                                                                            for
                                                                            your
                                                                            organization
                                                                            •
                                                                            This
                                                                            applies
                                                                            to
                                                                            all
                                                                            sectors
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-3">
                                                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                                                                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                                                                        <p className="text-xs text-yellow-800">
                                                                            <strong>
                                                                                Important:
                                                                            </strong>{' '}
                                                                            Answer
                                                                            these
                                                                            questions
                                                                            based
                                                                            on
                                                                            your
                                                                            organization's
                                                                            capabilities.
                                                                            All
                                                                            three
                                                                            must
                                                                            be
                                                                            YES
                                                                            to
                                                                            unlock
                                                                            course
                                                                            selection
                                                                            and
                                                                            supervisor
                                                                            fields
                                                                            for
                                                                            ALL
                                                                            sectors.
                                                                        </p>
                                                                    </div>

                                                                    <div className="flex items-center gap-2 text-sm font-semibold text-purple-700">
                                                                        <CheckCircle className="w-4 h-4" />
                                                                        ALL
                                                                        THREE
                                                                        MUST BE
                                                                        YES
                                                                    </div>

                                                                    {/* Question 1: Direct Support Environment */}
                                                                    <div
                                                                        className="bg-white rounded-xl p-4 border-2 transition-all duration-300"
                                                                        style={{
                                                                            borderColor:
                                                                                eligibilityChecks.directSupport
                                                                                    ? '#10B981'
                                                                                    : '#E5E7EB',
                                                                        }}
                                                                    >
                                                                        <div className="flex items-start gap-3">
                                                                            <div className="pt-1">
                                                                                <div
                                                                                    className="w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-200"
                                                                                    style={{
                                                                                        borderColor:
                                                                                            eligibilityChecks.directSupport
                                                                                                ? '#10B981'
                                                                                                : '#D1D5DB',
                                                                                        backgroundColor:
                                                                                            eligibilityChecks.directSupport
                                                                                                ? '#10B981'
                                                                                                : 'white',
                                                                                    }}
                                                                                    onClick={() =>
                                                                                        updateSector(
                                                                                            sector.id,
                                                                                            {
                                                                                                eligibilityChecks:
                                                                                                    {
                                                                                                        ...eligibilityChecks,
                                                                                                        directSupport:
                                                                                                            !eligibilityChecks.directSupport,
                                                                                                    },
                                                                                            }
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    {eligibilityChecks.directSupport && (
                                                                                        <CheckCircle className="w-4 h-4 text-white" />
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <div className="font-semibold text-sm mb-1">
                                                                                    1.
                                                                                    Direct
                                                                                    Support
                                                                                    Environment
                                                                                </div>
                                                                                <p className="text-xs text-muted-foreground">
                                                                                    Do
                                                                                    you
                                                                                    provide
                                                                                    direct
                                                                                    client
                                                                                    support
                                                                                    (personal
                                                                                    care,
                                                                                    daily
                                                                                    living,
                                                                                    community
                                                                                    support)
                                                                                    in
                                                                                    a
                                                                                    residential,
                                                                                    community,
                                                                                    home
                                                                                    or
                                                                                    centre-based
                                                                                    setting?
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Question 2: Supervision */}
                                                                    <div
                                                                        className="bg-white rounded-xl p-4 border-2 transition-all duration-300"
                                                                        style={{
                                                                            borderColor:
                                                                                eligibilityChecks.supervision
                                                                                    ? '#10B981'
                                                                                    : '#E5E7EB',
                                                                        }}
                                                                    >
                                                                        <div className="flex items-start gap-3">
                                                                            <div className="pt-1">
                                                                                <div
                                                                                    className="w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-200"
                                                                                    style={{
                                                                                        borderColor:
                                                                                            eligibilityChecks.supervision
                                                                                                ? '#10B981'
                                                                                                : '#D1D5DB',
                                                                                        backgroundColor:
                                                                                            eligibilityChecks.supervision
                                                                                                ? '#10B981'
                                                                                                : 'white',
                                                                                    }}
                                                                                    onClick={() =>
                                                                                        updateSector(
                                                                                            sector.id,
                                                                                            {
                                                                                                eligibilityChecks:
                                                                                                    {
                                                                                                        ...eligibilityChecks,
                                                                                                        supervision:
                                                                                                            !eligibilityChecks.supervision,
                                                                                                    },
                                                                                            }
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    {eligibilityChecks.supervision && (
                                                                                        <CheckCircle className="w-4 h-4 text-white" />
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <div className="font-semibold text-sm mb-1">
                                                                                    2.
                                                                                    Supervision
                                                                                </div>
                                                                                <p className="text-xs text-muted-foreground">
                                                                                    Will
                                                                                    the
                                                                                    student
                                                                                    be
                                                                                    supervised
                                                                                    by
                                                                                    a
                                                                                    qualified
                                                                                    worker
                                                                                    (same
                                                                                    qualification
                                                                                    or
                                                                                    higher)
                                                                                    or
                                                                                    experienced
                                                                                    support
                                                                                    staff?
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Question 3: Equipment & Resources */}
                                                                    <div
                                                                        className="bg-white rounded-xl p-4 border-2 transition-all duration-300"
                                                                        style={{
                                                                            borderColor:
                                                                                eligibilityChecks.equipmentResources
                                                                                    ? '#10B981'
                                                                                    : '#E5E7EB',
                                                                        }}
                                                                    >
                                                                        <div className="flex items-start gap-3">
                                                                            <div className="pt-1">
                                                                                <div
                                                                                    className="w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-200"
                                                                                    style={{
                                                                                        borderColor:
                                                                                            eligibilityChecks.equipmentResources
                                                                                                ? '#10B981'
                                                                                                : '#D1D5DB',
                                                                                        backgroundColor:
                                                                                            eligibilityChecks.equipmentResources
                                                                                                ? '#10B981'
                                                                                                : 'white',
                                                                                    }}
                                                                                    onClick={() =>
                                                                                        updateSector(
                                                                                            sector.id,
                                                                                            {
                                                                                                eligibilityChecks:
                                                                                                    {
                                                                                                        ...eligibilityChecks,
                                                                                                        equipmentResources:
                                                                                                            !eligibilityChecks.equipmentResources,
                                                                                                    },
                                                                                            }
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    {eligibilityChecks.equipmentResources && (
                                                                                        <CheckCircle className="w-4 h-4 text-white" />
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <div className="font-semibold text-sm mb-1">
                                                                                    3.
                                                                                    Equipment
                                                                                    &
                                                                                    Resources
                                                                                </div>
                                                                                <p className="text-xs text-muted-foreground">
                                                                                    Do
                                                                                    you
                                                                                    have
                                                                                    appropriate
                                                                                    equipment
                                                                                    and
                                                                                    systems
                                                                                    in
                                                                                    place?
                                                                                    <br />
                                                                                    <span className="text-xs italic">
                                                                                        Examples:
                                                                                        hoists,
                                                                                        mobility
                                                                                        aids,
                                                                                        transfer
                                                                                        equipment,
                                                                                        PPE,
                                                                                        care
                                                                                        plans,
                                                                                        incident
                                                                                        reporting,
                                                                                        documentation
                                                                                        systems.
                                                                                    </span>
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Eligibility Status */}
                                                                    {!eligibilityChecks.directSupport ||
                                                                    !eligibilityChecks.supervision ||
                                                                    !eligibilityChecks.equipmentResources ? (
                                                                        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
                                                                            <X className="w-5 h-5 text-red-600 shrink-0" />
                                                                            <div>
                                                                                <div className="font-bold text-red-700 text-sm">
                                                                                    Not
                                                                                    Eligible
                                                                                </div>
                                                                                <p className="text-xs text-red-600">
                                                                                    All
                                                                                    three
                                                                                    questions
                                                                                    must
                                                                                    be
                                                                                    YES
                                                                                    to
                                                                                    unlock
                                                                                    supervisor
                                                                                    fields
                                                                                    and
                                                                                    course
                                                                                    selection
                                                                                    for
                                                                                    this
                                                                                    sector
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                                                                            <div className="flex items-center gap-2 mb-3">
                                                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                                                                <div className="font-bold text-green-700 text-sm">
                                                                                    🔓
                                                                                    SECTOR
                                                                                    UNLOCKED
                                                                                </div>
                                                                            </div>
                                                                            <p className="text-xs text-muted-foreground mb-3">
                                                                                This
                                                                                sector
                                                                                meets
                                                                                the
                                                                                prerequisites.
                                                                                You
                                                                                can
                                                                                now
                                                                                configure
                                                                                supervisors
                                                                                and
                                                                                select
                                                                                available
                                                                                courses
                                                                                below.
                                                                            </p>
                                                                            <div className="space-y-2">
                                                                                <div className="text-xs font-semibold text-green-800">
                                                                                    Minimum
                                                                                    Supervisor
                                                                                    Requirement:
                                                                                </div>
                                                                                <div className="text-xs space-y-1 pl-4">
                                                                                    <div className="flex items-start gap-2">
                                                                                        <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 shrink-0" />
                                                                                        <span>
                                                                                            Certificate
                                                                                            III
                                                                                            in
                                                                                            Individual
                                                                                            Support
                                                                                            (Ageing)
                                                                                            or
                                                                                            higher
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                                                        <span className="ml-5">
                                                                                            OR
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="flex items-start gap-2">
                                                                                        <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 shrink-0" />
                                                                                        <span>
                                                                                            Diploma
                                                                                            in
                                                                                            Community
                                                                                            Services
                                                                                            /
                                                                                            Nursing
                                                                                            qualification
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                                                        <span className="ml-5">
                                                                                            OR
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="flex items-start gap-2">
                                                                                        <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 shrink-0" />
                                                                                        <span>
                                                                                            Enrolled
                                                                                            Nurse
                                                                                            (EN)
                                                                                            or
                                                                                            Registered
                                                                                            Nurse
                                                                                            (RN)
                                                                                            (in
                                                                                            residential
                                                                                            aged
                                                                                            care)
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="text-xs font-semibold text-green-800 mt-3">
                                                                                    Acceptable
                                                                                    Job
                                                                                    Titles:
                                                                                </div>
                                                                                <div className="text-xs text-muted-foreground pl-4 space-y-0.5">
                                                                                    <div>
                                                                                        •
                                                                                        Personal
                                                                                        Care
                                                                                        Worker
                                                                                        (Senior)
                                                                                    </div>
                                                                                    <div>
                                                                                        •
                                                                                        Aged
                                                                                        Care
                                                                                        Support
                                                                                        Worker
                                                                                    </div>
                                                                                    <div>
                                                                                        •
                                                                                        Team
                                                                                        Leader
                                                                                    </div>
                                                                                    <div>
                                                                                        •
                                                                                        Enrolled
                                                                                        Nurse
                                                                                    </div>
                                                                                    <div>
                                                                                        •
                                                                                        Registered
                                                                                        Nurse
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Show supervisor fields only if all eligibility checks are YES (check first sector's eligibility for all sectors) */}
                                                        {data.sectors.length >
                                                            0 &&
                                                            data.sectors[0]
                                                                .eligibilityChecks
                                                                .directSupport &&
                                                            data.sectors[0]
                                                                .eligibilityChecks
                                                                .supervision &&
                                                            data.sectors[0]
                                                                .eligibilityChecks
                                                                .equipmentResources && (
                                                                <>
                                                                    {/* Supervisor Information */}
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                        <div className="space-y-3">
                                                                            <Label className="text-sm font-semibold">
                                                                                Supervisor
                                                                                Name
                                                                            </Label>
                                                                            <TextInput
                                                                                name={
                                                                                    'supervisorName'
                                                                                }
                                                                                value={
                                                                                    sector.supervisorName
                                                                                }
                                                                                onChange={(
                                                                                    e: any
                                                                                ) =>
                                                                                    updateSector(
                                                                                        sector.id,
                                                                                        {
                                                                                            supervisorName:
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                        }
                                                                                    )
                                                                                }
                                                                                placeholder="Enter supervisor full name"
                                                                                className="bg-white/90 backdrop-blur-sm border-2 hover:border-primary/50 focus:border-primary"
                                                                            />
                                                                            {errors[
                                                                                `sector_${index}_supervisor_name`
                                                                            ] && (
                                                                                <p className="text-xs text-destructive">
                                                                                    {
                                                                                        errors[
                                                                                            `sector_${index}_supervisor_name`
                                                                                        ]
                                                                                    }
                                                                                </p>
                                                                            )}
                                                                        </div>

                                                                        <div className="space-y-3">
                                                                            <Label className="text-sm font-semibold">
                                                                                Supervisor
                                                                                Qualification
                                                                                Level
                                                                            </Label>
                                                                            <Select
                                                                                name="qualificationLevel"
                                                                                value={
                                                                                    sector.supervisorLevel
                                                                                }
                                                                                onChange={(
                                                                                    value: any
                                                                                ) =>
                                                                                    updateSector(
                                                                                        sector.id,
                                                                                        {
                                                                                            supervisorLevel:
                                                                                                value,
                                                                                        }
                                                                                    )
                                                                                }
                                                                                options={
                                                                                    qualificationLevels
                                                                                }
                                                                            />

                                                                            {errors[
                                                                                `sector_${index}_supervisor_level`
                                                                            ] && (
                                                                                <p className="text-xs text-destructive">
                                                                                    {
                                                                                        errors[
                                                                                            `sector_${index}_supervisor_level`
                                                                                        ]
                                                                                    }
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    <div className="space-y-3">
                                                                        <Label className="text-sm font-semibold">
                                                                            Qualification
                                                                            Title
                                                                        </Label>
                                                                        <TextInput
                                                                            name={
                                                                                'qualificationTitle'
                                                                            }
                                                                            value={
                                                                                sector.qualificationTitle
                                                                            }
                                                                            onChange={(
                                                                                e: any
                                                                            ) =>
                                                                                updateSector(
                                                                                    sector.id,
                                                                                    {
                                                                                        qualificationTitle:
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                    }
                                                                                )
                                                                            }
                                                                            placeholder="e.g., Diploma of Community Services"
                                                                            className="bg-white/90 backdrop-blur-sm border-2 hover:border-primary/50 focus:border-primary"
                                                                        />
                                                                        {errors[
                                                                            `sector_${index}_qualification_title`
                                                                        ] && (
                                                                            <p className="text-xs text-destructive">
                                                                                {
                                                                                    errors[
                                                                                        `sector_${index}_qualification_title`
                                                                                    ]
                                                                                }
                                                                            </p>
                                                                        )}
                                                                    </div>

                                                                    {/* Student Capacity */}
                                                                    <div className="grid grid-cols-2 gap-6">
                                                                        <div className="space-y-3">
                                                                            <Label className="text-sm font-semibold">
                                                                                Student
                                                                                Capacity
                                                                            </Label>
                                                                            <TextInput
                                                                                name={`sector_${index}_capacity`}
                                                                                type="number"
                                                                                min="1"
                                                                                max="50"
                                                                                value={
                                                                                    sector.capacity
                                                                                }
                                                                                onChange={(
                                                                                    e: any
                                                                                ) =>
                                                                                    updateSector(
                                                                                        sector.id,
                                                                                        {
                                                                                            capacity:
                                                                                                parseInt(
                                                                                                    e
                                                                                                        .target
                                                                                                        .value
                                                                                                ) ||
                                                                                                1,
                                                                                        }
                                                                                    )
                                                                                }
                                                                                className="bg-white/90 backdrop-blur-sm border-2 hover:border-primary/50 focus:border-primary"
                                                                            />
                                                                        </div>

                                                                        <div className="space-y-3">
                                                                            <Label className="text-sm font-semibold">
                                                                                Capacity
                                                                                Period
                                                                            </Label>
                                                                            <Select
                                                                                name="capacityPeriod"
                                                                                value={
                                                                                    sector.capacityPeriod
                                                                                }
                                                                                onlyValue
                                                                                onChange={(
                                                                                    value: any
                                                                                ) =>
                                                                                    updateSector(
                                                                                        sector.id,
                                                                                        {
                                                                                            capacityPeriod:
                                                                                                value,
                                                                                        }
                                                                                    )
                                                                                }
                                                                                options={[
                                                                                    {
                                                                                        value: 'weekly',
                                                                                        label: 'Weekly',
                                                                                    },
                                                                                    {
                                                                                        value: 'biweekly',
                                                                                        label: 'Biweekly',
                                                                                    },
                                                                                    {
                                                                                        value: 'monthly',
                                                                                        label: 'Monthly',
                                                                                    },
                                                                                ]}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* Industry Checks */}
                                                                    <div className="space-y-4">
                                                                        <div>
                                                                            <Label className="text-sm font-semibold">
                                                                                Required
                                                                                Industry
                                                                                Checks
                                                                            </Label>
                                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                                💡
                                                                                When
                                                                                you
                                                                                turn
                                                                                these
                                                                                on,
                                                                                students
                                                                                will
                                                                                be
                                                                                required
                                                                                to
                                                                                upload
                                                                                these
                                                                                documents
                                                                                when
                                                                                applying
                                                                                for
                                                                                placements
                                                                            </p>
                                                                        </div>
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                            {sector.industryChecks.map(
                                                                                (
                                                                                    check: any
                                                                                ) => {
                                                                                    const checkInfo =
                                                                                        getIndustryCheckInfo(
                                                                                            check.id
                                                                                        )
                                                                                    if (
                                                                                        check.id ===
                                                                                        'other'
                                                                                    ) {
                                                                                        // Special handling for "Other" custom check
                                                                                        return (
                                                                                            <div
                                                                                                key={
                                                                                                    check.id
                                                                                                }
                                                                                                className="col-span-full"
                                                                                            >
                                                                                                <div
                                                                                                    className="flex items-center justify-between p-4 rounded-xl border-2 bg-white/60"
                                                                                                    style={{
                                                                                                        borderColor:
                                                                                                            check.required
                                                                                                                ? sectorConfig.color
                                                                                                                : '#E2E8F0',
                                                                                                    }}
                                                                                                >
                                                                                                    <div className="flex items-center gap-3 flex-1">
                                                                                                        <span className="text-lg">
                                                                                                            {check.icon ||
                                                                                                                checkInfo?.icon}
                                                                                                        </span>
                                                                                                        <div className="flex-1">
                                                                                                            <div className="font-medium text-sm">
                                                                                                                {
                                                                                                                    check.name
                                                                                                                }
                                                                                                            </div>
                                                                                                            <div className="text-xs text-muted-foreground">
                                                                                                                {check.description ||
                                                                                                                    checkInfo?.description}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <Switch
                                                                                                        name="customCheckRequired"
                                                                                                        defaultChecked={
                                                                                                            check.required
                                                                                                        }
                                                                                                        onChange={(
                                                                                                            checked: any
                                                                                                        ) =>
                                                                                                            updateIndustryCheck(
                                                                                                                sector.id,
                                                                                                                check.id,
                                                                                                                'required',
                                                                                                                checked
                                                                                                            )
                                                                                                        }
                                                                                                        className="data-[state=checked]:bg-primary"
                                                                                                    />
                                                                                                </div>
                                                                                                {check.required && (
                                                                                                    <div className="mt-3 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                                                                                                        <Label className="text-xs font-semibold mb-2 block">
                                                                                                            Specify
                                                                                                            Custom
                                                                                                            Check
                                                                                                            Name
                                                                                                        </Label>
                                                                                                        <TextInput
                                                                                                            name="customCheckName"
                                                                                                            value={
                                                                                                                check.name ===
                                                                                                                'Other'
                                                                                                                    ? ''
                                                                                                                    : check.name
                                                                                                            }
                                                                                                            onChange={(
                                                                                                                e: any
                                                                                                            ) => {
                                                                                                                const updatedChecks =
                                                                                                                    sector.industryChecks.map(
                                                                                                                        (
                                                                                                                            c: any
                                                                                                                        ) =>
                                                                                                                            c.id ===
                                                                                                                            'other'
                                                                                                                                ? {
                                                                                                                                      ...c,
                                                                                                                                      name:
                                                                                                                                          e
                                                                                                                                              .target
                                                                                                                                              .value ||
                                                                                                                                          'Other',
                                                                                                                                  }
                                                                                                                                : c
                                                                                                                    )
                                                                                                                updateSector(
                                                                                                                    sector.id,
                                                                                                                    {
                                                                                                                        industryChecks:
                                                                                                                            updatedChecks,
                                                                                                                    }
                                                                                                                )
                                                                                                            }}
                                                                                                            placeholder="e.g., First Aid Certificate, Food Safety Certificate"
                                                                                                            className="bg-white border-2"
                                                                                                        />
                                                                                                    </div>
                                                                                                )}
                                                                                            </div>
                                                                                        )
                                                                                    }
                                                                                    return (
                                                                                        <div
                                                                                            key={
                                                                                                check.id
                                                                                            }
                                                                                            className="flex items-center justify-between p-4 rounded-xl border-2 bg-white/60"
                                                                                            style={{
                                                                                                borderColor:
                                                                                                    check.required
                                                                                                        ? sectorConfig.color
                                                                                                        : '#E2E8F0',
                                                                                            }}
                                                                                        >
                                                                                            <div className="flex items-center gap-3">
                                                                                                <span className="text-lg">
                                                                                                    {check.icon ||
                                                                                                        checkInfo?.icon}
                                                                                                </span>
                                                                                                <div>
                                                                                                    <div className="font-medium text-sm">
                                                                                                        {
                                                                                                            check.name
                                                                                                        }
                                                                                                    </div>
                                                                                                    <div className="text-xs text-muted-foreground">
                                                                                                        {check.description ||
                                                                                                            checkInfo?.description}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <Switch
                                                                                                name={
                                                                                                    'checkRequired'
                                                                                                }
                                                                                                defaultChecked={
                                                                                                    check.required
                                                                                                }
                                                                                                onChange={(
                                                                                                    checked: any
                                                                                                ) =>
                                                                                                    updateIndustryCheck(
                                                                                                        sector.id,
                                                                                                        check.id,
                                                                                                        'required',
                                                                                                        checked
                                                                                                    )
                                                                                                }
                                                                                                className="data-[state=checked]:bg-primary"
                                                                                            />
                                                                                        </div>
                                                                                    )
                                                                                }
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {/* Available Courses Preview */}
                                                                    {sector.supervisorLevel && (
                                                                        <div className="space-y-4">
                                                                            <Label className="text-sm font-semibold flex items-center gap-2">
                                                                                <BookOpen className="w-4 h-4" />
                                                                                Available
                                                                                Courses
                                                                                for
                                                                                This
                                                                                Supervisor
                                                                            </Label>
                                                                            <div className="grid grid-cols-1 gap-3">
                                                                                {getFilteredCoursesForSector(
                                                                                    sector.name,
                                                                                    sector.supervisorLevel
                                                                                ).map(
                                                                                    (
                                                                                        course
                                                                                    ) => (
                                                                                        <div
                                                                                            key={
                                                                                                course.id
                                                                                            }
                                                                                            className="p-5 rounded-xl border-2 bg-white/80 space-y-3"
                                                                                            style={{
                                                                                                borderColor: `${sectorConfig.color}20`,
                                                                                            }}
                                                                                        >
                                                                                            <div className="flex items-center justify-between mb-3">
                                                                                                <h4 className="font-semibold text-sm">
                                                                                                    {
                                                                                                        course.name
                                                                                                    }
                                                                                                </h4>
                                                                                                <Badge
                                                                                                    variant="secondary"
                                                                                                    className="text-xs"
                                                                                                >
                                                                                                    {
                                                                                                        course.level
                                                                                                    }
                                                                                                </Badge>
                                                                                            </div>

                                                                                            {/* Course Eligibility Checkboxes */}
                                                                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
                                                                                                <div className="text-xs font-semibold text-primary mb-2">
                                                                                                    Course
                                                                                                    Prerequisites
                                                                                                    (Specific
                                                                                                    to
                                                                                                    this
                                                                                                    course)
                                                                                                </div>

                                                                                                <div
                                                                                                    className="flex items-center gap-2 cursor-pointer group"
                                                                                                    onClick={() => {
                                                                                                        const coursePrereqs =
                                                                                                            getCoursePrerequisites(
                                                                                                                sector.id,
                                                                                                                course.id
                                                                                                            )
                                                                                                        updateCoursePrerequisite(
                                                                                                            sector.id,
                                                                                                            course.id,
                                                                                                            'directSupport',
                                                                                                            !coursePrereqs.directSupport
                                                                                                        )
                                                                                                    }}
                                                                                                >
                                                                                                    <div
                                                                                                        className="w-4 h-4 rounded flex items-center justify-center transition-all"
                                                                                                        style={{
                                                                                                            backgroundColor:
                                                                                                                getCoursePrerequisites(
                                                                                                                    sector.id,
                                                                                                                    course.id
                                                                                                                )
                                                                                                                    .directSupport
                                                                                                                    ? '#10B981'
                                                                                                                    : '#E5E7EB',
                                                                                                            border: '2px solid',
                                                                                                            borderColor:
                                                                                                                getCoursePrerequisites(
                                                                                                                    sector.id,
                                                                                                                    course.id
                                                                                                                )
                                                                                                                    .directSupport
                                                                                                                    ? '#10B981'
                                                                                                                    : '#D1D5DB',
                                                                                                        }}
                                                                                                    >
                                                                                                        {getCoursePrerequisites(
                                                                                                            sector.id,
                                                                                                            course.id
                                                                                                        )
                                                                                                            .directSupport && (
                                                                                                            <CheckCircle className="w-3 h-3 text-white" />
                                                                                                        )}
                                                                                                    </div>
                                                                                                    <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                                                                                                        1.
                                                                                                        Direct
                                                                                                        Support
                                                                                                        Environment
                                                                                                    </span>
                                                                                                </div>

                                                                                                <div
                                                                                                    className="flex items-center gap-2 cursor-pointer group"
                                                                                                    onClick={() => {
                                                                                                        const coursePrereqs =
                                                                                                            getCoursePrerequisites(
                                                                                                                sector.id,
                                                                                                                course.id
                                                                                                            )
                                                                                                        updateCoursePrerequisite(
                                                                                                            sector.id,
                                                                                                            course.id,
                                                                                                            'supervision',
                                                                                                            !coursePrereqs.supervision
                                                                                                        )
                                                                                                    }}
                                                                                                >
                                                                                                    <div
                                                                                                        className="w-4 h-4 rounded flex items-center justify-center transition-all"
                                                                                                        style={{
                                                                                                            backgroundColor:
                                                                                                                getCoursePrerequisites(
                                                                                                                    sector.id,
                                                                                                                    course.id
                                                                                                                )
                                                                                                                    .supervision
                                                                                                                    ? '#10B981'
                                                                                                                    : '#E5E7EB',
                                                                                                            border: '2px solid',
                                                                                                            borderColor:
                                                                                                                getCoursePrerequisites(
                                                                                                                    sector.id,
                                                                                                                    course.id
                                                                                                                )
                                                                                                                    .supervision
                                                                                                                    ? '#10B981'
                                                                                                                    : '#D1D5DB',
                                                                                                        }}
                                                                                                    >
                                                                                                        {getCoursePrerequisites(
                                                                                                            sector.id,
                                                                                                            course.id
                                                                                                        )
                                                                                                            .supervision && (
                                                                                                            <CheckCircle className="w-3 h-3 text-white" />
                                                                                                        )}
                                                                                                    </div>
                                                                                                    <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                                                                                                        2.
                                                                                                        Supervision
                                                                                                    </span>
                                                                                                </div>

                                                                                                <div
                                                                                                    className="flex items-center gap-2 cursor-pointer group"
                                                                                                    onClick={() => {
                                                                                                        const coursePrereqs =
                                                                                                            getCoursePrerequisites(
                                                                                                                sector.id,
                                                                                                                course.id
                                                                                                            )
                                                                                                        updateCoursePrerequisite(
                                                                                                            sector.id,
                                                                                                            course.id,
                                                                                                            'equipmentResources',
                                                                                                            !coursePrereqs.equipmentResources
                                                                                                        )
                                                                                                    }}
                                                                                                >
                                                                                                    <div
                                                                                                        className="w-4 h-4 rounded flex items-center justify-center transition-all"
                                                                                                        style={{
                                                                                                            backgroundColor:
                                                                                                                getCoursePrerequisites(
                                                                                                                    sector.id,
                                                                                                                    course.id
                                                                                                                )
                                                                                                                    .equipmentResources
                                                                                                                    ? '#10B981'
                                                                                                                    : '#E5E7EB',
                                                                                                            border: '2px solid',
                                                                                                            borderColor:
                                                                                                                getCoursePrerequisites(
                                                                                                                    sector.id,
                                                                                                                    course.id
                                                                                                                )
                                                                                                                    .equipmentResources
                                                                                                                    ? '#10B981'
                                                                                                                    : '#D1D5DB',
                                                                                                        }}
                                                                                                    >
                                                                                                        {getCoursePrerequisites(
                                                                                                            sector.id,
                                                                                                            course.id
                                                                                                        )
                                                                                                            .equipmentResources && (
                                                                                                            <CheckCircle className="w-3 h-3 text-white" />
                                                                                                        )}
                                                                                                    </div>
                                                                                                    <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                                                                                                        3.
                                                                                                        Equipment
                                                                                                        &
                                                                                                        Resources
                                                                                                    </span>
                                                                                                </div>
                                                                                            </div>

                                                                                            <p className="text-xs text-muted-foreground mb-2">
                                                                                                {
                                                                                                    course.requirements
                                                                                                }
                                                                                            </p>
                                                                                            <div className="flex items-center gap-2">
                                                                                                <Badge
                                                                                                    variant="secondary"
                                                                                                    className="text-xs"
                                                                                                >
                                                                                                    <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                                                                                                    Compatible
                                                                                                </Badge>
                                                                                                <span className="text-xs text-muted-foreground">
                                                                                                    {
                                                                                                        course
                                                                                                            .tasks
                                                                                                            .length
                                                                                                    }{' '}
                                                                                                    learning
                                                                                                    tasks
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {/* Confirm and Process Button */}
                                                                    {isSectorFullyConfigured(
                                                                        sector
                                                                    ) &&
                                                                        !sector.confirmed && (
                                                                            <motion.div
                                                                                initial={{
                                                                                    opacity: 0,
                                                                                    y: 20,
                                                                                }}
                                                                                animate={{
                                                                                    opacity: 1,
                                                                                    y: 0,
                                                                                }}
                                                                                transition={{
                                                                                    duration: 0.3,
                                                                                }}
                                                                                className="pt-6 border-t-2 border-dashed border-gray-200"
                                                                            >
                                                                                <div className="bg-linear-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 space-y-4">
                                                                                    <div className="flex items-center gap-3">
                                                                                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                                                                            <CheckCircle className="w-6 h-6 text-white" />
                                                                                        </div>
                                                                                        <div className="flex-1">
                                                                                            <h4 className="font-semibold text-green-900">
                                                                                                Sector
                                                                                                Configuration
                                                                                                Complete!
                                                                                            </h4>
                                                                                            <p className="text-sm text-green-700">
                                                                                                All
                                                                                                required
                                                                                                fields
                                                                                                have
                                                                                                been
                                                                                                filled
                                                                                                for
                                                                                                this
                                                                                                sector
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <Button
                                                                                        onClick={() =>
                                                                                            handleConfirmSector(
                                                                                                sector.id
                                                                                            )
                                                                                        }
                                                                                        className="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-6 shadow-lg hover:shadow-xl transition-all"
                                                                                    >
                                                                                        <CheckCircle className="w-5 h-5 mr-2" />
                                                                                        Confirm
                                                                                        and
                                                                                        Process
                                                                                        This
                                                                                        Sector
                                                                                    </Button>

                                                                                    <div className="flex items-start gap-2 text-xs text-green-700">
                                                                                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                                                                        <p>
                                                                                            By
                                                                                            confirming,
                                                                                            you
                                                                                            verify
                                                                                            that
                                                                                            all
                                                                                            information
                                                                                            is
                                                                                            accurate
                                                                                            and
                                                                                            this
                                                                                            sector
                                                                                            is
                                                                                            ready
                                                                                            for
                                                                                            student
                                                                                            placements.
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </motion.div>
                                                                        )}
                                                                </>
                                                            )}
                                                    </div>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>

                        {data.sectors.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>
                                    No sectors configured yet. Add your first
                                    sector above to get started.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
            {/* Industry Check Information Dialog */}
            <IndustryCheckInfoModal
                selectedIndustryCheck={selectedIndustryCheck}
                setSelectedIndustryCheck={setSelectedIndustryCheck}
                getIndustryCheckInfo={getIndustryCheckInfo}
            />

            {/* Sector Eligibility Dialog */}
            <SectorEligibilityModal
                data={data}
                handleAddSector={handleAddSector}
                eligibilityDialogOpen={eligibilityDialogOpen}
                setEligibilityDialogOpen={setEligibilityDialogOpen}
            />
        </motion.div>
    )
}
