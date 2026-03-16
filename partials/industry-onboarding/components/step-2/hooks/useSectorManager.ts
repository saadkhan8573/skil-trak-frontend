import {
    availableSectors,
    industryChecks,
    mockCourses,
    qualificationHierarchy,
} from '../mockData'
import {
    AllSectorsData,
    Course,
    EligibilityChecks,
    IndustryCheck,
    Sector,
    SectorConfig,
    SectorFormValues,
    SectorsCardProps,
} from '../types/sectorsAndCourses'

export const useSectorManager = (
    data: SectorsCardProps['data'],
    onChange: SectorsCardProps['onChange']
) => {
    // ========================================================================
    // GETTER METHODS - Retrieve configuration data
    // ========================================================================

    const getSectorConfig = (sectorName: string): SectorConfig =>
        (availableSectors.find((s) => s.name === sectorName) ||
            availableSectors[0]) as SectorConfig

    const getIndustryCheckInfo = (checkId: string): any =>
        industryChecks.find((c: any) => c.id === checkId)

    // ========================================================================
    // FORM VALUE RETRIEVAL METHODS - Get all field values
    // ========================================================================

    /**
     * Get all values from a specific sector
     * @param sectorId - The sector ID to retrieve values from
     * @returns SectorFormValues with all current field values
     */
    const getSectorValues = (sectorId: string): SectorFormValues | null => {
        const sector = data.sectors.find((s: Sector) => s.id === sectorId)
        if (!sector) return null

        return {
            supervisorName: sector.supervisorName,
            supervisorLevel: sector.supervisorLevel,
            qualificationTitle: sector.qualificationTitle,
            capacity: sector.capacity,
            capacityPeriod: sector.capacityPeriod,
            eligibilityChecks: sector.eligibilityChecks,
            industryChecks: sector.industryChecks.map(
                (check: IndustryCheck) => ({
                    id: check.id,
                    name: check.name,
                    required: check.required,
                })
            ),
            coursePrerequisites: Object.entries(
                sector.coursePrerequisites || {}
            ).map(([courseId, prereqs]: [string, EligibilityChecks]) => ({
                courseId,
                directSupport: prereqs.directSupport,
                supervision: prereqs.supervision,
                equipmentResources: prereqs.equipmentResources,
            })),
        }
    }

    /**
     * Get all values from all sectors
     * @returns AllSectorsData with all sectors' values
     */
    const getAllSectorsValues = (): AllSectorsData => {
        return {
            sectors: data.sectors
                .map((sector: Sector) => getSectorValues(sector.id))
                .filter(
                    (values): values is SectorFormValues => values !== null
                ),
        }
    }

    /**
     * Get specific field value from a sector
     * @param sectorId - The sector ID
     * @param fieldName - The field name to retrieve
     * @returns The field value or null if not found
     */
    const getSectorFieldValue = (
        sectorId: string,
        fieldName: keyof Sector
    ): any => {
        const sector = data.sectors.find((s: Sector) => s.id === sectorId)
        return sector ? sector[fieldName] : null
    }

    /**
     * Get eligibility checks for a sector
     * @param sectorId - The sector ID
     * @returns EligibilityChecks object
     */
    const getEligibilityCheckValues = (sectorId: string): EligibilityChecks => {
        const sector = data.sectors.find((s: Sector) => s.id === sectorId)
        return (
            sector?.eligibilityChecks || {
                directSupport: false,
                supervision: false,
                equipmentResources: false,
            }
        )
    }

    /**
     * Get industry checks for a sector
     * @param sectorId - The sector ID
     * @returns Array of industry checks with their current values
     */
    const getIndustryCheckValues = (
        sectorId: string
    ): (IndustryCheck & { currentName: string })[] => {
        const sector = data.sectors.find((s: Sector) => s.id === sectorId)
        if (!sector) return []

        return sector.industryChecks.map((check: IndustryCheck) => ({
            ...check,
            currentName: check.name,
        }))
    }

    /**
     * Get course prerequisite values
     * @param sectorId - The sector ID
     * @param courseId - The course ID
     * @returns EligibilityChecks for the course
     */
    const getCoursePrerequisiteValues = (
        sectorId: string,
        courseId: string
    ): EligibilityChecks => {
        const sector = data.sectors.find((s: Sector) => s.id === sectorId)
        if (!sector?.coursePrerequisites?.[courseId]) {
            return {
                directSupport: false,
                supervision: false,
                equipmentResources: false,
            }
        }
        return sector.coursePrerequisites[courseId]
    }

    // ========================================================================
    // UPDATE METHODS - Modify data
    // ========================================================================

    /**
     * Update a sector with new values
     * @param sectorId - The sector ID to update
     * @param updates - Partial sector object with fields to update
     */
    const updateSector = (sectorId: string, updates: Partial<Sector>): void => {
        onChange({
            ...data,
            sectors: data.sectors.map((s: Sector) =>
                s.id === sectorId ? { ...s, ...updates } : s
            ),
        })
    }

    /**
     * Remove a sector
     * @param sectorId - The sector ID to remove
     */
    const removeSector = (sectorId: string): void => {
        onChange({
            ...data,
            sectors: data.sectors.filter((s: Sector) => s.id !== sectorId),
        })
    }

    /**
     * Update an industry check (with strict boolean type checking)
     * @param sectorId - The sector ID
     * @param checkId - The check ID
     * @param field - The field to update ('required' or 'showToStudents')
     * @param value - Boolean value to set (type-safe)
     */
    const updateIndustryCheck = (
        sectorId: string,
        checkId: string,
        field: 'required' | 'showToStudents',
        value: boolean // ✅ Type is strictly boolean here
    ): void => {
        const sector = data.sectors.find((s: Sector) => s.id === sectorId)
        if (!sector) return

        // Ensure value is always boolean
        const boolValue: boolean = Boolean(value)

        const updatedChecks = sector.industryChecks.map(
            (check: IndustryCheck) =>
                check.id === checkId ? { ...check, [field]: boolValue } : check
        )

        updateSector(sectorId, { industryChecks: updatedChecks })
    }

    /**
     * Update eligibility checks with strict type checking
     * @param sectorId - The sector ID
     * @param updates - Partial EligibilityChecks object
     */
    const updateEligibilityChecks = (
        sectorId: string,
        updates: Partial<EligibilityChecks>
    ): void => {
        const sector = data.sectors.find((s: Sector) => s.id === sectorId)
        if (!sector) return

        // Ensure all values are boolean
        const safeUpdates: Partial<EligibilityChecks> = {
            ...(updates.directSupport !== undefined && {
                directSupport: Boolean(updates.directSupport),
            }),
            ...(updates.supervision !== undefined && {
                supervision: Boolean(updates.supervision),
            }),
            ...(updates.equipmentResources !== undefined && {
                equipmentResources: Boolean(updates.equipmentResources),
            }),
        }

        updateSector(sectorId, {
            eligibilityChecks: { ...sector.eligibilityChecks, ...safeUpdates },
        })
    }

    /**
     * Update course prerequisite with strict type checking
     * @param sectorId - The sector ID
     * @param courseId - The course ID
     * @param field - The field to update
     * @param value - Boolean value (type-safe)
     */
    const updateCoursePrerequisite = (
        sectorId: string,
        courseId: string,
        field: keyof EligibilityChecks,
        value: boolean // ✅ Type is strictly boolean here
    ): void => {
        const sector = data.sectors.find((s: Sector) => s.id === sectorId)
        if (!sector) return

        // Ensure value is always boolean
        const boolValue: boolean = Boolean(value)

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
                    [field]: boolValue,
                },
            },
        })
    }

    // ========================================================================
    // VALIDATION & FILTER METHODS
    // ========================================================================

    /**
     * Check if supervisor can supervise a course level
     * @param supervisorLevel - The supervisor's qualification level
     * @param courseLevel - The course's required level
     * @returns true if supervisor can supervise
     */
    const canSupervise = (
        supervisorLevel: string,
        courseLevel: string
    ): boolean => {
        const supervisorRank: number =
            qualificationHierarchy[
                supervisorLevel as keyof typeof qualificationHierarchy
            ] || 0
        const courseRank: number =
            qualificationHierarchy[
                courseLevel as keyof typeof qualificationHierarchy
            ] || 0
        return supervisorRank >= courseRank
    }

    /**
     * Get filtered courses for a sector based on supervisor level
     * @param sectorName - The sector name
     * @param supervisorLevel - The supervisor's qualification level
     * @returns Array of courses
     */
    const getFilteredCoursesForSector = (
        sectorName: string,
        supervisorLevel: string
    ): any => {
        return mockCourses.filter(
            (course: any) =>
                course.sector === sectorName &&
                (supervisorLevel
                    ? canSupervise(supervisorLevel, course.level)
                    : true)
        )
    }

    /**
     * Validate if a sector is fully configured
     * @param sector - The sector to validate
     * @returns true if sector meets all requirements
     */
    const isSectorFullyConfigured = (sector: Sector): boolean => {
        const firstSector = data.sectors[0]
        const eligibilityPassed: boolean =
            Boolean(firstSector?.eligibilityChecks.directSupport) &&
            Boolean(firstSector?.eligibilityChecks.supervision) &&
            Boolean(firstSector?.eligibilityChecks.equipmentResources)

        const supervisorFilled: boolean =
            sector.supervisorName.trim() !== '' &&
            sector.supervisorLevel !== '' &&
            sector.qualificationTitle.trim() !== ''

        const capacitySet: boolean = sector.capacity >= 1

        const hasAvailableCourses: boolean =
            sector.supervisorLevel !== '' &&
            getFilteredCoursesForSector(sector.name, sector.supervisorLevel)
                .length > 0

        return (
            eligibilityPassed &&
            supervisorFilled &&
            capacitySet &&
            hasAvailableCourses
        )
    }

    /**
     * Get course prerequisites with proper typing
     * @param sectorId - The sector ID
     * @param courseId - The course ID
     * @returns EligibilityChecks object
     */
    const getCoursePrerequisites = (
        sectorId: string,
        courseId: string
    ): EligibilityChecks => {
        const sector = data.sectors.find((s: Sector) => s.id === sectorId)
        if (!sector?.coursePrerequisites?.[courseId]) {
            return {
                directSupport: false,
                supervision: false,
                equipmentResources: false,
            }
        }
        return sector.coursePrerequisites[courseId]
    }

    // ========================================================================
    // EXPORT HOOK INTERFACE
    // ========================================================================

    return {
        // Getter methods
        getSectorConfig,
        getIndustryCheckInfo,
        getSectorFieldValue,

        // Value retrieval methods (NEW)
        getSectorValues,
        getAllSectorsValues,
        getEligibilityCheckValues,
        getIndustryCheckValues,
        getCoursePrerequisiteValues,

        // Update methods
        updateSector,
        removeSector,
        updateIndustryCheck,
        updateEligibilityChecks,
        updateCoursePrerequisite,

        // Validation & filter methods
        canSupervise,
        getFilteredCoursesForSector,
        isSectorFullyConfigured,
        getCoursePrerequisites,
    }
}

// ============================================================================
// EXPORT TYPES FOR USE IN COMPONENTS
// ============================================================================

export type SectorManager = ReturnType<typeof useSectorManager>
