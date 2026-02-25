import { Card } from '@components'
import { Brain, CheckCircle2, Clock, MapPin, Star } from 'lucide-react'
import React from 'react'

export const HowItWorks = () => {
    return (
        <Card className="border-border/60 shadow-premium-lg hover:shadow-premium-xl hover:border-primary/40 transition-all hover-lift bg-linear-to-br from-white via-white to-primary/5 relative overflow-hidden group/card">
            <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
            <div className="pb-2">
                <div className="flex items-center gap-2.5">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primaryNew rounded-lg blur opacity-30"></div>
                        <div className="relative h-8 w-8 rounded-lg bg-primaryNew flex items-center justify-center shadow-premium">
                            <Brain className="h-4 w-4 text-white" />
                            <div className="absolute inset-0 rounded-lg bg-linear-to-t from-white/0 to-white/20"></div>
                        </div>
                    </div>
                    <div>
                        <div className="text-sm">Automated Matching</div>
                        <p className="text-xs text-muted-foreground">
                            How it works
                        </p>
                    </div>
                </div>
            </div>
            <div className="space-y-2.5 pt-8">
                <p className="text-xs text-muted-foreground leading-relaxed">
                    Our automation system analyzes course requirements, industry
                    capabilities, location compatibility, and availability to
                    create perfect matches.
                </p>
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
                        <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                        <span className="text-xs font-medium">
                            Course Match
                        </span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/5 border border-secondary/10">
                        <MapPin className="h-3 w-3 text-secondary shrink-0" />
                        <span className="text-xs font-medium">Location</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-accent/5 border border-accent/10">
                        <Clock className="h-3 w-3 text-accent shrink-0" />
                        <span className="text-xs font-medium">
                            Availability
                        </span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-success/5 border border-success/10">
                        <Star className="h-3 w-3 text-success shrink-0" />
                        <span className="text-xs font-medium">Best Fit</span>
                    </div>
                </div>
            </div>
        </Card>
    )
}
