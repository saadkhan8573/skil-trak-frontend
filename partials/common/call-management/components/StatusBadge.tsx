import { CallStatus, statusConfigs } from './call'

interface StatusBadgeProps {
    status: CallStatus
    size?: 'sm' | 'md' | 'lg'
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
    const config = statusConfigs[status]

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-4 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base',
    }

    return (
        <span
            className={`inline-flex items-center rounded-full font-medium border ${sizeClasses[size]}`}
            style={{
                color: config?.color,
                backgroundColor: config?.bgColor,
                borderColor: config?.borderColor,
            }}
        >
            {config?.label}
        </span>
    )
}
