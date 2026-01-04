import { Skeleton } from '@components/ui/skeleton'

export function ComplianceSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4 flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl bg-white/20" />
                <Skeleton className="h-5 w-48 bg-white/30" />
            </div>
            <div className="p-6 space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-48 bg-slate-200" />
                        </div>
                        <Skeleton className="h-6 w-20 rounded-full bg-slate-200" />
                    </div>
                ))}
            </div>
        </div>
    )
}
