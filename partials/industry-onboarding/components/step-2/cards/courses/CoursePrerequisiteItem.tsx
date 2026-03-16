import { CheckCircle } from 'lucide-react'

interface CoursePrerequisiteItemProps {
    label: string
    checked: boolean
    onChange: (checked: boolean) => void
}

export const CoursePrerequisiteItem: React.FC<CoursePrerequisiteItemProps> = ({
    label,
    checked,
    onChange,
}) => (
    <div
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => onChange(!checked)}
    >
        <div
            className="w-4 h-4 rounded flex items-center justify-center transition-all"
            style={{
                backgroundColor: checked ? '#10B981' : '#E5E7EB',
                border: '2px solid',
                borderColor: checked ? '#10B981' : '#D1D5DB',
            }}
        >
            {checked && <CheckCircle className="w-3 h-3 text-white" />}
        </div>
        <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
            {label}
        </span>
    </div>
)
