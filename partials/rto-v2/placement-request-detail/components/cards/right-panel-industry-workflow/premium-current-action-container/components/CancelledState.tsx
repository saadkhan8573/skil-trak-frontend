import React from 'react'
import { XCircle } from 'lucide-react'

type CancelledStateProps = {
    reason?: string
    cancelledBy?: 'student' | 'rto' | 'industry'
    cancelledAt?: string
}

export const CancelledState: React.FC<CancelledStateProps> = ({
    reason,
    cancelledBy,
    cancelledAt,
}) => {
    return (
        <StateContainer>
            <StateHeader
                icon={XCircle}
                title="Placement Cancelled"
                description="This placement request has been cancelled."
            />

            <StateDetails>
                {cancelledBy && (
                    <DetailItem label="Cancelled By" value={cancelledBy} />
                )}

                {cancelledAt && (
                    <DetailItem label="Cancelled At" value={cancelledAt} />
                )}

                {reason && <DetailItem label="Reason" value={reason} />}
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
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
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
        <Icon className="h-6 w-6 text-red-600" />
        <div>
            <h3 className="text-sm font-semibold text-red-700">{title}</h3>
            {description && (
                <p className="text-xs text-red-600">{description}</p>
            )}
        </div>
    </div>
)

const StateDetails: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => <div className="space-y-1 text-sm text-red-700">{children}</div>

const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <div className="flex gap-1">
        <span className="font-medium">{label}:</span>
        <span>{value}</span>
    </div>
)
