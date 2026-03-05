import React from 'react'
import { Industry } from '@types'
import { RtoV2Api } from '@queries'
import { Badge, Card } from '@components'
import { Skeleton } from '@components/ui/skeleton'
import { CheckCircle2, FileCheck } from 'lucide-react'

export const HighlightedTasks = ({
    rtoUserId,
    coursesId,
}: {
    rtoUserId: number
    coursesId: number
}) => {
    const highlightedTasks = RtoV2Api.ApprovalRequest.highlightedTasks(
        { courseId: Number(coursesId), userId: rtoUserId },
        {
            skip: !coursesId,
        }
    )

    const getColorClasses = (color: string) => {
        const colors: Record<
            string,
            { bg: string; text: string; border: string; badge: string }
        > = {
            emerald: {
                bg: 'bg-emerald-50',
                text: 'text-emerald-700',
                border: 'border-emerald-200',
                badge: 'bg-emerald-100 text-emerald-700',
            },
            blue: {
                bg: 'bg-blue-50',
                text: 'text-blue-700',
                border: 'border-blue-200',
                badge: 'bg-blue-100 text-blue-700',
            },
            purple: {
                bg: 'bg-purple-50',
                text: 'text-purple-700',
                border: 'border-purple-200',
                badge: 'bg-purple-100 text-purple-700',
            },
        }
        return colors[color]
    }

    const colors = getColorClasses('emerald')

    return (
        <Card
            className={`border-2 ${colors.border} hover:shadow-lg transition-all`}
        >
            <div>
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                        <div
                            className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                        >
                            <FileCheck className={`w-5 h-5 ${colors.text}`} />
                        </div>
                        <div className="flex-1">
                            <div className="text-slate-900 mb-2">
                                Highlighted Tasks
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                {highlightedTasks?.isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                                <Skeleton className="h-4 w-4 rounded-full" />
                                <Skeleton className="h-4 w-full max-w-100" />
                            </div>
                        ))}
                    </div>
                ) : (
                    highlightedTasks?.data &&
                    highlightedTasks?.isSuccess && (
                        <div className="space-y-2.5">
                            {Array.isArray(highlightedTasks?.data) ? (
                                highlightedTasks?.data[0] &&
                                typeof highlightedTasks.data[0] === 'object' &&
                                'statement' in highlightedTasks.data[0] ? (
                                    highlightedTasks.data.map(
                                        (item: any, itemIndex: number) => (
                                            <div
                                                key={itemIndex}
                                                className="flex items-start gap-3"
                                            >
                                                <CheckCircle2
                                                    className={`w-4 h-4 ${colors.text} mt-0.5 shrink-0`}
                                                />
                                                <span className="text-sm text-slate-700">
                                                    {item.statement}
                                                </span>
                                            </div>
                                        )
                                    )
                                ) : (
                                    highlightedTasks?.data?.[0]?.map(
                                        (item: string, itemIndex: number) => (
                                            <div
                                                key={itemIndex}
                                                className="flex items-start gap-3"
                                            >
                                                <CheckCircle2
                                                    className={`w-4 h-4 ${colors.text} mt-0.5 shrink-0`}
                                                />
                                                <span className="text-sm text-slate-700">
                                                    {item}
                                                </span>
                                            </div>
                                        )
                                    )
                                )
                            ) : (
                                <div className="flex items-start gap-3">
                                    <CheckCircle2
                                        className={`w-4 h-4 ${colors.text} mt-0.5 shrink-0`}
                                    />
                                    <div
                                        className="text-sm text-slate-700"
                                        dangerouslySetInnerHTML={{
                                            __html: highlightedTasks?.data
                                                ?.info,
                                        }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    )
                )}
            </div>
        </Card>
    )
}
