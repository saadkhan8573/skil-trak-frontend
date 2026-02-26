import { Badge, Typography } from '@components'
import { UserRoles } from '@constants'
import { SubAdminApi } from '@queries'
import { ellipsisText, getUserCredentials } from '@utils'
import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import { TicketStatus } from '../enum'

export const TicketSubject = ({ ticket, layoutV2 = false }: { ticket: any, layoutV2?: boolean }) => {
    const role = getUserCredentials()?.role

    const subadmin = SubAdminApi.SubAdmin.useProfile(undefined, {
        skip: role !== UserRoles.SUBADMIN,
        refetchOnMountOrArgChange: true,
    })

    return (
        <Link
            href={
                role === UserRoles.ADMIN || subadmin?.data?.isAdmin
                    ? `/portals/admin/tickets/detail/${ticket?.id}`
                    : role === UserRoles.SUBADMIN
                        ? `/portals/sub-admin/tickets/detail/${ticket?.id}`
                        : role === UserRoles.RTO
                            ? layoutV2 ? `/portals/rto/communications/tickets/${ticket?.id}` : `/portals/rto/tickets/detail/${ticket?.id}`
                            : ''
            }
            className="relative z-10"
        >
            <div className="flex items-center gap-x-2 mb-1 w-[320px]">
                <div
                    className={`rounded-full ${ticket?.status === TicketStatus.OPEN
                        ? 'bg-success'
                        : ticket?.status === TicketStatus.CLOSED
                            ? 'bg-red-700'
                            : 'bg-success'
                        } uppercase text-[11px] text-white px-1.5 whitespace-pre`}
                >
                    {ticket?.status}
                </div>
                <div className="rounded-full bg-info uppercase text-[11px] text-white px-1.5 whitespace-pre">
                    {ticket?.replies} New Replies
                </div>
                <div
                    className={`rounded-full bg-success uppercase text-[11px] font-semibold text-white px-1.5 whitespace-pre`}
                >
                    {ticket?.priority}
                </div>
            </div>
            <div className="flex items-center gap-x-2">
                <Typography variant={'label'}>
                    <span className="font-bold cursor-pointer">
                        [#{String(ticket?.id)?.padStart(5, '0')}]{' '}
                        {ellipsisText(ticket?.subject, 28)}
                    </span>
                </Typography>
                {ticket?.isInternal ? (
                    <div
                        className={`rounded-full bg-primary uppercase text-[11px] font-semibold text-white px-1.5 whitespace-pre`}
                    >
                        Internal Ticket
                    </div>
                ) : null}
            </div>
            <Typography variant={'xs'} capitalize>
                <span className="whitespace-pre">
                    {moment(ticket?.createdAt).fromNow()}
                </span>
            </Typography>
        </Link>
    )
}
