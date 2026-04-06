import { Select, TextInput } from '@components'
import { Label } from '@components/ui/label'
import { SupervisorQualification } from '@partials/common'

interface SupervisorFormProps {
    sector: any
    sectorState: any
    index: number
    errors: Record<string, string>
    onUpdateSector: (updates: any) => void
    onQualificationLevelChange: (value: string) => void
}

export function SupervisorForm({
    sector,
    sectorState,
    index,
    errors,
    onUpdateSector,
    onQualificationLevelChange,
}: SupervisorFormProps) {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <Label className="text-sm font-semibold">Supervisor Name</Label>
                    <TextInput
                        name="supervisorName"
                        value={sectorState?.supervisorName || ''}
                        onChange={(e: any) => onUpdateSector({ supervisorName: e.target.value })}
                        placeholder="Enter supervisor full name"
                        className="bg-white/90 backdrop-blur-sm border-2 hover:border-primary/50 focus:border-primary"
                    />
                    {errors[`sector_${index}_supervisor_name`] && (
                        <p className="text-xs text-destructive">{errors[`sector_${index}_supervisor_name`]}</p>
                    )}
                </div>

                <div className="space-y-3">
                    <Label className="text-sm font-semibold">Supervisor Qualification Level</Label>
                    <Select
                        name="qualificationLevel"
                        onlyValue
                        value={sectorState?.supervisorLevel || ''}
                        onChange={(value: any) => {
                            onQualificationLevelChange(value)
                            onUpdateSector({ supervisorLevel: value })
                        }}
                        options={SupervisorQualification}
                    />
                    {errors[`sector_${index}_supervisor_level`] && (
                        <p className="text-xs text-destructive">{errors[`sector_${index}_supervisor_level`]}</p>
                    )}
                </div>
            </div>

            <div className="space-y-3">
                <Label className="text-sm font-semibold">Qualification Title</Label>
                <TextInput
                    name="qualificationTitle"
                    value={sectorState?.qualificationTitle || ''}
                    onChange={(e: any) => onUpdateSector({ qualificationTitle: e.target.value })}
                    placeholder="e.g., Diploma of Community Services"
                    className="bg-white/90 backdrop-blur-sm border-2 hover:border-primary/50 focus:border-primary"
                />
                {errors[`sector_${index}_qualification_title`] && (
                    <p className="text-xs text-destructive">{errors[`sector_${index}_qualification_title`]}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                    <Label className="text-sm font-semibold">
                        Student Capacity <span className="text-destructive">*</span>
                    </Label>
                    <TextInput
                        name={`sector_${index}_capacity`}
                        type="number"
                        min="1"
                        value={sectorState?.capacity ?? ''}
                        onChange={(e: any) => {
                            const val = parseInt(e.target.value)
                            onUpdateSector({ capacity: isNaN(val) ? undefined : val })
                        }}
                        className="bg-white/90 backdrop-blur-sm border-2 hover:border-primary/50 focus:border-primary"
                    />
                    {errors[`sector_${index}_capacity`] && (
                        <p className="text-xs text-destructive">{errors[`sector_${index}_capacity`]}</p>
                    )}
                </div>

                <div className="space-y-3">
                    <Label className="text-sm font-semibold">Capacity Period</Label>
                    <Select
                        name="capacityPeriod"
                        value={sector.capacityPeriod}
                        onlyValue
                        onChange={(value: any) => onUpdateSector({ capacityPeriod: value })}
                        options={[
                            { value: 'weekly', label: 'Weekly' },
                            { value: 'biweekly', label: 'Biweekly' },
                            { value: 'monthly', label: 'Monthly' },
                        ]}
                    />
                </div>
            </div>
        </>
    )
}
