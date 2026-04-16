import { AuthorizedUserComponent, Typography } from '@components'
import { SubAdminApi } from '@queries'
import Image from 'next/image'
import { MdAdminPanelSettings } from 'react-icons/md'

// hooks
import { UserRoles } from '@constants'
import { UserProfileDetailCard } from '@partials/common'
import { SubAdmin, UserStatus } from '@types'
import { getUserCredentials } from '@utils'
import Link from 'next/link'
import { IoCheckmarkDoneOutline } from 'react-icons/io5'
import { ProfileLinks } from '../components'
import moment from 'moment'
export const ViewProfileCB = ({
    subadmin,
    statistics,
}: {
    statistics: any
    subadmin: SubAdmin
}) => {
    const status = getUserCredentials()?.status

    const todoListCount = SubAdminApi.Todo.todoListCount(
        { date: moment(new Date()).format('YYYY-MM-DD') },
        {
            skip: status !== UserStatus.Approved,
        }
    )

    const pathname = '/portals/sub-admin/todo-list-details'

    const todoListData = [
        {
            text: 'Daily Tasks',
            lists: [
                {
                    text: 'High Priority Items',
                    count: todoListCount?.data?.highPriority?.total || 0,
                    completed:
                        todoListCount?.data?.highPriority?.completed || 0,
                    remaining: todoListCount?.data?.highPriority?.pending || 0,
                    link: {
                        pathname: pathname,
                        query: {
                            tab: 'daily-recurring-tasks',
                            id: 'highPriority',
                        },
                    },
                },
                {
                    text: 'Up coming appointments',
                    count: todoListCount?.data?.appointments?.total || 0,
                    completed:
                        todoListCount?.data?.appointments?.completed || 0,
                    remaining: todoListCount?.data?.appointments?.pending || 0,
                    link: {
                        pathname: pathname,
                        query: {
                            tab: 'daily-recurring-tasks',
                            id: 'appointment',
                        },
                    },
                },
                {
                    text: 'Open Tickets',
                    count: todoListCount?.data?.openTickets?.total || 0,
                    completed: todoListCount?.data?.openTickets?.completed || 0,
                    remaining: todoListCount?.data?.openTickets?.pending || 0,
                    link: {
                        pathname: pathname,
                        query: {
                            tab: 'daily-recurring-tasks',
                            id: 'openTickets',
                        },
                    },
                },
                {
                    text: 'Workplace Request',
                    count: todoListCount?.data?.workplaceRequests?.total || 0,
                    completed:
                        todoListCount?.data?.workplaceRequests?.completed || 0,
                    remaining:
                        todoListCount?.data?.workplaceRequests?.pending || 0,
                    link: {
                        pathname: pathname,
                        query: {
                            tab: 'daily-recurring-tasks',
                            id: 'workplaceRequest',
                        },
                    },
                },
            ],
        },
        {
            text: 'Weekly Recurring Tasks',
            lists: [
                {
                    text: 'Weekly Student Follow up',
                    count: todoListCount?.data?.studentFollowUp?.total || 0,
                    completed:
                        todoListCount?.data?.studentFollowUp?.completed || 0,
                    remaining:
                        todoListCount?.data?.studentFollowUp?.pending || 0,
                    link: {
                        pathname: pathname,
                        query: {
                            tab: 'weekly-recurring-tasks',
                        },
                    },
                },
            ],
        },
        {
            text: 'Monthly Recurring Tasks',
            lists: [
                {
                    text: 'Monthly Partner Industry Follow up',
                    count: todoListCount?.data?.partnerIndustries?.total || 0,
                    completed:
                        todoListCount?.data?.partnerIndustries?.completed || 0,
                    remaining:
                        todoListCount?.data?.partnerIndustries?.pending || 0,
                    link: {
                        pathname: pathname,
                        query: {
                            tab: 'monthly-recurring-tasks',
                        },
                    },
                },
            ],
        },
        {
            text: 'Bi-Monthly Recurring Tasks',
            lists: [
                {
                    text: 'Bi Monthly Non Partner Industries',
                    count:
                        todoListCount?.data?.nonPartnerIndustries?.total || 0,
                    completed:
                        todoListCount?.data?.nonPartnerIndustries?.completed ||
                        0,
                    remaining:
                        todoListCount?.data?.nonPartnerIndustries?.pending || 0,
                    link: {
                        pathname: pathname,
                        query: {
                            tab: 'student-move-to-flashing',
                        },
                    },
                },
            ],
        },
        {
            text: 'Quarterly Recurring Tasks',
            lists: [
                {
                    text: 'Quarterly Listed Industries',
                    count: todoListCount?.data?.listedIndustries?.total || 0,
                    completed:
                        todoListCount?.data?.listedIndustries?.completed || 0,
                    remaining:
                        todoListCount?.data?.listedIndustries?.pending || 0,
                    link: {
                        pathname: pathname,
                        query: {
                            tab: 'quarterly-recurring-tasks',
                        },
                    },
                },
            ],
        },
    ]

    const sectionsData = [
        {
            text: 'Up coming appointments',
            count: statistics?.appointmentBooked,
            // link: '/portals/sub-admin/tasks/appointments',
        },
        {
            text: 'Pending workplace requests',
            subText: 'Before Appointment',
            count: statistics?.inProcess,
            link: '/portals/sub-admin/tasks/workplace?tab=my-workplaces',
        },
        {
            text: 'My Agreements Pending',
            count: statistics?.awaitingAgreementSigned,
            link: '/portals/sub-admin/students?tab=agreement-pending',
        },
        // {
        //     text: 'Schedule pending',
        //     count: 2,
        //     link: '',
        // },
        {
            text: 'Pending students',
            subText: 'Same Sector and RTO',
            count: todoListCount?.data?.pendingStudent,
            link: '/portals/sub-admin/students?tab=pending',
        },
        {
            text: 'Tickets pending',
            subText: 'Unclosed',
            count: todoListCount?.data?.openTicket,
            link: '/portals/sub-admin/tickets?tab=all-tickets',
        },
        {
            text: 'Pending industry',
            subText: 'Assigned Student Added',
            count: todoListCount?.data?.pendingIndustries,
            link: '/portals/sub-admin/users/industries?tab=pending',
        },
        // {
        //     text: 'Pending assessment',
        //     count: todoListCount?.data?.pendingAssessment,
        //     link: '/portals/sub-admin/tasks/assessment-evidence?tab=pending',
        // },
        {
            text: 'Urgent Students',
            count: todoListCount?.data?.urgentStudents,
            link: '/portals/sub-admin/students?tab=urgent-students',
        },
    ]

    return (
        <>
            <div>
                <div className="flex flex-col">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="relative flex flex-col items-center">
                                {subadmin?.user.avatar ? (
                                    <div className="w-[100px] h-[100px]">
                                        <Image
                                            src={subadmin?.user.avatar}
                                            width={0}
                                            height={0}
                                            sizes="100vh 100vw"
                                            alt=""
                                            className="w-full h-full rounded-full object-cover shadow-inner-image"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-24 w-24 flex items-center justify-center bg-gray-100 rounded-full">
                                        <span className="text-4xl text-gray-300">
                                            <MdAdminPanelSettings />
                                        </span>
                                    </div>
                                )}
                                <div
                                    className={`${
                                        subadmin?.user?.avatar
                                            ? 'w-[100px] h-[100px]'
                                            : 'w-24 h-24'
                                    } absolute top-0 w-[100px] h-[100px] bg-transparent rounded-full shadow-inner-image`}
                                ></div>
                            </div>
                        </div>
                        <ProfileLinks subadmin={subadmin} />
                    </div>

                    <div className="mt-2">
                        <Typography semibold>
                            <span className="text-[15px]">
                                {subadmin?.user?.name}
                            </span>
                        </Typography>
                        <Typography variant="xs" color="text-[#6B7280]">
                            {subadmin?.user?.email}
                        </Typography>
                    </div>
                </div>

                <div className="mt-1.5 flex flex-col gap-y-1.5">
                    <div className="flex items-center gap-x-[5px]">
                        <UserProfileDetailCard
                            title="Coordinator ID"
                            detail={subadmin?.coordinatorId}
                        />
                        <UserProfileDetailCard
                            title="Phone Number"
                            detail={subadmin?.phone}
                        />
                    </div>
                </div>
                <div className="mt-1.5 flex flex-col gap-y-1.5">
                    <div className="flex items-center gap-x-[5px]">
                        <UserProfileDetailCard
                            title="Location"
                            detail={
                                subadmin?.addressLine1 || 'No Address Provided'
                            }
                        />
                    </div>
                </div>
                <AuthorizedUserComponent
                    roles={[UserRoles.SUBADMIN, UserRoles.ADMIN]}
                    isAssociatedWithRto={false}
                >
                    <div className="mt-5">
                        <div className="flex justify-between">
                            <Typography variant="label" semibold>
                                Todo List:
                            </Typography>
                            {/* <Link href={'/portals/sub-admin/todo-list-details'}>
                            <Typography variant="small" color="text-link">
                                View all
                            </Typography>
                        </Link> */}
                        </div>

                        {/* TODO: New requirements for todo   */}
                        <div className="flex flex-col gap-y-2 mt-2">
                            {todoListData?.map((todo) => (
                                <div key={todo?.text}>
                                    <Typography variant="label" medium>
                                        {todo?.text}
                                    </Typography>

                                    <div className="flex flex-col gap-y-1">
                                        {todo?.lists?.map((todoList, inner) => (
                                            <Link
                                                key={inner}
                                                href={todoList?.link || '#'}
                                            >
                                                <div className="flex items-center justify-between border border-[#6B728050] rounded-md py-3.5 px-2.5 hover:bg-gray-100">
                                                    <div>
                                                        <Typography
                                                            variant="xxs"
                                                            medium
                                                        >
                                                            {todoList?.text}
                                                        </Typography>
                                                        <div className="flex items-center gap-x-2">
                                                            <Typography
                                                                variant="xxs"
                                                                color="text-[#797979]"
                                                            >
                                                                Completed :
                                                            </Typography>
                                                            <Typography
                                                                variant="xxs"
                                                                color="text-[#797979]"
                                                            >
                                                                {
                                                                    todoList?.completed
                                                                }
                                                            </Typography>
                                                        </div>
                                                        <div className="flex items-center gap-x-2">
                                                            <Typography
                                                                variant="xxs"
                                                                color="text-[#797979]"
                                                            >
                                                                Pending :
                                                            </Typography>
                                                            <Typography
                                                                variant="xxs"
                                                                color="text-[#797979]"
                                                            >
                                                                {
                                                                    todoList?.remaining
                                                                }
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <Typography
                                                                variant="small"
                                                                color="text-black"
                                                            >
                                                                {
                                                                    todoList?.count
                                                                }
                                                            </Typography>
                                                        </div>
                                                        {todoList?.count ===
                                                            todoList?.completed &&
                                                            todoList?.completed >
                                                                0 && (
                                                                <IoCheckmarkDoneOutline />
                                                            )}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* <TodoList /> */}
                    </div>
                </AuthorizedUserComponent>
            </div>
        </>
    )
}
