import {
    Appointments,
    Communications,
    PinnedNotesActionBanner,
    RtoInfo,
    StudentAssessmentDocuments,
    StudentHeader,
    StudentInfoMessage,
    StudentOverview,
    StudentOverviewTesting,
    Tickets,
} from './components'

import { ConfigTabs, EmptyData, TabConfig, TechnicalError } from '@components'
import { Skeleton } from '@components/ui/skeleton'
import { ProfileSupportTickets } from '@partials/common'
import { Schedule } from '@partials/common/StudentProfileDetail/components'
import { useGetSubAdminStudentDetailQuery } from '@queries'
import {
    CommonApi,
    setAssessmentReSubmittedCount,
    setAssessmentSubmittedCount,
    setSelectedCourse,
    setStudentDetail,
} from '@redux'
import { Course, Student } from '@types'
import {
    Book,
    Building2,
    CalendarCheck,
    File,
    MessageSquare,
    Ticket,
} from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AllWorkplaces } from './components/AllWorkplaces/AllWorkplaces'
import {
    StudentOverviewSkeleton,
    StudentProfileHeaderSkeleton,
    StudentTopBarSkeleton,
} from './skeletonLoader'
import { getUserCredentials } from '@utils'
import { UserRoles } from '@constants'

export const RtoStudentDetail = () => {
    const router = useRouter()

    const dispatch = useDispatch()

    const role = getUserCredentials()?.role

    const studentId = Number(router.query?.id)
    const profile = useGetSubAdminStudentDetailQuery(studentId, {
        skip: !studentId,
        refetchOnMountOrArgChange: 30,
    })
    // Track profile visitor
    CommonApi.Industries.useAddProfileVisitor(Number(profile?.data?.user?.id), {
        skip: !profile?.data,
    })

    useEffect(() => {
        if (profile?.data) {
            dispatch(setStudentDetail(profile?.data))
        }
        return () => {
            dispatch(setAssessmentSubmittedCount(0))
            dispatch(setAssessmentReSubmittedCount(0))
            dispatch(setSelectedCourse(null as unknown as Course))
        }
    }, [profile?.data])

    const tabs: TabConfig[] = [
        {
            value: 'overview',
            label: 'Overview',
            icon: Book,
            // component: () => (
            //     <div className="space-y-[19.87px] mt-[19.87px]">
            //         <CourseOverview />
            //         <CourseProgress />
            //         <PlacementRequest />
            //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-[19.87px]">
            //             <WorkplaceBio />
            //             <CurrentStatus />
            //         </div>
            //     </div>
            // ),
            component: () => <StudentOverview />,
        },
        {
            value: 'overview-admin',
            label: 'Overview (Testing/ only admin visible)',
            icon: Book,
            component: () => <StudentOverviewTesting />,
            hidden: role !== UserRoles.ADMIN,
        },
        {
            value: 'workplace',
            icon: Building2,
            label: 'Workplace',
            component: () => <AllWorkplaces studentId={studentId} />,
        },
        {
            value: 'communications',
            icon: MessageSquare,
            label: 'Communications',
            component: () => (
                <Communications student={profile?.data as Student} />
            ),
        },
        {
            label: 'Schedule',
            value: 'schedule',
            icon: CalendarCheck,
            component: () => (
                // <Schedule
                //     selectedCourseId={
                //         profile?.data?.courses?.[0]?.id?.toString() || ''
                //     }
                // />
                <Schedule
                    user={profile?.data?.user!}
                    studentId={profile?.data?.id!}
                    student={profile?.data}
                />
            ),
        },
        {
            icon: File,
            value: 'documents',
            label: 'Documents',
            component: () => (
                <StudentAssessmentDocuments
                    student={profile?.data as Student}
                />
            ),
        },
        {
            value: 'appointments',
            icon: CalendarCheck,
            label: 'Appointments',
            component: () => (
                <Appointments student={profile?.data as Student} />
            ),
        },
        {
            value: 'tickets',
            label: 'Tickets',
            icon: Ticket,
            component: () => (
                <div>
                    <Tickets student={profile?.data as Student} />
                </div>
            ),
        },
        {
            value: 'support-tickets',
            label: 'Support Tickets',
            icon: Ticket,
            component: () => (
                <ProfileSupportTickets userId={profile?.data?.user?.id!} />
            ),
        },
    ]

    return (
        <>
            {profile?.isError ? <TechnicalError /> : null}

            {profile?.isLoading ? (
                <div className="bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 min-h-screen">
                    <StudentTopBarSkeleton />
                    <main className="w-full mx-auto px-[13.25px] sm:px-[19.87px] lg:px-[26.5px] py-[19.87px] space-y-6">
                        <StudentProfileHeaderSkeleton />
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                            <div className="flex gap-4 border-b border-slate-50 pb-4 mb-6">
                                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                    <Skeleton
                                        key={i}
                                        className="h-10 w-32 rounded-lg"
                                    />
                                ))}
                            </div>
                            <StudentOverviewSkeleton />
                        </div>
                    </main>
                </div>
            ) : profile?.data && profile?.isSuccess ? (
                <div className="bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
                    {/* Header */}
                    <RtoInfo />

                    <main className="w-full mx-auto px-[13.25px] sm:px-[19.87px] lg:px-[26.5px] py-[19.87px] space-y-4">
                        <StudentHeader student={profile?.data} />
                        <StudentInfoMessage
                            studentUserId={profile?.data?.user?.id}
                        />
                        <PinnedNotesActionBanner
                            userId={profile?.data?.user?.id}
                        />

                        <ConfigTabs
                            tabs={tabs}
                            tabsClasses="bg-white"
                            tabsTriggerClasses="!py-2 data-[state=active]:!bg-primaryNew data-[state=active]:!text-white !text-[13px]"
                        />
                    </main>
                </div>
            ) : profile?.isSuccess ? (
                <EmptyData />
            ) : null}
        </>
    )
}
