import {
    Button,
} from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { AlertTriangle } from 'lucide-react'

interface ConfirmCourseUpdateModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    loading?: boolean
}

export function ConfirmCourseUpdateModal({
    isOpen,
    onClose,
    onConfirm,
    loading,
}: ConfirmCourseUpdateModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="!max-w-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-amber-600">
                        <AlertTriangle className="w-5 h-5" />
                        Confirm Task Changes
                    </DialogTitle>
                    <DialogDescription className="text-[15px] pt-2">
                        You have modified the highlighted tasks for this course.
                        Updating these tasks will affect all linked industries.
                        <strong> All updated tasks will need to be confirmed again by the industries.</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-sm text-gray-500 bg-amber-50 p-4 rounded-lg border border-amber-100">
                        This action ensures that industries are aware of the changes to course requirements and can provide accurate confirmation of their capabilities.
                    </p>
                </div>

                <DialogFooter className="sm:justify-end gap-2">
                    <Button variant="secondary" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        variant="primaryNew"
                        loading={loading}
                        disabled={loading}
                    >
                        Confirm and Update Course
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
