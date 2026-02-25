import { Badge, Button, Card } from '@components'
import { ThumbsUp, XCircle } from 'lucide-react'

interface RejectedCourseCardProps {
    approvalStatus: any
    onResubmit: () => void
}

export const RejectedCourseCard = ({ approvalStatus, onResubmit }: RejectedCourseCardProps) => {
    return (
        <Card className="border-2 border-destructive/30 bg-linear-to-br from-destructive/5 to-red-50/50">
            <div className="p-5">
                <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-linear-to-br from-destructive to-red-600 flex items-center justify-center shadow-premium shrink-0">
                        <XCircle className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-destructive">
                                Course Rejected
                            </h4>
                            <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                                Needs Revision
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                            This course configuration was rejected and needs
                            to be revised
                        </p>
                        <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20 mb-3">
                            <p className="text-xs font-semibold text-destructive mb-1">
                                Rejection Reason:
                            </p>
                            <p className="text-sm">
                                {approvalStatus.rejectionReason}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="p-2 rounded-lg bg-background/50 border border-border/50">
                                <p className="text-muted-foreground mb-0.5">
                                    Rejected by
                                </p>
                                <p className="font-semibold">
                                    {approvalStatus.rejectedBy}
                                </p>
                            </div>
                            <div className="p-2 rounded-lg bg-background/50 border border-border/50">
                                <p className="text-muted-foreground mb-0.5">
                                    Rejected on
                                </p>
                                <p className="font-semibold">
                                    {new Date(
                                        approvalStatus.rejectedAt!
                                    ).toLocaleDateString('en-AU', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={onResubmit}
                            className="w-full mt-3 bg-linear-to-r from-primary to-secondary gap-2"
                        >
                            <ThumbsUp className="h-4 w-4" />
                            Resubmit for Approval
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    )
}
