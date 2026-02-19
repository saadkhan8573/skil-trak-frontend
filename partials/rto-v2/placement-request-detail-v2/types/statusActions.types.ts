import { ReactElement } from 'react'

export interface IStatusActionsProps {
    isCancelled: boolean
    isPlacementStarted: boolean
    cancellationReason: string
    currentStatus: {
        stage: string
    }
    setStatusNote: (note: string) => void
    appointmentDate: string
    setShowScheduleDialog: (show: boolean) => void
    setPendingStatus: (status: string) => void
    workplaceType: 'needs' | 'provided' | null
    workplace: any
    student: any
}

export interface IStatusActionRendererProps extends IStatusActionsProps {
    modal: ReactElement | null
    setModal: (modal: ReactElement | null) => void
    onCancelModal: () => void
}

export interface IStageComponentProps {
    workplace: any
    student: any
    appointmentDate: string
    setShowScheduleDialog: (show: boolean) => void
    setShowAgreementDialog: (show: boolean) => void
    showAgreementDialog: boolean
    setModal: (modal: ReactElement | null) => void
    onCancelModal: () => void
    requestStatusChange: (newStatus: string) => void
}
