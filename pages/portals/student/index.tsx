import moment from 'moment'
import Image from 'next/image'
import { ReactElement, useEffect, useState } from 'react'

import {
    Button,
    Card,
    ContextBarLoading,
    GlobalModal,
    InitialAvatar,
    InitialAvatarContainer,
    LoadingAnimation,
    Modal,
    NoData,
    Typography,
} from '@components'
import { StudentLayout } from '@layouts'
import { Course, NextPageWithLayout, SubAdmin } from '@types'

import { FaBriefcase, FaMapMarkerAlt, FaSchool } from 'react-icons/fa'
import { IoBriefcase } from 'react-icons/io5'
import { MdPermContactCalendar, MdPhone } from 'react-icons/md'

import { useContextBar } from '@hooks'
import {
    ImportantDocuments,
    PortalQuestions,
    ProfileCompletetionStatus,
    StudentContextBar,
} from '@partials/student/components'

import {
    CommonApi,
    RtoV2Api,
    StudentApi,
    useGetStudentProfileDetailQuery,
} from '@queries'

import { Desktop, Mobile } from '@components/Responsive'
import { MediaQueries, UserRoles } from '@constants'
import { UponAppointmentCompletionModal } from '@partials/common/StudentProfileDetail/components'
import { FeedbackForm } from '@partials/common/StudentProfileDetail/feedbackForm/FeedbackForm'
import { processSubmission } from '@partials/common/StudentProfileDetail/feedbackForm/utils/getAnswersWithQuestions'
import { StudentWpScheduleModal } from '@partials/student/Schedule/modal'
import { getSectors, getUserCredentials } from '@utils'
import Link from 'next/link'
import { useMediaQuery } from 'react-responsive'
import { AppointmentBookingModalV2 } from '@partials/rto-v2/placement-request-detail/modal'
import { SelectAppointmentStatusVII } from '@partials/common/ProfileAppointments/select-appointment-status-v2/SelectAppointmentStatusVII'

