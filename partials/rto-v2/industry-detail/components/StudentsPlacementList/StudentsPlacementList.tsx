import {
    ListHeader,
    CategoryFilters,
    StatsOverview,
    StudentsList,
    WaitingStudents,
    RejectedStudentsList,
    CancelledStudentsList,
    TerminatedStudentsList,
    WaitingForRtoStudents,
    WaitingForStudents,
    StudentsProvidedList,
} from './components'

import { ConfigTabs, TabConfig } from '@components'
import { Users, Clock, Ban, XCircle, FileCheck } from 'lucide-react'
import { useState } from 'react'

const AllStudents = () => (
    <div className="space-y-4">
        <ListHeader />
        <CategoryFilters />
        <StatsOverview />
        <StudentsList />
    </div>
)

const StudentProvided = () => (
    <div className="space-y-4">
        {/* <ListHeader /> */}
        <CategoryFilters />
        {/* <StatsOverview /> */}
        <StudentsProvidedList />
    </div>
)

export function StudentsPlacementList() {
    const [activeTab, setActiveTab] = useState<string>('all')

    const tabs: TabConfig[] = [
        {
            value: 'all',
            label: 'All Students',
            icon: Users,
            component: AllStudents,
        },
        {
            value: 'provided',
            label: 'Student Provided',
            icon: Users,
            component: StudentProvided,
        },
        // RejectedStudentsList
        {
            value: 'waiting_for_industry',
            label: 'Waiting for Industry',
            icon: Clock,
            component: WaitingStudents,
        },
        {
            value: 'waiting_for_rto',
            label: 'Waiting for RTO',
            icon: FileCheck,
            component: WaitingForRtoStudents,
        },
        {
            value: 'rejected_students',
            label: 'Rejected Students',
            icon: Ban,
            component: RejectedStudentsList,
        },
        {
            value: 'cancelled_students',
            label: 'Cancelled Students',
            icon: XCircle,
            component: CancelledStudentsList,
        },
        {
            value: 'terminated_students',
            label: 'Terminated Students',
            icon: Ban,
            component: TerminatedStudentsList,
        },
        {
            value: 'waiting_for_student',
            label: 'Waiting for Student',
            icon: Clock,
            component: WaitingForStudents,
        },
    ]

    return (
        <div className="space-y-4 px-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 pt-3">
                    <ConfigTabs
                        tabs={tabs}
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="p-1! bg-slate-100! rounded-lg! w-full"
                        tabsClasses="!p-1.5 !rounded-md"
                        tabsTriggerClasses="!py-1.5 !px-4 !text-xs !font-medium"
                    />
                </div>
            </div>
        </div>
    )
}
