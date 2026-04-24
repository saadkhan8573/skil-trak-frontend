import {
    Tooltip,
    TooltipPosition,
    Typography,
    WorldwideStudentDataRestriction,
} from '@components'
import { useSubadminProfile } from '@hooks'
import { Student } from '@types'
import { maskText } from '@utils'
import Link from 'next/link'
import { FiPhoneOff } from 'react-icons/fi'
import { LuFlagTriangleRight } from 'react-icons/lu'
import { MdSnooze } from 'react-icons/md'

export const StudentWPCellInfo = ({
    student,
    wpId,
}: {
    student: Student
    wpId: number
}) => {
    const subadmin = useSubadminProfile()

    return (
        <div>
            <Typography variant="muted" color="text-gray-700">
                {maskText(student?.studentId, 2) ?? 'N/A'}
            </Typography>
            <div className="flex items-center gap-x-2">
                <WorldwideStudentDataRestriction
                    fallbackOptions={{
                        width: '120px',
                        height: '20px',
                    }}
                    anotherUserId={student?.rto?.user?.id}
                >
                    <Typography variant="small" semibold>
                        {student?.user?.name ?? 'N/A'}
                    </Typography>
                </WorldwideStudentDataRestriction>
                <div className="flex items-center gap-x-2">
                    {student?.isSnoozed && (
                        <div className="w-5 h-5 flex items-center justify-center rounded relative group">
                            <MdSnooze size={20} className="text-red-500" />
                            <Tooltip>
                                Snoozed Student
                                {student?.snoozedBy?.name
                                    ? ` • Snoozed By: ${student.snoozedBy.name}`
                                    : ''}
                            </Tooltip>
                        </div>
                    )}
                    {student?.nonContactable && (
                        <div className="group relative bg-red-600 p-1 rounded-full flex items-center justify-center">
                            <FiPhoneOff className="text-white text-[10px]" />
                            <Tooltip position={TooltipPosition.left}>
                                Not Contactable
                            </Tooltip>
                        </div>
                    )}
                    {student?.hasIssue && (
                        <div className="group relative">
                            <LuFlagTriangleRight className="text-red-600 text-xl" />
                            <Tooltip position={TooltipPosition.left}>
                                Flagged Issue
                            </Tooltip>
                        </div>
                    )}
                    {student?.isHighPriority && (
                        <div className="rounded-md whitespace-nowrap px-1 py-0.5 border border-red-400 text-red-400 text-xs font-medium">
                            High Priority
                        </div>
                    )}
                </div>
            </div>
            <Typography variant="small" color="text-gray-500">
                {student?.addressLine1 ?? 'N/A'}
            </Typography>
            {(student?.subadmin?.user?.id === subadmin?.user?.id ||
                subadmin?.isManager ||
                subadmin?.departmentMember?.isHod) && (
                <Link
                    // href={`/portals/sub-admin/students/${student?.id}/detail`}
                    href={`/portals/sub-admin/tasks/workplace/${wpId}/${student?.id}`}
                    className="text-blue-500 text-xs"
                >
                    View Details
                </Link>
            )}
        </div>
    )
}
