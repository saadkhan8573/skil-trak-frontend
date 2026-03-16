import { Label } from '@components/ui/label'
import { Sector } from '../../types/sectorsAndCourses'
import { Select, TextInput } from '@components'

interface CapacitySectionProps {
    sector: Sector
    onUpdate: (updates: Partial<Sector>) => void
}

const CAPACITY_PERIOD_OPTIONS = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Biweekly' },
    { value: 'monthly', label: 'Monthly' },
]

export const CapacitySection: React.FC<CapacitySectionProps> = ({
    sector,
    onUpdate,
}) => (
    <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
            <Label className="text-sm font-semibold">Student Capacity</Label>
            <TextInput
                name="capacity"
                type="number"
                min="1"
                max="50"
                value={sector.capacity}
                onChange={(e: any) =>
                    onUpdate({ capacity: parseInt(e.target.value) || 1 })
                }
                className="bg-white/90 backdrop-blur-sm border-2 hover:border-primary/50 focus:border-primary"
            />
        </div>

        <div className="space-y-3">
            <Label className="text-sm font-semibold">Capacity Period</Label>
            <Select
                name="capacityPeriod"
                value={sector.capacityPeriod}
                onChange={(value: any) => onUpdate({ capacityPeriod: value })}
                options={CAPACITY_PERIOD_OPTIONS}
            />
        </div>
    </div>
)
