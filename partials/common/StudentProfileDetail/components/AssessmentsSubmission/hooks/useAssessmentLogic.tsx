// hooks/useAssessmentLogic.ts
import { useMemo } from 'react'
import { getCourseResult } from '@utils'
import { Result } from '@constants'
import { AssessmentEvidenceDetailType, Course } from '@types'

export const useAssessmentLogic = (
    selectedCourse: Course | null,
    getFolders: any,
    getAssessmentResponse: any
) => {
    const result = useMemo(
        () => getCourseResult(selectedCourse?.results),
        [selectedCourse?.results]
    )

    const isFilesUploaded = useMemo(
        () =>
            !getFolders.isLoading &&
            !getFolders.isFetching &&
            getFolders.isSuccess &&
            getFolders?.data?.assessmentEvidence?.every(
                (f: any) => f?.studentResponse[0]?.files?.length > 0
            ),
        [getFolders]
    )

    const files = useMemo(
        () =>
            getFolders?.data?.assessmentEvidence
                ?.map((f: any) => f?.studentResponse?.[0]?.files?.length > 0)
                ?.filter((f: any) => f)?.length,
        [getFolders?.data?.assessmentEvidence]
    )

    const rejectedFolders = useMemo(
        () =>
            getFolders?.data?.assessmentEvidence?.filter(
                (f: any) =>
                    f?.studentResponse?.[0]?.status === 'rejected' &&
                    f?.studentResponse?.[0]?.files?.length > 0
            )?.length,
        [getFolders?.data?.assessmentEvidence]
    )

    const allFiles = useMemo(
        () =>
            getFolders?.data?.assessmentEvidence
                ?.filter(
                    (f: any) => f?.studentResponse?.[0]?.status === 'rejected'
                )
                ?.every((f: any) => f?.studentResponse?.[0]?.files?.length > 0),
        [getFolders?.data?.assessmentEvidence]
    )

    const resubmitFiles = useMemo(
        () =>
            getFolders?.data?.assessmentEvidence?.filter(
                (f: any) =>
                    f?.studentResponse?.[0]?.reSubmitted &&
                    f?.studentResponse?.[0]?.files?.length > 0
            )?.length,
        [getFolders?.data?.assessmentEvidence]
    )

    const isResubmittedFiles = useMemo(
        () =>
            (!getFolders.isLoading &&
                !getFolders.isFetching &&
                getFolders.isSuccess &&
                rejectedFolders &&
                allFiles &&
                resubmitFiles &&
                rejectedFolders === resubmitFiles &&
                Number(files) > 0) as boolean,
        [getFolders, rejectedFolders, allFiles, resubmitFiles, files]
    )

    const all = useMemo(
        () =>
            getFolders?.data?.assessmentEvidence ||
            (getFolders?.data as AssessmentEvidenceDetailType[] | undefined),
        [getFolders?.data]
    )

    const allCommentsAdded = useMemo(
        () =>
            all
                ?.filter((folder: any) => !folder?.isIndustryCheck)
                ?.every((f: any) => f?.studentResponse[0]?.comment),
        [all]
    )

    const shouldShowSubmitButton = useMemo(() => {
        console.log('Check is this running outer?')
        if (!getAssessmentResponse.isSuccess || !selectedCourse) return false
        console.log('Check is this running outer? 2')

        if (selectedCourse?.results?.length > 0) {
            if (result?.totalSubmission < 3) {
                console.log('Check is this running?', 1)
                return (
                    result?.result === Result.ReOpened ||
                    result?.result === Result.NotCompetent ||
                    allCommentsAdded
                )
            } else {
                console.log('Check is this running?', 2)
                return (
                    !getAssessmentResponse.isLoading &&
                    !getAssessmentResponse.isFetching &&
                    getAssessmentResponse.isSuccess &&
                    result?.isManualSubmission &&
                    allCommentsAdded
                )
            }
        } else {
            console.log('Check is this running?', 3)
            return (
                !getAssessmentResponse.isLoading &&
                !getAssessmentResponse.isFetching &&
                getAssessmentResponse.isSuccess &&
                allCommentsAdded
            )
        }
    }, [getAssessmentResponse, selectedCourse, result, allCommentsAdded])

    return {
        result,
        isFilesUploaded,
        isResubmittedFiles,
        allCommentsAdded,
        shouldShowSubmitButton,
        all,
    }
}
