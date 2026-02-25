import { RtoV2Api } from '@queries'
import {
    AdminMessage,
    AIMatchingShowcase,
    AnalyticsInsight,
    AvailableServices,
    WelcomeCard,
} from './components'
import moment from 'moment'
import { Title } from '../components'
import { Badge, StudentAISearch, Typography } from '@components'
import { Sparkles } from 'lucide-react'

export const RtoDashboardV2 = () => {
    const adminMessage = RtoV2Api.Dashboard.adminMessage()
    return (
        <div className="space-y-4">
            <WelcomeCard />
            {adminMessage?.data && (
                <AdminMessage
                    type={adminMessage?.data?.urgencyLevel}
                    title={adminMessage?.data?.title}
                    message={adminMessage?.data?.message}
                    from={adminMessage?.data?.senderName}
                    date={moment(adminMessage?.data?.createdAt).fromNow()}
                    onDismiss={() => { }}
                />
            )}

            <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <Title
                        title="Search for Students"
                        description="Type a student name, ID, or email to find their profile and get instant AI-powered insights"
                        Icon={() => (
                            <Typography
                                variant="small"
                                bold
                                color={'text-white'}
                            >
                                1
                            </Typography>
                        )}
                    />
                    <Badge
                        Icon={Sparkles}
                        text="AI Powered"
                        shape="pill"
                        className="relative bg-linear-to-r from-accent/15 to-accent/10 border-accent/30 text-accent shadow-sm px-2.5 py-1 hover-lift overflow-hidden group/ai"
                    />
                </div>
                <StudentAISearch />
            </div>

            {/*  */}
            <AIMatchingShowcase />

            {/*  */}
            <AnalyticsInsight />

            {/*  */}
            <AvailableServices />
        </div>
    )
}
