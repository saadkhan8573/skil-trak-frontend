import {
    BlurOverlay,
    InitialAvatar,
    Permissions,
    Tooltip,
    TooltipPosition,
} from '@components'
import {
    Tooltip as ShadcnTooltip,
    TooltipContent,
    TooltipTrigger,
} from '@components/ui/tooltip'
import { useScrollIntoView, useSubadminProfile } from '@hooks'
import { CopyData } from '@partials/common/FindWorkplaces/components'
import { PermissionType, Student, StudentStatusEnum } from '@types'
import { ellipsisText, isBrowser, setLink } from '@utils'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { BsTicketDetailed } from 'react-icons/bs'
import { FaEnvelope, FaPhone } from 'react-icons/fa'
import { FiPhoneOff } from 'react-icons/fi'
import { ImPhone, ImPhoneHangUp } from 'react-icons/im'
import { LuFlagTriangleRight } from 'react-icons/lu'
import { MdSnooze, MdTimerOff } from 'react-icons/md'
import { Timer } from 'lucide-react'
import { WorldwideStudentDataRestriction } from '@components/WorldwideStudentDataRestriction'

export const StudentCellInfo = ({
    student,
    call,
}: {
    student: Student
    call?: boolean
}) => {
    const router = useRouter()

    const subadmin = useSubadminProfile()

    useScrollIntoView(student) // Scroll into view with scroll ID

    const callLog = student?.callLog?.reduce(
        (a: any, b: any) => (a?.createdAt > b?.createdAt ? a : b),
        {
            isExpired: true,
            createdAt: null,
        }
    )

    const today = moment()
    const startDate = today.startOf('week').format('YYYY-MM-DD')
    const endDate = today.endOf('week').format('YYYY-MM-DD')
    const createdAt = moment(callLog?.createdAt, 'YYYY-MM-DD')

    const isDateExist = createdAt.isBetween(startDate, endDate, 'day')

    return (
        <div
            className="flex items-center relative z-10"
            id={student?.studentId}
        >
            <div className="flex items-center gap-x-2">
                <WorldwideStudentDataRestriction
                    anotherUserId={student?.rto?.user?.id}
                >
                    <div>
                        {student?.user?.name && (
                            <InitialAvatar
                                name={student?.user?.name}
                                imageUrl={student?.user?.avatar}
                                socketId={student?.user?.socketId}
                            />
                        )}
                    </div>
                </WorldwideStudentDataRestriction>

                <Link
                    href={`${
                        router.pathname === '/portals/sub-admin/talent-pool'
                            ? '#'
                            : `/portals/sub-admin/students/${student?.id}/detail`
                    }`}
                    onClick={() => {
                        setLink('subadmin-student', router)
                        if (isBrowser()) {
                            sessionStorage.setItem(
                                'scrollId',
                                student?.studentId
                            )
                        }
                    }}
                >
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center gap-x-2">
                            <div className="flex items-center gap-x-2">
                                {student?.nonContactable && (
                                    <div className="group relative bg-red-600 p-1 rounded-full flex items-center justify-center">
                                        <FiPhoneOff className="text-white text-[10px]" />
                                        <Tooltip
                                            position={TooltipPosition.left}
                                        >
                                            Not Contactable
                                        </Tooltip>
                                    </div>
                                )}
                                {student?.hasIssue && (
                                    <div className="flex items-center">
                                        <div className="group relative ">
                                            <LuFlagTriangleRight className="text-red-600 text-xl" />
                                            <Tooltip
                                                position={TooltipPosition.left}
                                            >
                                                Flagged Issue
                                            </Tooltip>
                                        </div>
                                        {student?.isReported && (
                                            <div className="group relative">
                                                <div className="text-red-600 text-lg font-bold">
                                                    R
                                                </div>
                                                <Tooltip
                                                    position={
                                                        TooltipPosition.left
                                                    }
                                                >
                                                    Reported to RTO
                                                </Tooltip>
                                            </div>
                                        )}
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
                                    <div className="rounded-full bg-success p-0.5 relative group">
                                        <ImPhone className="text-white text-[10px]" />
                                        <Tooltip>
                                            Call Made and Answered
                                        </Tooltip>
                                    </div>
                                ) : callLog.isAnswered === false ? (
                                    <div className="rounded-full bg-red-700 p-0.5 relative group">
                                        <ImPhoneHangUp className="text-white text-[10px]" />
                                        <Tooltip>
                                            Call Made and Not Answered
                                        </Tooltip>
                                    </div>
                                ) : null)}
                        </div>
                    </div>
                    <div className="flex items-center gap-x-1.5">
                        <div className="group flex items-center gap-x-1">
                            <WorldwideStudentDataRestriction
                                anotherUserId={student?.rto?.user?.id}
                                fallbackOptions={{
                                    width: '110px',
                                    height: '20px',
                                }}
                            >
                                <p className="text-gray-800 font-medium">
                                    {student?.user?.name}{' '}
                                    {student?.familyName}{' '}
                                </p>
                            </WorldwideStudentDataRestriction>
                            <WorldwideStudentDataRestriction
                                anotherUserId={student?.rto?.user?.id}
                            >
                                <CopyData
                                    text={`${student?.user?.name} ${
                                        student?.familyName ?? ''
                                    }`}
                                    type={'Student Name'}
                                />
                            </WorldwideStudentDataRestriction>
                        </div>
                        {student?.tickets && student?.tickets?.length > 0 ? (
                            <div className="w-4 h-4 rounded  relative group">
                                <BsTicketDetailed className="text-black text-lg" />
                                <Tooltip>Ticket Created</Tooltip>
                            </div>
                        ) : null}
                        {student?.isSnoozed ? (
                            <div className="w-4 h-4 rounded  relative group">
                                <MdSnooze size={17} className="text-red-500" />
                                <Tooltip>
                                    Student Snoozed
                                    {student?.snoozedBy?.name
                                        ? ` by ${student.snoozedBy.name}`
                                        : ''}
                                </Tooltip>
                            </div>
                        ) : null}
                        {student?.expectedDelay ? (
                            <ShadcnTooltip>
                                <TooltipTrigger asChild>
                                    <div className="w-4 h-4 flex items-center justify-center rounded relative group cursor-help">
                                        <Timer
                                            size={17}
                                            className="text-violet-500"
                                        />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>
                                        Expected Delay: {student.expectedDelay}
                                    </p>
                                </TooltipContent>
                            </ShadcnTooltip>
                        ) : null}
                        {student?.studentStatus === StudentStatusEnum.EXPIRED &&
                            student?.expiryDate &&
                            moment(student.expiryDate).isBefore(
                                moment(),
                                'day'
                            ) && (
                                <div className="w-4 h-4 flex items-center justify-center rounded relative group">
                                    <MdTimerOff
                                        size={17}
                                        className="text-red-500"
                                    />
                                    <Tooltip>Student Expired</Tooltip>
                                </div>
                            )}
                    </div>
                    {subadmin?.isAssociatedWithRto && (
                        <>
                            {student?.user?.email && (
                                <div className="flex items-center gap-x-2 text-sm">
                                    <span className="text-gray-400">
                                        <FaEnvelope />
                                    </span>
                                    <p className="text-gray-500">
                                        <WorldwideStudentDataRestriction
                                            anotherUserId={student?.rto?.user?.id}
                                            fallbackOptions={{ width: '130px', height: '15px' }}
                                        >
                                            {ellipsisText(student?.user?.email, 20)}
                                        </WorldwideStudentDataRestriction>
                                    </p>
                                </div>
                            )}
                            {student?.phone && (
                                <div className="flex items-center gap-x-2 text-sm">
                                    <span className="text-gray-400">
                                        <FaPhone />
                                    </span>
                                    <p className="text-gray-500">
                                        <WorldwideStudentDataRestriction
                                            anotherUserId={student?.rto?.user?.id}
                                            fallbackOptions={{ width: '100px', height: '15px' }}
                                        >
                                            {student?.phone}
                                        </WorldwideStudentDataRestriction>
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </Link>
            </div>
        </div>
    )
}
