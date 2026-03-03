import {
    ActionButton,
    Badge,
    ContextBarLoading,
    GlobalModal,
    StudentAvatar,
    Typography,
} from '@components'
import {
    CommonApi,
    StudentApi,
    useGetStudentProfileDetailQuery,
} from '@queries'
import moment from 'moment'
import { AiFillEdit } from 'react-icons/ai'
import { BsUnlockFill } from 'react-icons/bs'
import { FaAddressCard, FaBirthdayCake, FaUserCircle } from 'react-icons/fa'
import { IoLocation } from 'react-icons/io5'
import { MdBatchPrediction, MdPhone, MdVerified } from 'react-icons/md'
import { getGender } from '@utils'

// hooks
import { useActionModal } from '@hooks'
import { useRouter } from 'next/router'
import { ellipsisText } from '@utils'
import { useState } from 'react'
import { processSubmission } from '@partials/common/StudentProfileDetail/feedbackForm/utils/getAnswersWithQuestions'
import { FeedbackForm } from '@partials/common/StudentProfileDetail/feedbackForm/FeedbackForm'
import { FeedbackButton } from '@partials/common/StudentProfileDetail/feedbackForm/components'
import Modal from '@modals/Modal'
import { ViewPlacementFeedbackModal } from '@partials/common/StudentProfileDetail/feedbackForm'
import { IndustryRatingForm } from '../forms'
export const ViewProfileCB = () => {
    const [modal, setModal] = useState<any | null>(null)
    const router = useRouter()
    const { data: courseSchedules } = CommonApi.Feedback.useGetCourseSchedules(
        {}
    )
    const studentIndustries = StudentApi.Profile.useIndustriesForFeedback()
    const getPlacementFeedback = CommonApi.Feedback.useGetPlacementFeedback({})

    const processedFeedback = processSubmission(getPlacementFeedback?.data)

    const eligibleCourses =
        courseSchedules?.courses?.filter(
            (course: any) => course.message === 'eligible for feedback'
        ) || []

    const onClose = () => {
        setModal(null)
    }
    const onPlacementFeedback = (courseId: any) => {
        setModal(
            <GlobalModal>
                <FeedbackForm onClose={onClose} courseId={courseId} />
            </GlobalModal>
        )
    }
    const onRatingIndustry = () => {
        setModal(
            <GlobalModal>
                <IndustryRatingForm onClose={onClose} />
            </GlobalModal>
        )
    }
    const { data, isLoading } = useGetStudentProfileDetailQuery()
    const { onUpdatePassword, passwordModal } = useActionModal()

    return (
        <>
            {modal && modal}
            {isLoading ? (
                <div className="h-[70vh] flex items-center justify-center">
                    <ContextBarLoading />
                </div>
            ) : (
                <div>
                    {passwordModal && passwordModal}
                    {/* Profile */}
                    <div>
                        <div className="relative flex flex-col items-center">
                            <div className="flex justify-end gap-x-2 absolute top-0 right-0">
                                <ActionButton
                                    rounded
                                    Icon={AiFillEdit}
                                    variant={'info'}
                                    onClick={() =>
                                        router.push(
                                            '/portals/student/my-profile'
                                        )
                                    }
                                    title="Edit Profile"
                                />

                                <ActionButton
                                    rounded
                                    Icon={BsUnlockFill}
                                    variant={'neutral'}
                                    onClick={() => onUpdatePassword(data)}
                                    title="Edit Password"
                                />
                            </div>
                            <StudentAvatar
                                name={data?.user?.name}
                                imageUrl={data?.user.avatar}
                                gender={data?.user.gender}
                            />

                            <div className="flex flex-col items-center">
                                <p className="text-lg font-semibold">
                                    {data?.user?.name} {data?.familyName}
                                </p>
                                <div className="flex items-center gap-x-2">
                                    <p className="text-sm text-gray-400">
                                        {ellipsisText(data?.user?.email, 30)}
                                    </p>
                                    <span className="text-blue-500">
                                        <MdVerified />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="inline-flex flex-col gap-y-2">
                            {processedFeedback &&
                                processedFeedback?.length > 0 && (
                                    <Modal>
                                        <Modal.Open opens="viewPlacementFeedback">
                                            <Badge
                                                text="View Placement Feedback"
                                                variant="info"
                                            />
                                        </Modal.Open>
                                        <Modal.Window name="viewPlacementFeedback">
                                            <ViewPlacementFeedbackModal
                                                feedbackData={processedFeedback}
                                            />
                                        </Modal.Window>
                                    </Modal>
                                )}

                            {eligibleCourses && eligibleCourses?.length > 0 && (
                                <FeedbackButton
                                    eligibleCourses={eligibleCourses}
                                    onPlacementFeedback={onPlacementFeedback}
                                />
                            )}
                            {studentIndustries?.data &&
                                studentIndustries?.data?.length > 0 && (
                                    <Badge
                                        text="Rate your Industry"
                                        variant="success"
                                        onClick={onRatingIndustry}
                                    />
                                )}
                            {/* onRatingIndustry */}
                        </div>

                        {/* Info Row 1 */}
                        <div className="flex justify-between divide-x border-b mt-4">
                            <div className="p-2">
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-300">
                                        <FaAddressCard />
                                    </span>
                                    <p className="text-sm font-medium">
                                        {ellipsisText(data?.studentId, 8)}
                                    </p>
                                </div>
                                <div className="text-gray-400 text-[11px] -mt-0.5 text-center">
                                    Student ID
                                </div>
                            </div>

                            {data?.batch ? (
                                <div className="p-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-300">
                                            <MdBatchPrediction />
                                        </span>
                                        <p className="text-sm font-medium">
                                            {data.batch}
                                        </p>
                                    </div>
                                    <div className="text-gray-400 text-[11px] -mt-0.5 text-center">
                                        Batch
                                    </div>
                                </div>
                            ) : null}

                            <div className="p-2">
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-300">
                                        <MdPhone />
                                    </span>
                                    <p className="text-sm font-medium">
                                        {data?.phone}
                                    </p>
                                </div>
                                <div className="text-gray-400 text-[11px] -mt-0.5 text-center">
                                    Phone Number
                                </div>
                            </div>
                        </div>

                        {/* Info Row 2 */}
                        <div className="flex justify-around divide-x border-b">
                            <div className="p-2">
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-300">
                                        <FaBirthdayCake />
                                    </span>
                                    <p className="text-sm font-medium">
                                        {data?.age || 'Not Provided'}
                                    </p>
                                </div>
                                <div className="text-gray-400 text-[11px] -mt-0.5 text-center">
                                    Age Range
                                </div>
                            </div>

                            <div className="p-2">
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-300">
                                        <FaUserCircle />
                                    </span>
                                    <p className="text-sm font-medium">
                                        {getGender(data?.gender)}
                                    </p>
                                </div>
                                <div className="text-gray-400 text-[11px] -mt-0.5 text-center">
                                    Gender
                                </div>
                            </div>
                        </div>

                        {/* Info Row 3 */}
                        <div className="flex justify-around divide-x border-b">
                            <div className="p-2">
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-300">
                                        <IoLocation />
                                    </span>
                                    <p className="text-sm font-medium">
                                        {data?.addressLine1},{' '}
                                        {data?.addressLine2}, {data?.state},{' '}
                                        {data?.suburb}
                                    </p>
                                </div>
                                <div className="text-gray-400 text-[11px] -mt-0.5 text-center">
                                    Address
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-1">
                        <Typography variant={'muted'} color={'text-gray-500'}>
                            Expires on
                        </Typography>
                        <Typography variant={'label'}>
                            {moment(data?.expiryDate).format('Do MMMM YYYY')}
                        </Typography>
                    </div>

                    {/* Important Documents */}
                    {/* <div className="mt-4">
            <ImportantDocuments sidebar />
        </div> */}
                </div>
            )}
        </>
    )
}
