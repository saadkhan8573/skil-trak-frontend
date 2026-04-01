import { ReactElement, useEffect, useMemo, useState } from 'react'

import { Desktop, Mobile, PageTitle } from '@components'
import { StudentLayout } from '@layouts'
import { NextPageWithLayout } from '@types'

// query
import { MediaQueries } from '@constants'
import { DesktopAssessment, MobileAssessment } from '@partials/student'
import {
    useGetAssessmentsCoursesQuery,
    useGetAssessmentsFoldersQuery,
    useGetWorkplaceIndustriesQuery,
} from '@queries'
import { getCourseResult } from '@utils'
import { useMediaQuery } from 'react-responsive'

type Props = {}

const AssessmentEvidence: NextPageWithLayout = (props: Props) => {
    const isMobile = useMediaQuery(MediaQueries.Mobile)

    const [selectedCourse, setSelectedCourse] = useState<any | null>(null)
    const [selectedFolder, setSelectedFolder] = useState<any | null>(null)

    const result = getCourseResult(selectedCourse?.results)

    // query
    const assessmentsCourses = useGetAssessmentsCoursesQuery(undefined, {
        refetchOnMountOrArgChange: true,
    })
    const workplace = useGetWorkplaceIndustriesQuery()

    const appliedIndustry = useMemo(
        () =>
            workplace?.data
                ?.filter(
                    (wp: any) => wp?.courses?.[0]?.id === selectedCourse?.id
                )
                ?.map((ind: any) => ind?.industries)
                ?.flat()
                ?.map((ind: any) => ind?.industry?.id)
                ?.join(','),
        [workplace, selectedCourse]
    )

    const assessmentsFolders = useGetAssessmentsFoldersQuery(
        { id: selectedCourse?.id, indId: appliedIndustry },
        {
            skip: !selectedCourse,
        }
    )

    useEffect(() => {
        if (assessmentsCourses.isSuccess) {
            setSelectedCourse(
                selectedCourse
                    ? assessmentsCourses?.data?.find(
                          (c) => c?.id === selectedCourse?.id
                      )
                    : assessmentsCourses?.data[0]
            )
        }
    }, [assessmentsCourses])

    useEffect(() => {
        if (assessmentsFolders.isSuccess) {
            !isMobile && setSelectedFolder(assessmentsFolders?.data[0])
        }
    }, [assessmentsFolders])

    const isFilesUploaded =
        !assessmentsFolders.isLoading &&
        !assessmentsFolders.isFetching &&
        assessmentsFolders.isSuccess &&
        assessmentsFolders?.data?.assessmentEvidence?.every(
            (f: any) => f?.studentResponse[0]?.files?.length > 0
        )

    return (
        <>
            {/* <AssessmentsEvidence /> */}
            <div className="mb-4">
                <PageTitle title="Assessment Evidence" backTitle="Assessment" />
            </div>
            {/* <TitleAndMessages result={result} /> */}
            <Desktop>
                <DesktopAssessment
                    result={result}
                    selectedFolder={selectedFolder}
                    selectedCourse={selectedCourse}
                    setSelectedCourse={setSelectedCourse}
                    setSelectedFolder={setSelectedFolder}
                    assessmentsCourses={assessmentsCourses}
                    isFilesUploaded={isFilesUploaded}
                    results={selectedCourse?.results}
                    assessmentsFolders={{
                        ...assessmentsFolders,
                        data:
                            assessmentsFolders?.data?.assessmentEvidence ||
                            assessmentsFolders?.data,
                    }}
                    otherDocs={
                        assessmentsFolders?.data?.otherDocs?.map(
                            (othDoc: any) => ({
                                ...othDoc,
                                otherDoc: true,
                            })
                        ) || []
                    }
                />
            </Desktop>
            <Mobile>
                <MobileAssessment
                    result={result}
                    selectedFolder={selectedFolder}
                    selectedCourse={selectedCourse}
                    setSelectedCourse={setSelectedCourse}
                    setSelectedFolder={setSelectedFolder}
                    assessmentsFolders={{
                        ...assessmentsFolders,
                        data:
                            assessmentsFolders?.data?.assessmentEvidence ||
                            assessmentsFolders?.data,
                    }}
                    assessmentsCourses={assessmentsCourses}
                    isFilesUploaded={isFilesUploaded}
                    otherDocs={
                        assessmentsFolders?.data?.otherDocs?.map(
                            (othDoc: any) => ({
                                ...othDoc,
                                otherDoc: true,
                            })
                        ) || []
                    }
                />
            </Mobile>
        </>
    )
}
AssessmentEvidence.getLayout = (page: ReactElement) => {
    return <StudentLayout>{page}</StudentLayout>
}

export default AssessmentEvidence
