import { useState } from 'react'
import { Card, LoadingAnimation, NoData, Button } from '@components'
import { RtoV2Api } from '@queries'
import { Activity } from 'lucide-react'
import { RecentMatchesModal } from '../modal'
import Link from 'next/link'

export const RecentMatches = () => {
    const last24HoursWp = RtoV2Api.Dashboard.last24HoursWp()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const matchesCount = last24HoursWp?.data?.length || 0

    return (
        <>
            <Card className="border-border/60 shadow-premium-lg hover:shadow-premium-xl hover:border-success/40 transition-all hover-lift bg-linear-to-br from-white via-white to-success/5 relative overflow-hidden group/card flex flex-col h-full">
                <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-success/10 to-transparent rounded-bl-full opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                <div className="pb-2">
                    <div className="flex items-center gap-2.5">
                        <div className="relative">
                            <div className="absolute inset-0 bg-linear-to-br from-success to-emerald-500 rounded-lg blur opacity-30"></div>
                            <div className="relative h-8 w-8 rounded-lg bg-linear-to-br from-success to-emerald-500 flex items-center justify-center shadow-premium">
                                <Activity className="h-4 w-4 text-white" />
                                <div className="absolute inset-0 rounded-lg bg-linear-to-t from-white/0 to-white/20"></div>
                            </div>
                        </div>
                        <div>
                            <div className="text-sm">Recent Matches</div>
                            <p className="text-xs text-muted-foreground">
                                Last 24 hours
                            </p>
                        </div>
                    </div>
                </div>
                <div className="space-y-1.5 pt-8 flex-1">
                    {last24HoursWp?.isError ? (
                        <NoData isError text="Some technical issue!" />
                    ) : null}
                    {last24HoursWp?.isLoading ? (
                        <LoadingAnimation size={70} />
                    ) : last24HoursWp?.data && matchesCount > 0 ? (
                        last24HoursWp?.data?.slice(0, 3)?.map((match) => (
                            <Link
                                href={`/portals/rto/students-and-placements/all-students/${match?.id}/detail`}
                                key={match?.id}
                                className="flex items-center justify-between p-2 rounded-lg bg-primaryNew/5 border border-border/50 hover:border-success/30 transition-all group/item cursor-pointer"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold truncate group-hover/item:text-success transition-colors">
                                        {match?.user?.name} {match?.familyName}
                                    </p>
                                    {/* <p className="text-xs text-muted-foreground truncate">
                                        {match.industry}
                                    </p> */}
                                </div>
                                {/* <Badge
                                    text={match.match}
                                    className="bg-success/10 text-success border-success/20 text-xs py-0.5"
                                /> */}
                            </Link>
                        ))
                    ) : last24HoursWp?.isSuccess ? (
                        <NoData text="No Data Found" />
                    ) : null}
                </div>
                {matchesCount > 3 && (
                    <div className="pt-4 mt-auto">
                        <Button
                            variant="secondary"
                            onClick={() => setIsModalOpen(true)}
                            className="w-full h-9 text-xs bg-success/10 text-success hover:bg-success/20 border-none transition-all cursor-pointer font-medium"
                        >
                            View All Matches
                        </Button>
                    </div>
                )}
            </Card>

            <RecentMatchesModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                matches={last24HoursWp?.data || []}
            />
        </>
    )
}
