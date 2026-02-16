import {
    AssessmentCourse,
    DownloadableFile,
} from '@components/AssessmentsTools'
import { Button } from '@components/buttons'
import { Card } from '@components/cards'
import { Typography } from '@components/Typography'
import {
    useGetAssessmentToolQuery,
    useGetAssessmentToolDetailQuery,
} from '@queries'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

type ArchivedViewProps = {
    role: 'RTO' | 'Student'
    actions?: any
}

export const ArchivedView = ({ role, actions }: ArchivedViewProps) => {
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(
        null
    )
    const router = useRouter()
    const { data: assessmentToolDetail, isLoading: isLoadingDetail } =
        useGetAssessmentToolDetailQuery(selectedCourseId)
    const { data, isLoading, isError } = useGetAssessmentToolQuery('approved')

    return (
        <>
            <div className="mb-2">
                <Typography variant="muted" color="text-gray-400">
                    *You can access all your assessment tools by clicking on
                    download button for your placement unit you are currently
                    enrolled in.
                </Typography>
            </div>
            <Card noPadding>
                <div className="flex">
                    <div className="w-[25%] border-r">
                        <div className={`p-3.5`}>
                            <Typography variant="label" color="text-black">
                                Select a Course
                            </Typography>
                        </div>
                        {data?.map((course: any, index: any) => (
                            <>
                                <AssessmentCourse
                                    code={course.course.code}
                                    name={course.course.title}
                                    id={course.id}
                                    onClick={() =>
                                        setSelectedCourseId(course.id)
                                    }
                                    selectedCourseId={selectedCourseId}
                                />
                            </>
                        ))}
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
                                                '/portals/rto/tasks/assessment-tools/view-archived'
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
                            <div className="border-2 border-blue-600">
                                <div
                                    className={`${role === 'RTO'
                                            ? 'border-b border-t'
                                            : 'border-b'
                                        } p-4`}
                                >
                                    <div className="flex justify-between">
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
                                        <Typography
                                            variant="label"
                                            color="text-black"
                                        >
                                            Action
                                        </Typography>
                                    </div>
                                </div>
                                <div className="p-2 min-h-[260px]">
                                    <DownloadableFile
                                        actions={() =>
                                            actions(
                                                assessmentToolDetail?.course.id
                                            )
                                        }
                                        key={assessmentToolDetail?.id}
                                        name={
                                            assessmentToolDetail?.course?.title
                                        }
                                        archivedView={false}
                                    />
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
