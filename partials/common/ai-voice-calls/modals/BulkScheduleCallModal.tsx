import React, { useState, useEffect, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@components/ui/dialog'
import { Student } from '@types'
import { Calendar, CheckCircle2, Users } from 'lucide-react'
import { CommonApi } from '@queries'
import { Button, TextInput, Switch } from '@components'
import { useNotification } from '@hooks'
import { cn } from '@utils'
import moment from 'moment'

interface BulkScheduleCallModalProps {
    students: Student[]
    onClose: () => void
}

export const BulkScheduleCallModal = ({ students, onClose }: BulkScheduleCallModalProps) => {
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
    const [isScheduled, setIsScheduled] = useState(true)
    const [scheduledDate, setScheduledDate] = useState<string>(moment().format('YYYY-MM-DD'))

    const [bulkScheduleCall, { isLoading }] = CommonApi.CallManagement.useBulkScheduleAiCallMutation()
    const { notification } = useNotification()

    // Find common courses among all selected students
    const commonCourses = useMemo(() => {
        if (!students.length) return []

        const firstStudentCourses = students[0].courses || []
        return firstStudentCourses.filter(course =>
            students.every(student =>
                (student.courses || []).some(c => c.id === course.id)
            )
        )
    }, [students])

    useEffect(() => {
        if (commonCourses.length === 1) {
            setSelectedCourseId(commonCourses[0].id)
        } else {
            setSelectedCourseId(null)
        }
    }, [commonCourses])

    const handleBulkSchedule = async () => {
        if (!students.length || !selectedCourseId || (isScheduled && !scheduledDate)) return

        const scheduledAt = isScheduled ? `${scheduledDate}T00:00:00` : moment().format('YYYY-MM-DDTHH:mm:ss')
        const studentIds = students.map(s => s.id)

        try {
            await bulkScheduleCall({
                studentIds,
                courseId: selectedCourseId,
                scheduledAt,
                isScheduled: isScheduled
            }).unwrap()

            notification.success({
                title: 'Success',
                description: isScheduled
                    ? `Successfully scheduled calls for ${students.length} students!`
                    : `Successfully initiated calls for ${students.length} students!`,
            })
            onClose()
        } catch (error: any) {
            notification.error({
                title: 'Error',
                description: error?.data?.message || `Failed to ${isScheduled ? 'schedule' : 'initiate'} bulk calls`,
            })
        }
    }

    if (!students.length) return null

    return (
        <Dialog open={students.length > 0} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-3xl! p-6 flex flex-col max-h-[90vh]">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#044866]" />
                        {isScheduled ? 'Bulk Schedule Call' : 'Bulk Initiate Call'}
                    </DialogTitle>
                    <p className="text-sm text-gray-500">
                        {isScheduled
                            ? `Schedule an AI voice call for ${students.length} selected students.`
                            : `Start an instant AI voice call for ${students.length} selected students.`}
                    </p>
                </DialogHeader>

                <div className="space-y-3.5 overflow-y-auto flex-1 pr-2 -mr-2">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 max-h-[120px] overflow-y-auto">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Selected Students</span>
                        <div className="flex flex-wrap gap-2">
                            {students.map(student => (
                                <div key={student.id} className="bg-white px-2 py-1 rounded border border-gray-200 text-xs font-medium text-gray-700">
                                    {student.user?.name}
                                </div>
                            ))}
                        </div>
                    </div>


                    {isScheduled && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Schedule Date</span>
                            <TextInput
                                name="date"
                                type="date"
                                showError={false}
                                value={scheduledDate}
                                onChange={(e: any) => setScheduledDate(e.target.value)}
                                min={moment().format('YYYY-MM-DD')}
                            />
                        </div>
                    )}

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Select Common Course</span>
                            <span className="text-[10px] text-gray-500">Only courses common to all selected students are shown</span>
                        </div>
                        <div className="grid grid-cols-1 gap-2 max-h-[250px] overflow-y-auto pr-1">
                            {commonCourses.length > 0 ? (
                                commonCourses.map((course) => (
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
                                <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100 italic">
                                    No common courses found among all selected students. Bulk scheduling requires a shared course.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex gap-3 border-t bg-white">
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
                        onClick={handleBulkSchedule}
                        loading={isLoading}
                        disabled={!selectedCourseId || (isScheduled && !scheduledDate) || !students.length}
                    >
                        {isScheduled ? `Schedule Calls (${students.length})` : `Call Now (${students.length})`}
                    </Button>
                </div>
            </DialogContent>
        </Dialog >
    )
}
