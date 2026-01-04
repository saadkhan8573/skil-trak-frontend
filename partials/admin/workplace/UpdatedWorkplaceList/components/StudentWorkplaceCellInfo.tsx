import { Tooltip, TooltipPosition, Typography } from '@components'
import { Student } from '@types'
import { ellipsisText, setLink } from '@utils'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { BiMessageRoundedDots } from 'react-icons/bi'
import { FiPhoneOff } from 'react-icons/fi'
import { LuFlagTriangleRight } from 'react-icons/lu'
import { MdSnooze } from 'react-icons/md'

export const StudentWorkplaceCellInfo = ({
    student,
    wpId,
}: {
    student: Student
    wpId?: number
}) => {
    const router = useRouter()
    return (
        <div>
            <div className="flex items-center gap-x-2">
                <Typography variant="muted" color="text-gray-700">
                    {student?.studentId ?? 'N/A'}
                </Typography>
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
                            Problamatic Issue
                        </Tooltip>
                    </div>
                )}
                {student?.isHighPriority && (
                    <div className="rounded-md whitespace-nowrap px-1 py-0.5 border border-red-400 text-red-400 text-xs font-medium">
                        High Priority
                    </div>
                )}
            </div>
            <div className="flex items-center gap-x-1.5">
                <Typography variant="small" semibold>
                    {ellipsisText(student?.user?.name, 16) ?? 'N/A'}
                </Typography>
                {student?.tickets && student?.tickets?.length > 0 ? (
                    <div className="w-5 h-5 flex items-center justify-center rounded relative group">
                        <BiMessageRoundedDots className="text-primary text-lg" />
                        <Tooltip>Ticket Created</Tooltip>
                    </div>
                ) : null}
                {student?.isSnoozed ? (
                    <div className="w-5 h-5 flex items-center justify-center rounded relative group">
                        <MdSnooze size={20} className="text-red-500" />
                        <Tooltip>Snoozed Student</Tooltip>
                    </div>
                ) : null}
            </div>
            <Typography variant="small" color="text-gray-500">
                {student?.addressLine1 ?? 'N/A'}
            </Typography>
            <Link
                legacyBehavior
                href={`/portals/admin/workplaces/${wpId}/${student?.id}`}
                className="text-blue-500 text-xs"
            >
                <a
                    onClick={() => {
                        setLink('student', router)
                    }}
                >
                    {' '}
                    View Details
                </a>
            </Link>
        </div>
    )
}
