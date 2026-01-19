import { AuthorizedUserComponent, Button, Typography } from '@components'
import { Result, UserRoles } from '@constants'
import { useNotification } from '@hooks'
import { useSubmitStudentAssessmentMutation } from '@queries'
import { Student } from '@types'
import { getCourseResult } from '@utils'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Send, AlertCircle } from 'lucide-react'
import { useDispatch } from 'react-redux'
import {
    setAssessmentReSubmittedCount,
    setAssessmentSubmittedCount,
    useAppSelector,
} from '@redux'

export const SubmitAssessmentSubmission = ({
    selectedCourseId,
    student,
    isFilesUploaded,
    results,
    isResubmittedFiles,
    isAllApproved,
}: {
    selectedCourseId: number
    student: Student | undefined
    isFilesUploaded: boolean | undefined
    results: any
    isResubmittedFiles?: boolean
    isAllApproved?: boolean
}) => {
    const { notification } = useNotification()
    const [submitAssessment, submitAssessmentResult] =
        useSubmitStudentAssessmentMutation()

    const dispatch = useDispatch()

    const submittedCount = useAppSelector(
        (state) => state.student.assessmentSubmittedCount
    )
    const reSubmittedCount = useAppSelector(
        (state) => state.student.assessmentReSubmittedCount
    )

    useEffect(() => {
        if (submitAssessmentResult.isSuccess) {
            notification.success({
                title: 'Assessment Submitted Successfully',
                description: 'Assessment Submitted Successfully',
            })
        }
    }, [submitAssessmentResult])

    const result = getCourseResult(results)

    const onSubmitAssessment = () => {
        submitAssessment({
            body: {
                notifyCoordinator: true,
                notifyRto: true,
            },
            student: student?.user?.id,
            id: selectedCourseId,
        })
    }

    console.log({ isFilesUploaded })

    useEffect(() => {
        if (
            isFilesUploaded &&
            !results?.length &&
            result?.result === Result.NotSubmitted &&
            !submitAssessmentResult.isLoading &&
            !submitAssessmentResult.isSuccess &&
            !submittedCount
        ) {
            dispatch(setAssessmentSubmittedCount(submittedCount + 1))
            onSubmitAssessment()
        }
    }, [
        isFilesUploaded,
        submitAssessmentResult,
        results,
        result,
        submittedCount,
    ])

    useEffect(() => {
        if (
            (isResubmittedFiles || isAllApproved) &&
            results?.length > 0 &&
            result?.result !== Result.Pending &&
            !submitAssessmentResult.isLoading &&
            !reSubmittedCount
        ) {
            dispatch(setAssessmentReSubmittedCount(reSubmittedCount + 1))
            onSubmitAssessment()
        }
    }, [
        result,
        results,
        isResubmittedFiles,
        isAllApproved,
        submitAssessmentResult,
        reSubmittedCount,
    ])

    // useEffect(() => {
    //     return () => {
    //         dispatch(setAssessmentSubmittedCount(0))
    //     }
    // }, [])

    const onSubmit = (values: any) => {
        onSubmitAssessment()
    }
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-white/40 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl shadow-indigo-500/5 mb-6"
        >
            <AuthorizedUserComponent excludeRoles={[UserRoles.OBSERVER]}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-start gap-4 flex-1">
                        <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-500">
                            <AlertCircle size={24} />
                        </div>
                        <div className="space-y-1">
                            <Typography
                                variant="title"
                                className="font-bold text-slate-800"
                            >
                                Ready for Submission?
                            </Typography>
                            <Typography
                                variant="small"
                                className="text-slate-500 max-w-lg"
                            >
                                If the assessment hasn't triggered
                                automatically, you can manually submit it for
                                review by the RTO and Coordinator.
                            </Typography>
                        </div>
                    </div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            text="Submit Assessment"
                            onClick={onSubmit}
                            variant="info"
                            loading={submitAssessmentResult.isLoading}
                            disabled={submitAssessmentResult.isLoading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-indigo-200 border-none flex items-center gap-3 transition-all h-auto"
                            Icon={Send}
                        />
                    </motion.div>
                </div>
            </AuthorizedUserComponent>
        </motion.div>
    )
}
