import { InitialAvatar, Tooltip, TooltipPosition } from '@components'
import { ErrorBoundary } from '@components/ErrorBoundary/ErrorBoundary'
import {
    Tooltip as ShadcnTooltip,
    TooltipContent,
    TooltipTrigger,
} from '@components/ui/tooltip'
import { useScrollIntoView } from '@hooks'
import { CopyData } from '@partials/common/FindWorkplaces/components'
import { Student, StudentStatusEnum } from '@types'
import { isBrowser, setLink } from '@utils'
import { Timer } from 'lucide-react'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { BiMessageRoundedDots } from 'react-icons/bi'
import { BsFillSendArrowUpFill } from 'react-icons/bs'
import { FiPhoneOff } from 'react-icons/fi'
import { ImPhone, ImPhoneHangUp } from 'react-icons/im'
import { LuFlagTriangleRight, LuPhoneOutgoing } from 'react-icons/lu'
import { MdSnooze, MdTimerOff } from 'react-icons/md'

export const StudentCellInfo = ({
    call,
    student,
    showHignPriority = true,
}: {
    call?: boolean
    student: Student
    showHignPriority?: boolean
}) => {
    const router = useRouter()

    // const query = queryToUrl(router?.query as QueryType)

    useScrollIntoView(student) // Scroll into view with scroll ID

    // useEffect(() => {
    //     if (student && router.query.scrollId) {
    //         const element = document.getElementById(
    //             String(router.query?.scrollId)
    //         )
    //         if (element) {
    //             element.scrollIntoView({
    //                 behavior: 'smooth',
    //             })
    //         }
    //     }
    // }, [student, router])

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
        // <div
        //     onClick={() => {
        //         router.push({
        //             pathname: router.pathname,
        //             query: { ...router.query, scrollId: student?.studentId },
        //         }) // First router.push is using for the save the full url in session storage to access when go back from detail page to list page
        //         setLink('student', router)
        //         router.push(
        //             /portals/admin/student/${student?.id}/detail
        //         ) // Secound Router.push is using for the navigating to detail page
        //     }}
        //     className="flex items-center gap-x-2 cursor-pointer"
        // >
        <Link
            href={`/portals/admin/student/${student?.id}/detail`}
            onClick={() => {
                setLink('student', router)
                if (isBrowser()) {
                    sessionStorage.setItem('scrollId', student?.studentId)
                }
            }}
            className="flex items-center gap-x-2 cursor-pointer relative z-10"
        >
            <div className="" id={student?.studentId}>
                <ErrorBoundary>
                    {student?.user?.name && (
                        <InitialAvatar
                            name={student?.user?.name}
                            imageUrl={student?.user?.avatar}
                            socketId={student?.user?.socketId}
                        />
                    )}
                </ErrorBoundary>
            </div>
            <div>
                <div className="flex items-center gap-x-2">
                    <div className="flex items-center gap-x-2">
                        {/* <p
                            className={
                                'whitespace-nowrap text-xs text-gray-500'
                            }
                        >
                            <ErrorBoundary>
                                {maskText(student?.studentId)}
                            </ErrorBoundary>
                        </p> */}
                        {student?.nonContactable && (
                            <div className="group relative bg-red-600 p-1 rounded-full flex items-center justify-center">
                                <FiPhoneOff className="text-white text-[10px]" />
                                <Tooltip position={TooltipPosition.left}>
                                    Not Contactable
                                </Tooltip>
                            </div>
                        )}
                        {student?.hasIssue && (
                            <div className="flex items-center">
                                <div className="group relative ">
                                    <LuFlagTriangleRight className="text-red-600 text-xl" />
                                    <Tooltip position={TooltipPosition.left}>
                                        Flagged Issue
                                    </Tooltip>
                                </div>
                                {student?.isReported && (
                                    <div className="group relative">
                                        <div className="text-red-600 text-lg font-bold">
                                            R
                                        </div>
                                        <Tooltip
                                            position={TooltipPosition.left}
                                        >
                                            Reported to RTO
                                        </Tooltip>
                                    </div>
                                )}
                            </div>
                        )}
                        {router.pathname !== '/portals/admin/talent-pool' &&
                        showHignPriority
                            ? student?.isHighPriority && (
                                  <div className="rounded-md whitespace-nowrap px-1 py-0.5 border border-red-400 text-red-400 text-xs font-medium">
                                      High Priority
                                  </div>
                              )
                            : null}
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
                    {student?.isTransferred ? (
                        <div className="w-5 h-5 flex items-center justify-center rounded relative group">
                            <BsFillSendArrowUpFill
                                size={17}
                                className="text-success-dark"
                            />
                            <Tooltip>Transfered Student</Tooltip>
                        </div>
                    ) : null}
                </div>

                <div className="flex items-center gap-x-1.5">
                    <div className="group flex items-center gap-x-1">
                        <p className="font-semibold">
                            {student?.user?.name || ''}{' '}
                            {student?.familyName?.toLowerCase() === 'na'
                                ? ''
                                : student?.familyName || ''}
                        </p>
                        <CopyData
                            text={`${student?.user?.name} ${
                                student?.familyName || ''
                            }`}
                            type={'Student Name'}
                        />
                    </div>

                    {student?.aiVoiceCalls &&
                    student?.aiVoiceCalls?.length > 0 ? (
                        <div className="w-5 h-5 flex items-center justify-center rounded relative group">
                            <LuPhoneOutgoing className="text-info text-lg" />
                            <Tooltip>
                                Scheduled:{' '}
                                {moment(
                                    student?.aiVoiceCalls[0]?.scheduledAt
                                ).format('DD/MM/YYYY')}
                            </Tooltip>
                        </div>
                    ) : null}
                    {student?.tickets && student?.tickets?.length > 0 ? (
                        <div className="w-5 h-5 flex items-center justify-center rounded relative group">
                            <BiMessageRoundedDots className="text-primary text-lg" />
                            <Tooltip>Ticket Created</Tooltip>
                        </div>
                    ) : null}
                    {student?.isSnoozed ? (
                        <div className="w-5 h-5 flex items-center justify-center rounded relative group">
                            <MdSnooze size={20} className="text-red-500" />
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
                                    <Timer
                                        size={23}
                                        className="text-violet-500"
                                    />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Expected Delay: {student.expectedDelay}</p>
                            </TooltipContent>
                        </ShadcnTooltip>
                    ) : null}
                    {student?.studentStatus === StudentStatusEnum.EXPIRED &&
                        student?.expiryDate &&
                        moment(student.expiryDate).isBefore(
                            moment(),
                            'day'
                        ) && (
                            <div className="w-5 h-5 flex items-center justify-center rounded relative group">
                                <MdTimerOff
                                    size={20}
                                    className="text-red-500"
                                />
                                <Tooltip>Student Expired</Tooltip>
                            </div>
                        )}
                </div>
                {/* <AuthorizedUserComponent
                    roles={[
                        UserRoles.ADMIN,
                        UserRoles.RTO,
                        UserRoles.INDUSTRY,
                    ]}
                    isHod={isHod}
                >
                    <div className="font-medium text-xs text-gray-500">
                        <p className="flex items-center gap-x-1">
                            <div>
                                <MdEmail />
                            </div>
                            <HideRestrictedData type={UserRoles.STUDENT}>
                                {maskText(student?.user?.email)}
                            </HideRestrictedData>
                        </p>
                    </div>
                </AuthorizedUserComponent> */}
                {/* <div className="font-medium text-xs text-gray-500">
                    <p className="flex items-center gap-x-1">
                        <span>
                            <MdPhone />
                        </span>
                        <HideRestrictedData type={UserRoles.STUDENT}>
                            {maskText(student?.phone)}
                        </HideRestrictedData>
                    </p>
                </div> */}
            </div>
        </Link>
    )
}
