import {
    Badge,
    Button,
    ShowErrorNotifications,
    Typography,
} from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { useNotification } from '@hooks'
import { AdminApi } from '@queries'
import { IndustryCourseApproval } from '@types'
import { AlertTriangle, Trash2, XCircle } from 'lucide-react'
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
    }, [deleteCourseResult.isSuccess, approval?.course?.title, notification, onOpenChange])

    const handleDelete = async () => {
        if (approval?.id) {
            await deleteCourse(approval.id)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm p-0 overflow-hidden border-none shadow-2xl [&>button]:text-white">
                <ShowErrorNotifications result={deleteCourseResult} />

                {/* Danger Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-500 p-5 flex flex-row items-center gap-4 text-white relative">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 shrink-0">
                        <Trash2 className="w-6 h-6 text-white" />
                    </div>
                    <DialogHeader className="text-left !space-y-0.5">
                        <DialogTitle className="text-lg font-bold text-white">
                            Remove Course
                        </DialogTitle>
                        <DialogDescription className="text-red-100 text-sm">
                            This action will permanently remove the course association.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Decorative Elements */}
                    <div className="absolute top-2 right-2 opacity-10">
                        <XCircle className="w-16 h-16" />
                    </div>
                </div>

                <div className="px-5 py-2 space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-[#64748B]">
                            <span>Course</span>
                            <span className="font-bold text-[#1A2332]">{approval?.course?.title}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-[#64748B]">
                            <span>Status</span>
                            <Badge
                                variant={
                                    approval?.status === 'approved'
                                        ? 'success'
                                        : 'warning'
                                }
                                size="xs"
                                text={approval?.status}
                                className="font-bold tracking-wider"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-4 bg-gray-50 border-t flex flex-row gap-2 sm:justify-center">
                    <Button
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        className="flex-1 h-9 text-xs font-bold"
                    >
                        Keep Course
                    </Button>
                    <Button
                        variant="error"
                        onClick={handleDelete}
                        loading={deleteCourseResult.isLoading}
                        disabled={deleteCourseResult.isLoading}
                        className="flex-1 h-9 bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-red-200"
                    >
                        Confirm Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
