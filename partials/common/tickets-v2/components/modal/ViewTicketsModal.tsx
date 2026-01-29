import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { CommonApi } from '@queries'
import { TicketCard } from '../cards/TicketCard'
import { TicketListSkeleton } from '../../skeleton'
import { EmptyTicket } from '../EmptyTicket'
import { useTicketListNavigation } from '../../hooks'

interface ViewTicketsModalProps {
    wpId: string | number
    isOpen: boolean
    onClose: () => void
}

export const ViewTicketsModal = ({
    wpId,
    isOpen,
    onClose,
}: ViewTicketsModalProps) => {
    const { handleTicketClick } = useTicketListNavigation({
        defaultTeamTab: 'all',
    })

    const { data, isLoading } =
        CommonApi.Teams.useTicketsByUserId(
            wpId
                ? {
                    id: wpId,
                    params: {
                        search: '',
                        skip: 0,
                        limit: 100, // Load enough for a modal view
                    },
                }
                : undefined,
            { skip: !wpId || !isOpen }
        )

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-7xl! max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-[#044866] flex items-center gap-2">
                        Support Tickets
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {isLoading ? (
                        <TicketListSkeleton />
                    ) : data?.data?.length > 0 ? (
                        data?.data?.map((ticket: any, index: number) => (
                            <div
                                key={ticket.id}
                                className="animate-scale-in"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <TicketCard
                                    ticket={ticket}
                                    onClick={() =>
                                        handleTicketClick(ticket?.id)
                                    }
                                    isSelected={false}
                                    onSelect={() => { }}
                                />
                            </div>
                        ))
                    ) : (
                        <EmptyTicket />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
