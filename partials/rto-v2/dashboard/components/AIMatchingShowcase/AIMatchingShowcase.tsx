import { Badge, Button } from '@components'
import { Sparkles, Zap } from 'lucide-react'
import { HowItWorks, MatchingStats, RecentMatches } from './components'
import { ReactElement, useState } from 'react'
import { StartMatchingAutoWP } from '../../modal'

export const AIMatchingShowcase = () => {
    const [modal, setModal] = useState<ReactElement | null>(null)

    const onCancel = () => setModal(null)

    const onStartMatching = () => {
        setModal(<StartMatchingAutoWP onCancel={onCancel} />)
    }
    return (
        <>
            {modal}
            <div
                className="space-y-2.5 animate-slide-in"
                style={{ animationDelay: '0.2s' }}
            >
                {/* Header - Compact */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2.5">
                        <div className="relative group/number">
                            <div className="absolute inset-0 bg-linear-to-br from-accent to-accent rounded-lg blur-lg opacity-40 group-hover/number:opacity-60 transition-opacity"></div>
                            <div className="relative h-9 w-9 rounded-lg bg-primary flex items-center justify-center font-bold text-white shadow-premium group-hover/number:shadow-glow-accent transition-all text-sm">
                                <span className="relative">2</span>
                                <div className="absolute inset-0 rounded-lg bg-linear-to-t from-white/0 to-white/20"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold tracking-tight">
                                    Industry Matching through Automation
                                </h2>
                                <Badge
                                    text={'NEW'}
                                    Icon={() => (
                                        <Sparkles
                                            className="text-[9px]!"
                                            size={14}
                                        />
                                    )}
                                    shape="rounded"
                                    // className="relative bg-gradient-to-r from-accent to-accent text-white border-0 shadow-accent hover-lift overflow-hidden group/new text-xs px-1.5 py-0.5"
                                />

                                {/* Info Icon with Popover */}
                                {/*  */}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Match students with eligible workplaces
                            </p>
                        </div>
                    </div>
                    {/* <Button
                        Icon={Zap}
                        text="Start Matching"
                        onClick={() => onStartMatching()}
                    /> */}
                </div>

                {/* Main Content - Compact Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5">
                    {/* Live Matching Stats */}
                    <MatchingStats />

                    {/* Recent Matches */}
                    <RecentMatches />

                    {/* How It Works */}
                    <HowItWorks />
                </div>
            </div>
        </>
    )
}
