import { Card, Permissions } from '@components'
import { UserRoles } from '@constants'
import { Notes, ProfileAppointments, UpdatedCourseList } from '@partials/common'
import { MailsCommunication } from '@partials/common/StudentProfileDetail/components'
import { SubAdminApi } from '@queries'
import { PermissionType, Rto, SubAdmin } from '@types'
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
import {
    DynamicPermissionCard,
    DynamicPermissionsTab,
} from '@partials/admin/permissions'

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

            <Permissions permission={[PermissionType.UPDATE_RTO_PERMISSION]}>
                {/* Dynamic Permissions */}
                <DynamicPermissionCard userId={rto?.user?.id} />
            </Permissions>
        </div>
    )
}
