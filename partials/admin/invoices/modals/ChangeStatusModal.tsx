import * as Yup from 'yup'
import { AdminApi } from '@queries'
import { useNotification } from '@hooks'
import { PaymentStatusEnum } from '../enum'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useForm } from 'react-hook-form'
import { Modal, Select, ShowErrorNotifications } from '@components'

interface onSubmitType {
    payment: PaymentStatusEnum
}

export const ChangeStatusModal = ({
    onCancel,
    id,
}: {
    id: any
    onCancel: () => void
}) => {
    const { notification } = useNotification()

    const [changePaymentStatus, changePaymentStatusResult] =
        AdminApi.Invoice.changePaymentStatus()

    const paymentOptions = Object.entries(PaymentStatusEnum)?.map(
        ([label, value]) => ({ label, value })
    )

    const validationSchema = Yup.object({
        payment: Yup.string().required('Payment is required!'),
    })

    const methods = useForm<any>({
        resolver: yupResolver(validationSchema),
        mode: 'all',
    })

    const onSubmit = async (values: any) => {
        const res: any = await changePaymentStatus({
            id,
            status: values?.payment,
        })

        if (res?.data) {
            notification.success({
                title: 'Status Changed',
                description: 'Status Changed Successfully',
            })
            onCancel()
        }
    }

    return (
        <>
            <ShowErrorNotifications result={changePaymentStatusResult} />
            <Modal
                title="Change Payment Status"
                subtitle=" "
                onCancelClick={onCancel}
                onConfirmClick={methods.handleSubmit(onSubmit)}
                loading={changePaymentStatusResult?.isLoading}
            >
                <FormProvider {...methods}>
                    <form className="mt-2 w-full">
                        <Select
                            name={'payment'}
                            options={paymentOptions}
                            onlyValue
                        />
                    </form>
                </FormProvider>
            </Modal>
        </>
    )
}
