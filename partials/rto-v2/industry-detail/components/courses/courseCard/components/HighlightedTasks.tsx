import { Card } from '@components'
import { RtoV2Api } from '@queries'
import { useAppSelector } from '@redux'
import { Loader2 } from 'lucide-react'
import { HighlightedTaskItem } from './HighlightedTaskItem'

interface HighlightedTasksProps {
    title?: string
    courseId?: number
    isDeleted?: boolean
}

export function HighlightedTasks({
    title = 'Course Highlights',
    courseId,
    isDeleted,
}: HighlightedTasksProps) {
    const industryId = useAppSelector(
        (state) => state.industry.industryDetail?.id
    )

    const {
        data: fetchedTasks,
        isLoading,
        refetch,
    } = RtoV2Api.Industries.useGetHighlightedTasks(
        { industryId: industryId!, courseId: courseId! },
        { skip: !courseId || !industryId }
    )

    if (isLoading) {
        return (
            <Card className="flex items-center justify-center p-8 border !border-gray-300">
                <Loader2 className="w-6 h-6 animate-spin text-[#044866]" />
            </Card>
        )
    }

    if (!fetchedTasks || fetchedTasks.length === 0) {
        return null
    }

    return (
        <Card className="space-y-4 border !border-gray-300 !bg-gray-50/20 shadow-none">
            <div className="flex items-center justify-between">
                <h5 className="text-[13px] font-bold text-[#1A2332] flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-[#044866] to-[#0D5468] rounded-full" />
                    {title}
                </h5>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fetchedTasks?.map((task: any, index: number) => {
                    return (
                        <HighlightedTaskItem
                            key={task.id || index}
                            task={task}
                            index={index}
                            onRefresh={() => refetch()}
                            isDeleted={isDeleted}
                        />
                    )
                })}
            </div>
        </Card>
    )
}
