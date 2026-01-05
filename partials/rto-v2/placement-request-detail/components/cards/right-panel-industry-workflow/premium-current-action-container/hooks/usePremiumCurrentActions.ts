import { ReactElement, useState } from 'react'

export const usePremiumCurrentActions = ({
    setPendingStatus,
    setStatusNote,
}: {
    setPendingStatus: (v: string) => void
    setStatusNote: (v: string) => void
}) => {
    const [modal, setModal] = useState<ReactElement | null>(null)
    const [showAppointmentDialog, setShowAppointmentDialog] = useState(false)
    const [showAgreementDialog, setShowAgreementDialog] = useState(false)

    const requestStatusChange = (status: string) => {
        setPendingStatus(status)
        setStatusNote('')
    }

    return {
        modal,
        setModal,
        showAppointmentDialog,
        setShowAppointmentDialog,
        showAgreementDialog,
        setShowAgreementDialog,
        requestStatusChange,
    }
}
