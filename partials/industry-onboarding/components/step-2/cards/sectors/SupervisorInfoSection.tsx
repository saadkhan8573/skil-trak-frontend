import { Select, TextInput } from '@components'
import { Label } from '@components/ui/label'
import { qualificationLevels } from '../../mockData'
import { Sector } from '../../types/sectorsAndCourses'

interface SupervisorInfoSectionProps {
    sector: Sector
    index: number
    errors: Record<string, string>
    onUpdate: (updates: Partial<Sector>) => void
}

export const SupervisorInfoSection: React.FC<SupervisorInfoSectionProps> = ({
    sector,
    index,
    errors,
    onUpdate,
}) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
            <Label className="text-sm font-semibold">Supervisor Name</Label>
            <TextInput
                name="supervisorName"
                value={sector.supervisorName}
                onChange={(e: any) =>
                    onUpdate({ supervisorName: e.target.value })
                }
                placeholder="Enter supervisor full name"
                className="bg-white/90 backdrop-blur-sm border-2 hover:border-primary/50 focus:border-primary"
            />
            {errors[`sector_${index}_supervisor_name`] && (
                <p className="text-xs text-destructive">
                    {errors[`sector_${index}_supervisor_name`]}
                </p>
            )}
        </div>

        <div className="space-y-3">
            <Label className="text-sm font-semibold">
                Supervisor Qualification Level
            </Label>
            <Select
                name="qualificationLevel"
                value={sector.supervisorLevel}
                onChange={(value: any) => onUpdate({ supervisorLevel: value })}
                options={qualificationLevels}
            />
            {errors[`sector_${index}_supervisor_level`] && (
                <p className="text-xs text-destructive">
                    {errors[`sector_${index}_supervisor_level`]}
                </p>
            )}
        </div>

        <div className="col-span-full space-y-3">
            <Label className="text-sm font-semibold">Qualification Title</Label>
            <TextInput
                name="qualificationTitle"
                value={sector.qualificationTitle}
                onChange={(e: any) =>
                    onUpdate({ qualificationTitle: e.target.value })
                }
                placeholder="e.g., Diploma of Community Services"
                className="bg-white/90 backdrop-blur-sm border-2 hover:border-primary/50 focus:border-primary"
            />
            {errors[`sector_${index}_qualification_title`] && (
                <p className="text-xs text-destructive">
                    {errors[`sector_${index}_qualification_title`]}
                </p>
            )}
        </div>
    </div>
)
