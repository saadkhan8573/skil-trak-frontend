import { RtoV2Api } from '@queries'
import { Course, Student } from '@types'
import { useMemo, useState } from 'react'
import { CourseOverview } from '../StudentOverview'
import { DocumentFilter, DocumentHeader } from './components'
import { FolderSection } from './components/FolderSection'
import { useAppSelector } from '@redux/hooks'
import { LoadingAnimation, NoData } from '@components'

interface DocumentsProps {
    student: Student
}

import { StudentDocumentsTabSkeleton } from '../../skeletonLoader'

export function StudentAssessmentDocuments({ student }: DocumentsProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [selectedView, setSelectedView] = useState<
        'all' | 'industry' | 'course'
    >('all')

    const selectedCourse = useAppSelector(
        (state) => state.student.selectedCourse
    )

    const count = RtoV2Api.StudentDocuments.getStudentDocumentsCount({
        studentId: student.id,
        courseId: selectedCourse?.id ?? 0,
    })

    const documents = RtoV2Api.StudentDocuments.getStudentDocumentsList(
        {
            // search: `${filterKey}:true`,
            studentId: student.id,
            courseId: selectedCourse?.id ?? 0,
        },
        {
            skip: !student.id || !selectedCourse?.id,
        }
    )

    const industryStats = {
        pending: count?.data?.pendingIndustryCheck,
        approved: count?.data?.approvedDocuments,
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

    const industryDocuments = getIndustryDocuments(true)
    const courseDocuments = getIndustryDocuments(false)

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
            filterKey: 'courseDocument',
            type: 'course' as const,
            title: 'Course Documents',
            documents: courseDocuments,
            description: 'Placement records, assessments, and course materials',
            stats: courseStats,
        },
    ]

    return (
        <div className="space-y-4">
            {/* Hero Section with Quick Stats */}
            <CourseOverview />

            <DocumentHeader count={count} />

            {/* Search and Filter Bar */}
            <DocumentFilter
                selectedView={selectedView}
                setSearchQuery={setSearchQuery}
                setSelectedView={setSelectedView}
                setStatusFilter={setStatusFilter}
            />

            {documents.isError && (
                <NoData text={'There is some technical issue!'} isError />
            )}
            {documents.isLoading || documents.isFetching ? (
                <StudentDocumentsTabSkeleton />
            ) : (
                documents?.isSuccess &&
                sections.map((section) => {
                    const shouldRender =
                        selectedView === 'all' || selectedView === section.type
                    return (
                        shouldRender && (
                            <FolderSection
                                key={section.type}
                                course={selectedCourse ?? ({ id: 0 } as Course)}
                                title={section.title}
                                description={section.description}
                                stats={section.stats}
                                sectionType={section.type}
                                filterKey={section.filterKey}
                                documents={section?.documents ?? []}
                                student={student}
                            />
                        )
                    )
                })
            )}


        </div>
    )
}
