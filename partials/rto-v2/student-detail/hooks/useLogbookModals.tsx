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
    skip?: boolean
}

export const useLogbookModals = ({
    selectedWorkplace,
    setModal,
    onClose,
    skip,
}: useLogbookModalsProps) => {
    const workplaceStudentDetail = SubAdminApi.Student.workplaceStudentDetail(
        Number(selectedWorkplace?.id),
        {
            skip: !selectedWorkplace || skip,
            refetchOnMountOrArgChange: true,
        }
    )

    useEffect(() => {
        if (
            !skip &&
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
    }, [selectedWorkplace, workplaceStudentDetail?.data, skip])

    // Logbook Not Released Modal
    useEffect(() => {
        if (
            !skip &&
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
    }, [selectedWorkplace, workplaceStudentDetail?.data, skip])

    // Release Logbook Modal
    useEffect(() => {
        if (
            !skip &&
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
    }, [selectedWorkplace, workplaceStudentDetail?.data, skip])
}
