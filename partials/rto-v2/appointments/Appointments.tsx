import { ConfigTabs } from '@components/ConfigTabs/ConfigTabs'
import {
    Ban,
    Calendar as CalendarIcon,
    CheckCircle,
    Clock,
    History,
    RefreshCw,
    Search,
    TrendingUp,
    Plus,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../components/ui/button'

import { Card, Permissions, Select, TextInput } from '@components'
import { RtoApi } from '@queries'
import { KPIStatCard } from './KpiStatsCard'
import { ScheduleAppointmentModal } from './modals'
import { getUserCredentials } from '@utils'
import { UserRoles } from '@constants'
import { useRouter } from 'next/router'
import {
    CancelledAppointments,
    PastAppointments,
    UpcomingAppointments,
} from './tabs'
import { Skeleton } from '@components/ui/skeleton'
import { PermissionType } from '@types'

interface Appointment {
    id: string
    title: string
    description: string
    date: string
    time: string
    duration: string
    type: 'meeting' | 'phone' | 'video' | 'site-visit'
    status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
    participants: string[]
    location?: string
    meetingLink?: string
    category: 'placement' | 'student' | 'industry' | 'admin' | 'training'
    priority: 'high' | 'normal' | 'low'
    notes?: string
}

export const Appointments = () => {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')
    const [scheduleOpen, setScheduleOpen] = useState(false)
    const [filterCategory, setFilterCategory] = useState<string>('all')
    const today = new Date().toISOString().split('T')[0]
    const counts = RtoApi.Appointments.useRtoAppointmentsCount()

    // 1. Stats Configuration
    const statsConfig = [
        {
            id: 'cancelled',
            label: 'Cancelled',
            value: counts?.data?.cancelled ?? 0,
            icon: Clock,
            subtitle: 'Cancelled Appointments',
            variant: 'warning' as const,
        },
        {
            id: 'upcoming',
            label: 'Upcoming',
            value: counts?.data?.future ?? 0,
            icon: TrendingUp,
            subtitle: 'In the future',
            variant: 'default' as const,
        },
        {
            id: 'past',
            label: 'Past',
            value: counts?.data?.past ?? 0,
            icon: CheckCircle,
            subtitle: 'Past Appointments',
            variant: 'success' as const,
        },
    ]

    // 2. Tabs Configuration
    const tabsConfig = [
        {
            value: 'cancelled',
            label: 'Cancelled',
            icon: Ban,
            count: counts?.data?.cancelled ?? 0,
            component: CancelledAppointments,
        },
        {
            value: 'upcoming',
            label: 'Upcoming',
            icon: TrendingUp,
            count: counts?.data?.future ?? 0,
            component: UpcomingAppointments,
        },
        {
            value: 'past',
            label: 'Past',
            icon: History,
            count: counts?.data?.past ?? 0,
            component: PastAppointments,
        },
    ]

    return (
        <div className="min-h-screen bg-background container mx-auto space-y-5">
            <div className="space-y-3.5 animate-fade-in">
                {/* Header - Compact */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-linear-to-br from-[#044866] to-[#0D5468] rounded-lg blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative h-11 w-11 rounded-lg bg-linear-to-br from-[#044866] to-[#0D5468] flex items-center justify-center shadow-lg ring-1 ring-white/20">
                                <CalendarIcon className="h-5 w-5 text-white" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Appointments
                            </h1>
                            <p className="text-xs text-slate-500 font-medium">
                                Manage your schedule and meetings efficiently
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 h-8 text-xs font-medium hover:bg-slate-50"
                        >
                            <RefreshCw className="h-3.5 w-3.5" />
                            Refresh
                        </Button> */}
                        <div className="flex items-center gap-2">
                            <ScheduleAppointmentModal
                                scheduleOpen={scheduleOpen}
                                setScheduleOpen={setScheduleOpen}
                            />
                            <Permissions
                                permission={[
                                    PermissionType.BOOK_STUDENT_APPOINTMENTS,
                                ]}
                            >
                                <Button
                                    onClick={() => {
                                        const { role } = getUserCredentials()
                                        if (role === UserRoles.ADMIN) {
                                            router.push(
                                                '/portals/admin/appointment-type/create-appointment'
                                            )
                                        } else if (
                                            role === UserRoles.SUBADMIN
                                        ) {
                                            router.push(
                                                '/portals/sub-admin/tasks/appointments/create-appointment'
                                            )
                                        } else {
                                            setScheduleOpen(true)
                                        }
                                    }}
                                    className="bg-linear-to-r from-[#044866] to-[#0D5468] hover:from-[#0D5468] hover:to-[#044866] text-white shadow-lg shadow-[#044866]/20 transition-all h-10 px-6 rounded-lg font-medium flex items-center gap-2 border-0"
                                >
                                    <Plus className="h-4 w-4" />
                                    Schedule New
                                </Button>
                            </Permissions>
                        </div>
                    </div>
                </div>

                {/* KPI Stats - Mapped */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {counts.isLoading
                        ? [1, 2, 3].map((i) => (
                              <Skeleton
                                  key={i}
                                  className="h-24 w-full rounded-xl"
                              />
                          ))
                        : statsConfig.map((stat) => (
                              <KPIStatCard
                                  key={stat.id}
                                  label={stat.label}
                                  value={stat.value}
                                  icon={stat.icon}
                                  subtitle={stat.subtitle}
                                  variant={stat.variant}
                              />
                          ))}
                </div>

                {/* Main Content with ConfigTabs */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <ConfigTabs
                        tabs={tabsConfig}
                        defaultValue="upcoming"
                        tabsClasses="bg-slate-50/50 border-b border-slate-100 p-1 gap-2 rounded-t-xl rounded-b-none"
                    />
                </div>
            </div>
        </div>
    )
}
