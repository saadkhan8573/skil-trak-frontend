import React from 'react'
import { Activity } from 'lucide-react'
import { StatsCard } from '../components'
export const InProgressTicketsTab = ({ count }: any) => {
    return (
        <>
            <div
                className="mb-4 animate-slide-up"
                style={{ animationDelay: '0.15s' }}
            >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <StatsCard
                        icon={<Activity className="w-4 h-4" />}
                        label="In-progress"
                        value={count?.data?.IN_PROGRESS ?? 0}
                        color="indigo"
                        gradient="from-indigo-500 to-sky-600"
                    />
                    {/* <StatsCard
                        icon={<TrendingUp className="w-4 h-4" />}
                        label="This Week"
                        value={9}
                        color="dark"
                        gradient="from-[#044866] to-[#0D5468]"
                    /> */}
                    {/* <StatsCard
                        icon={<Clock className="w-4 h-4" />}
                        label="This Month"
                        value={10}
                        color="teal"
                        gradient="from-[#0D5468] to-[#0891b2]"
                    /> */}
                    {/* <StatsCard
                        icon={<Sparkles className="w-4 h-4" />}
                        label="Avg Resolution"
                        value="2.4d"
                        color="orange"
                        gradient="from-[#F7A619]/80 to-[#F7A619]"
                    /> */}
                </div>
            </div>
        </>
    )
}
