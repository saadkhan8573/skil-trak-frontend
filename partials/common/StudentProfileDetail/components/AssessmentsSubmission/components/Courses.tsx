import React, { useState, useEffect } from 'react'
import { AuthorizedUserComponent, Button } from '@components'
import { UserRoles, Result } from '@constants'
import { Course, Student } from '@types'
import { FinalResult } from './FinalResult'
import { SubmitFinalResult } from './SubmitFinalResult'
import {
    useAssessmentData,
    useAssessmentLogic,
    useCourseSelection,
} from '../hooks'
import { SectorSlider } from './SectorSlider'
import { CourseSlider } from './CourseSlider'
import { AssessmentSection } from './AssessmentSection'
import { useSubadminProfile } from '@hooks'

interface CoursesProps {
    student: Student
    isEntered: boolean
    onSetSelectedCourse: (id: number | undefined) => void
}

export const Courses: React.FC<CoursesProps> = ({
    student,
    isEntered,
    onSetSelectedCourse,
}) => {
    const [editAssessment, setEditAssessment] = useState<boolean>(false)
    const [manualReOpen, setManualReOpen] = useState<boolean>(false)

    const subadmin = useSubadminProfile()

    // Custom hooks
    const {
        selectedSector,
        setSelectedSector,
        selectedCourse,
        setSelectedCourse,
        sectors,
        courses,
        appliedIndustry,
    } = useCourseSelection(student, isEntered)

    const {
        selectedFolder,
        getFolders,
        getAssessmentResponse,
        getOtherDocAssessmentResponse,
        eSignDocument,
        onSelectFolder,
    } = useAssessmentData(
        student,
        selectedCourse,
        appliedIndustry ?? '',
        isEntered
    )

    const {
        result,
        isFilesUploaded,
        allCommentsAdded,
        isResubmittedFiles,
        shouldShowSubmitButton,
    } = useAssessmentLogic(selectedCourse, getFolders, getAssessmentResponse)

    // Notify parent component of course selection
    useEffect(() => {
        if (onSetSelectedCourse) {
            onSetSelectedCourse(selectedCourse?.id)
        }
    }, [selectedCourse, onSetSelectedCourse])

    const handleSectorSlideChange = (sectorId: number) => {
        setSelectedSector(sectorId)
        if (courses && courses?.length > 0) {
            setSelectedCourse(courses[0])
        }
    }

    const handleCourseSlideChange = (course: Course) => {
        setSelectedCourse(course)
    }

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-3">
                <SectorSlider
                    sectors={sectors}
                    selectedSector={selectedSector}
                    onSectorChange={setSelectedSector}
                    onSlideChange={handleSectorSlideChange}
                />
                <CourseSlider
                    courses={courses}
                    selectedCourse={selectedCourse}
                    onCourseChange={setSelectedCourse}
                    onSlideChange={handleCourseSlideChange}
                />
            </div>

            <AssessmentSection
                student={student}
                selectedCourse={selectedCourse}
                selectedFolder={selectedFolder}
                getFolders={getFolders}
                getAssessmentResponse={getAssessmentResponse}
                getOtherDocAssessmentResponse={getOtherDocAssessmentResponse}
                eSignDocument={eSignDocument}
                result={result}
                isFilesUploaded={isFilesUploaded}
                isResubmittedFiles={isResubmittedFiles}
                shouldShowSubmitButton={shouldShowSubmitButton}
                onSelectFolder={onSelectFolder}
            />

            <div>
                <AuthorizedUserComponent excludeRoles={[UserRoles.OBSERVER]}>
                    {result?.isAssessed && !subadmin?.isAssociatedWithRto && (
                        <div className="flex px-4 pt-2">
                            <Button
                                text={
                                    editAssessment ? 'Cancel' : 'Change Result'
                                }
                                onClick={() =>
                                    setEditAssessment(!editAssessment)
                                }
                                variant={editAssessment ? 'primary' : 'info'}
                            />
                        </div>
                    )}
                    {((allCommentsAdded &&
                        ((result?.result !== Result.Competent &&
                            result?.isSubmitted) ||
                            manualReOpen)) ||
                        editAssessment ||
                        subadmin?.isAssociatedWithRto) && (
                        <div className="p-4">
                            <SubmitFinalResult
                                course={selectedCourse as Course}
                                result={result}
                                setEditAssessment={() => {}}
                                studentId={student?.id}
                            />
                        </div>
                    )}
                </AuthorizedUserComponent>
                {selectedCourse?.results?.length > 0 && (
                    <div className="px-4 pb-3">
                        <FinalResult
                            folders={{
                                ...getFolders,
                                data:
                                    getFolders?.data?.assessmentEvidence ||
                                    getFolders?.data,
                            }}
                            results={selectedCourse?.results}
                            courseName={String(selectedCourse?.title)}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