const StudentDashboard: NextPageWithLayout = () => {
    const [modal, setModal] = useState<any | null>(null)
    const [modalShown, setModalShown] = useState(false)
    const contextBar = useContextBar()
    const { data: courseSchedules } = CommonApi.Feedback.useGetCourseSchedules(
        {}
    )
    const role = getUserCredentials()?.role
    const getPlacementFeedback = CommonApi.Feedback.useGetPlacementFeedback({})
    const { data, isLoading } = useGetStudentProfileDetailQuery()
    const {
        data: industryAvailability,
        isLoading: isIndustryAvailabilityLoading,
    } = RtoV2Api.StudentsWorkplace.useIndustryAvailabilityForStudent(data?.id, {
        skip: !data?.id,
    })

    const processedFeedback = processSubmission(getPlacementFeedback?.data)

    const eligibleCourses =
        courseSchedules?.courses?.filter(
            (course: any) => course.message === 'eligible for feedback'
        ) || []
    const onClose = () => {
        setModal(null)
    }
    const appointmentCompletion =
        RtoV2Api.Students.useGetStudentAppointmentDetail()
    const agreementSignedAndSchedule =
        CommonApi.Appointments.useStudentAgreementAndScheduleStatus()

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
                                />
                            )
                        )}
                    </div>
                </GlobalModal>
            )
        }
    }, [industryAvailability])
    const uponAgreementSignedAndNoSchedule = () => {
        setModal(<StudentWpScheduleModal student={data} onClose={onClose} />)
    }
    const uponCompletionAppointment = (appointment: any) => {
        setModal(
            <SelectAppointmentStatusVII
                isOpen={true}
                appointment={appointment}
                onClose={onClose}
            />
        )
    }

    useEffect(() => {
        if (
            appointmentCompletion?.data &&
            Object.keys(appointmentCompletion?.data).length > 0 &&
            !appointmentCompletion?.data?.isSuccessfull
        ) {
            const appointmentDate = moment(appointmentCompletion?.data?.date)
            const oneMonthAgo = moment().subtract(1, 'months')

            if (appointmentDate.isAfter(oneMonthAgo)) {
                uponCompletionAppointment(appointmentCompletion?.data)
            }
        }
    }, [appointmentCompletion?.data])
    useEffect(() => {
        if (
            agreementSignedAndSchedule.isSuccess &&
            !agreementSignedAndSchedule?.data
        ) {
            uponAgreementSignedAndNoSchedule()
        }
    }, [agreementSignedAndSchedule?.data])
    const onPlacementFeedback = (courseId: any) => {
        setModal(
            <GlobalModal>
                <FeedbackForm onClose={onClose} courseId={courseId} />
            </GlobalModal>
        )
    }
    useEffect(() => {
        if (eligibleCourses && eligibleCourses?.length > 0) {
            onPlacementFeedback(eligibleCourses[0].courseId)
        }
    }, [])
    const talentPoolProfile =
        StudentApi.TalentPool.useAppliedTalentPoolStudentProfile()
    const handleMediaQueryChange = (matches: any) => {
        if (matches) {
            if (contextBar.isVisible) contextBar.hide()
        } else {
            // contextBar.setContent(<ViewProfileCB />)
            if (!contextBar.isVisible) contextBar.show(false)
        }
    }
    const isMobile = useMediaQuery(
        MediaQueries.Mobile,
        undefined,
        handleMediaQueryChange
    )

    const { data: averageRating } =
        CommonApi.Feedback.useUserReviewForCoordinator()

    const talentPoolStudentProfileDetail =
        StudentApi.TalentPool.useTalentPoolStudentProfile()
    const sectorsWithCourses = getSectors(data?.courses)

    // Modal
    const onCancel = () => {
        setModal(null)
        setModalShown(false)
    }

    const talentPoolCompletionModal = (
        <Modal
            onCancelClick={onCancel}
            showActions={false}
            title={'Talent Pool Profile'}
            subtitle={'Talent Pool Profile Completion.'}
        >
            <div className="max-w-3xl flex flex-col gap-y-3">
                <p className="text-gray-700">
                    Your talent pool profile is incomplete. To increase your
                    chances of getting noticed, please update your profile with
                    the required details.
                </p>
                <p className="text-gray-600 text-sm">
                    Missing information:{' '}
                    <strong>About, Interest, Skills</strong>.
                </p>
                <div className="flex justify-end">
                    <Button variant="info">
                        <Link
                            href={'/portals/student/talent-pool/edit-profile'}
                        >
                            Update Profile
                        </Link>
                    </Button>
                </div>
            </div>
        </Modal>
    )

    useEffect(() => {
        if (
            talentPoolProfile?.data &&
            (!talentPoolProfile?.data?.interest ||
                !talentPoolProfile?.data?.about ||
                !talentPoolProfile?.data?.skills)
        ) {
            setModal(talentPoolCompletionModal)
        }
    }, [talentPoolProfile?.data])
    useEffect(() => {
        // Check if the user has logged in before
        const hasUserLoggedInBefore = localStorage.getItem('hasUserLoggedIn')

        // If the user has logged in before, don't show the modal
        if (!hasUserLoggedInBefore) {
            // Check if the user has been hired
            if (
                talentPoolStudentProfileDetail?.data &&
                Object?.keys(talentPoolStudentProfileDetail?.data).length > 0 &&
                talentPoolStudentProfileDetail?.data?.status === 'hired'
            ) {
                setModalShown(true)
                localStorage.setItem('hasUserLoggedIn', 'true') // Mark the user as logged in
            }
        }
    }, [talentPoolStudentProfileDetail])

    const modalComponent = modalShown && (
        <Modal
            onCancelClick={onCancel}
            showActions={false}
            title={'Hired by industry'}
            subtitle={"Congratulations! You've been hired by the industry."}
        >
            <div className="max-w-3xl">
                Congratulations! You've been selected by an esteemed industry,
                marking an important milestone in your career journey. Your
                dedication and skills have paid off. We wish you continued
                success!
            </div>
        </Modal>
    )

    return (
        <>
            {modal && modal}
            {modalComponent && modalComponent}
            <StudentContextBar />
            <div className="flex flex-col gap-y-6 pb-8">
                {/* Question Section */}
                <PortalQuestions />

                {/* Sector Card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 items-start gap-3">
                    <div className="md:col-span-2">
                        <Card>
                            {/* Card Header */}
                            <div className="flex justify-between items-center">
                                {/* Icon Title */}
                                <div className="flex items-center gap-x-2">
                                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex justify-center items-center">
                                        <FaSchool size={16} />
                                    </div>
                                    <p className="text-sm font-semibold">
                                        My Sector &amp; Courses
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mt-4">
                                {isLoading ? (
                                    <ContextBarLoading />
                                ) : data?.courses.length ? (
                                    Object.keys(sectorsWithCourses).map(
                                        (sector, i) => {
                                            return (
                                                <div className="" key={i}>
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-400">
                                                            Sector
                                                        </p>
                                                        <p className="text-sm font-semibold">
                                                            {sector}
                                                        </p>
                                                    </div>

                                                    {(
                                                        sectorsWithCourses as any
                                                    )[sector].map(
                                                        (c: Course) => (
                                                            <div
                                                                className="flex flex-col gap-y-4 ml-4"
                                                                key={c.id}
                                                            >
                                                                <div className="border-l-4 border-green-600 px-2 py-1">
                                                                    <div>
                                                                        <p className="text-xs font-medium text-gray-400">
                                                                            {
                                                                                c.code
                                                                            }
                                                                        </p>
                                                                        <p className="text-sm">
                                                                            {
                                                                                c.title
                                                                            }
                                                                        </p>
                                                                    </div>

                                                                    {/* <Badge text="Active" /> */}
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )
                                        }
                                    )
                                ) : (
                                    <NoData text={'No Courses Assigned'} />
                                )}
                            </div>
                        </Card>
                    </div>
                    <Card>
                        <Typography>Profile completed</Typography>
                        <ProfileCompletetionStatus profile={data} />
                    </Card>
                </div>

                {/* Documents Section */}
                <Desktop>
                    <ImportantDocuments
                        coureseRequirementsLink={
                            '/portals/student/course-requirements'
                        }
                        rto={data?.rto}
                    />
                </Desktop>

                <div className="flex flex-col gap-y-4 md:flex-row md:gap-x-6">
                    {/* RTO Card */}
                    <Card>
                        {/* Card Header */}
                        <div className="flex justify-between items-center">
                            {/* Icon Title */}
                            <div className="flex items-center gap-x-2">
                                <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex justify-center items-center">
                                    <FaSchool size={16} />
                                </div>
                                <p className="text-sm font-semibold">
                                    Education Provider
                                </p>
                            </div>
                        </div>

                        {/* Card Body */}
                        {data?.rto ? (
                            <div className="flex items-center gap-x-6 py-4">
                                {!isMobile && (
                                    <div className="shrink-0">
                                        {data?.rto?.user.avatar ? (
                                            <Image
                                                src={data?.rto?.user.avatar}
                                                width={100}
                                                height={100}
                                                alt=""
                                                className="rounded-full shadow-inner-image"
                                            />
                                        ) : (
                                            <div className="h-24 w-24 flex items-center justify-center bg-gray-100 rounded-full">
                                                <span className="text-4xl text-gray-300">
                                                    <FaSchool />
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div>
                                    <div>
                                        <div className="flex items-center gap-x-1">
                                            {isMobile && (
                                                <div className="h-8 w-8 flex items-center justify-center bg-gray-100 rounded-full">
                                                    <FaSchool
                                                        className="text-gray-300"
                                                        size={16}
                                                    />
                                                </div>
                                            )}
                                            <p className="font-medium">
                                                {data?.rto?.user?.name}
                                            </p>
                                        </div>
                                        <p className="text-slate-400 text-sm">
                                            {data?.rto?.user?.email}
                                        </p>
                                    </div>
                                    <div className="flex gap-x-6 mt-1">
                                        <div className="flex items-center gap-x-2">
                                            <span className="text-gray-400">
                                                <MdPermContactCalendar
                                                    size={14}
                                                />
                                            </span>
                                            <span className="text-xs">
                                                Not Provided
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-x-2">
                                            <span className="text-gray-400">
                                                <MdPhone size={14} />
                                            </span>
                                            <span className="text-xs">
                                                {data?.rto?.phone}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <p className="text-[11px] text-gray-400">
                                            Coordinators
                                        </p>
                                        <div className="flex justify-between gap-x-2">
                                            {data?.rto?.subadmin?.length && (
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        {
                                                            data?.rto
                                                                ?.subadmin[0]
                                                                ?.user?.name
                                                        }
                                                    </p>
                                                    <p className="text-xs font-medium text-slate-400">
                                                        {
                                                            data?.rto
                                                                ?.subadmin[0]
                                                                ?.user?.email
                                                        }
                                                    </p>
                                                </div>
                                            )}

                                            {data?.rto?.subadmin.slice(
                                                1,
                                                data?.rto?.subadmin?.length
                                            ).length > 0 && (
                                                <InitialAvatarContainer
                                                    show={2}
                                                >
                                                    {data?.rto.subadmin
                                                        .slice(
                                                            1,
                                                            data?.rto?.subadmin
                                                                .length
                                                        )
                                                        .map(
                                                            (
                                                                subAdmin: SubAdmin,
                                                                idx: number
                                                            ) => (
                                                                <InitialAvatar
                                                                    key={
                                                                        subAdmin.id
                                                                    }
                                                                    name={
                                                                        subAdmin
                                                                            ?.user
                                                                            ?.name
                                                                    }
                                                                    first={
                                                                        idx ===
                                                                        0
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                </InitialAvatarContainer>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-6">
                                <NoData text="No RTO Assigned" />
                            </div>
                        )}
                    </Card>

                    {/* Workplace Card */}
                    <Card>
                        {/* Card Header */}
                        <div className="flex justify-between items-center">
                            {/* Icon Title */}
                            <div className="flex items-center gap-x-2">
                                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex justify-center items-center">
                                    <IoBriefcase size={16} />
                                </div>
                                <p className="text-sm font-semibold">
                                    My Workplace
                                </p>
                            </div>
                            <div className="flex gap-x-4">
                                <div>
                                    <p className="text-[11px] text-gray-400">
                                        Coordinators
                                    </p>
                                    <p className="font-medium text-xs">
                                        {data?.subadmin?.user?.name ?? 'NA'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Card Body */}
                        {data?.industries?.length > 0 ? (
                            <div className="mt-4">
                                {data?.industries?.map((workplace: any) => {
                                    return (
                                        <div key={workplace.id}>
                                            <div className="flex items-center gap-x-6 mb-4">
                                                <div className="hidden md:block">
                                                    <div className="shrink-0">
                                                        {workplace?.user
                                                            ?.avatar ? (
                                                            <Image
                                                                src={
                                                                    workplace
                                                                        ?.user
                                                                        ?.avatar
                                                                }
                                                                width={100}
                                                                height={100}
                                                                alt=""
                                                                className="hidden md:block rounded-full shadow-inner-image"
                                                            />
                                                        ) : (
                                                            <div className="h-24 w-24 flex items-center justify-center bg-gray-100 rounded-full">
                                                                <span className="text-4xl text-gray-300">
                                                                    <FaBriefcase />
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <div>
                                                        <div className="flex items-center gap-x-1">
                                                            <div className="h-8 w-8 flex items-center justify-center bg-gray-100 rounded-full">
                                                                <FaBriefcase
                                                                    size={16}
                                                                />
                                                            </div>
                                                            <p className="font-medium">
                                                                {
                                                                    workplace
                                                                        ?.user
                                                                        ?.name
                                                                }
                                                            </p>
                                                        </div>
                                                        <p className="text-slate-400 text-sm">
                                                            {
                                                                workplace?.user
                                                                    ?.email
                                                            }
                                                        </p>
                                                    </div>

                                                    <div className="flex gap-x-3 mt-1 border-t pt-2">
                                                        <div className="flex items-center gap-x-1">
                                                            <span className="text-gray-400">
                                                                <MdPermContactCalendar
                                                                    size={14}
                                                                />
                                                            </span>
                                                            <span className="text-xs">
                                                                {
                                                                    workplace
                                                                        ?.user
                                                                        ?.name
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-x-1">
                                                            <span className="text-gray-400">
                                                                <MdPhone
                                                                    size={14}
                                                                />
                                                            </span>
                                                            <span className="text-xs">
                                                                {
                                                                    workplace?.phoneNumber
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-2">
                                                        <p className="text-[11px] text-gray-400">
                                                            Contact Person
                                                        </p>
                                                        <div className="flex justify-between gap-x-4">
                                                            <div>
                                                                <p className="font-medium text-sm">
                                                                    {workplace?.contactPerson ||
                                                                        'N/A'}
                                                                </p>
                                                                <p className="text-xs font-medium text-slate-400">
                                                                    {workplace?.contactPersonNumber ||
                                                                        'N/A'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-x-3 mt-1 border-t pt-2">
                                                <div className="flex items-center gap-x-1">
                                                    <span className="text-gray-400">
                                                        <FaMapMarkerAlt
                                                            size={14}
                                                        />
                                                    </span>
                                                    <span className="text-xs">
                                                        {
                                                            workplace?.addressLine1
                                                        }
                                                        ,{' '}
                                                        {workplace?.addressLine2 ||
                                                            'N/A'}
                                                        ,{' '}
                                                        {workplace?.suburb ||
                                                            'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="mt-6">
                                <NoData text="No Workplace" />
                            </div>
                        )}
                        {/* approvalStatus */}
                    </Card>
                </div>

                <Mobile>
                    <ImportantDocuments
                        coureseRequirementsLink={
                            '/portals/student/course-requirements'
                        }
                        rto={data?.rto}
                    />
                </Mobile>
            </div>

            {/* <IndustryRatingForm /> */}
        </>
    )
}

StudentDashboard.getLayout = (page: ReactElement) => {
    return <StudentLayout>{page}</StudentLayout>
}

export default StudentDashboard
