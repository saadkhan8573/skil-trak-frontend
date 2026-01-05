import React from 'react'
import { Play } from 'lucide-react'

type PlacementStartedStateProps = {
    startDate?: string
    industryName?: string
    supervisorName?: string
}

export const PlacementStartedState: React.FC<PlacementStartedStateProps> = ({
    startDate,
    industryName,
    supervisorName,
}) => {
    return (
        <StateContainer>
            <StateHeader
                icon={Play}
                title="Placement Started"
                description="The student has officially started the placement."
            />

            <StateDetails>
                {startDate && (
                    <DetailItem label="Start Date" value={startDate} />
                )}

                {industryName && (
                    <DetailItem label="Industry" value={industryName} />
                )}

                {supervisorName && (
                    <DetailItem label="Supervisor" value={supervisorName} />
                )}
            </StateDetails>
        </StateContainer>
    )
}

/* -------------------------------------------------------------------------- */
/*                                  Sub UI                                   */
/* -------------------------------------------------------------------------- */

const StateContainer: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        {children}
    </div>
)

const StateHeader = ({
    icon: Icon,
    title,
    description,
}: {
    icon: React.ElementType
    title: string
    description?: string
}) => (
    <div className="mb-3 flex items-center gap-3">
        <Icon className="h-6 w-6 text-emerald-600" />
        <div>
            <h3 className="text-sm font-semibold text-emerald-700">{title}</h3>
            {description && (
                <p className="text-xs text-emerald-600">{description}</p>
            )}
        </div>
    </div>
)

const StateDetails: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => <div className="space-y-1 text-sm text-emerald-700">{children}</div>

const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <div className="flex gap-1">
        <span className="font-medium">{label}:</span>
        <span>{value}</span>
    </div>
)
