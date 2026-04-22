import { MailsCommunication } from '@partials/common/StudentProfileDetail/components'
import { Student } from '@types'
import { CallLogTab, QuickActions } from './components'
import { ConfigTabs } from '@components'

import { CommunicationsSkeleton } from '../../skeletonLoader'

const MailsTab = ({ user }: any) => (
    <div className="space-y-4">
        <MailsCommunication user={user} />
    </div>
)

const CallsTab = ({ studentId }: any) => <CallLogTab studentId={studentId} />

export function Communications({ student }: { student: Student }) {
    const tabs = [
        {
            value: 'messages',
            label: 'Messages & Emails',
            component: MailsTab,
        },
        {
            value: 'calls',
            label: 'Call History',
            component: CallsTab,
        },
    ]

    if (!student) return <CommunicationsSkeleton />
    return (
        <div className="space-y-6 ">
            {/* Quick Actions Bar */}
            <QuickActions student={student} />

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-slate-900">
                            Communication History
                        </h3>
                        <p className="text-sm text-slate-600">
                            View and manage all communications
                        </p>
                    </div>
                </div>

                <ConfigTabs
                    defaultValue="messages"
                    props={{ user: student, studentId: student?.id }}
                    tabs={tabs}
                />
            </div>
        </div>
    )
}
