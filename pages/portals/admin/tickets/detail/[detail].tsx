import { ReactElement, useEffect } from 'react'

// Layouts
import { AdminLayout } from '@layouts'
// Types
import {
    EmptyData,
    LoadingAnimation,
    ShowErrorNotifications,
    TechnicalError,
    Typography
} from '@components'
import { UserRoles } from '@constants'
import { useContextBar, useNavbar, useNotification } from '@hooks'
import { TicketReplies } from '@partials/admin/Tickets'
import { ReplyTicketForm, TicketStatus } from '@partials/common/Tickets'
import { TicketDetailHeaderCard } from '@partials/common/Tickets/components'
import { CommonApi } from '@queries'
import { NextPageWithLayout } from '@types'
import { ellipsisText, getUserCredentials } from '@utils'
import moment from 'moment'
import { useRouter } from 'next/router'
import { FaLongArrowAltLeft } from 'react-icons/fa'

const Tickets: NextPageWithLayout = () => {
    const contextBar = useContextBar()
    const { setTitle } = useNavbar()
    const role = getUserCredentials()?.role
    const router = useRouter()
    const { notification } = useNotification()

    const ticketDetail = CommonApi.Tickets.useGetDetail(
        Number(router.query.detail),
        {
            skip: !router.query.detail,
        }
    )
    const [addReply, addReplyResult] = CommonApi.Tickets.useAddReply()

    useEffect(() => {
        setTitle('Ticket Detail')
    }, [])

    const onSubmit = (values: any) => {
        addReply({
            ticket: ticketDetail?.data?.id,
            ...values,
        })
    }

    const isOpened =
        ticketDetail?.data?.status === TicketStatus.OPEN ||
        ticketDetail?.data?.status === TicketStatus.REOPENED

    useEffect(() => {
        contextBar.setContent(
            <TicketDetailHeaderCard
                ticket={ticketDetail?.data}
                isOpened={isOpened}
            />
        )
        contextBar.show(false)
        contextBar.setTitle('Ticket Info')
        return () => {
            contextBar.setContent(null)
            contextBar.hide()
        }
    }, [ticketDetail?.data])

    return (
        <>
            <ShowErrorNotifications result={addReplyResult} />
            <div className="px-4">
                {ticketDetail.isError && <TechnicalError />}
                {ticketDetail.isLoading ? (
                    <LoadingAnimation height={'h-[50vh]'} />
                ) : ticketDetail?.data && ticketDetail.isSuccess ? (
                    <>
                        <div className="h-[calc(100vh-320px)] overflow-auto custom-scrollbar">
                            {/* <div className="sticky top-0 z-20">
                                <TicketDetailHeaderCard
                                    ticket={ticketDetail?.data}
                                    isOpened={isOpened}
                                />
                            </div> */}
                            <div className="flex items-center gap-x-4">
                                <div className="flex items-center gap-x-2 ">
                                    <FaLongArrowAltLeft
                                        className="text-xl cursor-pointer"
                                        onClick={() => {
                                            router.back()
                                            // if (role === UserRoles.ADMIN) {
                                            //     router.push(
                                            //         '/portals/admin/tickets?tab=my-open-tickets'
                                            //     )
                                            // } else if (
                                            //     role === UserRoles.SUBADMIN
                                            // ) {
                                            //     router.push(
                                            //         '/portals/sub-admin/tickets?tab=all-tickets'
                                            //     )
                                            // }
                                        }}
                                    />
                                    <Typography variant={'subtitle'}>
                                        <span className="font-bold cursor-pointer">
                                            [#
                                            {String(
                                                ticketDetail?.data?.id
                                            )?.padStart(5, '0')}
                                            ]{' '}
                                            {ellipsisText(
                                                ticketDetail?.data?.subject,
                                                28
                                            )}
                                        </span>
                                    </Typography>
                                </div>
                                <div className="flex items-center gap-x-2">
                                    <div className="flex items-center  gap-2">
                                        <div
                                            className={`rounded-full text-xs ${ticketDetail?.data?.status ===
                                                TicketStatus.OPEN
                                                ? 'bg-success'
                                                : ticketDetail?.data
                                                    ?.status ===
                                                    TicketStatus.CLOSED
                                                    ? 'bg-red-700'
                                                    : 'bg-error'
                                                } uppercase text-[11px] text-white px-1.5 whitespace-pre`}
                                        >
                                            {ticketDetail?.data?.status}
                                        </div>
                                        {/* <BsDot /> */}
                                        <div className="whitespace-nowrap">
                                            <Typography
                                                variant={'xs'}
                                                color={'text-[#6B7280]'}
                                            >
                                                Ticket was{' '}
                                                {ticketDetail?.data?.status ===
                                                    TicketStatus.OPEN ||
                                                    ticketDetail?.data?.status ===
                                                    TicketStatus.REOPENED
                                                    ? 'opened'
                                                    : 'closed'}{' '}
                                                by
                                            </Typography>
                                        </div>
                                        {/* <div className="flex items-center gap-2"> */}
                                        <div className="rounded-full bg-gray-200 uppercase text-black px-2 whitespace-pre text-xs">
                                            {ticketDetail?.data?.status ===
                                                TicketStatus.OPEN
                                                ? ticketDetail?.data?.createdBy
                                                    ?.role === UserRoles.ADMIN
                                                    ? 'Admin'
                                                    : ticketDetail?.data
                                                        ?.createdBy?.name
                                                : ticketDetail?.data?.closedBy
                                                    ?.role === UserRoles.ADMIN
                                                    ? 'Admin'
                                                    : ticketDetail?.data?.closedBy
                                                        ?.name}
                                        </div>
                                    </div>
                                    <Typography
                                        variant={'xs'}
                                        color={'text-[#6B7280]'}
                                    >
                                        On{' '}
                                        {moment(
                                            ticketDetail?.data?.status ===
                                                TicketStatus.OPEN
                                                ? ticketDetail?.data?.createdAt
                                                : ticketDetail?.data?.closedAt
                                        ).format(
                                            'dddd, DD MMMM, YYYY [at] hh:mm a'
                                        )}
                                    </Typography>
                                    {/* </div> */}
                                </div>
                            </div>

                            <TicketReplies ticket={ticketDetail?.data} />
                        </div>
                        <div className="mt-2 fixed bottom-0 h-64 w-[calc(100%-255px)]">
                            <ReplyTicketForm
                                onSubmit={onSubmit}
                                result={addReplyResult}
                                isOpened={isOpened}
                            />
                        </div>
                    </>
                ) : (
                    !ticketDetail.isError &&
                    ticketDetail.isSuccess && (
                        <EmptyData
                            title={'No Ticket Data'}
                            description={'No Ticket Detail were found'}
                        />
                    )
                )}
            </div>
        </>
    )
}

Tickets.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default Tickets
