import { RtoV2Api } from '@queries'
import { setSelectedWorkplace } from '@redux'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { IWorkplaceIndustries } from '@redux/queryTypes'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { sortedWorkplaceRequests } from '../../utils'
import {
    ApplyWorkplaceOverview,
    CourseOverview,
    CurrentStatus,
    PlacementRequest,
    WorkplaceBio,
} from './components'
import {
    AppointmentBookingModal,
    AppointmentBookingModalV2,
} from '@partials/rto-v2/placement-request-detail/modal'
import { GlobalModal, LoadingAnimation, NoData } from '@components'
import { UserRoles } from '@constants'
import { getUserCredentials } from '@utils'
import { WorkplaceApprovalModal } from '@partials/student/workplace/modal'

export const StudentOverview = () => {
    const [modal, setModal] = useState<ReactNode | null>(null)
    const { selectedCourse, studentDetail, selectedWorkplace } = useAppSelector(
        (state) => state?.student
    )
    const dispatch = useAppDispatch()
    const onClose = () => {
        setModal(null)
    }
    const role = getUserCredentials()?.role
    const [addNewWorkplace, setAddNewWorkplace] = useState(false)
    const handleAddNewWorkplace = () => {
        setAddNewWorkplace(true)
    }
    const wpApprovalRequest =
        RtoV2Api.StudentsWorkplace.useStudentProfileWorkplaceApprovalRequest(
            studentDetail?.id,
            {
                skip: !studentDetail?.id,
            }
        )
    useEffect(() => {
        if (wpApprovalRequest?.data && role !== UserRoles.RTO) {
            setModal(
                <WorkplaceApprovalModal
                    onCancel={onClose}
                    wpApprovalRequest={wpApprovalRequest?.data}
                />
            )
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
        isError: isIndustryAvailabilityError,
        isSuccess: isIndustryAvailabilitySuccess,
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
    const [bookAppointment, resultBookAppointment] =
        RtoV2Api.Students.useBookAppointmentExternally()
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
            {modal && modal}
            <div className="space-y-4">
                <CourseOverview />
                <PlacementRequest
                    sortedWorkplaces={sortedWorkplaces}
                    studentWorkplaces={studentWorkplaces}
                />
                {selectedWorkplace && !addNewWorkplace ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <WorkplaceBio
                            workplace={selectedWorkplace}
                            handleAddNewWorkplace={handleAddNewWorkplace}
                        />
                        <CurrentStatus workplace={selectedWorkplace} />
                    </div>
                ) : (
                    <ApplyWorkplaceOverview
                        firstWorkplace={
                            selectedWorkplace as IWorkplaceIndustries
                        }
                        handleAddNewWorkplace={() => setAddNewWorkplace(false)}
                    />
                )}
            </div>
        </>
    )
}
