'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { ScrollArea } from '@components/ui/scroll-area'
import { Ticket, Hash, Clock, AlertCircle } from 'lucide-react'
import { commonApi } from '@queries/common/common.query'
import { Skeleton } from '@components/ui/skeleton'

import { Badge, Checkbox } from '@components'
import { FormProvider, useForm } from 'react-hook-form'
import React, { useState } from 'react'

interface ManageMemberTicketsModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    member: any
}

export function ManageMemberTicketsModal({
    isOpen,
    onOpenChange,
    member,
}: ManageMemberTicketsModalProps) {
    const userId = member?.subadmin?.user?.id
    const { data, isLoading, isError } = commonApi.useGetTicketsByUserIdQuery(
        userId,
        {
            skip: !userId || !isOpen,
        }
    )

    const methods = useForm()

    const apiTickets = data?.data || []

    // Static data fallback as requested
    const staticTickets = [
        {
            id: 101,
            ticket_code: 'TK-88291',
            createdAt: '2024-03-10T10:00:00Z',
            status: 'Open',
        },
        {
            id: 102,
            ticket_code: 'TK-77120',
            createdAt: '2024-03-12T14:30:00Z',
            status: 'Processing',
        },
        {
            id: 103,
            ticket_code: 'TK-99043',
            createdAt: '2024-03-15T09:15:00Z',
            status: 'Resolved',
        },
        {
            id: 104,
            ticket_code: 'TK-11029',
            createdAt: '2024-03-16T16:45:00Z',
            status: 'Open',
        },
    ]

    const tickets = apiTickets.length > 0 ? apiTickets : staticTickets

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl! p-0 overflow-hidden border shadow-2xl rounded-2xl">
                <div className="bg-primaryNew p-4 space-y-0.5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 size-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />

                    <DialogHeader className="p-0">
                        <DialogTitle className="text-lg font-bold flex items-center gap-2.5 text-white">
                            <div className="size-8 rounded-lg bg-white/20 flex items-center justify-center border border-white/10 shadow-sm">
                                <Ticket className="size-4 text-white" />
                            </div>
                            <span>
                                Manage Tickets - {member?.subadmin?.user?.name}
                            </span>
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-xs text-white/80 pl-10.5 font-medium">
                        Listing all assigned ticket codes
                    </p>
                </div>

                <ScrollArea className="max-h-[60vh] px-4 py-4">
                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <Skeleton
                                    key={i}
                                    className="h-16 w-full rounded-xl"
                                />
                            ))}
                        </div>
                    ) : isError && false ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                            <AlertCircle className="size-10 text-destructive/50" />
                            <p className="text-sm font-medium text-muted-foreground">
                                Failed to load tickets. Please try again.
                            </p>
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                            <div className="size-12 rounded-full bg-muted flex items-center justify-center">
                                <Hash className="size-6 text-muted-foreground/50" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">
                                No tickets found for this member.
                            </p>
                        </div>
                    ) : (
                        <FormProvider {...methods}>
                            <div className="space-y-2">
                                {tickets.map((ticket: any) => (
                                    <TicketRow
                                        key={ticket.id}
                                        ticket={ticket}
                                    />
                                ))}
                            </div>
                        </FormProvider>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

function TicketRow({ ticket }: { ticket: any }) {
    const [isEnabled, setIsEnabled] = useState(true)

    return (
        <div className="flex items-center justify-between p-1.5 rounded border bg-card hover:bg-accent/40 transition-all group border-muted/50">
            <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-primaryNew/5 flex items-center justify-center border border-primaryNew/10">
                    <Hash className="size-4 text-primaryNew" />
                </div>
                <div>
                    <p className="text-sm font-bold text-foreground/90">
                        {ticket.ticket_code || `#${ticket.id}`}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <Clock className="size-3 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground font-medium">
                            {ticket.createdAt
                                ? new Date(
                                      ticket.createdAt
                                  ).toLocaleDateString()
                                : 'N/A'}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <Badge
                    text={isEnabled ? 'Enabled' : 'Disabled'}
                    variant={isEnabled ? 'primaryNew' : 'muted'}
                    size="xs"
                    shape="pill"
                    outline
                />
                <div className="flex items-center">
                    <Checkbox
                        name={`ticket_${ticket.id}`}
                        defaultChecked={isEnabled}
                        onChange={(e: any) => setIsEnabled(e.target.checked)}
                        showError={false}
                    />
                </div>
            </div>
        </div>
    )
}
