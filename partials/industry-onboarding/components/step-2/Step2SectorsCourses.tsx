import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, GraduationCap, Shield, Sparkles } from 'lucide-react'

import { SectorsCard } from './cards/SectorsCard'
import { SectorEligibilityModal } from './modal/SectorEligibilityModal'
import { IndustryCheckInfoModal } from './modal/IndustryCheckInfoModal'
import {
    availableSectors,
    industryChecks,
    mockCourses,
    qualificationHierarchy,
    Sector,
    Step2Data,
} from './mockData'

// import { HelpPanel } from '../help-panel'

interface Step2Props {
    data: Step2Data
    onChange: any
    onValidationChange: (isValid: boolean) => void
}

export function Step2SectorsCourses({
    data,
    onChange,
    onValidationChange,
}: Step2Props) {
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [expandedSector, setExpandedSector] = useState<string | null>(
        data.sectors.length > 0 ? data.sectors[0].id : null
    )
    const [selectedIndustryCheck, setSelectedIndustryCheck] = useState<
        string | null
    >(null)
    const [facilityChecklistOpen, setFacilityChecklistOpen] = useState(false)
    const [selectedSectorForChecklist, setSelectedSectorForChecklist] =
        useState<string>('')
    const [eligibilityDialogOpen, setEligibilityDialogOpen] = useState(false)
    const [confirmedSectorId, setConfirmedSectorId] = useState<string>('')

    const helpTips = [
        {
            icon: <Building2 className="w-4 h-4" />,
            title: 'Sector Setup',
            description:
                'Configure your industry sectors with qualified supervisors for student placements',
        },
        {
            icon: <GraduationCap className="w-4 h-4" />,
            title: 'Smart Matching',
            description:
                'Courses are automatically matched based on supervisor qualifications and sector expertise',
        },
        {
            icon: <Shield className="w-4 h-4" />,
            title: 'Industry Compliance',
            description:
                'Set required background checks and industry-specific clearances for each sector',
        },
    ]

    const getSectorConfig = (sectorName: string) => {
        return (
            availableSectors.find((s) => s.name === sectorName) ||
            availableSectors[0]
        )
    }

    const getIndustryCheckInfo = (checkId: string) => {
        return industryChecks.find((c) => c.id === checkId)
    }

    const addSector = (sectorName: string) => {
        // Inherit eligibility checks from first sector if it exists
        const inheritedEligibilityChecks =
            data.sectors.length > 0
                ? data.sectors[0].eligibilityChecks
                : {
                      directSupport: false,
                      supervision: false,
                      equipmentResources: false,
                  }

        const newSector: Sector = {
            id: Date.now().toString(),
            name: sectorName,
            workplaceTypes: '',
            supervisorName: '',
            supervisorLevel: '',
            qualificationTitle: '',
            industryChecks: industryChecks.map((check) => ({
                id: check.id,
                name: check.name,
                icon: check.icon,
                description: check.description,
                required: false,
                showToStudents: true,
            })),
            capacity: 1,
            capacityPeriod: 'Month',
            eligibilityChecks: inheritedEligibilityChecks,
        }

        onChange({
            ...data,
            sectors: [...data.sectors, newSector],
        })

        // Always keep new sectors expanded
        setExpandedSector(newSector.id)
    }

    const removeSector = (sectorId: string) => {
        onChange({
            ...data,
            sectors: data.sectors.filter((s) => s.id !== sectorId),
        })
        setExpandedSector((prev) => {
            if (prev === sectorId) return null
            return prev
        })
    }

    const updateSector = (sectorId: string, updates: Partial<Sector>) => {
        onChange({
            ...data,
            sectors: data.sectors.map((s) =>
                s.id === sectorId ? { ...s, ...updates } : s
            ),
        })
    }

    const updateIndustryCheck = (
        sectorId: string,
        checkId: string,
        field: 'required' | 'showToStudents',
        value: boolean
    ) => {
        const sector = data.sectors.find((s) => s.id === sectorId)
        if (!sector) return

        const updatedChecks = sector.industryChecks.map((check) =>
            check.id === checkId ? { ...check, [field]: value } : check
        )

        updateSector(sectorId, { industryChecks: updatedChecks })
    }

    const updateCoursePrerequisite = (
        sectorId: string,
        courseId: string,
        field: 'directSupport' | 'supervision' | 'equipmentResources',
        value: boolean
    ) => {
        const sector = data.sectors.find((s) => s.id === sectorId)
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

    const getCoursePrerequisites = (sectorId: string, courseId: string) => {
        const sector = data.sectors.find((s) => s.id === sectorId)
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

    const toggleSectorExpansion = (sectorId: string) => {
        // Keep all sectors expanded by default - users can still collapse if needed
        setExpandedSector((prev) => {
            if (prev === sectorId) return null
            return sectorId
        })
    }

    const isSectorUnlocked = (sectorName: string) => {
        // All sectors are now available by default
        return true
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (data.sectors.length === 0) {
            newErrors.sectors = 'At least one sector is required'
        }

        // Check if first sector has all eligibility checks set to YES
        if (data.sectors.length > 0) {
            const firstSector = data.sectors[0]
            if (
                !firstSector.eligibilityChecks.directSupport ||
                !firstSector.eligibilityChecks.supervision ||
                !firstSector.eligibilityChecks.equipmentResources
            ) {
                newErrors.eligibility =
                    'All three course prerequisites must be YES'
            }
        }

        data.sectors.forEach((sector, index) => {
            // Only validate supervisor fields if eligibility checks pass
            if (
                data.sectors.length > 0 &&
                data.sectors[0].eligibilityChecks.directSupport &&
                data.sectors[0].eligibilityChecks.supervision &&
                data.sectors[0].eligibilityChecks.equipmentResources
            ) {
                if (!sector.supervisorName.trim()) {
                    newErrors[`sector_${index}_supervisor_name`] =
                        'Supervisor name is required'
                }
                if (!sector.supervisorLevel) {
                    newErrors[`sector_${index}_supervisor_level`] =
                        'Supervisor qualification level is required'
                }
                if (!sector.qualificationTitle.trim()) {
                    newErrors[`sector_${index}_qualification_title`] =
                        'Qualification title is required'
                }
            }
        })

        setErrors(newErrors)
        const isValid = Object.keys(newErrors).length === 0
        onValidationChange(isValid)
        return isValid
    }

    // Ensure all sectors stay expanded by default
    useEffect(() => {
        setExpandedSector(data.sectors.length > 0 ? data.sectors[0].id : null)
    }, [data.sectors.length])

    useEffect(() => {
        validateForm()
    }, [data])

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
        return mockCourses.filter((course) => {
            const matchesSector = course.sector === sectorName
            const canSuperviseCourse = supervisorLevel
                ? canSupervise(supervisorLevel, course.level)
                : true
            return matchesSector && canSuperviseCourse
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
        const sector = data.sectors.find((s) => s.id === sectorId)
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

    const handleAddSector = (sectorName: string) => {
        addSector(sectorName)
        // toast.success(
        //     `🎉 ${sectorName} sector added! Please configure the details below.`
        // )
    }

    const filteredCourses = mockCourses.filter((course) =>
        data.sectors.some((sector) => sector.name === course.sector)
    )

    return (
        <div className="max-w-260 mx-auto px-6 py-8 space-y-8">
            {/* <HelpPanel tips={helpTips} /> */}

            {/* Optimized Header */}
            <motion.div
                className="text-center py-8 relative overflow-hidden"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div
                    className="absolute inset-0 bg-linear-to-r from-blue-50/30 via-orange-50/20 to-blue-50/30 rounded-3xl"
                    style={{
                        background: `linear-gradient(135deg, 
            rgba(4, 72, 102, 0.03) 0%, 
            rgba(247, 166, 25, 0.02) 50%, 
            rgba(13, 84, 104, 0.03) 100%)`,
                    }}
                ></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Building2 className="w-8 h-8 text-primaryNew" />
                        </motion.div>
                        <h2 className="text-3xl font-bold gradient-text">
                            Sectors & Student Placements
                        </h2>
                        <motion.div
                            animate={{ rotate: [0, -10, 10, 0] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: 1,
                            }}
                        >
                            <Sparkles className="w-8 h-8 text-primary" />
                        </motion.div>
                    </div>
                    <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
                        🎯 Configure your industry sectors and qualified
                        supervisors to provide exceptional student placement
                        opportunities
                    </p>
                </div>
            </motion.div>

            {/* Main Sectors Card */}
            <SectorsCard onChange={onChange} errors={errors} data={data} handleAddSector={handleAddSector} />

            {/* Industry Check Information Dialog */}
            <IndustryCheckInfoModal
                selectedIndustryCheck={selectedIndustryCheck}
                setSelectedIndustryCheck={setSelectedIndustryCheck}
                getIndustryCheckInfo={getIndustryCheckInfo}
            />

            {/* Sector Eligibility Dialog */}
            {/* <SectorEligibilityModal
                data={data}
                handleAddSector={handleAddSector}
                eligibilityDialogOpen={eligibilityDialogOpen}
                setEligibilityDialogOpen={setEligibilityDialogOpen}
            /> */}
        </div>
    )
}
