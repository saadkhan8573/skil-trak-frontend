import { Skeleton } from '@components/ui/skeleton'

export function StatusNotesSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#044866] to-[#0D5468] px-5 py-4">
                <div className="flex items-center gap-2.5">
                    <Skeleton className="w-10 h-10 rounded-xl bg-white/20" />
                    <Skeleton className="h-5 w-48 bg-white/30" />
                </div>
                <Skeleton className="h-3 w-64 bg-white/20 mt-2" />
            </div>
            <div className="p-6 space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 rounded-xl border-l-4 border-slate-200 bg-slate-50 space-y-3">
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-5 w-32 bg-slate-300" />
                            <Skeleton className="h-3 w-20 bg-slate-200" />
                        </div>
                        <Skeleton className="h-12 w-full bg-slate-100" />
                    </div>
                ))}
            </div>
        </div>
    )
}
