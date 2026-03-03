import { Modal, Select, ShowErrorNotifications } from '@components'
import { useNotification } from '@hooks'
import { SubAdminApi } from '@queries'
import { Student, StudentStatusEnum } from '@types'
import { FormProvider, useForm } from 'react-hook-form'
import { MdInfo } from 'react-icons/md'

export const StudentStatusModal = ({
    onCancel,
    student,
}: {
    student: Student
    onCancel: () => void
}) => {
    const { notification } = useNotification()

    const [changeCurrentStatus, changeCurrentStatusResult] =
        SubAdminApi.Student.changeCurrentStatus()

    const methods = useForm({
        defaultValues: {
            status: student?.studentStatus,
        },
    })

    const onSubmit = (values: { status: StudentStatusEnum }) => {
        changeCurrentStatus({ id: student?.id, status: values.status }).then(
            (res: any) => {
                if (res?.data) {
                    notification.success({
                        title: 'Status Changed',
                        description: 'Status Changed Successfully',
                    })
                    onCancel()
                }
            }
        )
    }

    const studentStatusOptions = [
        {
            label: 'Active',
            value: StudentStatusEnum.ACTIVE,
        },
        {
            label: 'Completed',
            value: StudentStatusEnum.COMPLETED,
        },
        {
            label: 'Terminated',
            value: StudentStatusEnum.TERMINATED,
        },
        {
            label: 'Cancelled',
            value: StudentStatusEnum.CANCELLED,
        },
        {
            label: 'Expired',
            value: StudentStatusEnum.EXPIRED,
        },
        {
            label: 'Qualification Issued',
            value: StudentStatusEnum.QUALIFICATION_ISSUED,
        },
    ]

    return (
        <>
            <ShowErrorNotifications result={changeCurrentStatusResult} />
            <Modal
                titleIcon={MdInfo}
                title="Update Student Status"
                onCancelClick={onCancel}
                subtitle={`Current Status: ${student?.studentStatus}`}
                loading={changeCurrentStatusResult.isLoading}
                onConfirmClick={methods.handleSubmit(onSubmit)}
            >
                <FormProvider {...methods}>
                    <form className="w-full">
                        <Select
                            label="Select New Status"
                            name="status"
                            options={studentStatusOptions}
                            required
                            placeholder="Select status..."
                        />
                    </form>
                </FormProvider>
            </Modal>
        </>
    )
}
