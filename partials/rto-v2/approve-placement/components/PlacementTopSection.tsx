import { Badge, StudentJobId } from '@components'
import { Course } from '@types'
import { Clock, GraduationCap, Sparkles, User } from 'lucide-react'
import { PlacementActions } from './PlacementActions'
import { ellipsisText } from '@utils'

export const PlacementTopSection = ({ approval }: { approval: any }) => {
    const course: Course =
        approval?.industry?.industryCourseApprovals?.[0]?.course
    return (
        <>
            <div className="from-muted/30 to-muted/10 p-4 border-b">
                <div className="flex items-start justify-between gap-4">
                    {/* Student Info */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primaryNew to-primaryNew/80 flex items-center justify-center shrink-0 shadow-md">
                            <User className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-semibold text-lg">
                                    {approval?.student?.user?.name}
                                </h3>
                                <Badge
                                    text={ellipsisText(
                                        approval?.student?.studentId,
                                        8
                                    )}
                                    shape="pill"
                                    outline
                                    variant="primaryNew"
                                    className="bg-transparent!"
                                />
                                {approval.daysWaiting >= 7 && (
                                    <Badge
                                        Icon={Clock}
                                        text={`${approval.daysWaiting} days waiting`}
                                        variant="error"
                                        shape="pill"
                                    />
                                )}
                                {approval.matchingType === 'automation' && (
                                    <Badge
                                        text="Automated Match"
                                        Icon={() => (
                                            <Sparkles className="h-3 w-3 mr-1" />
                                        )}
                                        shape="pill"
                                        variant="primaryNew"
                                        outline
                                        className="bg-primaryNew/20 !text-primaryNew"
                                    />
                                )}
                                <StudentJobId
                                    studentJobId={
                                        approval?.student?.studentMaskedId
                                    }
                                />
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="font-medium">
                                    {course?.code}
                                </span>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground truncate">
                                    {course?.title}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Actions */}
                    {/* <PlacementActions approval={approval} /> */}
                </div>
            </div>
        </>
    )
}
