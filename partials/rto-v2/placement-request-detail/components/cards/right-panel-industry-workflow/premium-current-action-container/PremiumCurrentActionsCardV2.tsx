import { Card, NoData } from '@components'
import { CurrentActionHeader } from './components/CurrentActionHeader'
import { StatusRenderer } from './components/StatusRenderer'
import { usePremiumCurrentActions } from './hooks/usePremiumCurrentActions'
import { CancelledState } from './components/CancelledState'
import { PlacementStartedState } from './components/PlacementStartedState'
import { ReRunWPAutomation } from '@partials/common/StudentProfileDetail/components'
import { ScheduleModal } from '@partials/rto-v2/placement-request-detail/modal'

export const PremiumCurrentActionsCardV2 = (props: any) => {
    const {
        modal,
        requestStatusChange,
        showAgreementDialog,
        setShowAgreementDialog,
        showAppointmentDialog,
        setShowAppointmentDialog,
        setModal,
    } = usePremiumCurrentActions(props)
    const onCancelClicked = () => setModal(null)
    const onReRunAutomation = () => {
        setModal(
            <ReRunWPAutomation
                workplace={props.workplace}
                onCancel={onCancelClicked}
            />
        )
    }

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
                            onReRunAutomation={onReRunAutomation}
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
            <ScheduleModal
                open={props.showScheduleDialog}
                onClose={() => props.setShowScheduleDialog(false)}
                student={props.studentDetails?.data}
            />
        </>
    )
}
