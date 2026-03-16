import { Switch, TextInput } from '@components'
import { Label } from '@components/ui/label'
import { IndustryCheck } from '../../types/sectorsAndCourses'

interface IndustryCheckItemProps {
    check: IndustryCheck
    checkInfo: any
    sectorColor: string
    onUpdateRequired: (value: boolean) => void
    onUpdateName?: (value: string) => void
}

export const IndustryCheckItem: React.FC<IndustryCheckItemProps> = ({
    check,
    checkInfo,
    sectorColor,
    onUpdateRequired,
    onUpdateName,
}) => {
    const isOtherCheck = check.id === 'other'

    return (
        <div className={isOtherCheck ? 'col-span-full' : ''}>
            <div
                className="flex items-center justify-between p-4 rounded-xl border-2 bg-white/60"
                style={{
                    borderColor: check.required ? sectorColor : '#E2E8F0',
                }}
            >
                <div className="flex items-center gap-3 flex-1">
                    <span className="text-lg">
                        {check.icon || checkInfo?.icon}
                    </span>
                    <div className="flex-1">
                        <div className="font-medium text-sm">{check.name}</div>
                        <div className="text-xs text-muted-foreground">
                            {check.description || checkInfo?.description}
                        </div>
                    </div>
                </div>
                <Switch
                    name={
                        isOtherCheck ? 'customCheckRequired' : 'checkRequired'
                    }
                    defaultChecked={check.required}
                    onChange={onUpdateRequired}
                    className="data-[state=checked]:bg-primary"
                />
            </div>
            {isOtherCheck && check.required && onUpdateName && (
                <div className="mt-3 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                    <Label className="text-xs font-semibold mb-2 block">
                        Specify Custom Check Name
                    </Label>
                    <TextInput
                        name="customCheckName"
                        value={check.name === 'Other' ? '' : check.name}
                        onChange={(e: any) =>
                            onUpdateName(e.target.value || 'Other')
                        }
                        placeholder="e.g., First Aid Certificate, Food Safety Certificate"
                        className="bg-white border-2"
                    />
                </div>
            )}
        </div>
    )
}
