import {
    AuthorizedUserComponent,
    Button,
    ShowErrorNotifications,
} from '@components'
import { UserRoles } from '@constants'
import { useNotification } from '@hooks'
import { CommonApi } from '@queries'
import React, { ReactElement, useEffect, useState } from 'react'
import { DeleteSupportTicketModal } from '../../components'
import { useSupportTicketPermissions } from '../../hooks'

export const SelectAllTicketsCheckbox = ({
    isAllSelected,
    toggleSelectAll,
    selectedTicketIds,
    data,
    clearSelection,
}: any) => {
    const { notification } = useNotification()
    const [modal, setModal] = useState<ReactElement | null>(null)
    const { canSeeAssignedFilter } = useSupportTicketPermissions()
    const onCancel = () => {
        setModal(null)
    }
    const onClickDelete = () => {
        setModal(
            <DeleteSupportTicketModal
                onCancel={onCancel}
                ticketIds={selectedTicketIds}
                clearSelection={clearSelection}
            />
        )
    }

    return (
        <>
            {modal && modal}
            {canSeeAssignedFilter && (
                <div className="flex items-center justify-between gap-2 mb-2 ml-3.5">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={(e) => toggleSelectAll(e.target.checked)}
                            className="h-4 w-4 accent-[#044866]"
                        />
                        <span className="text-sm text-[#044866]">
                            Select all ({data?.length})
                        </span>

                        {selectedTicketIds?.length > 0 && (
                            <span className="ml-auto text-xs text-[#F7A619]">
                                Selected: {selectedTicketIds.length}
                            </span>
                        )}
                    </div>
                    {selectedTicketIds.length > 0 && (
                        <Button
                            text="Delete Selected item"
                            variant="error"
                            onClick={onClickDelete}
                        />
                    )}
                </div>
            )}
        </>
    )
}
