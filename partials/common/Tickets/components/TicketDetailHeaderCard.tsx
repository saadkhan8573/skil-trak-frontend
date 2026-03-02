import {
    AuthorizedUserComponent,
    Button,
    Portal,
    Typography,
} from '@components'
import { UserRoles } from '@constants'
import { StudentCellInfo } from '@partials/admin/student/components'
import { CloseTicketModal } from '@partials/admin/Tickets'
import { StudentCellInfo as RtoStudentCellInfo } from '@partials/rto/student/components'
import { StudentCellInfo as SubadminStudentCellInfo } from '@partials/sub-admin/students'
import { ForwardTicket } from '@partials/sub-admin/Tickets'
import { getUserCredentials } from '@utils'
import { ReactElement, useState } from 'react'
import { TicketUser } from './TicketUser'

export const TicketDetailHeaderCard = ({
    ticket,
    isOpened,
}: {
    ticket: any
    isOpened: boolean
}) => {
    const [modal, setModal] = useState<ReactElement | null>(null)
    const onCancel = () => {
        setModal(null)
    }

    const onCloseClicked = () => {
        setModal(
            <Portal>
                <CloseTicketModal onCancel={onCancel} ticket={ticket} />
            </Portal>
        )
    }

    const role = getUserCredentials()?.role
    const userId = getUserCredentials()?.id

    const checkCreatorOfTicket = userId === ticket?.createdBy?.id
    // ticket.course.title
    // ticket.course.code
    return (
        <>
            {modal}
            <div>
                <div className="flex flex-col gap-y-3 py-2">
                    <div className="border-b pb-3 relative z-20">
                        {(ticket?.assignedTo?.id === userId ||
                            ticket?.createdBy?.id === userId) && (
                            <ForwardTicket ticketDetail={ticket} />
                        )}
                    </div>
                    <div></div>
                    <div className="flex flex-col px-4 gap-y-2 pb-4">
                        {ticket?.student && (
                            <div className="border-b py-2 relative z-10">
                                <AuthorizedUserComponent
                                    roles={[UserRoles.ADMIN]}
                                >
                                    <StudentCellInfo
                                        student={ticket?.student}
                                    />
                                </AuthorizedUserComponent>
                                <AuthorizedUserComponent
                                    roles={[UserRoles.SUBADMIN]}
                                >
                                    <SubadminStudentCellInfo
                                        student={ticket?.student}
                                    />
                                </AuthorizedUserComponent>
                                <AuthorizedUserComponent
                                    roles={[UserRoles.RTO]}
                                >
                                    <RtoStudentCellInfo
                                        student={ticket?.student}
                                    />
                                </AuthorizedUserComponent>
                            </div>
                        )}

                        <div className="border-b pb-2">
                            <Typography color={'text-gray-400'} variant={'xs'}>
                                Created By: {ticket?.createdBy?.name ?? 'NA'}
                            </Typography>
                            <TicketUser small ticket={ticket?.createdBy} />
                        </div>
                        <div className="border-b pb-2">
                            <Typography color={'text-gray-400'} variant={'xs'}>
                                Course:
                            </Typography>
                            <Typography
                                color={'text-gray-700'}
                                variant={'muted'}
                            >
                                {ticket?.course?.code || 'N/A'} :{' '}
                                {ticket?.course?.title || 'N/A'}
                            </Typography>
                        </div>
                        <div className="border-b pb-2">
                            <Typography color={'text-gray-400'} variant={'xs'}>
                                Assigned To: {ticket?.assignedTo?.name ?? 'NA'}
                            </Typography>
                            <TicketUser small ticket={ticket?.assignedTo} />
                        </div>
                        {isOpened && (
                            <Button
                                variant={isOpened ? 'error' : 'info'}
                                text={isOpened ? 'Close Ticket' : 'Re Open'}
                                onClick={() => {
                                    if (isOpened) {
                                        onCloseClicked()
                                    }
                                }}
                                disabled={!checkCreatorOfTicket}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
