// moment
import { Typography } from '@components/Typography'
import moment from 'moment'
// icons
import { AiFillEdit } from 'react-icons/ai'
import { BiRename } from 'react-icons/bi'
import { BsUnlockFill } from 'react-icons/bs'
import { FaAddressCard, FaBirthdayCake, FaUserCircle } from 'react-icons/fa'
import { IoLocation } from 'react-icons/io5'
import { MdBatchPrediction, MdPhone, MdVerified } from 'react-icons/md'

// hooks
import { useActionModal, useNotification } from '@hooks'

// queries
import { LoadingAnimation } from '@components/LoadingAnimation'
import { ShowErrorNotifications } from '@components/ShowErrorNotifications'
import { Tooltip } from '@components/Tooltip'
import { UserCreatedAt } from '@components/UserCreatedAt'
import { StudentAvatar } from '@components/avatars'
import { ActionButton, Button } from '@components/buttons'
import { CallLogsModal } from '@partials/sub-admin/students/modals'
import { CommonApi, SubAdminApi } from '@queries'
import { ellipsisText, getUserCredentials } from '@utils'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { IoMdEye } from 'react-icons/io'
import { StudentStatus } from './StudentStatus'
import { AuthorizedUserComponent } from '@components/AuthorizedUserComponent'
import { UserRoles } from '@constants'

