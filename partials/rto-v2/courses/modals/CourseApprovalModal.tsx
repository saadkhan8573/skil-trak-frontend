import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@components/ui/dialog'
import { Badge, Button } from '@components'
import { TextInput } from '@components/inputs'
import {
    UserCheck,
    Info,
    Target,
    Clock,
    Layers,
    AlertTriangle,
    X,
    ThumbsUp,
} from 'lucide-react'
import { RtoV2Api } from '@queries'
import { useNotification } from '@hooks'

interface CourseApprovalModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    course: any
    approval: any
    logbook?: any
    onApproved?: () => void
}

export const CourseApprovalModal = ({
    open,
    onOpenChange,
    course,
    approval,
    logbook,
    onApproved,
}: CourseApprovalModalProps) => {
    const [userName, setUserName] = useState('')
    const { notification } = useNotification()

    const [updateCourseApprovalStatus, { isLoading }] =
        RtoV2Api.Courses.useUpdateCourseApprovalStatus()

    const handleApprove = async () => {
        try {
            const res: any = await updateCourseApprovalStatus({
                id: logbook.id,
                name: userName
            })

            if (res?.error) {
                notification.error({
                    title: 'Error',
                    description:
                        res.error?.data?.message ||
                        'Failed to approve course. Please try again.',
                })
                return
            }

            notification.success({
                title: 'Approved',
                description: 'Course configuration has been approved successfully.',
            })
            onApproved?.()
            onOpenChange(false)
        } catch (error) {
            notification.error({
                title: 'Error',
                description: 'Something went wrong. Please try again.',
            })
        }
    }

    if (!course || !approval) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="py-2! max-w-2xl! max-h-[90vh] flex flex-col overflow-hidden">
                <DialogHeader className="shrink-0">
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <div className="h-10 w-10 rounded-lg bg-linear-to-br from-accent to-warning flex items-center justify-center">
                            <UserCheck className="h-5 w-5" />
                        </div>
                        <span>Review Course Configuration</span>
                    </DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto py-4 space-y-4 text-sm text-muted-foreground">
                    <div className="bg-linear-to-br from-blue-50 to-indigo-50/30 dark:from-blue-950/30 dark:to-indigo-950/20 border border-blue-200/60 dark:border-blue-800/60 rounded-lg p-4 font-sans">
                        <div className="flex items-start gap-3 text-left">
                            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div className="space-y-2">
                                <p className="font-semibold text-foreground">
                                    Review and approve the course configuration:
                                </p>
                                <div className="bg-white/60 dark:bg-background/40 rounded-lg p-3 border border-blue-200/40 dark:border-blue-800/40">
                                    <p className="font-semibold text-foreground text-left">{course.code}</p>
                                    <p className="text-sm text-muted-foreground text-left">{course.name}</p>
                                    <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-border/50">
                                        <Badge outline variant="muted" className="text-xs">
                                            <Target className="h-3 w-3 mr-1" />
                                            {course.sector?.name || course.sector}
                                        </Badge>
                                        <Badge outline variant="muted" className="text-xs">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {course.confirmedHours || course.requiredHours || course.hours} hours
                                        </Badge>
                                        <Badge outline variant="muted" className="text-xs">
                                            <Layers className="h-3 w-3 mr-1" />
                                            {(course.workplaceTypes || []).length} workplace types
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/5 border border-warning/20 text-left">
                        <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-foreground mb-1 text-left">Important</p>
                            <p className="text-sm text-muted-foreground text-left">
                                By approving this course configuration, you confirm that all placement requirements, documents, and settings are correct and compliant with training.gov.au requirements. This course will become active for placement matching.
                            </p>
                        </div>
                    </div>

                    <TextInput
                        name="userName"
                        label="Your Name"
                        value={userName}
                        onChange={(e: any) => setUserName(e.target.value)}
                        placeholder="Enter your name to confirm..."
                    />
                </div>
                <DialogFooter className="shrink-0 gap-2 border-t pt-4">
                    <Button
                        onClick={() => onOpenChange(false)}
                        variant="secondary"
                        Icon={X}
                        text="Cancel"
                        disabled={isLoading}
                    />
                    <Button
                        onClick={handleApprove}
                        variant="success"
                        className="bg-linear-to-r from-success to-emerald-500 hover:from-success/90 hover:to-emerald-500/90"
                        disabled={!userName.trim() || isLoading}
                        loading={isLoading}
                        Icon={ThumbsUp}
                        text="Approve Course"
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
