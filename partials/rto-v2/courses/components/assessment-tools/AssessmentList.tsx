import { Button, LoadingAnimation, NoData } from '@components'
import { useNotification, DocumentsView } from '@hooks'
import {
    useGetAssessmentToolByCourseQuery,
    useRemoveRTOAssessmentToolsMutation,
    useUpdateAssessmentToolArchiveMutation,
} from '@queries'
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui/tooltip'
import {
    Download,
    Trash2,
    Archive,
    Loader2,
    Eye,
    RotateCcw,
    BookOpen,
    Building,
    FileText,
} from 'lucide-react'
import React, { useEffect } from 'react'
import { UserStatus } from '@types'

interface AssessmentListProps {
    courseId: number
    status?: string
}

export const AssessmentList = ({
    courseId,
    status = UserStatus.Approved,
}: AssessmentListProps) => {
    const { notification } = useNotification()
    const {
        data: assessments,
        isLoading,
        isFetching,
    } = useGetAssessmentToolByCourseQuery(
        { id: courseId, status: status },
        { skip: !courseId }
    )

    const [archiveAssessment] = useUpdateAssessmentToolArchiveMutation()
    const [
        removeAssessment,
        { isLoading: isDeleting, originalArgs: deletingId },
    ] = useRemoveRTOAssessmentToolsMutation()
    const { onFileClicked, documentsViewModal } = DocumentsView()

    const isArchivedView = status === UserStatus.Archived

    const handleArchive = async (id: number) => {
        try {
            await archiveAssessment(id).unwrap()
            notification.success({
                title: 'Success',
                description: `Assessment ${isArchivedView ? 'unarchived' : 'archived'} successfully`,
            })
        } catch (error) {
            notification.error({
                title: 'Error',
                description: `Failed to ${isArchivedView ? 'unarchive' : 'archive'} assessment`,
            })
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await removeAssessment(id).unwrap()
            notification.success({
                title: 'Success',
                description: 'Assessment deleted successfully',
            })
        } catch (error) {
            notification.error({
                title: 'Error',
                description: 'Failed to delete assessment',
            })
        }
    }

    if (isLoading || isFetching) {
        return <LoadingAnimation size={60} />
    }

    if (!assessments || assessments.length === 0) {
        return <NoData text="No assessment tools found for this course." />
    }

    return (
        <div className="space-y-3 mt-4">
            {assessments.map((assessment: any) => (
                <div
                    key={assessment.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-accent/5 hover:bg-accent/10 transition-colors group"
                >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div
                            className={`p-2 rounded-xl shrink-0 ${
                                assessment.isLogBook
                                    ? 'bg-blue-50 text-blue-600'
                                    : assessment.isIndustryLogBook
                                        ? 'bg-purple-50 text-purple-600'
                                        : 'bg-green-50 text-green-600'
                            }`}
                        >
                            {assessment.isLogBook ? (
                                <BookOpen className="h-5 w-5" />
                            ) : assessment.isIndustryLogBook ? (
                                <Building className="h-5 w-5" />
                            ) : (
                                <FileText className="h-5 w-5" />
                            )}
                        </div>

                        <div className="min-w-0 mr-4">
                            <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                                {assessment.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {assessment.isLogBook
                                    ? 'Student Logbook'
                                    : assessment.isIndustryLogBook
                                        ? 'Industry Logbook'
                                        : 'Assessment Tool'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => {
                                        const extension = assessment.file
                                            .split('?')[0]
                                            .split('.')
                                            .pop()
                                        onFileClicked({
                                            file: assessment.file,
                                            extension,
                                            filename: assessment.title,
                                        })
                                    }}
                                    className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors cursor-pointer"
                                >
                                    <Eye className="h-4 w-4" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>View Assessment</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <a
                                    href={assessment.file}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                                >
                                    <Download className="h-4 w-4" />
                                </a>
                            </TooltipTrigger>
                            <TooltipContent>Download Assessment</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => handleArchive(assessment.id)}
                                    className={`p-2 rounded-lg transition-colors cursor-pointer ${isArchivedView
                                            ? 'hover:bg-green-50 text-green-600'
                                            : 'hover:bg-orange-50 text-orange-600'
                                        }`}
                                >
                                    {isArchivedView ? (
                                        <RotateCcw className="h-4 w-4" />
                                    ) : (
                                        <Archive className="h-4 w-4" />
                                    )}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {isArchivedView
                                    ? 'Unarchive Assessment'
                                    : 'Archive Assessment'}
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => handleDelete(assessment.id)}
                                    disabled={
                                        isDeleting &&
                                        deletingId === assessment.id
                                    }
                                    className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    {isDeleting &&
                                        deletingId === assessment.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="h-4 w-4" />
                                    )}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>Delete Assessment</TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            ))}
            {documentsViewModal}
        </div>
    )
}
