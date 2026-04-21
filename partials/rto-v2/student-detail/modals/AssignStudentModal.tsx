import { Button } from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { useAlert, useNotification } from '@hooks'
import { useAssignStudentsToSubAdminMutation } from '@queries'
import { Student } from '@types'
import { useEffect } from 'react'

export const AssignStudentModal = ({
    student,
    onCancel,
}: {
    student: Student
    onCancel: () => void
}) => {
    const { alert } = useAlert()
    const { notification } = useNotification()

    const [assignStudent, { isLoading, isSuccess, isError }] =
        useAssignStudentsToSubAdminMutation()

    const mode = student?.subadmin ? 'Unassign' : 'Assign'
    const isAssign = mode === 'Assign'

    const onConfirmClicked = async () => {
        await assignStudent(student.id)
    }

    useEffect(() => {
        if (isSuccess) {
            alert.success({
                title: `Student ${mode}ed`,
                description: `Student has been ${mode}ed.`,
            })
            onCancel()
        }
        if (isError) {
            notification.error({
                title: 'Request Failed',
                description: `Your request for ${mode}ing Student`,
            })
        }
    }, [isSuccess, isError])

    return (
        <Dialog open={true} onOpenChange={onCancel}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle>{mode} Student</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to {mode.toLowerCase()} this
                        student ?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-end gap-2">
                    <Button
                        variant="secondary"
                        outline
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirmClicked}
                        disabled={isLoading}
                        className={
                            isAssign
                                ? 'bg-primaryNew hover:bg-primaryNew/90'
                                : 'bg-red-600 hover:bg-red-700 text-white'
                        }
                        variant={isAssign ? 'primary' : 'error'}
                    >
                        {isLoading ? `${mode}ing...` : mode}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
