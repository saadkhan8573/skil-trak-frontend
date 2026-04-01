import { UserStatus } from '@types'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

// Icons

// colors
import { getThemeColors } from '@theme'

// components
import {
    AssessmentCourse,
    Button,
    Card,
    DownloadableFile,
    LoadingAnimation,
    NoData,
    ShowErrorNotifications,
    Typography,
} from '@components'
import { useContextBar, useJoyRide, useNotification } from '@hooks'
import {
    RtoApi,
    useGetAssessmentToolByCourseQuery,
    useRemoveRTOAssessmentToolsMutation,
    useUpdateAssessmentToolArchiveMutation,
} from '@queries'
import { MdDelete } from 'react-icons/md'
import { PulseLoader } from 'react-spinners'
import { AddAssessmentForm } from './form'
// import {AssessmentCourse} from

export const AssessmentsToolsContainer = () => {
    const router = useRouter()
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(
        null
    )

    const { notification } = useNotification()

    const contextBar = useContextBar()

    const rtoCourses = RtoApi.Courses.useRtoCourses()
    const getAssessmentTools = useGetAssessmentToolByCourseQuery(
        {
            id: Number(selectedCourseId),
            status: UserStatus.Approved,
        },
        { skip: !selectedCourseId }
    )
    const [archiveAssessmentTool] = useUpdateAssessmentToolArchiveMutation()
    const [remove, removeResult] = useRemoveRTOAssessmentToolsMutation()

    const onAddAssessment = () => {
        contextBar.setTitle('Add Assessment')
        contextBar.setContent(<AddAssessmentForm courses={rtoCourses} />)
        contextBar.show()
    }
    useEffect(() => {
        if (rtoCourses.isSuccess) {
            setSelectedCourseId(
                selectedCourseId
                    ? rtoCourses?.data?.find(
                          (c: any) => c?.id === selectedCourseId
                      )?.id
                    : rtoCourses?.data[0]?.id
            )
        }
    }, [rtoCourses])

    //  ADD ASSESSMENT JOY RIDE
    const joyride = useJoyRide()
    useEffect(() => {
        if (joyride.state.tourActive) {
            setTimeout(() => {
                joyride.setState({ ...joyride.state, run: true, stepIndex: 2 })
            }, 1200)
        }
    }, [])

    useEffect(() => {
        if (removeResult.isSuccess) {
            notification.error({
                title: 'Assessment Deleted',
                description: 'Assessment Deleted Successfully',
            })
        }
    }, [removeResult])

    //  ADD ASSESSMENT JOY RIDE - END
    //  ADD ASSESSMENT JOY RIDE

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
                        Archive
                    </Typography>
                </div>
                {removeResult.isLoading &&
                removeResult?.originalArgs === assessment?.id ? (
                    <PulseLoader
                        size={4}
                        color={getThemeColors()?.error?.DEFAULT}
                    />
                ) : (
                    <div
                        onClick={() => {
                            remove(assessment?.id)
                        }}
                    >
                        <MdDelete className="text-red-400 cursor-pointer" />
                    </div>
                )}
            </div>
        )
    }
    return (
        <div>
            <ShowErrorNotifications result={removeResult} />

            <Card noPadding>
                <div className="flex">
                    <div className="w-[25%] border-r">
                        <div className={`p-3.5`}>
                            <Typography variant="label" color="text-black">
                                Select a Course
                            </Typography>
                        </div>

                        <div className="max-h-96 overflow-auto remove-scrollbar">
                            {rtoCourses?.isLoading || rtoCourses?.isFetching ? (
                                <LoadingAnimation size={85} />
                            ) : rtoCourses?.data &&
                              rtoCourses?.data?.length > 0 ? (
                                rtoCourses?.data?.map((course: any) => (
                                    <AssessmentCourse
                                        code={course?.code}
                                        name={course?.title}
                                        id={course.id}
                                        onClick={() =>
                                            setSelectedCourseId(course?.id)
                                        }
                                        selectedCourseId={selectedCourseId}
                                    />
                                ))
                            ) : (
                                <NoData text={'No Courses were Found'} />
                            )}
                        </div>
                    </div>
                    <div className="w-[75%]">
                        <div className="flex justify-end gap-x-2.5 p-4">
                            <div id="add-assessments">
                                <Button
                                    variant="primary"
                                    text="ADD ASSESSMENT"
                                    onClick={() => {
                                        onAddAssessment()
                                    }}
                                />
                            </div>
                            <Button
                                variant="dark"
                                text="VIEW ARCHIVED"
                                onClick={() => {
                                    router.push(
                                        `/portals/rto/tasks/assessment-tools/view-archived`
                                    )
                                }}
                            />
                        </div>

                        <div className={`border-b border-t p-4`}>
                            <div className="flex justify-between">
                                <Typography variant="label" color="text-black">
                                    Description
                                </Typography>
                                <Typography variant="label" color="text-black">
                                    Action
                                </Typography>
                            </div>
                        </div>
                        <div className="p-2 min-h-[260px]">
                            {getAssessmentTools?.isLoading ||
                            getAssessmentTools?.isFetching ? (
                                <LoadingAnimation size={80} />
                            ) : getAssessmentTools?.data &&
                              getAssessmentTools?.data?.length > 0 ? (
                                getAssessmentTools?.data?.map(
                                    (assessment: any) => (
                                        <DownloadableFile
                                            actions={() => actions(assessment)}
                                            key={assessment?.id}
                                            name={assessment?.title}
                                            archivedView={false}
                                        />
                                    )
                                )
                            ) : (
                                <NoData
                                    text={'No Assessment tools were found'}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}
