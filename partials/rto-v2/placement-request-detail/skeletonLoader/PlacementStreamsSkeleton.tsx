import { Skeleton } from '@components/ui/skeleton'

export function PlacementStreamsSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#0D5468] to-[#044866] px-5 py-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-2.5">
                    <Skeleton className="w-10 h-10 rounded-xl bg-white/20" />
                    <Skeleton className="h-5 w-48 bg-white/30" />
                </div>
                <Skeleton className="h-6 w-12 bg-white/20 rounded-full" />
            </div>
            <div className="p-6 space-y-4">
                <Skeleton className="h-12 w-full bg-blue-50 border border-blue-100 rounded-lg" />
                {[1, 2].map((i) => (
                    <div key={i} className="p-4 rounded-xl border-2 border-slate-100 bg-white space-y-3">
                        <div className="flex items-start gap-3">
                            <Skeleton className="h-5 w-5 rounded mt-1 bg-slate-100" />
                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between">
                                    <Skeleton className="h-5 w-40 bg-slate-200" />
                                    <Skeleton className="h-5 w-16 bg-slate-100 rounded-full" />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-3 w-16 bg-slate-100" />
                                        <Skeleton className="h-3 w-10 bg-slate-100" />
                                    </div>
                                    <Skeleton className="h-2 w-full bg-slate-100 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
