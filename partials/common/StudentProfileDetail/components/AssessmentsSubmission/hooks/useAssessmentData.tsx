import { useState, useEffect, useCallback } from 'react'
import {
    useGetAssessmentEvidenceDetailQuery,
    useGetAssessmentResponseQuery,
    SubAdminApi,
    CommonApi,
} from '@queries'
import { AssessmentEvidenceDetailType, Course, Student } from '@types'

export const useAssessmentData = (
    student: Student,
    selectedCourse: Course | null,
    appliedIndustry: string,
    isEntered: boolean
) => {
    const [selectedFolder, setSelectedFolder] =
        useState<AssessmentEvidenceDetailType | null>(null)

    const getFolders = useGetAssessmentEvidenceDetailQuery(
        {
            courseId: Number(selectedCourse?.id),
            studentId: Number(student?.id),
            indId: appliedIndustry,
        },
        {
            skip: !selectedCourse || !student?.id || !isEntered,
            refetchOnMountOrArgChange: 60,
        }
    )

    const getAssessmentResponse = useGetAssessmentResponseQuery(
        {
            selectedFolder: Number(selectedFolder?.id),
            student: Number(student?.user?.id),
        },
        {
            skip:
                !selectedFolder ||
                !student ||
                !isEntered ||
                selectedFolder?.otherDoc,
            refetchOnMountOrArgChange: 20,
        }
    )

    const getOtherDocAssessmentResponse =
        SubAdminApi.AssessmentEvidence.getOtherDocAssessment(
            {
                selectedFolder: Number(selectedFolder?.id),
                student: Number(student?.id),
            },
            {
                skip:
                    !selectedFolder ||
                    !student ||
                    !isEntered ||
                    !selectedFolder?.otherDoc,
                refetchOnMountOrArgChange: true,
            }
        )

    const eSignDocument = CommonApi.ESign.useStudentEsignDocument(
        {
            std: student?.user?.id,
            folder: Number(selectedFolder?.id),
        },
        {
            skip: !selectedFolder,
            refetchOnMountOrArgChange: 15,
        }
    )

    const onSelectFolder = useCallback((data: AssessmentEvidenceDetailType) => {
        setSelectedFolder(data)
    }, [])

    // Auto-select first folder when folders load
    useEffect(() => {
        if (
            getFolders?.data &&
            getFolders?.isSuccess &&
            getFolders?.data?.assessmentEvidence?.length > 0
        ) {
            const folder = getFolders?.data?.assessmentEvidence?.find(
                (folder: any) => folder?.id === Number(selectedFolder?.id)
            )
            onSelectFolder(
                (selectedFolder && folder
                    ? folder
                    : getFolders?.data
                        ?.assessmentEvidence?.[0]) as AssessmentEvidenceDetailType
            )
        }
    }, [getFolders, selectedFolder, onSelectFolder])

    return {
        selectedFolder,
        setSelectedFolder,
        getFolders,
        getAssessmentResponse,
        getOtherDocAssessmentResponse,
        eSignDocument,
        onSelectFolder,
    }
}
