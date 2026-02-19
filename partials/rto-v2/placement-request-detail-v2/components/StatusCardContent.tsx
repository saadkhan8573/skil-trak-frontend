import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface IStatusCardContentProps {
    icon: LucideIcon
    iconColor: string
    title: string
    description?: string
    children?: ReactNode
}

export const StatusCardContent = ({
    icon: Icon,
    iconColor,
    title,
    description,
    children,
}: IStatusCardContentProps) => (
    <div className="relative flex items-start gap-3">
        <div className="p-2 bg-white rounded-lg shadow-sm shrink-0">
            <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="flex-1">
            <p className="font-medium">{title}</p>
            {description && <p className="text-sm mt-1">{description}</p>}
            {children && <div className="mt-3">{children}</div>}
        </div>
    </div>
)
