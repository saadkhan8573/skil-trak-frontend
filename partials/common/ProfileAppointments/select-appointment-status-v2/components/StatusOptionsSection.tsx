interface StatusOptionsSectionProps {
    status: string | undefined
    unsuccessfulReason: string | undefined
    appointment: any
    industry: any
}

export function StatusOptionsSection({
    status,
    unsuccessfulReason,
    appointment,
    industry,
}: StatusOptionsSectionProps) {
    return (
        <div className="space-y-3">
            <StatusSuccessfulOption
                isSelected={status === 'successful'}
                appointment={appointment}
                industry={industry}
            />
            <StatusNotSuccessfulOption
                isSelected={status === 'not-successful'}
                unsuccessfulReason={unsuccessfulReason}
            />
        </div>
    )
}

// Import sub-components
import { StatusSuccessfulOption } from './StatusOptions/StatusSuccessfulOption'
import { StatusNotSuccessfulOption } from './StatusOptions/StatusNotSuccessfulOption'
