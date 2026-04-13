import { Button, Permissions } from '@components'
import { UserRoles } from '@constants'
import { ScheduleAppointmentModal } from '@partials/rto-v2/appointments'
import { useGetSubAdminStudentDetailQuery } from '@queries'
import { PermissionType } from '@types'
import { getUserCredentials } from '@utils'
import { Calendar, Sparkles } from 'lucide-react'
import { useRouter } from 'next/router'
import { useState } from 'react'

export const AppointmentHeader = () => {
    const [scheduleOpen, setScheduleOpen] = useState(false)

    const router = useRouter()
    const studentId = Number(router.query?.id)
    const profile = useGetSubAdminStudentDetailQuery(studentId, {
        skip: !studentId,
        refetchOnMountOrArgChange: 30,
    })

    const { role } = getUserCredentials()

    const getAppointmentLink = () => {
        if (role === UserRoles.ADMIN) {
            return {
                pathname: '/portals/admin/appointment-type/create-appointment',
                query: { student: profile?.data?.user?.id },
            }
        } else if (role === UserRoles.SUBADMIN) {
            return {
                pathname:
                    '/portals/sub-admin/tasks/appointments/create-appointment',
                query: { student: profile?.data?.user?.id },
            }
        }
        return null
    }

    const onScheduleClicked = () => {
        const link = getAppointmentLink()
        if (link) {
            router.push(link)
        } else {
            setScheduleOpen(true)
        }
    }
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl p-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-linear-to-br from-[#044866] to-[#0D5468] flex items-center justify-center shadow-lg shadow-[#044866]/20">
                        <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-slate-900 flex items-center gap-2">
                            Appointments
                            <Sparkles className="w-5 h-5 text-[#F7A619]" />
                        </h3>
                        <p className="text-slate-600 text-sm">
                            Manage and track student appointments
                        </p>
                    </div>
                </div>

                {/*  */}
                <ScheduleAppointmentModal
                    defaultSelectedParicipantType={UserRoles.STUDENT}
                    defaultSelectedUser={profile?.data}
                    scheduleOpen={scheduleOpen}
                    setScheduleOpen={setScheduleOpen}
                />
                <Permissions
                    permission={PermissionType.BOOK_STUDENT_APPOINTMENTS}
                >
                    <Button
                        onClick={onScheduleClicked}
                        className="shrink-0 bg-linear-to-r from-[#044866] to-[#0D5468] hover:from-[#0D5468] hover:to-[#044866] shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                    >
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule New
                    </Button>
                </Permissions>
            </div>
        </div>
    )
}
