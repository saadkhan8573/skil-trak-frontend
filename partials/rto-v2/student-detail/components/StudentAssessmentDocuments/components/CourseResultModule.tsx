import React, { useState } from 'react'
import {
    AuthorizedUserComponent,
    Button,
    Typography,
    Card,
    Badge,
} from '@components'
import { UserRoles, Result } from '@constants'
import { Course, Student } from '@types'
import { SubmitFinalResult } from './SubmitFinalResult'
import { FinalResult } from './FinalResult'
import { motion, AnimatePresence } from 'framer-motion'
import {
    GraduationCap,
    ClipboardCheck,
    History,
    Edit3,
    X,
    AlertCircle,
} from 'lucide-react'

interface CourseResultModuleProps {
    student: Student
    selectedCourse: Course | null
    result: any
    allCommentsAdded: boolean
    subadmin: any
    getFolders: any
}

export const CourseResultModule: React.FC<CourseResultModuleProps> = ({
    student,
    selectedCourse,
    result,
    allCommentsAdded,
    subadmin,
    getFolders,
}) => {
    const [editAssessment, setEditAssessment] = useState<boolean>(false)

    console.log({ selectedCourse })

    if (!selectedCourse) return null

    const showSubmitForm =
        (allCommentsAdded &&
            result?.result !== Result.Competent &&
            result?.isSubmitted) ||
        editAssessment ||
        subadmin?.isAssociatedWithRto

    console.log({ showSubmitForm, allCommentsAdded })

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full mx-auto"
        >
            <Card className="overflow-hidden border-none shadow-2xl bg-white/80 backdrop-blur-md rounded-2xl ring-1 ring-black/5">
                {/* Header Decoration */}
                <div className="h-2 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600" />

                <div className="p-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                                <GraduationCap size={28} />
                            </div>
                            <div>
                                <Typography
                                    variant="h4"
                                    className="font-bold text-slate-800"
                                >
                                    Assessment Outcome
                                </Typography>
                                <Typography
                                    variant="small"
                                    className="text-slate-500"
                                >
                                    Final review and certification for{' '}
                                    <Badge
                                        text={selectedCourse.title}
                                        variant="info"
                                    />
                                </Typography>
                            </div>
                        </div>

                        <AuthorizedUserComponent
                            excludeRoles={[UserRoles.OBSERVER]}
                        >
                            {result?.isAssessed &&
                                !subadmin?.isAssociatedWithRto && (
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button
                                            text={
                                                editAssessment
                                                    ? 'Cancel Edit'
                                                    : 'Revise Last Assessment Result'
                                            }
                                            onClick={() =>
                                                setEditAssessment(
                                                    !editAssessment
                                                )
                                            }
                                            variant={
                                                editAssessment
                                                    ? 'error'
                                                    : 'primary'
                                            }
                                            // className={`transition-all duration-300 ${editAssessment
                                            //     ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                                            //     : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50'
                                            //     }`}
                                            Icon={editAssessment ? X : Edit3}
                                        />
                                    </motion.div>
                                )}
                        </AuthorizedUserComponent>
                    </div>

                    {/* Submission Limit Notice */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3"
                    >
                        <AlertCircle
                            size={20}
                            className="text-amber-600 mt-0.5 shrink-0"
                        />
                        <div>
                            <Typography
                                variant="small"
                                className="text-amber-900 font-semibold"
                            >
                                Submission Limit
                            </Typography>
                            <Typography
                                variant="small"
                                className="text-amber-700 mt-1"
                            >
                                Students are allowed a maximum of 3 assessment
                                submissions per course. Please ensure all
                                feedback is comprehensive.
                            </Typography>
                        </div>
                    </motion.div>

                    {/* Main Content Area */}
                    <div className="space-y-6">
                        <AnimatePresence mode="wait">
                            {showSubmitForm ? (
                                <motion.div
                                    key="submit-form"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-slate-50/50 rounded-xl p-1 border border-slate-100"
                                >
                                    <div className="flex items-center gap-2 px-4 pt-4 text-slate-600">
                                        <ClipboardCheck
                                            size={20}
                                            className="text-indigo-500"
                                        />
                                        <span className="font-semibold uppercase tracking-wider text-xs">
                                            Submission Terminal
                                        </span>
                                    </div>
                                    <SubmitFinalResult
                                        course={selectedCourse}
                                        result={result}
                                        editAssessment={editAssessment}
                                        setEditAssessment={setEditAssessment}
                                        studentId={student?.id}
                                    />
                                </motion.div>
                            ) : null}

                            {selectedCourse?.results?.length > 0 && (
                                <motion.div
                                    key="history"
                                    layout
                                    className="mt-4"
                                >
                                    <div className="flex items-center gap-2 px-2 mb-4 text-slate-600">
                                        <History
                                            size={20}
                                            className="text-indigo-500"
                                        />
                                        <span className="font-semibold uppercase tracking-wider text-xs">
                                            Decision History
                                        </span>
                                    </div>
                                    <FinalResult
                                        folders={{
                                            ...getFolders,
                                            data:
                                                getFolders?.data
                                                    ?.assessmentEvidence ||
                                                getFolders?.data,
                                        }}
                                        results={selectedCourse?.results}
                                        courseName={String(
                                            selectedCourse?.title
                                        )}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}
