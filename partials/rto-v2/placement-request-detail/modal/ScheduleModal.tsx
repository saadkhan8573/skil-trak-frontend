import { GlobalModal } from '@components/Modal/GlobalModal'
import { Button } from '@components'
import { Typography } from '@components/Typography'
import { Calendar, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react'
import { Schedule } from '@partials/common/StudentProfileDetail/components'

interface ScheduleModalProps {
    open: boolean
    onClose: () => void
    student: any
}

export function ScheduleModal({ open, onClose, student }: ScheduleModalProps) {
    if (!open) return null

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
                        Review and confirm the placement schedule from the
                        student's profile
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
