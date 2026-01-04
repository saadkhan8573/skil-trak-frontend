import { Skeleton } from '@components/ui/skeleton'

export function WorkflowTrackerSkeleton() {
    return (
        <div className="px-8 py-8 bg-gradient-to-b from-white/80 via-white/70 to-white/60 backdrop-blur-xl border-b border-slate-200/80 shadow-inner">
            <div className="max-w-[1900px] mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 px-4 py-2.5 bg-[#044866]/5 rounded-xl border border-[#044866]/20">
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-10 h-10 rounded-lg bg-[#044866]/50" />
                                <div className="space-y-1">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8 space-y-6">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-40 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full bg-slate-100" />
                    <div className="grid grid-cols-6 lg:grid-cols-12 gap-2 mt-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                            <div key={i} className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200">
                                <Skeleton className="w-8 h-8 rounded-full" />
                                <Skeleton className="h-3 w-12 hidden lg:block" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
