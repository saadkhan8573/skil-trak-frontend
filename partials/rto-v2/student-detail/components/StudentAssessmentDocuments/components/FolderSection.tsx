import { NoData } from '@components'
import { AssessmentEvidenceFolder, Course, Folder, Student } from '@types'
import { FolderCard, FolderHeaderCard } from '../cards'
import { getStatusConfig } from '../utils/getStatusConfig'

interface FolderSectionProps {
    title: string
    description: string
    stats: any
    sectionType: 'industry' | 'course' | 'industryCustom'
    student: Student

    course: Course
    filterKey: string
    documents: AssessmentEvidenceFolder[]
}

export const FolderSection = ({
    course,
    title,
    stats,
    filterKey,
    documents,
    sectionType,
    description,
    student,
}: FolderSectionProps) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <FolderHeaderCard
                title={title}
                description={description}
                courseStats={stats}
            />

            {documents && documents?.length > 0 ? (
                <div
                    className={`p-3 space-y-${sectionType === 'industry' ? '3' : '2'
                        }`}
                >
                    {documents?.map((folder: AssessmentEvidenceFolder) => {
                        const config = getStatusConfig(
                            folder?.studentResponse?.[0]?.status
                        )

                        return (
                            <FolderCard
                                key={folder.id}
                                folder={folder}
                                config={config}
                                course={course}
                                student={student}
                            />
                        )
                    })}
                </div>
            ) : (
                <NoData text="There is no document list" />
            )}

            {/* {documents.isError && (
                <NoData text={'There is some technical issue!'} isError />
            )}
            {documents.isLoading || documents.isFetching ? (
                <div className="min-h-[inherit] flex justify-center items-center">
                    <LoadingAnimation />
                </div>
            ) : documents?.isSuccess &&
              documents.data &&
              documents?.data?.length > 0 ? (
                <div
                    className={`p-3 space-y-${
                        sectionType === 'industry' ? '3' : '2'
                    }`}
                >
                    {documents?.data?.map((folder: Folder) => {
                        const config = getStatusConfig(
                            folder?.studentResponse?.[0]?.status
                        )

                        return (
                            <FolderCard
                                key={folder.id}
                                folder={folder}
                                config={config}
                            />
                        )
                    })}
                </div>
            ) : (
                documents.isSuccess && (
                    <NoData text="There is no document list" />
                )
            )} */}
        </div>
    )
}
