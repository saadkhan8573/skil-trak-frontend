import { Card } from '@components'
import { CourseOverViewChart } from './CourseOverViewChart'
import { ProgressDistribution } from './ProgressDistribution'

export const AnalyticsInsight = () => {
    return (
        <div
            className="space-y-2.5 animate-slide-in"
            style={{ animationDelay: '0.3s' }}
        >
            <div className="flex items-center gap-2.5">
                <div className="relative group/number">
                    <div className="absolute inset-0 bg-linear-to-br from-secondary to-primary rounded-lg blur-lg opacity-40 group-hover/number:opacity-60 transition-opacity"></div>
                    <div className="relative h-9 w-9 rounded-lg bg-primaryNew flex items-center justify-center font-bold text-white shadow-premium group-hover/number:shadow-glow-primary transition-all text-sm">
                        <span className="relative">3</span>
                        <div className="absolute inset-0 rounded-lg bg-linear-to-t from-white/0 to-white/20"></div>
                    </div>
                </div>
                <div>
                    <h2 className="text-lg font-bold tracking-tight">
                        Analytics & Insights
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        Student progress and course data
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <Card className="border-border/60 shadow-premium hover:shadow-premium-lg transition-all bg-linear-to-br from-white via-white to-secondary/5">
                    <ProgressDistribution />
                </Card>

                <Card className="border-border/60 shadow-premium hover:shadow-premium-lg transition-all bg-linear-to-br from-white via-white to-primary/5">
                    <div className="">
                        <CourseOverViewChart />{' '}
                    </div>
                </Card>
            </div>
        </div>
    )
}
