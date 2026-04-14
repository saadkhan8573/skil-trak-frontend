import { InitialAvatar, Tooltip, TooltipPosition } from '@components'
import {
    Tooltip as ShadcnTooltip,
    TooltipContent,
    TooltipTrigger,
} from '@components/ui/tooltip'
import { Student } from '@types'
import { ellipsisText } from '@utils'
import moment from 'moment'
import Link from 'next/link'
import { BiMessageRoundedDots } from 'react-icons/bi'
import { FiPhoneOff } from 'react-icons/fi'
import { ImPhone, ImPhoneHangUp } from 'react-icons/im'
import { LuFlagTriangleRight } from 'react-icons/lu'
import { MdEmail, MdPhone, MdSnooze } from 'react-icons/md'
import { Timer, Users } from 'lucide-react'
import { SectorCourseGroup } from './SectorCourseGroup'

export const StudentCellInfo = ({
    student,
    call,
    link,
}: {
    link?: string
    student: Student
    call?: boolean
}) => {
    const callLog = student?.callLog?.reduce(
        (a: any, b: any) => (a?.createdAt > b?.createdAt ? a : b),
        {
            isExpired: true,
            createdAt: null,
        }
    )

    const today = moment()
    const startDate = today.startOf('week').format('MM-DD-YYYY')
    const endDate = today.endOf('week').format('MM-DD-YYYY')
    const createdAt = moment(callLog?.createdAt, 'YYYY-MM-DD')

    const isDateExist = createdAt.isBetween(startDate, endDate, 'day')
    return (
        <Link
            href={link || `/portals/rto/students/${student?.id}`}
            className="flex items-center gap-x-2"
        >
            <div className="shadow-inner-image rounded-full">
                {student?.user?.name && (
                    <InitialAvatar
                        name={student?.user?.name}
                        imageUrl={student?.user?.avatar}
                    />
                )}
            </div>
            <div>
                <div className="flex items-center gap-x-2">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600">
                            <Users size={12} className="text-slate-500" />
                            <span className="text-[11px] font-semibold tracking-wide uppercase">
                                {student?.batch ? ellipsisText(student.batch, 18) : 'NO BATCH'}
                            </span>
                        </div>
                        {student?.nonContactable && (
                            <div className="group relative bg-red-600 p-1 rounded-full flex items-center justify-center">
                                <FiPhoneOff className="text-white text-[10px]" />
                                <Tooltip position={TooltipPosition.left}>
                                    Not Contactable
                                </Tooltip>
                            </div>
                        )}

                        {student?.isHighPriority && (
                            <div className="rounded-md whitespace-nowrap px-1 py-0.5 border border-red-400 text-red-400 text-xs font-medium">
                                High Priority
                            </div>
                        )}
                    </div>
                    {call &&
                        isDateExist &&
                        (callLog.isAnswered ? (
                            <div className="rounded-full bg-success p-0.5">
                                <ImPhone
                                    title={'Call Made and Answered'}
                                    className="text-white text-[10px]"
                                />
                            </div>
                        ) : callLog.isAnswered === false ? (
                            <div className="rounded-full bg-red-700 p-0.5">
                                <ImPhoneHangUp
                                    title={'Call Made and Not Answered'}
                                    className="text-white text-[10px]"
                                />
                            </div>
                        ) : null)}
                    {student?.hasIssue && (
                        <div className="group relative ">
                            <LuFlagTriangleRight className="text-red-600 text-xl" />
                            <Tooltip position={TooltipPosition.left}>
                                Flagged Issue
                            </Tooltip>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-x-1.5">
                    <p className="font-semibold">
                        {student?.user?.name}{' '}
                        {student?.familyName?.toLowerCase() === 'na'
                            ? ''
                            : student?.familyName}
                    </p>
                    {student?.tickets && student?.tickets?.length > 0 ? (
                        <div className="w-5 h-5 flex items-center justify-center rounded relative group">
                            <BiMessageRoundedDots className="text-primary text-lg" />
                            <Tooltip>Ticket Created</Tooltip>
                        </div>
                    ) : null}
                    {student?.isSnoozed ? (
                        <div className="w-5 h-5 flex items-center justify-center rounded relative group">
                            <MdSnooze size={14} className="text-red-500" />
                            <Tooltip>
                                Snoozed Student
                                {student?.snoozedBy?.name
                                    ? ` • Snoozed By: ${student.snoozedBy.name}`
                                    : ''}
                            </Tooltip>
                        </div>
                    ) : null}
                    {student?.expectedDelay ? (
                        <ShadcnTooltip>
                            <TooltipTrigger asChild>
                                <div className="w-5 h-5 flex items-center justify-center rounded relative group cursor-help">
                                    <Timer size={14} className="text-violet-500" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Expected Delay: {student.expectedDelay}</p>
                            </TooltipContent>
                        </ShadcnTooltip>
                    ) : null}
                </div>
                <div className="mt-2">
                    <SectorCourseGroup courses={student?.courses || []} />
                </div>
            </div>
        </Link>
    )
}
