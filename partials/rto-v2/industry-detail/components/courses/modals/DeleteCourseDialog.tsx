import { Button, ShowErrorNotifications, Typography } from '@components'
import { Dialog, DialogContent } from '@components/ui/dialog'
import { useNotification } from '@hooks'
import { AdminApi } from '@queries'
import { IndustryCourseApproval } from '@types'
import { AlertTriangle, XCircle } from 'lucide-react'
import { useEffect } from 'react'

interface DeleteCourseDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    approval: IndustryCourseApproval
}

export function DeleteCourseDialog({
    open,
    onOpenChange,
    approval,
}: DeleteCourseDialogProps) {
    const { notification } = useNotification()
    const [deleteCourse, deleteCourseResult] =
        AdminApi.Industries.useDeleteIndustryProfileCourse()

    useEffect(() => {
        if (deleteCourseResult.isSuccess) {
            notification.success({
                title: 'Course Removed',
                description: `${approval?.course?.title} has been successfully removed from this industry.`,
            })
            onOpenChange(false)
        }
    }, [
        deleteCourseResult.isSuccess,
        approval?.course?.title,
        notification,
        onOpenChange,
    ])

    const handleDelete = async () => {
        if (approval?.id) {
            await deleteCourse(approval.id)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md p-6 overflow-hidden border-none shadow-2xl">
                <ShowErrorNotifications result={deleteCourseResult} />

                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center border border-red-100 mb-2">
                        <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
                    </div>

                    <div className="space-y-1">
                        <Typography
                            variant="h4"
                            className="font-bold text-slate-800"
                        >
                            Delete Course Connection?
                        </Typography>
                        <Typography
                            variant="label"
                            className="text-slate-500 leading-relaxed px-4"
                        >
                            You are about to remove{' '}
                            <span className="font-bold text-slate-800">
                                {approval?.course?.title}
                            </span>
                            . If you proceed,{' '}
                            <span className="font-bold text-red-600 underline">
                                all related student workplaces will be
                                automatically cancelled
                            </span>
                            .
                        </Typography>
                    </div>

                    <div className="w-full bg-slate-50 rounded-xl px-4 py-2 border border-slate-100 flex items-center gap-3">
                        <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                        <Typography
                            variant="label"
                            className="text-left text-slate-600 text-xs"
                        >
                            This action cannot be undone and will impact student
                            placement records.
                        </Typography>
                    </div>
                </div>

                <div className="flex flex-row gap-3 mt-2">
                    <Button
                        variant="secondary"
                        className="flex-1"
                        onClick={() => onOpenChange(false)}
                    >
                        Go Back
                    </Button>
                    <Button
                        variant="error"
                        onClick={handleDelete}
                        loading={deleteCourseResult.isLoading}
                        disabled={deleteCourseResult.isLoading}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 h-auto rounded-xl shadow-lg shadow-red-200 border-none px-6 transition-all active:scale-95"
                    >
                        Confirm Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
