import { ConfigTabs, TabConfig } from '@components'
import { ProfileSupportTickets } from '@partials/common'
import { StudentSchedule } from '@partials/common/IndustryProfileDetail/components/StudentSchedule'
import { useAppSelector } from '@redux/hooks'
import { Industry } from '@types'
import {
    BookOpen,
    Calendar,
    Clock,
    FileSignature,
    FileText,
    Image,
    MessageSquare,
    Shield,
    Ticket,
    Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { IndustryCoursesSection } from './courses'
import { AppointmentsModule } from './modules/AppointmentsModule/AppointmentsModule'
import { CommunicationLog } from './modules/CommunicationLog'
import { DocumentsModule } from './modules/DocumentsModule'
import { ESignModule } from './modules/ESignModule'
import { GalleryModule } from './modules/GalleryModule'
import { RTOChecklistModule } from './modules/RtoChecklistModule'
import { TradingHoursModule } from './modules/TradingHoursModule'
import { InsuranceModule } from './modules/InsuranceModule'
import { StudentsPlacementList } from './StudentsPlacementList'

export function OperationalModules({ profile }: { profile: Industry }) {
    const navigationTarget = useAppSelector(
        (state) => state.industry.navigationTarget
    )
    const [activeTab, setActiveTab] = useState('courses')

    useEffect(() => {
        if (navigationTarget?.tab) {
            setActiveTab(navigationTarget.tab)
        }
    }, [navigationTarget?.tab])

    const tabs: TabConfig[] = [
        {
            value: 'courses',
            label: 'Courses & Programs',
            icon: BookOpen,
            component: IndustryCoursesSection,
        },
        {
            value: 'students',
            label: 'Students Placement',
            icon: Users,
            component: StudentsPlacementList,
        },
        {
            value: 'appointments',
            label: 'Appointments',
            icon: Calendar,
            component: AppointmentsModule,
        },
        {
            value: 'hours',
            label: 'Trading Hours',
            icon: Clock,
            component: TradingHoursModule,
        },
        {
            value: 'schedule',
            label: 'Industry Schedule',
            icon: Clock,
            component: StudentSchedule,
        },
        {
            value: 'documents',
            label: 'Required Documents',
            icon: FileText,
            component: DocumentsModule,
        },
        {
            value: 'esign',
            label: 'Pending E-Sign Documents',
            icon: FileSignature,
            component: ESignModule,
        },
        {
            value: 'communication',
            label: 'Communication Log',
            icon: MessageSquare,
            component: CommunicationLog,
        },
        {
            value: 'industry-support-tickets',
            label: 'Industry Support Tickets',
            icon: Ticket,
            component: () => <ProfileSupportTickets userId={profile?.user?.id} />,
        },
        {
            value: 'rto-checklist',
            label: 'RTO Checklist',
            icon: Shield,
            component: RTOChecklistModule,
        },
        {
            value: 'insurance',
            label: 'Insurance Documents',
            icon: FileText,
            component: InsuranceModule,
        },
        {
            value: 'gallery',
            label: 'Gallery',
            icon: Image,
            component: GalleryModule,
        },

    ]

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-[#1A2332] mb-0.5">Operational Modules</h2>
                <p className="text-[#64748B] text-xs">
                    Manage day-to-day operations and configurations
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
                {/* Tab Navigation */}
                <ConfigTabs
                    tabs={tabs}
                    value={activeTab}
                    onValueChange={setActiveTab}
                />
            </div>
        </div>
    )
}
