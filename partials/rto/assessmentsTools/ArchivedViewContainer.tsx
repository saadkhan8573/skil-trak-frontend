// Icons
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'

// components
import {
    AssessmentCourse,
    DownloadableFile,
} from '@components/AssessmentsTools'
import { Button } from '@components/buttons'
import {
    Typography,
    NoData,
    Card,
    LoadingAnimation,
    ShowErrorNotifications,
} from '@components'
import { UserStatus } from '@types'
import {
    RtoApi,
    useGetRTOCoursesQuery,
    useGetAssessmentToolByCourseQuery,
    useRemoveRTOAssessmentToolsMutation,
    useUpdateAssessmentToolArchiveMutation,
} from '@queries'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useNotification } from '@hooks'

type ArchivedViewProps = {
    role: 'RTO' | 'Student'
}

export const ArchivedViewContainer = ({ role }: ArchivedViewProps) => {
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(
        null
    )
    const rtoCourses = RtoApi.Courses.useRtoCourses()
    const getAssessmentTools = useGetAssessmentToolByCourseQuery(
        {
            id: Number(selectedCourseId),
            status: UserStatus.Archived,
        },
        { skip: !selectedCourseId }
    )
    const [archiveAssessmentTool, archiveAssessmentToolResult] =
        useUpdateAssessmentToolArchiveMutation()

    const [remove, removeResult] = useRemoveRTOAssessmentToolsMutation()
    const router = useRouter()
    const { notification } = useNotification()

    useEffect(() => {
        if (removeResult.isSuccess) {
            notification.error({
                title: 'Assessment Deleted',
                description: 'Assessment Deleted Successfully',
            })
        }
    }, [removeResult])

    const actions = (assessment: any) => {
        return (
            <div className="flex gap-x-2 ">
                <a href={assessment?.file} target="blank" rel="noreferrer">
                    <Typography variant="tableCell" color="text-blue-600">
                        Download
                    </Typography>
                </a>
                <div
                    className="cursor-pointer"
                    onClick={() => {
                        archiveAssessmentTool(assessment?.id)
                    }}
                >
                    <Typography variant="tableCell" color="text-[#7081A0]">
                        Unarchive
                    </Typography>
                </div>
                {/* <div
                    onClick={() => {
                    }}
                >
                    <FaEdit className="text-[#686DE0] cursor-pointer" />
                </div> */}
                <div
                    onClick={() => {
                        remove(assessment?.id)
                    }}
                >
                    <MdDelete className="text-red-400 cursor-pointer" />
                </div>
            </div>
        )
    }

    return (
        <>
            <ShowErrorNotifications result={removeResult} />
            <div className="mb-2">
                <Typography variant="muted" color="text-gray-400">
                    *You can access all your assessment tools by clicking on
                    download button for your placement unit you are currently
                    enrolled in.
                </Typography>
            </div>
            <Card noPadding>
                <div className="flex">
                    <div className="w-[25%]  border-r">
                        <div className={`p-3.5`}>
                            <Typography variant="label" color="text-black">
                                Select a Course
                            </Typography>
                        </div>
                        <div className="max-h-96 overflow-auto remove-scrollbar">
                            {rtoCourses.isError && (
                                <NoData
                                    text={
                                        'There is some Network issues, Refresh your browser'
                                    }
                                />
                            )}
                            {rtoCourses?.isLoading ? (
                                <LoadingAnimation size={85} />
                            ) : rtoCourses?.data &&
                              rtoCourses?.data?.length > 0 ? (
                                rtoCourses?.data?.map((course: any) => (
                                    <AssessmentCourse
                                        code={course?.code}
                                        name={course?.title}
                                        id={course.id}
                                        onClick={() =>
                                            setSelectedCourseId(course.id)
                                        }
                                        selectedCourseId={selectedCourseId}
                                    />
                                ))
                            ) : (
                                !rtoCourses.isError && (
                                    <NoData text={'No Courses were Found'} />
                                )
                            )}
                        </div>
                    </div>
                    <div className="w-[75%]">
                        {role === 'RTO' && (
                            <>
                                <div className="flex justify-end gap-x-2.5 p-4">
                                    <Button
                                        variant="dark"
                                        text="VIEW CURRENT"
                                        onClick={() => {
                                            router.push(
                                                '/portals/rto/tasks/assessment-tools/'
                                            )
                                        }}
                                    />
                                </div>
                            </>
                        )}
                        <div className="relative">
                            <span className="bg-blue-600 py-1 px-2 absolute -top-2.5 left-7">
                                <Typography variant="muted" color="text-white">
                                    Archived View
                                </Typography>
                            </span>
                            <div className="border-4 border-blue-600">
                                <div
                                    className={`${
                                        role === 'RTO'
                                            ? 'border-b border-t'
                                            : 'border-b'
                                    } p-4`}
                                >
                                    <div className="grid grid-cols-3">
                                        <Typography
                                            variant="label"
                                            color="text-black"
                                        >
                                            Description
                                        </Typography>
                                        <Typography
                                            variant="label"
                                            color="text-black"
                                        >
                                            Archived On
                                        </Typography>
                                        <div className="ml-auto">
                                            <Typography
                                                variant="label"
                                                color="text-black"
                                            >
                                                Action
                                            </Typography>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-2 min-h-[260px]">
                                    {getAssessmentTools.isError && (
                                        <NoData
                                            text={
                                                'There is some Network issues, Refresh your browser'
                                            }
                                        />
                                    )}
                                    {getAssessmentTools?.isLoading ? (
                                        <LoadingAnimation size={80} />
                                    ) : getAssessmentTools?.data &&
                                      getAssessmentTools?.data?.length > 0 ? (
                                        getAssessmentTools?.data?.map(
                                            (assessment: any) => (
                                                <DownloadableFile
                                                    actions={() =>
                                                        actions(assessment)
                                                    }
                                                    key={assessment?.id}
                                                    name={assessment?.title}
                                                    archivedView
                                                />
                                            )
                                        )
                                    ) : (
                                        !getAssessmentTools.isError && (
                                            <NoData
                                                text={
                                                    'No Assessment tools were found'
                                                }
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
            <div className="mt-6">
                <Typography variant="label" color="text-black">
                    What you want to do here?
                </Typography>
            </div>
            <div>
                <Typography variant="label" color="text-blue-500">
                    <Link href="#">
                        I want to access my assessment tool for enrolled course
                    </Link>
                </Typography>
            </div>
        </>
    );
}
