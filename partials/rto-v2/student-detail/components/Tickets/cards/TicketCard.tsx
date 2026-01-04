import { Badge, Button, Card } from '@components'
import { UserRoles } from '@constants'
import { TicketTypes } from '@types'
import { getUserCredentials } from '@utils'
import {
    AlertCircle,
    CheckCircle,
    Clock,
    MessageSquare,
    Ticket,
} from 'lucide-react'
import moment from 'moment'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import { AddTicketReplyModal } from '../modal'

export const TicketCard = ({ ticket }: { ticket: TicketTypes }) => {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open':
                return (
                    <Badge
                        text="Open"
                        Icon={AlertCircle}
                        className="bg-red-100 text-red-700 border border-red-200"
                    />
                )
            case 'reopened':
                return (
                    <Badge
                        text="In Progress"
                        Icon={Clock}
                        className="bg-blue-100 text-blue-700 border border-blue-200"
                    />
                )
            case 'closed':
                return (
                    <Badge
                        text="Resolved"
                        Icon={CheckCircle}
                        className="bg-emerald-100 text-emerald-700 border border-emerald-200"
                    />
                )
            default:
                return <Badge outline text="Unknown" />
        }
    }

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'high':
                return <Badge text="High Priority" />
            case 'medium':
                return (
                    <Badge
                        outline
                        text="Medium"
                        className="border-yellow-300 text-yellow-700"
                    />
                )
            case 'low':
                return (
                    <Badge
                        outline
                        text="Low"
                        className="border-slate-300 text-slate-600"
                    />
                )
            default:
                return <Badge outline text="Unknown" />
        }
    }

    const [modal, setModal] = useState<ReactElement | null>(null)

    const onCancel = () => setModal(null)

    const onAddTicketReply = () => {
        setModal(<AddTicketReplyModal ticket={ticket} onCancel={onCancel} />)
    }

    const router = useRouter()
    const { role } = getUserCredentials()

    const onViewDetails = () => {
        if (role === UserRoles.ADMIN) {
            router.push(`/portals/admin/tickets/detail/${ticket.id}`)
        } else if (role === UserRoles.SUBADMIN) {
            router.push(`/portals/sub-admin/tickets/detail/${ticket.id}`)
        } else {
            router.push(
                `/portals/rto/tickets/detail/${ticket.id}`
            )
        }
    }
    return (
        <Card
            noPadding
            key={ticket.id}
            className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg p-4 hover:shadow-2xl hover:border-[#044866]/30 transition-all"
        >
            {modal}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-start gap-4 mb-3">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#044866] to-[#0D5468] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#044866]/20 group-hover:scale-110 transition-transform">
                            <Ticket className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h4 className="text-slate-900">
                                    {ticket?.subject}
                                </h4>
                                <Badge
                                    outline
                                    text={ticket.id + ''}
                                    className="text-xs"
                                />
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                {getStatusBadge(ticket.status)}
                                {getPriorityBadge(ticket.priority)}
                            </div>
                            <p className="text-slate-600 leading-relaxed mb-3">
                                {ticket?.message}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                <span>
                                    Created:{' '}
                                    {moment(ticket?.createdAt).format(
                                        'DD/MM/YYYY'
                                    )}
                                </span>
                                <span>•</span>
                                <span>
                                    Updated:{' '}
                                    {moment(ticket?.updatedAt).format(
                                        'DD/MM/YYYY'
                                    )}
                                </span>
                                <span>•</span>
                                <span>
                                    Assigned to: {ticket?.assignedTo?.name}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:text-right space-y-2 bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="flex lg:flex-col items-center lg:items-end gap-2">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <MessageSquare className="w-4 h-4" />
                            <span>
                                {ticket.responses?.length || 0} responses
                            </span>
                        </div>
                        <span className="text-xs text-slate-500">
                            Last:{' '}
                            {moment(ticket.responses?.[0]?.createdAt).fromNow()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Ticket Actions */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
                <Button
                    outline
                    variant="primaryNew"
                    className="text-[#044866] border-[#044866]/30 hover:bg-[#044866]/10"
                    onClick={onViewDetails}
                >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    View Details
                </Button>
                {ticket.status !== 'resolved' && (
                    <Button
                        outline
                        variant="secondary"
                        className="text-slate-700 border-slate-300 hover:bg-slate-50"
                        onClick={onAddTicketReply}
                    >
                        Add Response
                    </Button>
                )}

                {ticket.status === 'in-progress' && (
                    <Button
                        outline
                        variant="success"
                        className="text-emerald-600 border-emerald-300 hover:bg-emerald-50"
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark Resolved
                    </Button>
                )}
            </div>

            {/* Response Preview (for open/in-progress tickets) */}
            {ticket?.responses?.length > 0 && (
                <div className="space-y-2 mt-2">
                    {ticket?.responses?.map((response) => (
                        <div
                            key={response.id}
                            className="bg-gradient-to-br from-slate-50 to-white rounded-lg p-3 border border-slate-200"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#044866] to-[#0D5468] flex items-center justify-center text-white text-sm flex-shrink-0 shadow-lg shadow-[#044866]/20">
                                    {ticket.assignedTo?.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm text-slate-900">
                                            {ticket.assignedTo?.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {moment(
                                                response?.createdAt
                                            ).fromNow()}
                                        </p>
                                    </div>

                                    <p
                                        className="text-xs text-slate-500"
                                        dangerouslySetInnerHTML={{
                                            __html: response?.message,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    )
}
