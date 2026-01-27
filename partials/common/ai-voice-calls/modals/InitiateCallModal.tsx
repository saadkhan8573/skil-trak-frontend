import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@components/ui/dialog'
import { Student } from '@types'
import { Phone, User, X, CheckCircle2 } from 'lucide-react'
import { CommonApi } from '@queries'
import { Button } from '@components'
import { useNotification } from '@hooks'
import { cn } from '@utils'

interface InitiateCallModalProps {
    student: Student | null
    onClose: () => void
}

export const InitiateCallModal = ({ student, onClose }: InitiateCallModalProps) => {
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
    const [initiateCall, { isLoading }] = CommonApi.CallManagement.useInitiateAiCallMutation()
    const { notification } = useNotification()

    useEffect(() => {
        if (student?.courses?.length === 1) {
            setSelectedCourseId(student.courses[0].id)
        } else {
            setSelectedCourseId(null)
        }
    }, [student])

    const handleInitiateCall = async () => {
        if (!student || !selectedCourseId) return

        try {
            await initiateCall({ studentId: student.id, courseId: selectedCourseId }).unwrap()
            notification.success({
                title: 'Success',
                description: 'Call initiated successfully!',
            })
            onClose()
        } catch (error: any) {
            notification.error({
                title: 'Error',
                description: error?.data?.message || 'Failed to initiate call',
            })
        }
    }

    if (!student) return null

    const courses = student?.courses || []

    return (
        <Dialog open={!!student} onOpenChange={onClose}>
            <DialogContent className="sm:!max-w-2xl p-6">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl font-bold text-gray-900">
                        Initiate Call
                    </DialogTitle>
                    <p className="text-sm text-gray-500">
                        Select a course and confirm details to start the AI voice call.
                    </p>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Student</span>
                            <p className="text-sm font-medium text-gray-900">{student?.user?.name}</p>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone</span>
                            <p className="text-sm font-medium text-gray-900">{student?.phone || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Select Course</span>
                        <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1">
                            {courses.length > 0 ? (
                                courses.map((course) => (
                                    <button
                                        key={course.id}
                                        onClick={() => setSelectedCourseId(course.id)}
                                        className={cn(
                                            'flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left group',
                                            selectedCourseId === course.id
                                                ? 'border-[#044866] bg-blue-50/50'
                                                : 'border-gray-100 hover:border-gray-200 bg-white'
                                        )}
                                    >
                                        <div className="flex flex-col gap-0.5 min-w-0">
                                            <p className={cn(
                                                'text-sm font-bold truncate',
                                                selectedCourseId === course.id ? 'text-[#044866]' : 'text-gray-700'
                                            )}>
                                                {course.title || course.name}
                                            </p>
                                            <p className="text-[10px] text-gray-500 font-medium uppercase">{course.code}</p>
                                        </div>
                                        {selectedCourseId === course.id ? (
                                            <CheckCircle2 className="w-5 h-5 text-[#044866] shrink-0" />
                                        ) : (
                                            <div className="w-5 h-5 rounded-full border-2 border-gray-200 group-hover:border-gray-300 shrink-0" />
                                        )}
                                    </button>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 italic">No courses available for this student.</p>
                            )}
                        </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                        <Button
                            variant="secondary"
                            className="flex-1"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 bg-[#044866] hover:bg-[#095a7d] text-white"
                            onClick={handleInitiateCall}
                            loading={isLoading}
                            disabled={!selectedCourseId}
                        >
                            Proceed
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
