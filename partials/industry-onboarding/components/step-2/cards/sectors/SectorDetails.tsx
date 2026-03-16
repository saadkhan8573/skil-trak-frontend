import {
    EligibilityChecks,
    IndustryCheck,
    Sector,
    SectorConfig,
} from '../../types/sectorsAndCourses'
import { AvailableCoursesSection } from '../courses'
import { EligibilityChecksSection } from '../eligibility'
import { IndustryChecksSection } from '../industry-checks'
import { CapacitySection } from './CapacitySection'
import { ConfirmSectorSection } from './ConfirmSectorSection'
import { SupervisorInfoSection } from './SupervisorInfoSection'

interface SectorDetailsProps {
    sector: Sector
    index: number
    sectorConfig: SectorConfig
    errors: Record<string, string>
    isEligible: boolean
    isSectorFullyConfigured: boolean
    getFilteredCoursesForSector: (
        sectorName: string,
        supervisorLevel: string
    ) => any[]
    getCoursePrerequisites: (
        sectorId: string,
        courseId: string
    ) => EligibilityChecks
    getIndustryCheckInfo: (id: string) => any
    onUpdateSector: (updates: Partial<Sector>) => void
    onUpdateIndustryCheck: (
        checkId: string,
        field: 'required' | 'showToStudents',
        value: boolean
    ) => void
    onUpdateCoursePrerequisite: (
        courseId: string,
        field: keyof EligibilityChecks,
        value: boolean
    ) => void
    onConfirmSector: () => void
}

export const SectorDetails: React.FC<SectorDetailsProps> = ({
    sector,
    index,
    sectorConfig,
    errors,
    isEligible,
    isSectorFullyConfigured,
    getFilteredCoursesForSector,
    getCoursePrerequisites,
    getIndustryCheckInfo,
    onUpdateSector,
    onUpdateIndustryCheck,
    onUpdateCoursePrerequisite,
    onConfirmSector,
}) => (
    <div className="p-6 space-y-6 bg-white/60 backdrop-blur-sm">
        {index === 0 && (
            <EligibilityChecksSection
                eligibilityChecks={sector.eligibilityChecks}
                onUpdate={(updates) =>
                    onUpdateSector({ eligibilityChecks: updates })
                }
            />
        )}

        {isEligible && (
            <>
                <SupervisorInfoSection
                    sector={sector}
                    index={index}
                    errors={errors}
                    onUpdate={onUpdateSector}
                />

                <CapacitySection sector={sector} onUpdate={onUpdateSector} />

                <IndustryChecksSection
                    sector={sector}
                    sectorColor={sectorConfig.color}
                    getIndustryCheckInfo={getIndustryCheckInfo}
                    onUpdateCheck={onUpdateIndustryCheck}
                    onUpdateCheckName={(checkId, name) => {
                        const updatedChecks = sector.industryChecks.map(
                            (check: IndustryCheck) =>
                                check.id === 'other'
                                    ? { ...check, name }
                                    : check
                        )
                        onUpdateSector({ industryChecks: updatedChecks })
                    }}
                />

                <AvailableCoursesSection
                    sector={sector}
                    getFilteredCoursesForSector={getFilteredCoursesForSector}
                    getCoursePrerequisites={getCoursePrerequisites}
                    onPrerequisiteChange={onUpdateCoursePrerequisite}
                    sectorColor={sectorConfig.color}
                />

                {isSectorFullyConfigured && !sector.confirmed && (
                    <ConfirmSectorSection
                        sector={sector}
                        onConfirm={onConfirmSector}
                    />
                )}
            </>
        )}
    </div>
)
