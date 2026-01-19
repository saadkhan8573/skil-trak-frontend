import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { motion } from 'framer-motion'
import { Send, BellRing, UserCheck } from 'lucide-react'

// components
import {
    Button,
    Select,
    Checkbox,
    TextArea,
    ShowErrorNotifications,
    Typography,
} from '@components'

// query
import { Result, UserRoles } from '@constants'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNotification } from '@hooks'
import { useSubmitAssessmentEvidenceMutation } from '@queries'
import { AssessmentFinalCommentFormType, Course } from '@types'
import { getUserCredentials } from '@utils'

export const SubmitFinalResult = ({
    result,
    editAssessment,
    course,
    studentId,
    setEditAssessment,
}: {
    editAssessment?: boolean
    result: any
    course: Course
    studentId: number
    setEditAssessment: any
}) => {
    const pathname = useRouter()
    const { notification } = useNotification()

    console.log({ iiiiiiinnnnnnnn: result })

    // query
    const [submitAssessmentEvidence, submitAssessmentEvidenceResult] =
        useSubmitAssessmentEvidenceMutation()

    const validationSchema = Yup.object({
        result: Yup.string().required('Result is Required'),
        finalComment: Yup.string().required('Final Comment is Required'),
    })

    const methods = useForm<AssessmentFinalCommentFormType>({
        mode: 'all',
        resolver: yupResolver(validationSchema),
    })

    const handleUpdate = useCallback(
        (e: Result) => {
            const finalComment = () => {
                switch (e) {
                    case Result.Competent:
                        return `Well done on successfully completing your placement with SkilTrak! You have met all the requirements of your practical component for unit ${course?.code} ${course?.title}. We are pleased to provide you with a Satisfactory result. `

                    case Result.NotCompetent:
                        return `Thank you for submitting your placement documents for unit ${course?.code} ${course?.title}. However, there are still some sections that have missing/incorrect information. Please review your work and follow my feedback provided to assist you with your second submission. If you need any assistance, please contact us to book a Coaching Call. `

                    default:
                        return ''
                }
            }
            methods.setValue('finalComment', finalComment())
        },
        [course, methods]
    )

    useEffect(() => {
        if (editAssessment && result) {
            methods.setValue('finalComment', result?.finalComment)
            methods.setValue('result', result?.result)
        }
    }, [editAssessment, result])

    const onSubmit = (values: AssessmentFinalCommentFormType) => {
        submitAssessmentEvidence({ id: result?.id, body: values }).then(
            (res: any) => {
                if (res?.data) {
                    setEditAssessment(false)
                    notification.success({
                        title: 'Result Added',
                        description: 'Result Added Successfully',
                    })
                }
            }
        )
    }

    const ResultOptions = [
        { label: 'Competent', value: Result.Competent },
        { label: 'Not Competent', value: Result.NotCompetent },
        { label: 'Re-Open', value: Result.ReOpened },
        {
            label: 'All Documents Submitted',
            value: Result.AllDocumentSubmitted,
        },
    ]
    return (
        <div className="p-4 bg-white/40 backdrop-blur-sm rounded-xl transition-all duration-300">
            <ShowErrorNotifications result={submitAssessmentEvidenceResult} />
            <FormProvider {...methods}>
                <form
                    className="w-full space-y-4"
                    onSubmit={methods.handleSubmit(onSubmit)}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <div className="space-y-4">
                                <div>
                                    <Select
                                        label={'Selection Outcome'}
                                        name={'result'}
                                        onChange={handleUpdate}
                                        options={ResultOptions}
                                        menuPlacement={'top'}
                                        onlyValue
                                        className="shadow-sm"
                                    />
                                </div>

                                <div className="p-4 bg-indigo-50/30 rounded-lg border border-indigo-100 flex flex-col gap-3">
                                    <Typography
                                        variant="small"
                                        className="font-semibold text-indigo-700 mb-1 flex items-center gap-2"
                                    >
                                        <BellRing size={14} /> Notifications
                                    </Typography>
                                    <div className="flex flex-col gap-2">
                                        <div className="hover:bg-indigo-50/50 p-1 rounded transition-colors">
                                            <Checkbox
                                                name="notifyStudent"
                                                label="Alert Student"
                                            />
                                        </div>
                                        <div className="hover:bg-indigo-50/50 p-1 rounded transition-colors">
                                            <Checkbox
                                                name="notifyRto"
                                                label="Sync with RTO"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <TextArea
                                label={'Decision Commentary'}
                                rows={6}
                                name={'finalComment'}
                                placeholder={
                                    'Provide detailed feedback on the assessment decision...'
                                }
                                className="shadow-sm resize-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-slate-100">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                text="Finalize & Submit"
                                submit
                                loading={
                                    submitAssessmentEvidenceResult?.isLoading
                                }
                                disabled={
                                    submitAssessmentEvidenceResult?.isLoading
                                }
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-lg shadow-lg shadow-indigo-200 flex items-center gap-2 transition-all duration-300"
                                Icon={() => <Send size={18} />}
                            />
                        </motion.div>
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}
