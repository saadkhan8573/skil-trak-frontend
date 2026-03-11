import { UserStatus } from '@types'
import { ProfileCountsCard, StudentCountCard } from '../cards'

import { UserRoles } from '@constants'
import { SubAdminApi } from '@queries'
import { getUserCredentials } from '@utils'
import { useRouter } from 'next/router'

import { HiUserCircle } from 'react-icons/hi'
import {
    SiHomeassistantcommunitystore,
    SiSimpleanalytics,
} from 'react-icons/si'

export interface RtoProfileCountDataType {
    title: string
    count: number
    Icon: any
    loading: boolean
    background: Background
    link?: {
        pathname: string
        query?: {
            [key: string]: string | number | boolean
        }
    }
    customDetail?: {
        text: string
        onClick?: Function
    }
}

export interface Background {
    from: string
    to: string
}

export const ProfileCounts = ({
    statisticsCount,
}: {
    statisticsCount: any
}) => {
    const router = useRouter()

    const role = getUserCredentials()?.role
    const subadmin = SubAdminApi.SubAdmin.useProfile(undefined, {
        skip: role !== UserRoles.SUBADMIN,
        refetchOnMountOrArgChange: true,
    })

    const countsData: RtoProfileCountDataType[] = [
        {
            title: 'Pending Student',
            count: Number(statisticsCount?.data?.pendingStudent),
            Icon: HiUserCircle,
            loading: statisticsCount?.isLoading,
            link: {
                pathname: '/portals/rto/students',
                query: {
                    tab: 'pending',
                },
            },
            background: {
                from: '#3E3D45',
                to: '#202020',
            },
        },
        {
            title: 'Total Students Received',
            count: Number(statisticsCount?.data?.allStudents),
            Icon: HiUserCircle,
            loading: statisticsCount?.isLoading,
            link: {
                pathname: '/portals/rto/students',
                query: {
                    tab: 'archived',
                },
            },
            background: {
                from: '#3E3D45',
                to: '#202020',
            },
        },
        {
            title: 'Completed Student',
            count: Number(statisticsCount?.data?.completedStudent),
            Icon: HiUserCircle,
            loading: statisticsCount?.isLoading,
            link: {
                pathname:
                    role === UserRoles.ADMIN || subadmin?.data?.isAdmin
                        ? '/portals/admin/student'
                        : role === UserRoles.SUBADMIN
                          ? '/portals/sub-admin/students'
                          : '',
                query: {
                    tab: 'completed',
                    page: 1,
                    pageSize: 50,
                    rtoId: Number(router?.query?.id),
                    completed: String(true),
                },
            },
            background: {
                from: '#3E3D45',
                to: '#202020',
            },
        },
        {
            title: 'Archive/Block Students',
            count: Number(statisticsCount?.data?.combined),
            Icon: HiUserCircle,
            loading: statisticsCount?.isLoading,
            link: {
                pathname:
                    role === UserRoles.ADMIN || subadmin?.data?.isAdmin
                        ? '/portals/admin/student'
                        : role === UserRoles.SUBADMIN
                          ? '/portals/sub-admin/students'
                          : '',
                query: {
                    tab: 'archive',
                    page: 1,
                    pageSize: 50,
                    rtoId: Number(router?.query?.id),
                    status: UserStatus.Archived,
                },
            },
            background: {
                from: '#3E3D45',
                to: '#202020',
            },
        },
        {
            title: 'Active Students',
            count: Number(statisticsCount?.data?.currentStudent),
            Icon: HiUserCircle,
            loading: statisticsCount?.isLoading,
            link: {
                pathname:
                    role === UserRoles.ADMIN || subadmin?.data?.isAdmin
                        ? '/portals/admin/student'
                        : role === UserRoles.SUBADMIN
                          ? '/portals/sub-admin/students'
                          : '',
                query: {
                    tab: 'active',
                    page: 1,
                    pageSize: 50,
                    rtoId: Number(router?.query?.id),
                    status: UserStatus.Approved,
                },
            },
            background: {
                from: '#3E3D45',
                to: '#202020',
            },
        },
        {
            title: 'Reported Students',
            count: Number(statisticsCount?.data?.flaggedStudents),
            Icon: HiUserCircle,
            loading: statisticsCount?.isLoading,
            link: {
                pathname:
                    role === UserRoles.ADMIN || subadmin?.data?.isAdmin
                        ? '/portals/admin/student'
                        : role === UserRoles.SUBADMIN
                          ? '/portals/sub-admin/students'
                          : '',
                query: {
                    tab: 'pending',
                    page: 1,
                    pageSize: 50,
                    rtoId: Number(router?.query?.id),
                    status: UserStatus.Pending,
                },
            },
            background: {
                from: '#E93B77',
                to: '#DA1F63',
            },
        },
        {
            title: 'Schedule Completed',
            count: Number(statisticsCount?.data?.scheduleCompleted),
            Icon: SiHomeassistantcommunitystore,
            loading: statisticsCount?.isLoading,
            background: {
                from: '#63B967',
                to: '#4BA64F',
            },
        },
        {
            title: 'Placement Started',
            count: Number(statisticsCount?.data?.placementStarted),
            Icon: SiSimpleanalytics,
            loading: statisticsCount?.isLoading,
            link:
                role === UserRoles.SUBADMIN
                    ? {
                          pathname:
                              '/portals/sub-admin/tasks/assessment-evidence',
                          query: {
                              tab: 'pending',
                              page: 1,
                              pageSize: 50,
                              rtoId: Number(router?.query?.id),
                              result: UserStatus.Pending,
                          },
                      }
                    : undefined,
            background: {
                from: '#439DEE',
                to: '#1E78E9',
            },
        },
    ]
    return (
        <div className="mt-[18px] h-[calc(100%-18px)] flex flex-col justify-between">
            <StudentCountCard
                newAddedStudents={statisticsCount?.data?.newAddedStudents}
            />
            <div className="mt-[18px] grid grid-cols-2 gap-x-3.5 gap-y-[18px]">
                {countsData.map((data, i) => (
                    <div key={i} className="mt-[18px]">
                        <ProfileCountsCard data={data} />
                    </div>
                ))}
            </div>
        </div>
    )
}
