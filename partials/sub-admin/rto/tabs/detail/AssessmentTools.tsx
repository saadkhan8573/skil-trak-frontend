import { useEffect, useState } from 'react'

// components
import {
    Button,
    Card,
    EmptyData,
    LoadingAnimation,
    Typography,
} from '@components'
import {
    AssessmentCourse,
    DownloadableFile,
} from '@components/AssessmentsTools'

// query
import { useContextBar } from '@hooks'
import { useGetRTOAssessmentToolsQuery } from '@queries'
import { UserStatus } from '@types'
import Link from 'next/link'
import { AddAssessmentToolCB } from '../../contextBar'

export const AssessmentTools = ({
    id,
    rto,
    courses,
    actions,
    setAssessmentView,
}: any) => {
    const contextBar = useContextBar()
    const [selectedCourseId, setSelectedCourseId] = useState<any | null>(null)
    const getAssessmentTools = useGetRTOAssessmentToolsQuery(
        {
            id: Number(selectedCourseId),
            rtoId: rto.id,
            status: UserStatus.Approved,
        },
        { skip: !selectedCourseId }
    )

    useEffect(() => {
        setSelectedCourseId(selectedCourseId || courses[0]?.id)
    }, [courses])
    const onAddAssessment = () => {
        contextBar.setTitle('Add Assessment')
        contextBar.setContent(<AddAssessmentToolCB edit={false} />)
        contextBar.show()
    }
    return courses && courses?.length > 0 ? (
        <div>
            <div className="mb-2">
                <Typography variant="muted" color="text-gray-400">
                    *You can access all your assessment tools by clicking on
                    download button for your placement unit you are currently
                    enrolled in.
                </Typography>
            </div>
            <Card noPadding>
                <div className="flex">
                    <div className="w-[25%] border-r h-[450px] overflow-auto custom-scrollbar">
                        <div className={`p-3.5`}>
                            <Typography variant="label" color="text-black">
                                Select a Course
                            </Typography>
                        </div>
                        {courses?.map((course: any, index: any) => (
                            <>
                                <AssessmentCourse
                                    code={course?.code}
                                    name={course?.title}
                                    id={course?.id}
                                    onClick={() =>
                                        setSelectedCourseId(course?.id)
                                    }
                                    selectedCourseId={selectedCourseId}
                                />
                            </>
                        ))}
                        {/* <AssessmentCourse
                            code={'-'}
                            name={'Miscellaneous'}
                            id={-1}
                            onClick={() => setSelectedCourseId(-1)}
                            selectedCourseId={selectedCourseId} 
                        />*/}
                    </div>
                    <div className="w-[75%]">
                        <div className="flex justify-end gap-x-2.5 p-4">
                            <Button
                                variant="primary"
                                text="ADD ASSESSMENT"
                                onClick={() => {
                                    onAddAssessment()
                                }}
                            />
                            <Button
                                variant="dark"
                                text="VIEW ARCHIVED"
                                onClick={() => {
                                    setAssessmentView('archived')
                                }}
                            />
                        </div>

                        {getAssessmentTools?.data && (
                            <div className={`border-b border-t p-4`}>
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
                                        Action
                                    </Typography>
                                </div>
                            </div>
                        )}
                        <div className="p-2 h-80 overflow-auto custom-scrollbar">
                            {getAssessmentTools?.isLoading ||
                            getAssessmentTools?.isFetching ? (
                                <LoadingAnimation size={70} />
                            ) : getAssessmentTools?.data &&
                              getAssessmentTools?.data?.length > 0 ? (
                                getAssessmentTools?.data?.map((tools: any) => (
                                    <DownloadableFile
                                        key={tools.id}
                                        actions={() => actions(tools)}
                                        name={tools?.title}
                                        archivedView={false}
                                    />
                                ))
                            ) : (
                                <EmptyData />
                            )}
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
        </div>
    ) : (
        <EmptyData />
    );
}
