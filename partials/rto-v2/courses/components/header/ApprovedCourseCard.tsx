import { Badge, Card } from '@components'
import { CheckCircle2 } from 'lucide-react'

interface ApprovedCourseCardProps {
    logbook: any
}

export const ApprovedCourseCard = ({ logbook }: ApprovedCourseCardProps) => {
    return (
        <Card className="border-2 border-success/30 bg-linear-to-br from-success/5 to-emerald-50/50">
            <div>
                <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-linear-to-br from-success to-emerald-500 flex items-center justify-center shadow-premium shrink-0">
                        <CheckCircle2 className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-success">
                                Course Approved
                            </h4>
                            <Badge className="bg-success/10 text-success border-success/20">
                                Active
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                            This course configuration has been approved and
                            is ready for placement matching
                        </p>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="p-2 rounded-lg bg-background/50 border border-border/50">
                                <p className="text-muted-foreground mb-0.5">
                                    Submitted by
                                </p>
                                <p className="font-semibold">
                                    {logbook?.name}
                                </p>
                            </div>
                            <div className="p-2 rounded-lg bg-background/50 border border-border/50">
                                <p className="text-muted-foreground mb-0.5">
                                    Approved by
                                </p>
                                <p className="font-semibold">
                                    {logbook?.actionBy?.name}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
