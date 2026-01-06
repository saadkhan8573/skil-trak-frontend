import {
    AuthorizedUserComponent,
    Button,
    ShowErrorNotifications,
} from '@components'
import { UserRoles } from '@constants'
import { useNotification } from '@hooks'
import { CommonApi } from '@queries'
import React, { useEffect } from 'react'

export const SelectAllTicketsCheckbox = ({
    isAllSelected,
    toggleSelectAll,
    selectedTicketIds,
    data,
    clearSelection,
}: any) => {
    const { notification } = useNotification()
    const [deleteBulk, deleteBulkResult] =
        CommonApi.Teams.useBulkDeleteSupportTickets()
    useEffect(() => {
        if (deleteBulkResult.isSuccess) {
            notification.success({
                title: 'Tickets Deleted',
                description: 'Tickets deleted successfully',
            })
            clearSelection()
        }
    }, [deleteBulkResult.isSuccess])
    return (
        <>
            <ShowErrorNotifications result={deleteBulkResult} />
            <AuthorizedUserComponent roles={[UserRoles.ADMIN]}>
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
                            onClick={() =>
                                deleteBulk({ ids: selectedTicketIds })
                            }
                            loading={deleteBulkResult.isLoading}
                            disabled={deleteBulkResult.isLoading}
                        />
                    )}
                </div>
            </AuthorizedUserComponent>
        </>
    )
}
