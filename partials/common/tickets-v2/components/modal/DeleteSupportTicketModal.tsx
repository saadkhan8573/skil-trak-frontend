import React from 'react'

import { ActionModal, ShowErrorNotifications } from '@components'
import { useNotification } from '@hooks'
import { CommonApi } from '@queries'
import { useEffect } from 'react'
import { FaTrash } from 'react-icons/fa'

export const DeleteSupportTicketModal = ({
    ticketIds,
    onCancel,
    clearSelection,
}: {
    ticketIds: any
    onCancel: () => void
    clearSelection: any
}) => {
    const { notification } = useNotification()
    const [remove, removeResult] = CommonApi.Teams.useBulkDeleteSupportTickets()
    const onConfirmUClicked = (ticketIds: number[]) => {
        remove({ ids: ticketIds })
    }

    useEffect(() => {
        if (removeResult.isSuccess) {
            notification.error({
                title: `Deleted Selected Ticket(s)`,
                description: `Selected ticket(s) has been deleted.`,
            })
            clearSelection()
            onCancel()
        }
    }, [removeResult])

    return (
        <>
            <ShowErrorNotifications result={removeResult} />
            <ActionModal
                Icon={FaTrash}
                variant="error"
                title="Are you sure!"
                description={`You are about to delete ${ticketIds?.length} ticket(s). Do you wish to continue?`}
                onConfirm={onConfirmUClicked}
                onCancel={onCancel}
                input
                actionObject={ticketIds}
                loading={removeResult.isLoading}
            />
        </>
    )
}
