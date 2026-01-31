import { Badge } from '@components'
import { UserRoles } from '@constants'
import { useStatusInfo } from '@partials/rto-v2/student-detail/components/StudentOverview/hooks/useStatusInfo'
import { WorkplaceWorkIndustriesType } from '@redux/queryTypes'
import { getUserCredentials } from '@utils'
import { ExternalLink } from 'lucide-react'
import moment from 'moment'
import Link from 'next/link'

interface StudentCardProps {
    student: any
}

function getStudentProfileLink(role: string, studentId: number) {
    switch (role) {
        case UserRoles.ADMIN:
            return `/portals/admin/student/${studentId}/detail`
        case UserRoles.SUBADMIN:
            return `/portals/sub-admin/students/${studentId}/detail`
        default:
            return `/portals/rto/students-and-placements/all-students/${studentId}/detail`
    }
}

export function RejectedStudentCard({ student }: StudentCardProps) {
    const role = getUserCredentials()?.role
    const workplace = student?.workplace?.[0]
    const industry = workplace?.industries?.[0]

    const { currentStep } = useStatusInfo({
        workplace: workplace,
        workIndustry: industry as WorkplaceWorkIndustriesType,
    })

    // Check for terminal states
    const isTerminalState =
        currentStep?.label &&
        ['Cancelled', 'Terminated', 'Rejected', 'No Response'].includes(
            currentStep.label
        )

    // Action info
    const isApproved = industry?.action === 'approved'
    const hasActionInfo = student?.ActionedBy

    console.log({ student })

    return (
        <div
            className={`${isTerminalState
                    ? 'bg-red-50 border-red-200'
                    : 'bg-white border-[#E2E8F0]'
                } border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300`}
        >
            <div className="p-4">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-4">
                    {/* Left: Student Info */}
                    <div className="flex items-start gap-3 flex-1">
                        {/* Avatar */}
                        <div className="w-10 h-10 bg-gradient-to-br from-[#044866] to-[#0D5468] rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm">
                            {student?.student?.user?.name
                                ?.split(' ')
                                .map((n: any) => n[0])
                                .join('') || '?'}
                        </div>

                        {/* Student Details */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-sm font-bold text-[#1A2332]">
                                    {student?.student?.user?.name}{' '}
                                    {student?.familyName || ''}
                                </h3>
                                {student?.id && (
                                    <Link
                                        href={getStudentProfileLink(
                                            role,
                                            student?.student?.id
                                        )}
                                    >
                                        <ExternalLink className="w-4 h-4 text-[#64748B] hover:text-[#044866] cursor-pointer" />
                                    </Link>
                                )}
                            </div>

                            {/* Course Title - Only if exists */}
                            {student?.course?.title && (
                                <p className="text-xs text-[#64748B] mb-2">
                                    {student?.course?.title}
                                </p>
                            )}

                            {/* RTO Info - Only if exists */}
                            {student?.student?.rto?.user?.name && (
                                <span className="text-xs font-semibold text-[#64748B]">
                                    {' '}
                                    🏢 RTO:{' '}
                                    {student?.student?.rto?.user?.name}{' '}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Right: Workflow Status */}
                    <div className="">
                        {hasActionInfo && (
                            <div
                                className={`mb-4 rounded-md border px-3 py-2 text-xs ${isApproved
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-red-50 border-red-200'
                                    }`}
                            >
                                <div className="flex items-center gap-1 justify-between">
                                    <Badge
                                        text={'Rejected By'}
                                        variant={'error'}
                                        size="xs"
                                    />
                                    <p
                                        className={`font-medium capitalize ${isApproved
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                            }`}
                                    >
                                        {student?.ActionedBy?.name}
                                    </p>
                                </div>
                                {student?.createdAt && (
                                    <p className="mt-1 text-gray-500">
                                        {moment(student?.createdAt).format(
                                            'DD MMM YYYY · hh:mm A'
                                        )}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
