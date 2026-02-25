import { Badge } from '@components/ui/badge'
import { Progress } from '@components/ui/progress'
import { RtoV2Api } from '@queries'
import { UserStatus } from '@types'
import { AlertCircle, CheckCircle2, Clock, FileText, Target } from 'lucide-react'
import React from 'react'
import { PulseLoader } from 'react-spinners'

export const CourseHeaderStats = ({ course }: any) => {
    const setupConfirmationPercentage =
        RtoV2Api.Courses.setupConfirmationPercentage(course?.id, {
            skip: !course?.id,
        })

    const getCompletionColor = (progress: number) => {
        if (progress >= 80) return 'text-success'
        if (progress >= 50) return 'text-warning'
        return 'text-destructive'
    }

    const logbook = course?.rtoCourseFiles?.find((file: any) => file.title === 'logBook')
    const isCourseApproved = logbook?.status === UserStatus.Approved


    const filesUploaded = course?.rtoCourseFiles?.length || 0
    return (
        <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-100/50 rounded-lg p-3 border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-xs">Placement Hours</span>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className={`text-lg font-semibold  text-success`}>
                        {course?.extraHours && course?.extraHours?.length > 0
                            ? course?.extraHours?.[0]?.hours
                            : course?.hours ?? 0}
                    </span>
                    <span className="text-xs text-muted-foreground">hours</span>
                </div>
                {isCourseApproved ? (
                    <Badge className="!bg-success/10 !text-success !border-success/20 ml-auto flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Confirmed
                    </Badge>
                ) : (
                    <Badge className="bg-warning/10 text-warning border-yellow-300/20 ml-auto flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Needs Confirmation
                    </Badge>
                )}
            </div>

            <div className="bg-gray-100/50 rounded-lg p-3 border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <FileText className="h-3.5 w-3.5" />
                    <span className="text-xs">Documents</span>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-lg font-semibold">
                        {filesUploaded}
                    </span>
                    <span className="text-xs text-muted-foreground">/ 3</span>
                </div>
                <div className="mt-1">
                    <Progress
                        value={(filesUploaded / 3) * 100}
                        className="h-1.5"
                    />
                </div>
            </div>

            <div className="bg-gray-100/50 rounded-lg p-3 border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Target className="h-3.5 w-3.5" />
                    <span className="text-xs">Setup Progress</span>
                </div>
                <div className="flex items-baseline gap-1">
                    <span
                        className={`text-lg font-semibold ${getCompletionColor(
                            20
                        )}`}
                    >
                        {/* {currentProgress} */}
                        {setupConfirmationPercentage?.isLoading ? (
                            <PulseLoader size={5} color={'#044866'} />
                        ) : (
                            setupConfirmationPercentage?.data ?? 0
                        )}
                    </span>
                    <span className="text-xs text-muted-foreground">%</span>
                </div>
                <div className="mt-1">
                    <Progress
                        // value={currentProgress}
                        value={setupConfirmationPercentage?.data || 0}
                        className="h-1.5"
                    />
                </div>
            </div>
        </div>
    )
}
