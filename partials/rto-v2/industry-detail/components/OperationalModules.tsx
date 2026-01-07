import { ConfigTabs, TabConfig } from '@components'
import {
    BookOpen,
    Calendar,
    Clock,
    FileText,
    FileSignature,
    Image,
    MessageSquare,
    Shield,
    Users,
} from 'lucide-react'
import { GalleryModule } from './modules/GalleryModule'
import { DocumentsModule } from './modules/DocumentsModule'
import { ESignModule } from './modules/ESignModule'
import { CommunicationLog } from './modules/CommunicationLog'
import { StudentsPlacementList } from './StudentsPlacementList'
import { TradingHoursModule } from './modules/TradingHoursModule'
import { RTOChecklistModule } from './modules/RtoChecklistModule'
import { AppointmentsModule } from './modules/AppointmentsModule/AppointmentsModule'
import { IndustryCoursesSection } from './courses'
import { useAppSelector } from '@redux/hooks'
import { useEffect, useState } from 'react'
import { StudentSchedule } from '@partials/common/IndustryProfileDetail/components/StudentSchedule'

export function OperationalModules() {
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
            label: 'E-Sign Documents',
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
            value: 'rto-checklist',
            label: 'RTO Checklist',
            icon: Shield,
            component: RTOChecklistModule,
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
