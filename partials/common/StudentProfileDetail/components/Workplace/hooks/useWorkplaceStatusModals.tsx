import { UserRoles } from '@constants'
import { InitiateSigningModal } from '@partials/sub-admin/assessmentEvidence/modal'
import { AssessmentEvidenceDetailType, Course } from '@types'
import { WorkplaceCurrentStatus } from '@utils'
import { ReactNode, useEffect } from 'react'
import {
    AddFeedbackModal,
    LogbookNotReleasedModal,
    NoLogbookFoundModal,
    ReleaseLogbookModal,
} from '../modals'

export const useWorkplaceStatusModals = ({
    selectedWorkplace,
    appliedIndustry,
    workplaceStudentDetail,
    student,
    role,
    latestWorkplaceApprovaleRequest,
    showModal,
}: {
    selectedWorkplace: any
    appliedIndustry: any
    workplaceStudentDetail: any
    student: any
    role: UserRoles
    latestWorkplaceApprovaleRequest: any
    showModal: (modal: ReactNode, id?: string) => void
}) => {
    // Add Feedback Modal
    useEffect(() => {
        if (
            selectedWorkplace &&
            selectedWorkplace?.currentStatus ===
                WorkplaceCurrentStatus.AgreementSigned &&
            !selectedWorkplace?.studentFeedBack &&
            appliedIndustry &&
            (role === UserRoles.ADMIN || role === UserRoles.SUBADMIN)
        ) {
            showModal(
                <AddFeedbackModal
                    onCancel={() => showModal(null)}
                    id={appliedIndustry?.id}
                    agreementSigned={appliedIndustry?.AgreementSigned}
                    student={student}
                    course={selectedWorkplace?.courses?.[0] as Course}
                    wpId={Number(selectedWorkplace?.id)}
                    industryId={appliedIndustry?.industry?.id}
                    isStartPlacement={false}
                />
            )
        }
    }, [selectedWorkplace, appliedIndustry])

    // Initiate Signing Modal
    useEffect(() => {
        if (
            workplaceStudentDetail?.isSuccess &&
            !workplaceStudentDetail?.data?.agreementSigned &&
            selectedWorkplace?.currentStatus ===
                WorkplaceCurrentStatus.AwaitingAgreementSigned &&
            (role === UserRoles.ADMIN || role === UserRoles.SUBADMIN)
        ) {
            showModal(
                <InitiateSigningModal
                    onCancel={() => showModal(null)}
                    courseId={Number(selectedWorkplace?.courses?.[0]?.id)}
                    folder={
                        selectedWorkplace?.courses?.[0]
                            ?.assessmentEvidence?.[0] as AssessmentEvidenceDetailType
                    }
                />
            )
        }
    }, [selectedWorkplace, workplaceStudentDetail])

    // Logbook Modals
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
            showModal(
                <LogbookNotReleasedModal
                    onCancel={() => showModal(null)}
                    rto={workplaceStudentDetail?.data?.rto}
                    selectedWorkplaceId={Number(selectedWorkplace?.id)}
                />
            )
        }
    }, [selectedWorkplace, workplaceStudentDetail?.data])

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
            showModal(
                <ReleaseLogbookModal
                    onCancel={() => showModal(null)}
                    selectedWorkplaceId={Number(selectedWorkplace?.id)}
                    rto={workplaceStudentDetail?.data?.rto}
                    course={selectedWorkplace?.courses?.[0] as Course}
                />
            )
        }
    }, [selectedWorkplace, workplaceStudentDetail?.data])

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
            showModal(
                <NoLogbookFoundModal
                    onCancel={() => showModal(null)}
                    rto={workplaceStudentDetail?.data?.rto?.user?.name}
                    course={selectedWorkplace?.courses?.[0]?.title + ''}
                />
            )
        }
    }, [selectedWorkplace, workplaceStudentDetail?.data])
}
