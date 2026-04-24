import { Button, NoData, ShowErrorNotifications } from '@components'
import { RtoV2Api, SubAdminApi } from '@queries'
import { useAppSelector } from '@redux/hooks'
import { AssessmentEvidenceFolder, Course, Student } from '@types'
import { useEffect, useMemo, useState } from 'react'
import { CourseOverview } from '../StudentOverview'
import { DocumentFilter, DocumentHeader } from './components'
import { FolderSection } from './components/FolderSection'

interface DocumentsProps {
    student: Student
}

import { Result } from '@constants'
import { useNotification, useSubadminProfile } from '@hooks'
import { getCourseResult, removeEmptyValues } from '@utils'
import { StudentDocumentsTabSkeleton } from '../../skeletonLoader'
import { CourseResultModule, SubmitAssessmentSubmission } from './components'

export function StudentAssessmentDocuments({ student }: DocumentsProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const subadmin = useSubadminProfile()
    const [selectedView, setSelectedView] = useState<
        'all' | 'industry' | 'course'
    >('all')
    const { notification } = useNotification()
    const selectedCourse = useAppSelector(
        (state) => state.student.selectedCourse
    )

    const studentWorkplace = SubAdminApi.Student.getWorkplaceForSchedule(
        student?.id,
        {
            skip: !student,
        }
    )

    const appliedIndustry = useMemo(
        () =>
            studentWorkplace?.data
                ?.filter(
                    (wp: any) => wp?.courses?.[0]?.id === selectedCourse?.id
                )
                ?.map((ind: any) => ind?.industries)
                ?.flat()
                ?.map((ind: any) => ind?.industry?.id)
                ?.join(','),
        [studentWorkplace, selectedCourse]
    )

    const count = RtoV2Api.StudentDocuments.getStudentDocumentsCount({
        studentId: student.id,
        courseId: selectedCourse?.id ?? 0,
    })

    const documents = RtoV2Api.StudentDocuments.getStudentDocumentsList(
        removeEmptyValues({
            studentId: student.id,
            courseId: selectedCourse?.id ?? 0,
            industryId: appliedIndustry ? Number(appliedIndustry) : null,
        }),
        {
            skip: !student.id || !selectedCourse?.id,
        }
    )
    const [sendEmailOnIndustryChecks, sendEmailOnIndustryChecksResult] =
        RtoV2Api.StudentDocuments.useSendEmailOnIndustryChecks()

    useEffect(() => {
        if (sendEmailOnIndustryChecksResult.isSuccess) {
            notification.success({
                title: 'Email sent successfully!',
                description: 'The email has been sent to the student.',
            })
        }
    }, [sendEmailOnIndustryChecksResult.isSuccess])

    const industryStats = {
        pending: count?.data?.pendingIndustryCheck,
        approved: count?.data?.approvedIndustryCheck,
    }

    const courseStats = {
        approved: count?.data?.approvedCourseDocuments,
        pending: count?.data?.pendingCourseDocuments,
    }

    const getIndustryDocuments = useMemo(
        () => (checkIndustryCheck: boolean) => {
            return documents?.data?.filter(
                (document: any) =>
                    document?.isIndustryCheck === checkIndustryCheck
            )
        },
        [documents]
    )
    const getIndustryOtherDocuments = useMemo(
        () => () => {
            return documents?.data?.filter((document) => document?.isOtherDoc)
        },
        [documents]
    )

    const industryDocuments = getIndustryDocuments(true)
    const courseDocuments = getIndustryDocuments(false)
    const industryCustomRequiredDocuments = getIndustryOtherDocuments()

    const result = useMemo(
        () => getCourseResult(selectedCourse?.results),
        [selectedCourse?.results]
    )

    const allCommentsAdded = useMemo(
        () =>
            documents?.data
                ?.filter(
                    (folder) => !folder?.isIndustryCheck && !folder?.isCustom
                )
                ?.every((f) => f?.studentResponse[0]?.comment),
        [documents?.data]
    )

    const isFilesUploaded = useMemo(
        () =>
            !documents.isLoading &&
            !documents.isFetching &&
            documents.isSuccess &&
            courseDocuments &&
            courseDocuments?.length > 0 &&
            courseDocuments?.every(
                (f: AssessmentEvidenceFolder) =>
                    f?.studentResponse[0]?.files?.length > 0
            ),
        [documents, courseDocuments]
    )

    const files = useMemo(
        () =>
            courseDocuments
                ?.map(
                    (f: AssessmentEvidenceFolder) =>
                        f?.studentResponse?.[0]?.files?.length > 0
                )
                ?.filter((f: any) => f)?.length,
        [courseDocuments]
    )

    const rejectedFolders = useMemo(
        () =>
            courseDocuments?.filter(
                (f: AssessmentEvidenceFolder) =>
                    f?.studentResponse?.[0]?.status === 'rejected' &&
                    f?.studentResponse?.[0]?.files?.length > 0
            )?.length,
        [courseDocuments]
    )

    const allFiles = useMemo(
        () =>
            courseDocuments
                ?.filter(
                    (f: AssessmentEvidenceFolder) =>
                        f?.studentResponse?.[0]?.status === 'rejected'
                )
                ?.every(
                    (f: AssessmentEvidenceFolder) =>
                        f?.studentResponse?.[0]?.files?.length > 0
                ),
        [courseDocuments]
    )

    const resubmitFiles = useMemo(
        () =>
            courseDocuments?.filter(
                (f: AssessmentEvidenceFolder) =>
                    f?.studentResponse?.[0]?.reSubmitted &&
                    f?.studentResponse?.[0]?.files?.length > 0
            )?.length,
        [courseDocuments]
    )

    const isAllApproved = useMemo(
        () =>
            courseDocuments &&
            courseDocuments?.length > 0 &&
            courseDocuments?.every(
                (f) => f?.studentResponse[0]?.status === 'approved'
            ),
        [courseDocuments]
    )

    const isResubmittedFiles = useMemo(
        () =>
            (!documents.isLoading &&
                !documents.isFetching &&
                documents.isSuccess &&
                rejectedFolders &&
                allFiles &&
                resubmitFiles &&
                rejectedFolders === resubmitFiles &&
                Number(files) > 0) as boolean,
        [documents, rejectedFolders, allFiles, resubmitFiles, files]
    )

    const shouldShowSubmitButton = useMemo(() => {
        if (!documents.isSuccess || !selectedCourse) return false

        if (selectedCourse?.results?.length > 0) {
            if (result?.totalSubmission < 3) {
                return (
                    (result?.result === Result.ReOpened ||
                        result?.result === Result.NotCompetent ||
                        allCommentsAdded) &&
                    result?.result !== Result.Competent &&
                    !result?.isSubmitted
                )
            } else {
                return (
                    !documents.isLoading &&
                    !documents.isFetching &&
                    documents.isSuccess &&
                    result?.isManualSubmission &&
                    allCommentsAdded
                )
            }
        } else {
            return (
                !documents.isLoading &&
                !documents.isFetching &&
                documents.isSuccess &&
                allCommentsAdded
            )
        }
    }, [documents, selectedCourse, result])

    // Section configuration array
    const sections = [
        {
            type: 'industry' as const,
            title: 'Industry Checks & Clearances',
            description: 'Required compliance documents',
            stats: industryStats,
            documents: industryDocuments,
            filterKey: 'industryCheck',
        },
        {
            filterKey: 'industryCustomDocument',
            type: 'industryCustom' as const,
            title: 'Industry Custom Required Documents',
            documents: industryCustomRequiredDocuments,
            description: 'Industry custom required documents',
            // stats: courseStats,
        },
        {
            filterKey: 'courseDocument',
            type: 'course' as const,
            title: 'Course Documents',
            documents: courseDocuments,
            description: 'Placement records, assessments, and course materials',
            stats: courseStats,
        },
    ]
    const currentStatus = studentWorkplace?.data?.[0]?.currentStatus

    const hasValidDocs = [industryDocuments, industryCustomRequiredDocuments]
        ?.flat()
        ?.some(
            (doc) => doc?.studentResponse && doc?.studentResponse?.length > 0
        )
    const blockedStatuses = [
        'awaitingAgreementSigned',
        'AgreementSigned',
        'placementStarted',
        'cancelled',
        'completed',
        'noResponse',
        'rejected',
        'terminated',
    ]
    const isBlocked = currentStatus && blockedStatuses.includes(currentStatus)

    const isAnyDocument = hasValidDocs && !isBlocked

    const onSendEmail = () => {
        sendEmailOnIndustryChecks({
            stdId: student.id,
            cId: selectedCourse?.id ?? 0,
        })
    }
    console.log('studentWorkplace', studentWorkplace?.data?.[0]?.currentStatus)
    // WorkplaceCurrentStatus
    return (
        <>
            <ShowErrorNotifications result={sendEmailOnIndustryChecksResult} />
            <div className="space-y-4">
                {/* Hero Section with Quick Stats */}
                <CourseOverview />

                <DocumentHeader count={count} result={result} />

                {/* Search and Filter Bar */}
                <DocumentFilter
                    selectedView={selectedView}
                    setSearchQuery={setSearchQuery}
                    setSelectedView={setSelectedView}
                    setStatusFilter={setStatusFilter}
                    onSendEmail={onSendEmail}
                    sendEmailOnIndustryChecksResult={
                        sendEmailOnIndustryChecksResult
                    }
                    isAnyDocument={isAnyDocument}
                />

                {documents.isError && (
                    <NoData text={'There is some technical issue!'} isError />
                )}
                {documents.isLoading ? (
                    <StudentDocumentsTabSkeleton />
                ) : (
                    <>
                        {documents?.isSuccess &&
                            sections.map((section) => {
                                const shouldRender =
                                    selectedView === 'all' ||
                                    selectedView === section.type
                                return (
                                    shouldRender &&
                                    section?.documents &&
                                    section?.documents?.length > 0 && (
                                        <FolderSection
                                            key={section.type}
                                            course={
                                                selectedCourse ??
                                                ({ id: 0 } as Course)
                                            }
                                            title={section.title}
                                            description={section.description}
                                            stats={section.stats}
                                            sectionType={section.type}
                                            filterKey={section.filterKey}
                                            documents={section?.documents}
                                            student={student}
                                        />
                                    )
                                )
                            })}
                    </>
                )}

                {/* <ManualAssessmentSubmission
                result={result}
                totalResultsCount={selectedCourse?.results?.length}
            /> */}

                <div className="pt-8 space-y-4">
                    {shouldShowSubmitButton && (
                        <div className="flex justify-center items-center">
                            <SubmitAssessmentSubmission
                                results={selectedCourse?.results}
                                selectedCourseId={Number(selectedCourse?.id)}
                                student={student}
                                isFilesUploaded={isFilesUploaded}
                                isResubmittedFiles={isResubmittedFiles}
                                isAllApproved={isAllApproved}
                            />
                        </div>
                    )}
                    {selectedCourse?.results &&
                        selectedCourse?.results?.length > 0 && (
                            <CourseResultModule
                                student={student}
                                selectedCourse={selectedCourse}
                                result={result}
                                allCommentsAdded={!!allCommentsAdded}
                                subadmin={subadmin}
                                getFolders={documents}
                            />
                        )}
                </div>
            </div>
        </>
    )
}
