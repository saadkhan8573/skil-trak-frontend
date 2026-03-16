export interface EligibilityChecks {
    directSupport: boolean
    supervision: boolean
    equipmentResources: boolean
}

export interface CoursePrerequisites {
    [courseId: string]: EligibilityChecks
}

export interface IndustryCheck {
    id: string
    name: string
    icon?: string
    description?: string
    required: boolean
    showToStudents: boolean
}

export interface Sector {
    id: string
    name: string
    workplaceTypes: string
    supervisorName: string
    supervisorLevel: string
    qualificationTitle: string
    industryChecks: IndustryCheck[]
    capacity: number
    capacityPeriod: string
    eligibilityChecks: EligibilityChecks
    coursePrerequisites?: CoursePrerequisites
    confirmed?: boolean
}

export interface SectorConfig {
    name: string
    icon: string
    color: string
    bgColor: string
}

export interface SectorsCardProps {
    data: {
        sectors: Sector[]
    }
    onChange: (data: any) => void
    errors?: Record<string, string>
}

// ============================================================================
// EXTRACTED TYPES FROM MOCKDATA
// ============================================================================

export interface CourseTask {
    id: string
    description: string
}

export interface Course {
    id: string
    name: string
    sector: string
    level: string
    requirements: string
    tasks: CourseTask[]
}

export interface SectorFormValues {
    supervisorName: string
    supervisorLevel: string
    qualificationTitle: string
    capacity: number
    capacityPeriod: string
    eligibilityChecks: EligibilityChecks
    industryChecks: {
        id: string
        name: string
        required: boolean
    }[]
    coursePrerequisites: {
        courseId: string
        directSupport: boolean
        supervision: boolean
        equipmentResources: boolean
    }[]
}

export interface AllSectorsData {
    sectors: SectorFormValues[]
}
