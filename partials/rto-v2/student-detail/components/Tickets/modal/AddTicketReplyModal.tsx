import {
    GlobalModal,
    ShowErrorNotifications,
    Typography
} from '@components'
import { useNotification } from '@hooks'
import { CommonApi } from '@queries'
import { TicketTypes } from '@types'
import { ReplyTicketForm } from '../form'

export const AddTicketReplyModal = ({
    ticket,
    onCancel,
}: {
    ticket: TicketTypes
    onCancel: () => void
}) => {
    const [addReply, addReplyResult] = CommonApi.Tickets.useAddReply()

    const { notification } = useNotification()
    const onSubmit = async (values: any) => {
        const res: any = await addReply({
            ticket: ticket?.id,
            ...values,
        })
        if (res?.data) {
            onCancel()
            notification.success({
                title: 'Ticket Reply Added',
                description: 'Ticket Reply Added Successfully',
            })
        }
    }
    return (
        <GlobalModal onCancel={onCancel} className="w-[600px]!">
            <ShowErrorNotifications result={addReplyResult} />
            <div className="w-full p-4">
                <Typography variant="title">Add Ticket Reply</Typography>
                <ReplyTicketForm onSubmit={onSubmit} />
            </div>
        </GlobalModal>
    )
}
