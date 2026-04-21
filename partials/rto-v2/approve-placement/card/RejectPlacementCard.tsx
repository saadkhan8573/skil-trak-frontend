import { Badge, Card, StudentJobId } from '@components'
import { RtoApprovalWorkplaceRequest } from '@types'
import { Building2, GraduationCap, User, XCircle } from 'lucide-react'
import React from 'react'

export const RejectPlacementCard = ({
    approval,
}: {
    approval: RtoApprovalWorkplaceRequest
}) => {
    return (
        <Card className="border-destructive/30 shadow-md hover:shadow-lg transition-all border border-error/30">
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-destructive to-red-600 flex items-center justify-center shadow-md">
                            <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold">
                                {approval?.student?.user?.name}
                            </h4>
                            <StudentJobId
                                studentJobId={
                                    approval?.student?.studentMaskedId
                                }
                            />
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Building2 className="h-3.5 w-3.5" />
                                <span className="truncate">
                                    {approval?.industry?.user?.name}
                                </span>
                                <span>•</span>
                                <GraduationCap className="h-3.5 w-3.5" />
                                <span className="truncate">
                                    {
                                        approval?.workplaceRequest?.courses?.[0]
                                            ?.code
                                    }
                                </span>
                            </div>
                        </div>
                        <Badge Icon={XCircle} text="Rejected" variant="error" />
                    </div>
                </div>
            </div>
        </Card>
    )
}
