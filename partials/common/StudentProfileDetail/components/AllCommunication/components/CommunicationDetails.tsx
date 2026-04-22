import { Mail } from '@components'
import { HistoryCard } from '@partials/common/History'
import { NoteCard } from '@partials/common/Notes'
import { StudentMessageCard } from '../../StudentMessageCard'
import { CommunicationDetailsProps } from '../types'
import { StatusChangeHistoryCommunication } from './StatusChangeHistoryCommunication'
import { TicketAllCommunication } from './TicketAllCommunication'
import { WorkplaceStatusCommunication } from './WorkplaceStatusCommunication'

export const CommunicationDetails: React.FC<CommunicationDetailsProps> = ({
    item,
}) => {
    if (item?.type === 'workplaceHistory') {
        return <WorkplaceStatusCommunication item={item} />
    }

    if (item?.type === 'statusChangeHistory') {
        return <StatusChangeHistoryCommunication item={item} />
    }

    if (item.type === 'twilio') {
        return <StudentMessageCard studentMessage={item} />
    }

    if (item.calledBy) {
        return (
            <HistoryCard
                call
                history={{
                    ...item,
                    title: 'Call',
                    description: (
                        <>
                            call made by <strong>{item?.calledBy?.name}</strong>
                        </>
                    ),
                }}
            />
        )
    }

    if (item.assignedTo) {
        return <TicketAllCommunication item={item} />
    }

    if (item.title) {
        return <NoteCard note={item} />
    }

    return (
        <Mail sender={item.sender?.role === 'admin'} message={item} index={0} />
    )
}
