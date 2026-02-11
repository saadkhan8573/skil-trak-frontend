import { Badge, Button, Card } from '@components'
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui'
import { RtoV2Api } from '@queries'
import { useAppSelector } from '@redux'
import { CheckSquare, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { ConfirmHighlightedTasksModal } from '../../modals/ConfirmHighlightedTasksModal'
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
    const [isBulkConfirmOpen, setIsBulkConfirmOpen] = useState(false)
    const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([])
    const [isConfirmedBulk, setIsConfirmedBulk] = useState(true)

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
            <Card className="flex items-center justify-center p-8 border border-gray-300!">
                <Loader2 className="w-6 h-6 animate-spin text-[#044866]" />
            </Card>
        );
    }

    if (!fetchedTasks || fetchedTasks.length === 0) {
        return null;
    }

    const unconfirmedTasks = fetchedTasks.filter((task: any) => {
        const detail = task.industryHighlightedTasks?.[0];
        return !detail || !detail.isConfirmed;
    });

    const toggleTaskSelection = (taskId: number) => {
        setSelectedTaskIds(prev =>
            prev.includes(taskId)
                ? prev.filter(id => id !== taskId)
                : [...prev, taskId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedTaskIds.length === unconfirmedTasks.length) {
            setSelectedTaskIds([]);
        } else {
            setSelectedTaskIds(unconfirmedTasks.map((t: any) => t.id));
        }
    };

    const handleBulkAction = (isConfirmed: boolean) => {
        setIsConfirmedBulk(isConfirmed);
        setIsBulkConfirmOpen(true);
    };

    const confirmIds = selectedTaskIds.length > 0
        ? selectedTaskIds
        : unconfirmedTasks.map((t: any) => t.id);

    return (
        <Card className="p-3 border border-gray-300! bg-gray-50/20! shadow-none space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h5 className="text-[13px] font-bold text-[#1A2332] flex items-center gap-2">
                        <div className="w-1 h-3.5 bg-linear-to-b from-[#044866] to-[#0D5468] rounded-full" />
                        {title}
                    </h5>

                    {/* {unconfirmedTasks.length > 0 && !isDeleted && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Badge
                                    variant="primaryNew"
                                    onClick={toggleSelectAll}
                                    outline={selectedTaskIds.length !== unconfirmedTasks.length}
                                >
                                    {selectedTaskIds.length === unconfirmedTasks.length ? 'Deselect All' : `Select All (${unconfirmedTasks.length})`}
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                                {selectedTaskIds.length === unconfirmedTasks.length ? 'Clear current selection' : 'Select all pending tasks for bulk action'}
                            </TooltipContent>
                        </Tooltip>
                    )} */}
                </div>

                {/* <div className="flex items-center gap-2">
                    {unconfirmedTasks.length > 0 && !isDeleted && (
                        <>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={() => handleBulkAction(true)}
                                        variant="primaryNew"
                                    >
                                        <CheckSquare className="w-3 h-3" />
                                        {selectedTaskIds.length > 0
                                            ? `Confirm Selected (${selectedTaskIds.length})`
                                            : `Confirm All (${unconfirmedTasks.length})`}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {selectedTaskIds.length > 0
                                        ? `Confirm the ${selectedTaskIds.length} selected tasks`
                                        : 'Confirm all pending tasks at once'}
                                </TooltipContent>
                            </Tooltip>
                        </>
                    )}
                </div> */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2.5">
                {fetchedTasks?.map((task: any, index: number) => {
                    const isConfirmed = task.industryHighlightedTasks?.[0]?.isConfirmed;
                    return (
                        <HighlightedTaskItem
                            key={task.id || index}
                            task={task}
                            index={index}
                            onRefresh={() => refetch()}
                            isDeleted={isDeleted}
                            isSelected={selectedTaskIds.includes(task.id)}
                            onToggleSelection={() => toggleTaskSelection(task.id)}
                        />
                    )
                })}
            </div>

            {isBulkConfirmOpen && (
                <ConfirmHighlightedTasksModal
                    isOpen={isBulkConfirmOpen}
                    onClose={() => {
                        setIsBulkConfirmOpen(false)
                        setSelectedTaskIds([])
                        refetch()
                    }}
                    taskIds={confirmIds}
                    industryId={industryId!}
                    showNotAvailable={confirmIds.length > 0}
                />
            )}
        </Card>
    )
}
