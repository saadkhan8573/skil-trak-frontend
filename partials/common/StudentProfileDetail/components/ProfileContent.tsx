import { UserRoles } from '@constants'
import { ProfileAppointments } from '@partials/common/ProfileAppointments'
import { ProfileIds } from '../types'
import { AssessmentSubmissions } from './AssessmentsSubmission'
import { MailsCommunication } from './MailsCommunication'
import { Schedule } from './Schedule'
import { Tickets } from './Tickets'
import { Workplace } from './Workplace'
import { StudentProfileNotes } from '@partials/common/Notes'

export const WorkplaceNotesSection: React.FC<any> = ({
    profile,
    role,
    subadmin,
    workplaceLength,
    getWorkplaceLength,
    getActiveBorder,
    isAdminRole,
}) => (
    <div
        className={`grid grid-cols-1 h-auto  px-2 gap-x-3`}
        // className={`grid grid-cols-1 h-auto ${
        //     isAdminRole ? 'xl:grid-cols-1 gap-3' : `xl:grid-cols-5 `
        // } px-2 gap-x-3`}
    >
        <div
            className={`h-[99%] ${getActiveBorder(ProfileIds.Workplace)}`}
            id={`student-profile-${ProfileIds.Workplace}`}
        >
            <Workplace
                getWorkplaceLength={getWorkplaceLength}
                student={profile}
            />
        </div>
        {/* <div
            className={`${isAdminRole ? 'xl:col-span-1' : 'xl:col-span-2'
                } h-[99%] ${getActiveBorder(ProfileIds.Notes)}`}
            id={`student-profile-${ProfileIds.Notes}`}
        >
            <StudentProfileNotes
                userId={profile?.user?.id}
                studentId={profile?.id}
            />
        </div> */}
    </div>
)

export const AssessmentSection: React.FC<any> = ({
    profile,
    getActiveBorder,
}) => (
    <div
        className={`${getActiveBorder(ProfileIds['Assessment Evidence'])} px-2`}
        id={`student-profile-${ProfileIds['Assessment Evidence']}`}
    >
        <AssessmentSubmissions student={profile} />
    </div>
)

export const CommunicationSection: React.FC<any> = ({
    profile,
    getActiveBorder,
}) => (
    <div
        id={`student-profile-${ProfileIds['All Communications']}`}
        className={`h-[640px] px-2 grid grid-cols-2 gap-x-3 ${getActiveBorder(
            ProfileIds['All Communications']
        )}`}
    >
        <div className="!h-[99%] col-span-2">
            <MailsCommunication user={profile} />
        </div>
    </div>
)

export const AppointmentsTicketsSection: React.FC<any> = ({
    profile,
    role,
    subadmin,
    getActiveBorder,
}) => {
    const getAppointmentLink = () => {
        if (role === UserRoles.ADMIN || subadmin?.data?.isAdmin) {
            return {
                pathname: '/portals/admin/appointment-type/create-appointment',
                query: { student: profile?.user?.id },
            }
        } else if (role === UserRoles.SUBADMIN) {
            return {
                pathname:
                    '/portals/sub-admin/tasks/appointments/create-appointment',
                query: { student: profile?.user?.id },
            }
        }
        return null
    }

    return (
        <div className="h-[600px] px-3 grid grid-cols-1 xl:grid-cols-2 gap-y-5 gap-x-3">
            <div
                id={`student-profile-${ProfileIds.Appointments}`}
                className={`${getActiveBorder(
                    ProfileIds.Appointments
                )} !h-[99%] overflow-hidden`}
            >
                <ProfileAppointments
                    link={getAppointmentLink()}
                    userId={profile?.user?.id}
                />
            </div>
            <div
                id={`student-profile-${ProfileIds.Tickets}`}
                className={`${getActiveBorder(
                    ProfileIds.Tickets
                )} !h-[99%] overflow-hidden`}
            >
                <Tickets studentId={profile?.id} />
            </div>
        </div>
    )
}

export const ScheduleSection: React.FC<any> = ({
    profile,
    getActiveBorder,
}) => (
    <div
        className={getActiveBorder(ProfileIds.Schedule)}
        id={`student-profile-${ProfileIds.Schedule}`}
    >
        <Schedule
            user={profile?.user}
            studentId={profile?.id}
            student={profile}
        />
    </div>
)