const getGender = (gender: string | undefined) => {
    if (!gender) return 'N/A'

    if (gender.toLocaleLowerCase() === 'm') return 'Male'
    if (gender.toLocaleLowerCase() === 'f') return 'Female'
}
export const SubAdminStudentProfile = ({
    student,
    setRefetchStudent,
}: {
    student: any
    setRefetchStudent?: any
}) => {
    const [modal, setModal] = useState<ReactNode | null>(null)
    const router = useRouter()
    const { notification } = useNotification()
    const { passwordModal, onUpdatePassword } = useActionModal()
    const [callLog, callLogResult] = SubAdminApi.Student.useStudentCallLog()
    const [makeAsHighPriority, makeAsHighPriorityResult] =
        CommonApi.StudentAssessmentFiles.useMakeAsHighPriority()

    const role = getUserCredentials()?.role
    const subadmin = SubAdminApi.SubAdmin.useProfile(undefined, {
        skip: role !== UserRoles.SUBADMIN,
        refetchOnMountOrArgChange: true,
    })

    // useEffect(() => {
    //     if (resultCalledStudent.isSuccess) {
    //         notification.success({
    //             title: 'Called Student',
    //             description: `Called Student with Id: ${student.studentId}`,
    //         })
    //     }
    // }, [resultCalledStudent])
    useEffect(() => {
        if (makeAsHighPriorityResult.isSuccess) {
            notification.success({
                title: student.isHighPriority
                    ? 'Remove Mark As High Priority'
                    : 'Mark As High Priority',
                description: student.isHighPriority
                    ? `Removed Marked ${student?.user?.name} As High Priority`
                    : `Marked ${student?.user?.name} As High Priority`,
            })
        }
    }, [makeAsHighPriorityResult])

    // useEffect
    useEffect(() => {
        if (callLogResult.isSuccess) {
            notification.success({
                title: 'Called Student',
                description: `Called Student with Id: ${student.studentId}`,
            })
        }
    }, [callLogResult])

    const onViewCallLogs = () => {
        setModal(
            <CallLogsModal
                studentId={student?.id}
                onCancel={() => {
                    setModal(null)
                }}
            />
        )
    }

    return (
        <div>
            {modal}
            {passwordModal && passwordModal}
            <ShowErrorNotifications result={callLogResult} />
            <div className="relative flex flex-col items-center">
                <div className="flex items-center gap-x-2 absolute top-0 right-0">
                    <ActionButton
                        rounded
                        Icon={AiFillEdit}
                        variant={'info'}
                        onClick={() => {
                            router.push(
                                role === UserRoles.ADMIN ||
                                    subadmin?.data?.isAdmin
                                    ? `/portals/admin/student/edit-student/${student?.id}`
                                    : role === UserRoles.SUBADMIN
                                      ? `/portals/sub-admin/students/${student?.id}/edit-student`
                                      : role === UserRoles.RTO
                                        ? `/portals/rto/students/${student?.id}/edit-student`
                                        : '#'
                            )
                        }}
                        title="Edit Profile"
                    />

                    <ActionButton
                        rounded
                        Icon={BsUnlockFill}
                        variant={'neutral'}
                        onClick={() => onUpdatePassword(student)}
                        title="Edit Password"
                    />
                </div>
                <StudentAvatar
                    name={student?.user.name}
                    imageUrl={student?.user?.avatar}
                    gender={student?.gender}
                />

                <div className="flex flex-col items-center">
                    <p className="text-sm 2xl:text-lg font-semibold">
                        {student?.user?.name} {student?.familyName}
                    </p>
                    <div className="flex items-center gap-x-2">
                        <p className="text-sm text-gray-400">
                            {true
                                ? '---'
                                : ellipsisText(student?.user?.email, 30)}
                        </p>
                        <span className="text-blue-500">
                            <MdVerified />
                        </span>
                    </div>
                </div>
            </div>

            {/* Info Row 1 */}
            <div className="flex justify-between divide-x border-b mt-4">
                <div className="p-2">
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-300">
                            <FaAddressCard size={12} />
                        </span>
                        <p className="text-xs font-medium">
                            {ellipsisText(student?.studentId, 8)}
                        </p>
                    </div>
                    <div className="text-gray-400 text-[11px] -mt-0.5 text-right">
                        Student ID
                    </div>
                </div>

                <div className="p-2">
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-300">
                            <MdBatchPrediction size={12} />
                        </span>
                        <p className="text-xs font-medium">
                            {student?.batch || 'N/A'}
                        </p>
                    </div>
                    <div className="text-gray-400 text-[11px] -mt-0.5 text-right">
                        Batch
                    </div>
                </div>
            </div>
            <div className="p-2 border-b">
                <div>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-x-2 cursor-pointer group relative">
                            {callLogResult.isLoading && (
                                <div className="absolute top-0 left-0 w-full h-full bg-[#00000020] text-white flex justify-center items-center">
                                    <LoadingAnimation size={20} />
                                </div>
                            )}
                            <span className="text-gray-300">
                                <MdPhone size={12} />
                            </span>
                            <div
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        student?.phone
                                    )
                                    callLog({
                                        student: student?.id,
                                    })
                                    notification.success({
                                        title: 'Copied',
                                        description: 'Phone Number Copied',
                                    })
                                }}
                            >
                                <p className="text-xs font-medium">
                                    {student?.phone}
                                </p>
                                <div className="text-gray-400 text-[11px] flex justify-start -mt-0.5 text-right">
                                    Phone Number
                                </div>
                            </div>
                            <div className="mt-3 ml-5">
                                <Tooltip>Copy to Clipboard</Tooltip>
                            </div>
                        </div>
                        <div
                            className="text-white bg-info rounded-md px-1.5 py-1 cursor-pointer"
                            onClick={() => {
                                onViewCallLogs()
                            }}
                        >
                            <IoMdEye size={14} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-b">
                <UserCreatedAt label createdAt={student?.createdAt} />
            </div>
            {/* Info Row 2 */}
            <div className="flex justify-around divide-x border-b">
                <div className="p-2">
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-300">
                            <FaBirthdayCake size={12} />
                        </span>
                        <p className="text-xs font-medium">
                            {student?.age || 'Not Provided'}
                        </p>
                    </div>
                    <div className="text-gray-400 text-[11px] -mt-0.5 text-right">
                        Age Range
                    </div>
                </div>

                <div className="p-2">
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-300">
                            <FaUserCircle size={12} />
                        </span>
                        <p className="text-xs font-medium">
                            {getGender(student?.gender)}
                        </p>
                    </div>
                    <div className="text-gray-400 text-[11px] -mt-0.5 text-right">
                        Gender
                    </div>
                </div>
            </div>

            {/* Info Row 3 */}
            <div className="flex justify-around">
                <div className="p-2">
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-300">
                            <IoLocation size={12} />
                        </span>
                        {/* <div className="text-gray-400 text-[11px] -mt-0.5 text-right">
                            Address
                        </div> */}
                        <div>
                            <p className="text-xs font-medium">
                                {student?.addressLine1},{student?.suburb},{' '}
                                {student?.state}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* contact person row 4 */}
            <div className="mt-4">
                <Typography variant={'small'} color={'text-gray-500'}>
                    Emergency Contact Person
                </Typography>
                <div className="flex justify-around divide-x border-t border-b">
                    <div className="p-2">
                        <div className="flex items-center gap-x-2">
                            <BiRename className="text-gray-400" size={12} />
                            <Typography
                                variant={'muted'}
                                color={'text-gray-400'}
                            >
                                Name
                            </Typography>
                        </div>
                        <Typography variant={'small'} color={'text-black'}>
                            {student?.emergencyPerson}
                        </Typography>
                    </div>
                    <div className="p-2">
                        <div className="flex items-center gap-x-2">
                            <MdPhone className="text-gray-400" size={12} />
                            <Typography
                                variant={'muted'}
                                color={'text-gray-400'}
                            >
                                Phone
                            </Typography>
                        </div>
                        <div className="py-1">
                            <Typography variant={'small'} color={'text-black'}>
                                {student?.emergencyPersonPhone}
                            </Typography>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <Typography variant="label" semibold>
                    Student Type
                </Typography>
                <div>
                    {
                        <Typography
                            variant="small"
                            color="text-gray-600"
                            semibold
                        >
                            {student?.isInternational
                                ? 'International'
                                : student?.isInternational === false
                                  ? 'Domestic'
                                  : '---'}
                        </Typography>
                    }
                </div>
            </div>

            {/* Status Of Student */}
            <StudentStatus
                id={student?.user?.id}
                currentStatus={student?.studentStatus}
            />
            <AuthorizedUserComponent
                roles={[UserRoles.SUBADMIN, UserRoles.ADMIN]}
            >
                <div className="mt-2">
                    <Button
                        text={
                            student?.isHighPriority
                                ? 'Remove From High Priority'
                                : 'Mark As High Priority'
                        }
                        variant={student?.isHighPriority ? 'success' : 'error'}
                        onClick={() => {
                            makeAsHighPriority(student?.id)
                        }}
                        loading={makeAsHighPriorityResult?.isLoading}
                        disabled={makeAsHighPriorityResult?.isLoading}
                    />
                </div>
            </AuthorizedUserComponent>

            {/* Sector & Courses */}
            {/* <div className="mt-4">
        <Typography variant={'small'} color={'text-gray-500'}>
          Sector & Courses
        </Typography>
        <Typography variant={'label'} color={'text-black'}>
          Commercial Cookery & Hospitality
        </Typography>
        <div className="mt-2 flex items-center gap-x-2">
          <div className="flex flex-col items-center">
            <div className="bg-blue-400 p-2 rounded-full"></div>
            <div className="bg-blue-400 w-[1px] h-10"></div>
            <div className="bg-blue-400 p-2 rounded-full"></div>
            <div className="bg-blue-400 w-[1px] h-10"></div>
            <div className="bg-blue-400 p-2 rounded-full"></div>
          </div>
          <div className="flex flex-col gap-y-4">
            {studentProfileData.map((course: any) => (
              <div key={course.id}>
                <div className="flex items-center gap-x-2">
                  <Typography variant={'small'} color={'text-gray-500'}>
                    {course.courseCode}
                  </Typography>
                  <div
                    className={`rounded whitespace-nowrap border px-2 ${
                      course.status === 'Not Active'
                        ? 'border-gray-400'
                        : 'border-green-400'
                    }`}
                  >
                    <Typography
                      variant={'small'}
                      color={
                        course.status === 'Not Active'
                          ? 'text-gray-500'
                          : 'text-green-500'
                      }
                    >
                      {course.status}
                    </Typography>
                  </div>
                  {course.status === 'Active' ? (
                    <div
                      className={`rounded whitespace-nowrap text-center border px-2 ${
                        data?.result?.result === 'competent'
                          ? 'bg-green-600'
                          : data?.result?.result === 'notCompetent'
                          ? 'bg-red-500'
                          : null
                      }`}
                    >
                      <Typography variant={'small'} color={'text-white'}>
                        {checkStatus(data?.result?.result)}
                      </Typography>
                    </div>
                  ) : course.status === 'Completed' ? (
                    <div
                      className={`rounded whitespace-nowrap text-center border px-2 ${
                        data?.result?.result === 'competent'
                          ? 'bg-green-600'
                          : data?.result?.result === 'notCompetent'
                          ? 'bg-red-500'
                          : null
                      }`}
                    >
                      <Typography variant={'small'} color={'text-white'}>
                        {checkStatus(data?.result?.result)}
                      </Typography>
                    </div>
                  ) : null}
                </div>
                <Typography variant={'small'} color={'text-gray-800'}>
                  {course.courseName}
                </Typography>
              </div>
            ))}

           
          </div>
        </div>
      </div> */}
        </div>
    )
}
