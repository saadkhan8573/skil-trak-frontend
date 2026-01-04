import { Skeleton } from '@components/ui/skeleton'

export function TasksSkeleton() {
    return (
        <div className="space-y-7">
            {/* Current Actions Skeleton */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden border-l-4 border-l-[#044866]">
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-7 w-64 bg-slate-200" />
                            <Skeleton className="h-4 w-48 bg-slate-100" />
                        </div>
                        <Skeleton className="w-12 h-12 rounded-xl bg-slate-100" />
                    </div>
                    <Skeleton className="h-32 rounded-xl bg-slate-50" />
                    <div className="flex gap-3">
                        <Skeleton className="h-12 flex-1 rounded-xl bg-[#044866]/10" />
                        <Skeleton className="h-12 w-12 rounded-xl bg-slate-100" />
                    </div>
                </div>
            </div>

            {/* Highlighted Tasks Skeleton */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-[#F7A619] to-[#F7A619]/80 px-5 py-4 flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-xl bg-white/20" />
                    <Skeleton className="h-5 w-48 bg-white/30" />
                </div>
                <div className="p-6 space-y-3">
                    {[1, 2].map((i) => (
                        <div key={i} className="p-4 rounded-lg border border-slate-200 space-y-3">
                            <div className="flex items-start gap-3">
                                <Skeleton className="h-4 w-4 rounded bg-slate-100 mt-1" />
                                <Skeleton className="h-4 flex-1 bg-slate-200" />
                            </div>
                            <Skeleton className="h-9 w-full bg-slate-100 rounded-lg" />
                        </div>
                    ))}
                </div>
            </div>

            {/* RTO Requirements Skeleton */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-4 flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-xl bg-white/20" />
                    <Skeleton className="h-5 w-48 bg-white/30" />
                </div>
                <div className="p-6 space-y-3">
                    {[1, 2].map((i) => (
                        <div key={i} className="p-4 rounded-lg border border-slate-200 space-y-3">
                            <div className="flex items-start gap-3">
                                <Skeleton className="h-4 w-4 rounded bg-slate-100 mt-1" />
                                <Skeleton className="h-4 flex-1 bg-slate-200" />
                            </div>
                            <Skeleton className="h-9 w-full bg-slate-100 rounded-lg" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
