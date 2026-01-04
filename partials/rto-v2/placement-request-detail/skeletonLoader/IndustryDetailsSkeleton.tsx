import { Skeleton } from '@components/ui/skeleton'

export function IndustryDetailsSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#044866] to-[#0D5468] px-5 py-4 flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl bg-white/20" />
                <Skeleton className="h-5 w-48 bg-white/30" />
            </div>
            <div className="p-4 m-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-24 bg-slate-200" />
                    <Skeleton className="h-7 w-16 bg-[#044866]/10" />
                </div>
                <Skeleton className="h-10 w-full bg-slate-200 rounded-lg" />
            </div>
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-xl bg-[#044866]/20" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-64 bg-slate-200" />
                        <Skeleton className="h-4 w-40 bg-slate-100" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                        <Skeleton className="h-3 w-16 bg-slate-200" />
                        <Skeleton className="h-5 w-32 bg-slate-300" />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                        <Skeleton className="h-3 w-16 bg-slate-200" />
                        <Skeleton className="h-5 w-32 bg-slate-300" />
                    </div>
                </div>
                <div className="space-y-3">
                    <Skeleton className="h-12 w-full border border-slate-200 rounded-lg" />
                    <Skeleton className="h-12 w-full border border-slate-200 rounded-lg" />
                </div>
            </div>
        </div>
    )
}
