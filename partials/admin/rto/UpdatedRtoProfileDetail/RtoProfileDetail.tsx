import { Card } from '@components'
import { UserRoles } from '@constants'
import { Notes, ProfileAppointments, UpdatedCourseList } from '@partials/common'
import { MailsCommunication } from '@partials/common/StudentProfileDetail/components'
import { SubAdminApi } from '@queries'
import { Rto, SubAdmin } from '@types'
import { getSectors, getUserCredentials } from '@utils'
import {
    InsuranceDocumentsData,
    RtoAssessmentTools,
    RtoNotifications,
    RtoProfileStatistics,
    RtoProfileTopbar,
    RtoReports,
    RtoSectors,
} from './components'
import { DynamicPermissionsTab } from '@partials/admin/permissions'

export const RtoProfileDetail = ({ rto }: { rto: Rto }) => {
    const role = getUserCredentials()?.role

    const subadmin = SubAdminApi.SubAdmin.useProfile(undefined, {
        skip: role === UserRoles.ADMIN,
    })
    const sectorsWithCourses = getSectors(rto?.courses)

    return (
        <div className="px-2.5 py-5">
            <RtoProfileTopbar rtoUserId={rto?.user?.id} />

            <RtoProfileStatistics
                rtoUserId={rto?.user?.id}
                subadmin={subadmin}
                rto={rto}
            />

            {/* Sector */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-3 mt-5 h-506px">
                {role === UserRoles.ADMIN ? (
                    <Card fullHeight>
                        <UpdatedCourseList
                            sectorsWithCourses={sectorsWithCourses}
                            editCourseHours
                            rtoUserId={rto?.user?.id}
                        />
                    </Card>
                ) : (
                    <RtoSectors courses={rto?.courses} userId={rto?.user?.id} />
                )}
                <div className="h-full">
                    <Notes userId={rto?.user?.id} />
                </div>
            </div>

            <div className="mt-5 h-420px">
                <InsuranceDocumentsData userId={rto?.user?.id} />
            </div>

            {/* Appointments */}
            <div className="mt-5 h-570px">
                <ProfileAppointments
                    link={
                        role === UserRoles.ADMIN
                            ? {
                                  pathname:
                                      '/portals/admin/appointment-type/create-appointment',
                                  query: {
                                      rto: rto?.user?.id,
                                  },
                              }
                            : role === UserRoles.SUBADMIN
                              ? {
                                    pathname:
                                        '/portals/sub-admin/tasks/appointments/create-appointment',
                                    query: {
                                        rto: rto?.user?.id,
                                    },
                                }
                              : null
                    }
                    userId={rto?.user?.id}
                    fullWidth
                />
            </div>

            {/* Assessment Tools */}
            <div className="mt-5 h-405px">
                <RtoAssessmentTools
                    rtoUser={rto?.user}
                    courses={rto?.courses}
                />
            </div>

            {/* Reports */}
            <div className="mt-5 h-405px">
                <RtoReports
                    user={rto?.user}
                    subadmin={subadmin?.data as SubAdmin}
                    createdAt={rto?.createdAt as Date}
                />
            </div>

            {/* Mails */}
            <div className="mt-5">
                <MailsCommunication user={rto} />
            </div>

            {/* Notifications */}
            <div className="mt-5 h-135">
                <RtoNotifications rtoUser={rto?.user} />
            </div>

            {/* Dynamic Permissions */}
            <div className="mt-6 transition-all duration-500">
                <Card
                    className="overflow-hidden border-0 shadow-2xl rounded-xl"
                    noPadding
                >
                    <div className="bg-primaryNew px-4 py-2 text-white relative overflow-hidden group">
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xl font-bold tracking-tight">
                                        Permissions
                                    </h3>
                                    <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                                </div>
                                <p className="text-white/80 text-[13px] max-w-md font-medium leading-relaxed">
                                    Strategic access management and RTO-specific
                                    permission controls. Customize functional
                                    boundaries with precision.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50/30">
                        <DynamicPermissionsTab rtoUserId={rto?.user?.id} />
                    </div>
                </Card>
            </div>
        </div>
    )
}
