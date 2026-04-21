import {
    GlobalModal,
    LoadingAnimation,
    TechnicalError,
    usePermissions,
} from '@components'
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
import { useSubadminProfile } from '@hooks'
import { PermissionType } from '@types'

export const StudentOverview = () => {
    const [modal, setModal] = useState<ReactNode | null>(null)
    const { selectedCourse, studentDetail, selectedWorkplace } = useAppSelector(
        (state) => state?.student
    )
    const hasPermission = usePermissions([PermissionType.SHOW_MODAL])
    const dispatch = useAppDispatch()
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

    const subadmin = useSubadminProfile()

    useLogbookModals({
        selectedWorkplace,
        setModal,
        onClose,
        skip: role === UserRoles.RTO || subadmin?.isAssociatedWithRto,
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
    }, [wpApprovalRequest])

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
            !subadmin?.isAssociatedWithRto &&
            (!isRto || hasPermission)
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
                {studentWorkplaces?.isError ? <TechnicalError /> : null}
                {studentWorkplaces?.isSuccess && (
                    <StudentOverViewUpdated
                        sortedWorkplaces={sortedWorkplaces}
                        isLoading={studentWorkplaces?.isLoading}
                    />
                )}
            </div>
        </>
    )
}
