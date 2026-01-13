import React from 'react'
import { AuthorizedUserComponent, Button } from '@components'
import { UserRoles, Result } from '@constants'
import { Student, Course, AssessmentEvidenceDetailType } from '@types'
import { AssessmentFiles, InitiateSign } from './AssessmentFiles'
import { AddComment } from './AssessmentFiles/AddComment'
import { AssessmentsFolders } from './AssessmentsFolders'
import { SubmitAssessmentSubmission } from './SubmitAssessmentSubmission'

interface AssessmentSectionProps {
    student: Student
    selectedCourse: Course | null
    selectedFolder: AssessmentEvidenceDetailType | null
    getFolders: any
    getAssessmentResponse: any
    getOtherDocAssessmentResponse: any
    eSignDocument: any
    result: any
    isFilesUploaded: boolean
    isResubmittedFiles: boolean
    shouldShowSubmitButton: boolean
    onSelectFolder: (folder: AssessmentEvidenceDetailType) => void
}

export const AssessmentSection: React.FC<AssessmentSectionProps> = ({
    student,
    selectedCourse,
    selectedFolder,
    getFolders,
    getAssessmentResponse,
    getOtherDocAssessmentResponse,
    eSignDocument,
    result,
    isFilesUploaded,
    isResubmittedFiles,
    shouldShowSubmitButton,
    onSelectFolder,
}) => {
    return (
        <div
            className={`border-y border-secondary-dark h-auto ${eSignDocument?.data && eSignDocument?.data?.length > 0
                    ? 'lg:h-[520px]'
                    : 'lg:h-[400px]'
                } overflow-hidden`}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 h-[inherit]">
                <div className="py-4 border-r h-[inherit]">
                    <div className="h-[calc(100%-38px)]">
                        <AssessmentsFolders
                            student={student}
                            getFolders={{
                                ...getFolders,
                                data:
                                    getFolders?.data?.assessmentEvidence ||
                                    getFolders?.data,
                            }}
                            otherDocs={
                                getFolders?.data?.otherDocs?.map(
                                    (othDoc: any) => ({
                                        ...othDoc,
                                        otherDoc: true,
                                    })
                                ) || []
                            }
                            course={selectedCourse}
                            selectedFolder={selectedFolder}
                            onSelectFolder={onSelectFolder}
                        />
                    </div>
                    {shouldShowSubmitButton && (
                        <div className="flex justify-center items-center mt-2">
                            <SubmitAssessmentSubmission
                                results={selectedCourse?.results}
                                selectedCourseId={Number(selectedCourse?.id)}
                                student={student}
                                isFilesUploaded={isFilesUploaded}
                                isResubmittedFiles={isResubmittedFiles}
                            />
                        </div>
                    )}
                </div>
                <div className="lg:col-span-2 h-[inherit]">
                    <div className="h-auto lg:h-[85%]">
                        <AssessmentFiles
                            selectedFolder={selectedFolder}
                            course={selectedCourse}
                            getAssessmentResponse={
                                selectedFolder?.otherDoc
                                    ? getOtherDocAssessmentResponse
                                    : getAssessmentResponse
                            }
                        >
                            <AuthorizedUserComponent
                                roles={[UserRoles.ADMIN, UserRoles.SUBADMIN]}
                            >
                                {getAssessmentResponse?.isSuccess ? (
                                    <InitiateSign
                                        student={student}
                                        folder={selectedFolder}
                                        courseId={selectedCourse?.id}
                                        eSignDocument={eSignDocument}
                                    />
                                ) : null}
                            </AuthorizedUserComponent>
                        </AssessmentFiles>
                    </div>
                    <AddComment
                        resultId={result?.id}
                        studentId={student?.id}
                        comment={getAssessmentResponse?.data?.comment}
                        assessmentResponseId={getAssessmentResponse?.data?.id}
                        assessmentFolder={
                            getAssessmentResponse?.data?.assessmentFolder
                        }
                        folderStatus={getAssessmentResponse?.data?.status}
                    />
                    <AuthorizedUserComponent
                        excludeRoles={[UserRoles.OBSERVER]}
                    >
                        {getAssessmentResponse?.data &&
                            getAssessmentResponse?.isSuccess &&
                            (getAssessmentResponse?.data?.assessmentFolder
                                ?.isAgreement ||
                                getAssessmentResponse?.data?.assessmentFolder
                                    ?.isFacilityCheckList) && (
                                <AddComment
                                    resultId={result?.id}
                                    studentId={student?.id}
                                    comment={
                                        getAssessmentResponse?.data?.comment
                                    }
                                    assessmentResponseId={
                                        getAssessmentResponse?.data?.id
                                    }
                                    assessmentFolder={
                                        getAssessmentResponse?.data
                                            ?.assessmentFolder
                                    }
                                    folderStatus={
                                        getAssessmentResponse?.data?.status
                                    }
                                />
                            )}
                        {getAssessmentResponse?.isSuccess &&
                            getAssessmentResponse?.data &&
                            (result?.result === Result.Pending ||
                                result?.result === Result.NotCompetent ||
                                result?.result === Result.ReOpened) &&
                            !getAssessmentResponse?.data?.assessmentFolder
                                ?.isAgreement &&
                            !getAssessmentResponse?.data?.assessmentFolder
                                ?.isFacilityCheckList ? (
                            <AddComment
                                resultId={result?.id}
                                studentId={student?.id}
                                comment={getAssessmentResponse?.data?.comment}
                                assessmentResponseId={
                                    getAssessmentResponse?.data?.id
                                }
                                assessmentFolder={
                                    getAssessmentResponse?.data
                                        ?.assessmentFolder
                                }
                                folderStatus={
                                    getAssessmentResponse?.data?.status
                                }
                            />
                        ) : null}
                    </AuthorizedUserComponent>
                </div>
            </div>
        </div>
    )
}
