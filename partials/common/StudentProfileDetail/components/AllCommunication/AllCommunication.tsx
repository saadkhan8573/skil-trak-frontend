// TODO: save all the workplace status in all communication, including rejection and cancellation. With date stamp and the person who did it?,
// TODO: modal view snoozed history
// TODO: student cancellation note in all communication

import { AllCommunicationComponent, CommunicationHeader } from './components'
export const AllCommunication = ({
    user,
    isEntered = true,
}: {
    user: any
    isEntered?: boolean
}) => {
    return (
        <div className="h-160 overflow-auto flex flex-col">
            <CommunicationHeader user={user} />
            <AllCommunicationComponent user={user} isEntered={isEntered} />
        </div>
    )
}
