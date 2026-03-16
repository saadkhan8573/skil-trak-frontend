import { Label } from '@components/ui/label'
import { IndustryCheck, Sector } from '../../types/sectorsAndCourses'
import { IndustryCheckItem } from './IndustryCheckItem'

interface IndustryChecksSectionProps {
    sector: Sector
    sectorColor: string
    getIndustryCheckInfo: (id: string) => any
    onUpdateCheck: (
        checkId: string,
        field: 'required' | 'showToStudents',
        value: boolean
    ) => void
    onUpdateCheckName: (checkId: string, name: string) => void
}

export const IndustryChecksSection: React.FC<IndustryChecksSectionProps> = ({
    sector,
    sectorColor,
    getIndustryCheckInfo,
    onUpdateCheck,
    onUpdateCheckName,
}) => (
    <div className="space-y-4">
        <div>
            <Label className="text-sm font-semibold">
                Required Industry Checks
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
                💡 When you turn these on, students will be required to upload
                these documents when applying for placements
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sector.industryChecks.map((check: IndustryCheck) => {
                const checkInfo = getIndustryCheckInfo(check.id)
                return (
                    <IndustryCheckItem
                        key={check.id}
                        check={check}
                        checkInfo={checkInfo}
                        sectorColor={sectorColor}
                        onUpdateRequired={(value) =>
                            onUpdateCheck(check.id, 'required', value)
                        }
                        onUpdateName={
                            check.id === 'other'
                                ? (name) => onUpdateCheckName(check.id, name)
                                : undefined
                        }
                    />
                )
            })}
        </div>
    </div>
)
