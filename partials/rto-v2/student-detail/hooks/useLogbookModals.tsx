import { Course } from '@types'
import { WorkplaceCurrentStatus } from '@utils'
import { ReactNode, useEffect } from 'react'
import {
    LogbookNotReleasedModal,
    NoLogbookFoundModal,
    ReleaseLogbookModal,
} from '../modals'
import { SubAdminApi } from '@redux'

interface useLogbookModalsProps {
    selectedWorkplace: any
    setModal: (modal: ReactNode | null) => void
    onClose: () => void
}

export const useLogbookModals = ({
    selectedWorkplace,
    setModal,
    onClose,
}: useLogbookModalsProps) => {
    const workplaceStudentDetail = SubAdminApi.Student.workplaceStudentDetail(
        Number(selectedWorkplace?.id),
        {
            skip: !selectedWorkplace,
            refetchOnMountOrArgChange: true,
        }
    )

    useEffect(() => {
        if (
            selectedWorkplace &&
            selectedWorkplace?.currentStatus ===
                WorkplaceCurrentStatus.AgreementSigned &&
            !selectedWorkplace?.isLogBookReleased &&
            !workplaceStudentDetail?.data?.rto?.assessmentTools?.length &&
            workplaceStudentDetail?.data &&
            workplaceStudentDetail?.data?.rto?.autoReleaseLogBook
        ) {
            setModal(
                <NoLogbookFoundModal
                    isOpen={true}
                    onClose={onClose}
                    rto={workplaceStudentDetail?.data?.rto?.user?.name}
                    course={selectedWorkplace?.courses?.[0]?.title + ''}
                />
            )
        }
    }, [selectedWorkplace, workplaceStudentDetail?.data])

    // Logbook Not Released Modal
    useEffect(() => {
        if (
            selectedWorkplace &&
            selectedWorkplace?.currentStatus ===
                WorkplaceCurrentStatus.PlacementStarted &&
            !selectedWorkplace?.isLogBookReleased &&
            workplaceStudentDetail?.data?.rto?.assessmentTools?.length > 0 &&
            workplaceStudentDetail?.data &&
            workplaceStudentDetail?.data?.rto?.autoReleaseLogBook
        ) {
            setModal(
                <LogbookNotReleasedModal
                    isOpen={true}
                    onClose={onClose}
                    rto={workplaceStudentDetail?.data?.rto}
                    selectedWorkplaceId={Number(selectedWorkplace?.id)}
                />
            )
        }
    }, [selectedWorkplace, workplaceStudentDetail?.data])

    // Release Logbook Modal
    useEffect(() => {
        if (
            selectedWorkplace &&
            selectedWorkplace?.currentStatus ===
                WorkplaceCurrentStatus.AgreementSigned &&
            !selectedWorkplace?.isLogBookReleased &&
            workplaceStudentDetail?.data?.rto?.assessmentTools?.length > 0 &&
            workplaceStudentDetail?.data &&
            workplaceStudentDetail?.data?.rto?.autoReleaseLogBook
        ) {
            setModal(
                <ReleaseLogbookModal
                    isOpen={true}
                    onClose={onClose}
                    rto={workplaceStudentDetail?.data?.rto}
                    course={selectedWorkplace?.courses?.[0] as Course}
                    selectedWorkplaceId={selectedWorkplace?.id!}
                />
            )
        }
    }, [selectedWorkplace, workplaceStudentDetail?.data])
}
