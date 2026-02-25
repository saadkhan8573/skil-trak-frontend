import { useState } from 'react'
import { UserStatus } from '@types'
import { CourseApprovalModal } from '../../modals'
import { ApprovedCourseCard } from './ApprovedCourseCard'
import { RejectedCourseCard } from './RejectedCourseCard'
import { PendingCourseCard } from './PendingCourseCard'

interface CourseApprovalProps {
    course: any
}

export const CourseApproval = ({ course }: CourseApprovalProps) => {
    const [approvalStatus, setApprovalStatus] = useState<any>({
        status: course.approvals?.[0]?.status || 'pending',
        approvedBy: course.approvals?.[0]?.actionBy?.name || 'Administrator',
        approvedAt: course.approvals?.[0]?.updatedAt || new Date().toISOString(),
        rejectionReason: course.approvals?.[0]?.note || '',
    })
    const [showApprovalDialog, setShowApprovalDialog] = useState(false)

    const logbook = course?.rtoCourseFiles?.find((file: any) => file.title === 'logBook')
    const isCourseApproved = logbook?.status === UserStatus.Approved

    const openApprovalDialog = () => {
        setShowApprovalDialog(true)
    }

    const handleApproved = () => {
        setApprovalStatus((prev: any) => ({
            ...prev,
            status: 'approved',
            approvedAt: new Date().toISOString(),
            approvedBy: 'Administrator',
        }))
    }

    return (
        <>
            {isCourseApproved ? (
                <ApprovedCourseCard logbook={logbook} />
            ) : approvalStatus.status === 'rejected' ? (
                <RejectedCourseCard
                    approvalStatus={approvalStatus}
                    onResubmit={openApprovalDialog}
                />
            ) : (
                <PendingCourseCard
                    logbook={logbook}
                    onReview={openApprovalDialog}
                />
            )}

            <CourseApprovalModal
                course={course}
                logbook={logbook}
                open={showApprovalDialog}
                approval={approvalStatus}
                onApproved={handleApproved}
                onOpenChange={setShowApprovalDialog}
            />
        </>
    )
}
