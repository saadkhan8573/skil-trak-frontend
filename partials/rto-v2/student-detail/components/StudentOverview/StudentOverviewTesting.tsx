import { GlobalModal, LoadingAnimation, usePermissions } from '@components'
import { UserRoles } from '@constants'
import { AppointmentBookingModalV2 } from '@partials/rto-v2/placement-request-detail/modal'
import { WorkplaceApprovalModal } from '@partials/student/workplace/modal'
import { RtoV2Api } from '@queries'
import { setSelectedWorkplace } from '@redux'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { getUserCredentials } from '@utils'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useLogbookModals } from '../../hooks/useLogbookModals'
import { sortedWorkplaceRequests } from '../../utils'
import { CourseOverview } from './components'
import { StudentOverViewUpdated } from './StudentOverViewUpdated'
import { PermissionType } from '@types'

export const StudentOverviewTesting = () => {
    const [modal, setModal] = useState<ReactNode | null>(null)
    const { selectedCourse, studentDetail, selectedWorkplace } = useAppSelector(
        (state) => state?.student
    )
    const dispatch = useAppDispatch()
    const hasPermission = usePermissions({
        permission: [PermissionType.SHOW_MODAL],
    })
    const onClose = () => {
        setModal(null)
    }
    const role = getUserCredentials()?.role
    const isRto = role === UserRoles.RTO

    const wpApprovalRequest =
        RtoV2Api.StudentsWorkplace.useStudentProfileWorkplaceApprovalRequest(
            studentDetail?.id,
            {
                skip: !studentDetail?.id,
            }
        )

    useLogbookModals({
        selectedWorkplace,
        setModal,
        onClose,
    })

    useEffect(() => {
        if (wpApprovalRequest?.data && !modal && (!isRto || hasPermission)) {
            setModal(
                <WorkplaceApprovalModal
                    onCancel={onClose}
                    wpApprovalRequest={wpApprovalRequest?.data}
                />
            )
        }

        return () => {
            dispatch(setSelectedWorkplace(null))
        }
    }, [wpApprovalRequest, hasPermission, isRto])

    const studentWorkplaces =
        RtoV2Api.StudentsWorkplace.getStudentWorkplacesByCourse(
            {
                id: studentDetail?.id ?? 0,
                courseId: selectedCourse?.id ?? 0,
            },
            {
                skip: !selectedCourse?.id || !studentDetail?.id,
            }
        )
    const {
        data: industryAvailability,
        isLoading: isIndustryAvailabilityLoading,
    } = RtoV2Api.StudentsWorkplace.useIndustryAvailabilityForStudent(
        studentDetail?.id,
        { skip: !studentDetail?.id }
    )
    useEffect(() => {
        if (
            industryAvailability &&
            !industryAvailability?.existingAppointment &&
            role !== UserRoles.RTO
        ) {
            setModal(
                <GlobalModal>
                    <div className="min-w-200">
                        {isIndustryAvailabilityLoading ? (
                            <LoadingAnimation />
                        ) : (
                            industryAvailability && (
                                <AppointmentBookingModalV2
                                    // isOpen={true}
                                    onClose={onClose}
                                    wprId={
                                        industryAvailability?.workplaceRequestId
                                    }
                                    indId={industryAvailability?.industryId}
                                    availability={industryAvailability}
                                    // resultBookAppointment={resultBookAppointment}
                                    // bookAppointment={bookAppointment}
                                />
                            )
                        )}
                    </div>
                </GlobalModal>
            )
        }
    }, [industryAvailability?.existingAppointment, selectedWorkplace])

    const sortedWorkplaces = useMemo(
        () => sortedWorkplaceRequests(studentWorkplaces?.data),
        [studentWorkplaces?.data]
    )

    useEffect(() => {
        if (sortedWorkplaces && sortedWorkplaces?.length > 0) {
            dispatch(setSelectedWorkplace(sortedWorkplaces?.[0]))
        }
    }, [sortedWorkplaces])

    return (
        <>
            {modal}
            <div className="space-y-4">
                <CourseOverview />
                <StudentOverViewUpdated
                    sortedWorkplaces={sortedWorkplaces}
                    isLoading={studentWorkplaces?.isLoading}
                />
            </div>
        </>
    )
}
