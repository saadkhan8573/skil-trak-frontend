import { CheckCircle } from 'lucide-react'

interface EligibilityCheckboxProps {
    label: string
    description: string
    checked: boolean
    onChange: (checked: boolean) => void
}

export const EligibilityCheckbox: React.FC<EligibilityCheckboxProps> = ({
    label,
    description,
    checked,
    onChange,
}) => (
    <div
        className="bg-white rounded-xl p-4 border-2 transition-all duration-300"
        style={{
            borderColor: checked ? '#10B981' : '#E5E7EB',
        }}
    >
        <div className="flex items-start gap-3">
            <div className="pt-1">
                <div
                    className="w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-200"
                    style={{
                        borderColor: checked ? '#10B981' : '#D1D5DB',
                        backgroundColor: checked ? '#10B981' : 'white',
                    }}
                    onClick={() => onChange(!checked)}
                >
                    {checked && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
            </div>
            <div className="flex-1">
                <div className="font-semibold text-sm mb-1">{label}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
        </div>
    </div>
)
