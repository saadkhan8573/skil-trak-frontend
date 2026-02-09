import { marked } from 'marked'
import { useMemo } from 'react'
import { ellipsisText } from '@utils'
import { UserRoles } from '@constants'
import { SubAdminApi } from '@queries'
import { useNotification } from '@hooks'
import { IoCheckmarkDoneOutline } from 'react-icons/io5'
import {
    ActionButton,
    AuthorizedUserComponent,
    Button,
    Tooltip,
    Typography,
} from '@components'

import {
    AddContentForOldIndustry,
    AddHodNote,
    DeleteIndustryCourse,
    EditIndustryCourseContent,
    IndustryCourseSupervisors,
    UploadCourseFile,
    AddCourseProgramIndustry,
} from '../components'
import {
    getCleanExternalUrl,
    groupCoursesBySector,
    groupDirectCoursesBySector,
    isValidUrl,
} from '../functions'
import Modal from '@modals/Modal'
import {
    ApproveCourseModal,
    RejectCourseModal,
    Status,
} from '@partials/sub-admin'
import { MdCancel } from 'react-icons/md'
import { FaCircleCheck } from 'react-icons/fa6'

export const CourseCard = ({
    data,
    industry,
    isPending = false,
    isPreviousCourses = false,
}: any) => {
    const approvals = useMemo(
        () =>
            isPreviousCourses
                ? data?.courses || []
                : data?.industryCourseApprovals || [],
        [data, isPreviousCourses]
    )
    const { notification } = useNotification()

    const [confirmContent, confirmContentResult] =
        SubAdminApi.Industry.useConfirmCourseDescription()

    const onConfirmContent = (courseId: string) => {
        confirmContent(courseId).then((res: any) => {
            if (res.data) {
                notification.success({
                    title: 'Content Confirmed',
                    description:
                        'Course content has been confirmed successfully.',
                })
            } else {
                notification.error({
                    title: 'Error',
                    description:
                        res?.error?.data?.message || 'Something went wrong',
                })
            }
        })
    }

    // Execute the grouping
    const sectorsData = groupCoursesBySector(approvals)

    const groupedCourseData = groupDirectCoursesBySector(approvals)

    const allSectors = isPreviousCourses ? groupedCourseData : sectorsData

    return (
        <div className="flex flex-col gap-y-2">
            {allSectors?.map((sectorData: any) => (
                <div
                    key={sectorData?.sector?.id}
                    className="flex flex-col shadow mt-4 bg-gray-100 p-2 rounded border-2 border-dashed border-gray-400"
                >
                    <div className="p-4 bg-gray-50 flex items-center gap-x-2 justify-between">
                        <div className="flex items-center gap-x-2">
                            <Typography variant="subtitle">
                                {sectorData?.sector?.name}
                            </Typography>
                            {!isPreviousCourses && !isPending && (
                                <span className="px-2 py-0.5 bg-green-100 border border-green-200 text-[#2d5a2d] rounded-full text-[9px] font-medium">
                                    Approved
                                </span>
                            )}
                            <AuthorizedUserComponent
                                roles={[UserRoles.ADMIN, UserRoles.SUBADMIN]}
                            >
                                {!isPreviousCourses && sectorData?.actionBy && (
                                    <div className="flex gap-x-1 bg-green-100 border border-green-200 rounded-full px-2 py-0.5">
                                        <Typography
                                            variant="xxs"
                                            color="text-[#2d5a2d]"
                                        >
                                            Approved by:{' '}
                                            {ellipsisText(
                                                sectorData?.actionBy?.name,
                                                11
                                            )}
                                        </Typography>
                                    </div>
                                )}
                            </AuthorizedUserComponent>
                        </div>
                        <IndustryCourseSupervisors
                            industry={industry}
                            sectorData={sectorData}
                        />
                    </div>

                    <div className="flex flex-col gap-y-3">
                        {[...sectorData?.courses]?.map((approval: any) => {
                            const rawText = approval?.description || ''
                            const parsedHtml = String(marked.parse(rawText))
                            return (
                                <div
                                    key={approval.id}
                                    className="overflow-auto custom-scrollbar"
                                >
                                    <div className="border bg-[#95C6FB26] bg-opacity-15">
                                        <div className="px-4 pt-4 flex justify-between gap-x-12 w-full items-center mb-4">
                                            <div className="space-y-2">
                                                <Typography
                                                    variant="small"
                                                    color="text-gray-600"
                                                >
                                                    COURSES -{' '}
                                                </Typography>
                                                <div className="flex items-center gap-x-1">
                                                    <Typography variant="muted">
                                                        {approval?.course
                                                            ?.title ??
                                                            approval?.title}{' '}
                                                        -{' '}
                                                        {approval?.course
                                                            ?.code ??
                                                            approval?.code}
                                                    </Typography>
                                                    {isPending && (
                                                        <div className="">
                                                            <span className="py-0.5 px-2 bg-red-100 border border-red-200 text-red-700 rounded-md text-[10px] font-medium">
                                                                Pending
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="w-fit">
                                                    <Typography
                                                        variant="small"
                                                        color="text-gray-600"
                                                        whiteSpacePre
                                                    >
                                                        Course Hours
                                                    </Typography>
                                                    <Typography variant="muted">
                                                        {approval?.course
                                                            ?.hours ??
                                                            approval?.hours}
                                                    </Typography>
                                                </div>
                                            </div>
                                            <div></div>

                                            <div className="flex flex-col justify-end items-end gap-2">
                                                {!isPreviousCourses && (
                                                    <>
                                                        {!approval?.isContentVerified &&
                                                            !isPending && (
                                                                <AuthorizedUserComponent
                                                                    roles={[
                                                                        UserRoles.ADMIN,
                                                                    ]}
                                                                    isHod
                                                                    isAssociatedWithRto={
                                                                        false
                                                                    }
                                                                >
                                                                    <Button
                                                                        onClick={() => {
                                                                            onConfirmContent(
                                                                                approval?.id
                                                                            )
                                                                        }}
                                                                        text="Confirm"
                                                                        disabled={
                                                                            confirmContentResult.isLoading
                                                                        }
                                                                        loading={
                                                                            confirmContentResult.isLoading
                                                                        }
                                                                        variant="error"
                                                                        outline
                                                                    />
                                                                </AuthorizedUserComponent>
                                                            )}
                                                        <AuthorizedUserComponent
                                                            roles={[
                                                                UserRoles.ADMIN,
                                                            ]}
                                                            isHod
                                                        >
                                                            {isPending && (
                                                                <div className="flex gap-x-1 items-center">
                                                                    <Modal>
                                                                        <Modal.Open opens="approveCourseRequest">
                                                                            <div className="relative group">
                                                                                <ActionButton
                                                                                    disabled={
                                                                                        approval?.status !==
                                                                                        Status.PENDING
                                                                                    }
                                                                                    Icon={
                                                                                        FaCircleCheck
                                                                                    }
                                                                                    variant="success"
                                                                                />
                                                                                <Tooltip>
                                                                                    Approve
                                                                                    Course
                                                                                </Tooltip>
                                                                            </div>
                                                                        </Modal.Open>
                                                                        <Modal.Window name="approveCourseRequest">
                                                                            <ApproveCourseModal
                                                                                request={
                                                                                    approval
                                                                                }
                                                                            />
                                                                        </Modal.Window>
                                                                    </Modal>
                                                                    <Modal>
                                                                        <Modal.Open opens="rejectCourseRequest">
                                                                            <div className="relative group">
                                                                                <ActionButton
                                                                                    disabled={
                                                                                        approval?.status !==
                                                                                        Status.PENDING
                                                                                    }
                                                                                    Icon={
                                                                                        MdCancel
                                                                                    }
                                                                                    variant="error"
                                                                                />
                                                                                <Tooltip>
                                                                                    Reject
                                                                                    Course
                                                                                </Tooltip>
                                                                            </div>
                                                                        </Modal.Open>
                                                                        <Modal.Window name="rejectCourseRequest">
                                                                            <RejectCourseModal
                                                                                request={
                                                                                    approval
                                                                                }
                                                                            />
                                                                        </Modal.Window>
                                                                    </Modal>
                                                                </div>
                                                            )}
                                                        </AuthorizedUserComponent>
                                                        <div className="flex flex-col items-end gap-2">
                                                            {!isPending && (
                                                                <>
                                                                    <UploadCourseFile
                                                                        approval={
                                                                            approval
                                                                        }
                                                                    />
                                                                </>
                                                            )}
                                                            <div className="flex items-end gap-2">
                                                                <EditIndustryCourseContent
                                                                    approval={
                                                                        approval
                                                                    }
                                                                />

                                                                <AuthorizedUserComponent
                                                                    roles={[
                                                                        UserRoles.ADMIN,
                                                                    ]}
                                                                    isHod
                                                                    isAssociatedWithRto={
                                                                        false
                                                                    }
                                                                >
                                                                    <DeleteIndustryCourse
                                                                        approval={
                                                                            approval
                                                                        }
                                                                    />
                                                                </AuthorizedUserComponent>
                                                            </div>{' '}
                                                        </div>
                                                    </>
                                                )}
                                                {!isPreviousCourses && (
                                                    <AddCourseProgramIndustry
                                                        approval={approval}
                                                        industry={industry}
                                                    />
                                                )}
                                                {isPreviousCourses && (
                                                    <AddContentForOldIndustry
                                                        id={approval?.id}
                                                    />
                                                )}
                                            </div>

                                            {!isPreviousCourses &&
                                                !approval?.isPreviousCourse &&
                                                approval?.isCoordinatorAdded && (
                                                    <div>
                                                        <IoCheckmarkDoneOutline
                                                            size={25}
                                                            className="text-emerald-500"
                                                        />
                                                    </div>
                                                )}
                                        </div>

                                        {/*  */}
                                        {approval?.isContentVerified && (
                                            <div className="bg-green-100 px-6 py-2">
                                                <Typography
                                                    medium
                                                    variant={'small'}
                                                    color={'text-green-800'}
                                                >
                                                    Eligibility checklist
                                                    attached
                                                </Typography>
                                            </div>
                                        )}
                                        <div
                                            className={`${isPreviousCourses ||
                                                !approval?.isVerifiedByHod
                                                ? 'bg-red-500'
                                                : isPending
                                                    ? 'bg-indigo-500'
                                                    : 'bg-emerald-700'
                                                } relative text-white p-4 w-full mb-4 flex gap-x-5 items-start max-h-56 overflow-auto custom-scrollbar`}
                                        >
                                            <div>
                                                {/* <Typography variant="label" color="white">
                                        Description
                                    </Typography> */}

                                                <div className="w-full min-w-80">
                                                    <div
                                                        className="w-full customTailwingStyles-inline-style customTailwingStyles text-xs text-white bg-transparent! leading-relaxed"
                                                        dangerouslySetInnerHTML={{
                                                            __html:
                                                                parsedHtml ||
                                                                'No description available',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Hod Note */}
                                        {!isPreviousCourses && (
                                            <AuthorizedUserComponent
                                                roles={[
                                                    UserRoles.ADMIN,
                                                    UserRoles.SUBADMIN,
                                                ]}
                                            >
                                                <AddHodNote
                                                    comment={
                                                        approval?.hodComment
                                                    }
                                                    courseReqId={approval?.id}
                                                />
                                            </AuthorizedUserComponent>
                                        )}

                                        <div className="flex justify-between text-[11px] px-4">
                                            <AuthorizedUserComponent
                                                roles={[
                                                    UserRoles.SUBADMIN,
                                                    UserRoles.ADMIN,
                                                ]}
                                                isAssociatedWithRto={false}
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-[#666] font-semibold ">
                                                        Requested by:{' '}
                                                    </span>
                                                    <span className="text-[#333]">
                                                        {approval?.addedBy
                                                            ?.name || 'N/A'}
                                                    </span>
                                                </div>
                                            </AuthorizedUserComponent>
                                            {/* <div>
                                <span className="text-gray-600">
                                    Reference URL:{' '}
                                </span>
                                <span>{approval?.reference?.[0] || 'N/A'}</span>
                            </div> */}
                                            <div className="flex flex-col">
                                                <span className="text-gray-600 font-semibold">
                                                    Reference URL:{' '}
                                                </span>

                                                {isValidUrl(
                                                    approval?.reference?.[0]
                                                ) ? (
                                                    <a
                                                        href={getCleanExternalUrl(
                                                            approval
                                                                ?.reference?.[0]
                                                        )}
                                                        className="text-blue-500 hover:underline"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {getCleanExternalUrl(
                                                            approval
                                                                ?.reference?.[0]
                                                        ) || 'N/A'}
                                                    </a>
                                                ) : (
                                                    <span>
                                                        {approval
                                                            ?.reference?.[0] ??
                                                            'N/A'}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-gray-600 font-semibold">
                                                    DATE:{' '}
                                                </span>
                                                <span>
                                                    {approval?.updatedAt
                                                        ? approval?.updatedAt?.slice(
                                                            0,
                                                            10
                                                        )
                                                        : 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    )

    return (
        <>
            {/* <ShowErrorNotifications result={confirmContentResult} />  */}
            <div className="flex flex-col gap-4 mt-4">
                {[...approvals]?.map((approval: any) => {
                    const rawText = approval?.description || ''
                    const parsedHtml = String(marked.parse(rawText))
                    return (
                        <div
                            key={approval.id}
                            className="overflow-auto custom-scrollbar"
                        >
                            <div className="p-4 bg-gray-50 flex items-center gap-x-2 justify-between">
                                <div className="flex items-center gap-x-2">
                                    <Typography variant="subtitle">
                                        {approval?.course?.sector?.name ??
                                            approval?.sector?.name}
                                    </Typography>
                                    {!isPreviousCourses && (
                                        <span className="p-1 bg-green-100 border border-green-200 text-green-700 rounded-md text-[9px] font-medium">
                                            Approved
                                        </span>
                                    )}
                                    <AuthorizedUserComponent
                                        roles={[
                                            UserRoles.ADMIN,
                                            UserRoles.SUBADMIN,
                                        ]}
                                    >
                                        {!isPreviousCourses &&
                                            approval?.actionBy && (
                                                <div className="flex gap-x-1">
                                                    <Typography
                                                        variant="xxs"
                                                        color="text-emerald-500"
                                                    >
                                                        Approved by:{' '}
                                                        {ellipsisText(
                                                            approval?.actionBy
                                                                ?.name,
                                                            5
                                                        )}
                                                    </Typography>
                                                </div>
                                            )}
                                    </AuthorizedUserComponent>
                                </div>
                                {/* {!isPreviousCourses && ( */}
                                <div className="flex items-center gap-x-2">
                                    {!isPreviousCourses && (
                                        <>
                                            {!approval?.isContentVerified && (
                                                <AuthorizedUserComponent
                                                    roles={[
                                                        UserRoles.ADMIN,
                                                        UserRoles.SUBADMIN,
                                                    ]}
                                                    isAssociatedWithRto={false}
                                                >
                                                    <Button
                                                        onClick={() => {
                                                            onConfirmContent(
                                                                approval?.id
                                                            )
                                                        }}
                                                        text="Confirm"
                                                        disabled={
                                                            confirmContentResult.isLoading
                                                        }
                                                        loading={
                                                            confirmContentResult.isLoading
                                                        }
                                                        variant="error"
                                                        outline
                                                    />
                                                </AuthorizedUserComponent>
                                            )}
                                            <>
                                                <UploadCourseFile
                                                    approval={approval}
                                                />
                                                <EditIndustryCourseContent
                                                    approval={approval}
                                                />
                                            </>
                                            <DeleteIndustryCourse
                                                approval={approval}
                                            />
                                        </>
                                    )}
                                    {isPreviousCourses && (
                                        <AddContentForOldIndustry
                                            id={approval?.id}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="p-4 border rounded-md bg-[#95C6FB26] bg-opacity-15">
                                <div className="flex justify-between gap-x-12 w-full items-center mb-4">
                                    <div className="flex items-center gap-x-1">
                                        <Typography
                                            variant="small"
                                            color="text-gray-600"
                                        >
                                            COURSES -{' '}
                                        </Typography>

                                        <Typography variant="muted">
                                            {approval?.course?.title ??
                                                approval?.title}{' '}
                                            -{' '}
                                            {approval?.course?.code ??
                                                approval?.code}
                                        </Typography>
                                    </div>
                                    <div>
                                        <div className="text-right">
                                            <Typography
                                                variant="small"
                                                color="text-gray-600"
                                            >
                                                Course Hours
                                            </Typography>
                                            <Typography variant="muted" center>
                                                {approval?.course?.hours ??
                                                    approval?.hours}
                                            </Typography>
                                        </div>
                                    </div>

                                    {!isPreviousCourses &&
                                        !approval?.isPreviousCourse &&
                                        approval?.isCoordinatorAdded && (
                                            <div>
                                                <IoCheckmarkDoneOutline
                                                    size={25}
                                                    className="text-emerald-500"
                                                />
                                            </div>
                                        )}
                                </div>
                                <div
                                    className={`${isPreviousCourses
                                        ? 'bg-red-500'
                                        : approval?.status === 'pending'
                                            ? 'bg-indigo-500'
                                            : 'bg-emerald-700'
                                        } relative text-white p-4 rounded-md w-full mb-4 flex gap-x-5 items-start max-h-56 overflow-auto custom-scrollbar`}
                                >
                                    <div>
                                        {/* <Typography variant="label" color="white">
                                        Description
                                    </Typography> */}

                                        <div className="w-full min-w-80">
                                            <div
                                                className="w-full customTailwingStyles-inline-style customTailwingStyles text-xs text-white bg-transparent! leading-relaxed"
                                                dangerouslySetInnerHTML={{
                                                    __html:
                                                        parsedHtml ||
                                                        'No description available',
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between text-[10px]">
                                    <AuthorizedUserComponent
                                        roles={[
                                            UserRoles.SUBADMIN,
                                            UserRoles.ADMIN,
                                        ]}
                                        isAssociatedWithRto={false}
                                    >
                                        <div>
                                            <span className="text-gray-600">
                                                Requested by:{' '}
                                            </span>
                                            <span>
                                                {approval?.addedBy?.name ||
                                                    'N/A'}
                                            </span>
                                        </div>
                                    </AuthorizedUserComponent>
                                    {/* <div>
                                <span className="text-gray-600">
                                    Reference URL:{' '}
                                </span>
                                <span>{approval?.reference?.[0] || 'N/A'}</span>
                            </div> */}
                                    <div>
                                        <span className="text-gray-600">
                                            Reference URL:{' '}
                                        </span>

                                        {isValidUrl(
                                            approval?.reference?.[0]
                                        ) ? (
                                            <a
                                                href={getCleanExternalUrl(
                                                    approval?.reference?.[0]
                                                )}
                                                className="text-blue-500 hover:underline"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {getCleanExternalUrl(
                                                    approval?.reference?.[0]
                                                ) || 'N/A'}
                                            </a>
                                        ) : (
                                            <span>
                                                {approval?.reference?.[0] ??
                                                    'N/A'}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <span className="text-gray-600">
                                            DATE:{' '}
                                        </span>
                                        <span>
                                            {approval?.updatedAt
                                                ? approval?.updatedAt?.slice(
                                                    0,
                                                    10
                                                )
                                                : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}
