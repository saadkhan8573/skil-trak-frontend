import { Card, NoData } from '@components'
import { CurrentActionHeader } from './components/CurrentActionHeader'
import { StatusRenderer } from './components/StatusRenderer'
import { usePremiumCurrentActions } from './hooks/usePremiumCurrentActions'
import { CancelledState } from './components/CancelledState'
import { PlacementStartedState } from './components/PlacementStartedState'

export const PremiumCurrentActionsCardV2 = (props: any) => {
    const {
        modal,
        requestStatusChange,
        showAgreementDialog,
        setShowAgreementDialog,
        showAppointmentDialog,
        setShowAppointmentDialog,
    } = usePremiumCurrentActions(props)

    const { isCancelled, isPlacementStarted, currentStatus } = props

    return (
        <>
            {modal}

            <Card noPadding>
                <CurrentActionHeader />

                <div className="p-7">
                    {isCancelled && <CancelledState {...props} />}
                    {isPlacementStarted && <PlacementStartedState />}

                    {!isCancelled && !isPlacementStarted && (
                        <StatusRenderer
                            stage={currentStatus?.stage}
                            {...props}
                            requestStatusChange={requestStatusChange}
                            showAgreementDialog={showAgreementDialog}
                            setShowAgreementDialog={setShowAgreementDialog}
                            showAppointmentDialog={showAppointmentDialog}
                            setShowAppointmentDialog={setShowAppointmentDialog}
                        />
                    )}

                    {!currentStatus && (
                        <NoData text="No progress has been recorded." />
                    )}
                </div>
            </Card>
        </>
    )
}
