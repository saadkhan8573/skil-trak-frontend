import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import { MailsCommunication } from '@partials/common/StudentProfileDetail/components'
import { Student } from '@types'
import { CallLogTab, QuickActions } from './components'

import { CommunicationsSkeleton } from '../../skeletonLoader'

export function Communications({ student }: { student: Student }) {
    if (!student) return <CommunicationsSkeleton />
    return (
        <div className="space-y-6 ">
            {/* Quick Actions Bar */}
            <QuickActions student={student} />

            {/* Communications Tabs */}

            <Tabs defaultValue="messages" className="space-y-6">
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

                    <TabsList className="w-full justify-start bg-slate-100">
                        <TabsTrigger value="messages">
                            Messages & Emails
                        </TabsTrigger>
                        <TabsTrigger value="calls">Call History</TabsTrigger>
                    </TabsList>
                </div>

                {/* Messages Tab */}
                <TabsContent value="messages" className="space-y-4">
                    <div>
                        <MailsCommunication user={student} />
                    </div>
                </TabsContent>

                {/* Call History Tab */}
                <TabsContent value="calls">
                    <CallLogTab studentId={student?.id} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
