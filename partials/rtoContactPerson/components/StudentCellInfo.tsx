import {
    AuthorizedUserComponent,
    HideRestrictedData,
    InitialAvatar,
    Tooltip,
    TooltipPosition,
} from '@components'
import { ErrorBoundary } from '@components/ErrorBoundary/ErrorBoundary'
import { UserRoles } from '@constants'
import { useScrollIntoView } from '@hooks'
import { Student } from '@types'
import { QueryType, ellipsisText, isBrowser, queryToUrl, setLink } from '@utils'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { BiMessageRoundedDots } from 'react-icons/bi'
import { FiPhoneOff } from 'react-icons/fi'
import { ImPhone, ImPhoneHangUp } from 'react-icons/im'
import { LuFlagTriangleRight } from 'react-icons/lu'
import { MdEmail, MdPhone, MdSnooze } from 'react-icons/md'

export const StudentCellInfo = ({
    student,
    call,
    showHignPriority = true,
}: {
    call?: boolean
    student: Student
    showHignPriority?: boolean
}) => {
    const router = useRouter()

    useScrollIntoView(student) // Scroll into view with scroll ID

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
            href={`/portals/observer/${student?.id}`}
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
                        />
                    )}
                </ErrorBoundary>
            </div>
            <div>
                <div className="flex items-center gap-x-2">
                    <div className="flex items-center gap-x-2">
                        <p
                            className={
                                'whitespace-nowrap text-xs text-gray-500'
                            }
                        >
                            <ErrorBoundary>
                                {ellipsisText(student?.studentId, 8)}
                            </ErrorBoundary>
                        </p>
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
                            <MdSnooze size={20} className="text-red-500" />
                            <Tooltip>
                                Snoozed Student
                                {student?.snoozedBy?.name
                                    ? ` by ${student.snoozedBy.name}`
                                    : ''}
                            </Tooltip>
                        </div>
                    ) : null}
                </div>
                <AuthorizedUserComponent roles={[UserRoles.ADMIN]}>
                    <div className="font-medium text-xs text-gray-500">
                        <p className="flex items-center gap-x-1">
                            <span>
                                <MdEmail />
                            </span>
                            <HideRestrictedData type={UserRoles.STUDENT}>
                                {student?.user?.email}
                            </HideRestrictedData>
                        </p>
                    </div>
                </AuthorizedUserComponent>
                <div className="font-medium text-xs text-gray-500">
                    <p className="flex items-center gap-x-1">
                        <span>
                            <MdPhone />
                        </span>
                        <HideRestrictedData type={UserRoles.STUDENT}>
                            {student?.phone}
                        </HideRestrictedData>
                    </p>
                </div>
            </div>
        </Link>
    )
}
