import { ReactElement } from 'react'
// Layouts
import { RtoLayoutV2 } from '@layouts'
// Components
import { NextPageWithLayout } from '@types'
import { useState } from 'react'
import { BiEnvelope } from 'react-icons/bi'

// Layouts
// Types
import {
    BackButton,
    EmptyData,
    LoadingAnimation,
    ShowErrorNotifications,
    TechnicalError
} from '@components'
import { ReplyTicketForm, TicketStatus } from '@partials/common/Tickets'
import { TicketDetailHeaderCard } from '@partials/common/Tickets/components'
import { TicketReplies } from '@partials/sub-admin/Tickets'
import { CommonApi } from '@queries'
import { useRouter } from 'next/router'

const TicketDetailPage: NextPageWithLayout = () => {
    const [modal, setModal] = useState<ReactElement | null>(null)
    const router = useRouter()

    const ticketDetail = CommonApi.Tickets.useGetDetail(
        Number(router.query.id),
        {
            skip: !router.query.id,
        }
    )
    const [addReply, addReplyResult] = CommonApi.Tickets.useAddReply()

    const onSubmit = (values: any) => {
        addReply({
            ticket: ticketDetail?.data?.id,
            ...values,
        })
    }

    const isOpened =
        ticketDetail?.data?.status === TicketStatus.OPEN ||
        ticketDetail?.data?.status === TicketStatus.REOPENED

    return (
        <>
            {modal}
            <ShowErrorNotifications result={addReplyResult} />
            <BackButton link={"portals/rto/communications/tickets?tab=all-tickets"} />
            <div className="px-4">
                {ticketDetail.isError && <TechnicalError />}
                {ticketDetail.isLoading ? (
                    <LoadingAnimation height={'h-[50vh]'} />
                ) : ticketDetail?.data && ticketDetail.isSuccess ? (
                    <>
                        <div className="h-[calc(100vh-420px)] overflow-auto custom-scrollbar">
                            <TicketDetailHeaderCard
                                ticket={ticketDetail?.data}
                                isOpened={isOpened}
                            />

                            <TicketReplies ticket={ticketDetail?.data} />
                        </div>
                        <div className="mt-2 fixed bottom-0 h-64 w-[calc(100%-95px)]">
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

TicketDetailPage.getLayout = (page: ReactElement) => {
    return (
        <RtoLayoutV2
            titleProps={{
                Icon: BiEnvelope,
                title: 'Ticket Details',
                description: 'View and reply to this ticket conversation',
            }}
        >
            {page}
        </RtoLayoutV2>
    )
}

export default TicketDetailPage