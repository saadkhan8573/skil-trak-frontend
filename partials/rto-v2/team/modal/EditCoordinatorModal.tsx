import { useNotification } from '@hooks'
import { SubAdminForm } from '@partials/admin/sub-admin/form'
import { RtoApi } from '@queries'
import { SubAdmin } from '@types'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@components/ui'

export const EditCoordinatorModal = ({
    coordinator,
    onCancel,
}: {
    coordinator: SubAdmin
    onCancel: () => void
}) => {
    const { notification } = useNotification()

    const rto = RtoApi.Rto.useProfile()

    const [updateCoordinator, updateCoordinatorResult] =
        RtoApi.Coordinator.useUpdate()

    const rtoCoursesOptions = rto?.data?.courses?.map((course: any) => ({
        label: course?.title,
        value: course?.id,
        item: course,
    }))

    const onSubmit = (values: any) => {
        delete values?.rtos
        delete values?.sectors
        updateCoordinator({
            id: coordinator?.id,
            ...values,
        }).then((res: any) => {
            if (res?.data) {
                notification.success({
                    title: 'Coordinator Updated',
                    description: 'Coordinator Updated Successfully',
                })
                onCancel()
            }
        })
    }

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit My Coordinator Detail</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <SubAdminForm
                        edit
                        onSubmit={onSubmit}
                        subAdmin={coordinator}
                        result={updateCoordinatorResult}
                        rtoCoursesOptions={rtoCoursesOptions}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
