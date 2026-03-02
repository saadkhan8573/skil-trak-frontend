import { ActionButton, Typography } from '@components'
import { getUserCredentials } from '@utils'
import moment from 'moment'
import { useState } from 'react'
import { FaEdit } from 'react-icons/fa'
import { TiArrowForward } from 'react-icons/ti'
import { EditTicketMessageModal } from '../modals'
import { TicketUser } from './TicketUser'

export const StatusEnum = {
    FORWARDED: 'forwarded',
    REPLY: 'reply',
    CLOSED: 'closed',
}
export const TicketMessageCard = ({
    message,
    ticketDetail,
    replyId,
}: {
    message: any
    ticketDetail?: any
    replyId?: any
}) => {
    const [showEditModal, setShowEditModal] = useState(false)
    const id = getUserCredentials()?.id
    const forwarded = message?.action

    const handleEdit = () => {
        setShowEditModal(true)
    }

    return (
        <>
            <EditTicketMessageModal
                open={showEditModal}
                onOpenChange={setShowEditModal}
                message={message}
                replyId={replyId}
            />
            <div
                className={`${
                    id === message?.author?.id ? 'bg-gray-200' : 'bg-white'
                } border-2 border-dashed border-gray-400 shadow px-4 py-2`}
            >
                {forwarded?.action === StatusEnum.FORWARDED && (
                    <div className="flex justify-end">
                        <span className="text-gray-400 font-medium text-xs">
                            Forwarded by: {forwarded?.actionBy?.name}
                        </span>

                        <TiArrowForward className="text-gray-500" />
                    </div>
                )}
                <div className="flex justify-between items-center ">
                    <TicketUser
                        ticket={message?.author}
                        forwarded={forwarded}
                    />
                    <div className="flex items-center gap-x-2">
                        <Typography variant={'small'} color={'text-gray-500'}>
                            {moment(message?.createdAt).format(
                                'dddd DD MMMM, YYYY - hh:mm a'
                            )}
                        </Typography>

                        <div>
                            {id === message?.author?.id && (
                                <ActionButton
                                    onClick={handleEdit}
                                    variant={'info'}
                                >
                                    <FaEdit />
                                </ActionButton>
                            )}
                        </div>
                    </div>
                </div>
                <div
                    className="text-sm text-gray-500 mt-1 py-1 customTailwingStyles-inline-style customTailwingStyles"
                    dangerouslySetInnerHTML={{
                        __html: message?.message,
                    }}
                />
            </div>
        </>
    )
}
