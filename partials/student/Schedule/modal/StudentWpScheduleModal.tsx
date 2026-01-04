import { GlobalModal, Typography } from '@components'
import { Schedule } from '@partials/common/StudentProfileDetail/components'
import { Calendar } from 'lucide-react'
import React from 'react'

export const StudentWpScheduleModal = ({ student, onClose }: any) => {
    return (
        <GlobalModal onCancel={onClose} className="max-w-5xl">
            <div className="p-8 overflow-auto max-h-[40rem]">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 text-primaryNew text-xl font-semibold mb-2">
                        <Calendar className="h-5 w-5" />
                        <Typography variant="h3">
                            Confirm Placement Schedule
                        </Typography>
                    </div>
                    <Typography variant="small" className="text-gray-600">
                        Review and confirm the placement schedule
                    </Typography>
                </div>

                <Schedule
                    user={student?.user}
                    studentId={student?.id}
                    student={student}
                />
            </div>
        </GlobalModal>
    )
}
