import {
    Button,
    Card,
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
    LoadingAnimation,
    NoData,
    TechnicalError,
} from '@components'
import {
    Activity,
    ChevronRight,
    Clock,
    ExternalLink,
    LogIn,
    Sparkles,
    Upload,
} from 'lucide-react'
import { RecentActivityCard } from '../cards'
import { useState } from 'react'
import classNames from 'classnames'
import { Title } from '@partials/rto-v2/components'
import { RtoV2Api } from '@queries'
import { useRouter } from 'next/router'

interface ActivityItem {
    id: string
    studentId: string
    studentName: string
    type:
        | 'status_change'
        | 'portal_login'
        | 'document_upload'
        | 'hours_logged'
        | 'comment_added'
        | 'profile_update'
    description: string
    timestamp: string
    icon: any
    color: string
}

export const RecentActivities = () => {
    const [expand, setExpand] = useState<boolean>(false)
    const router = useRouter()

    const recentActivities = RtoV2Api.Students.rtoStudentHistory(
        {
            search: ``,
            skip: 0,
            limit: 5,
        },
        {
            skip: !expand,
            refetchOnMountOrArgChange: true,
        }
    )

    const recentActivitiesIcons = [Clock, Upload, Sparkles, LogIn, Clock]

    return (
        <Card className="border-border/50 shadow-premium-lg hover:shadow-premium-xl transition-all">
            <Collapsible open={expand} onOpenChange={() => setExpand(!expand)}>
                <div
                    className={classNames({
                        'pb-4': !!expand,
                    })}
                >
                    <div className="flex items-center justify-between">
                        <Title
                            Icon={Activity}
                            title="Recent Activity"
                            description="Live updates from your students"
                        />

                        <div className="flex items-center gap-2">
                            <CollapsibleTrigger>
                                <Button
                                    outline
                                    variant="primaryNew"
                                    className="gap-1.5 hover-lift"
                                >
                                    {expand ? 'Collapse' : 'Show'}
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </CollapsibleTrigger>

                            {expand && (
                                <Button
                                    variant="primaryNew"
                                    className="gap-1.5 hover-lift"
                                    onClick={() =>
                                        router.push(
                                            '/portals/rto/students-and-placements/all-students/student-recent-activities'
                                        )
                                    }
                                >
                                    View All Activities
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <CollapsibleContent>
                    {recentActivities?.isError && (
                        <NoData text="There is some technical issue!" isError />
                    )}
                    {recentActivities?.isLoading ||
                    recentActivities?.isFetching ? (
                        <LoadingAnimation />
                    ) : recentActivities?.data?.data &&
                      recentActivities?.data?.data?.length > 0 ? (
                        <div className="space-y-2.5">
                            {recentActivities?.data?.data
                                .slice(0, 5)
                                .map((activity: any, index: any) => (
                                    <RecentActivityCard
                                        key={activity?.id}
                                        index={index}
                                        Icon={
                                            recentActivitiesIcons[
                                                index %
                                                    recentActivitiesIcons?.length
                                            ]
                                        }
                                        activity={activity}
                                    />
                                ))}
                        </div>
                    ) : (
                        !recentActivities?.isError && (
                            <NoData text="No Recent Activities" />
                        )
                    )}
                </CollapsibleContent>
            </Collapsible>
        </Card>
    )
}
