import { Badge, Button, Card } from '@components'
import { Clock, ThumbsUp } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui'

interface PendingCourseCardProps {
    logbook: any
    onReview: () => void
}

export const PendingCourseCard = ({ logbook, onReview }: PendingCourseCardProps) => {
    return (
        <Card className="border-2 border-warning/30 bg-linear-to-br from-warning/5 to-amber-50/50">
            <div className="p-3">
                <div className="flex items-start gap-2">
                    <div className="h-7 w-7 rounded-lg bg-linear-to-br from-warning to-amber-500 flex items-center justify-center shadow-md shrink-0">
                        <Clock className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm text-warning">
                                Pending Approval
                            </h4>
                            <Badge className="bg-warning/10 text-warning border-warning/20 text-xs px-1.5 py-0">
                                Awaiting Review
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                            This course configuration is waiting for approval
                            from an administrator
                        </p>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="w-full">
                                    <Button
                                        disabled={!logbook}
                                        onClick={onReview}
                                        className="w-full bg-linear-to-r from-success to-emerald-500 gap-1.5 h-7 text-xs"
                                    >
                                        <ThumbsUp className="h-3 w-3" />
                                        Review & Approve
                                    </Button>
                                </div>
                            </TooltipTrigger>
                            {!logbook && (
                                <TooltipContent>
                                    Please add a logbook before approving.
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </div>
                </div>
            </div>
        </Card>
    )
}
