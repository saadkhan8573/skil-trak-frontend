import { Skeleton } from '@components/ui/skeleton'

export function StudentSummarySkeleton() {
    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-14 h-14 rounded-2xl bg-[#044866]/10" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48 bg-slate-200" />
                        <Skeleton className="h-4 w-32 bg-slate-100" />
                    </div>
                </div>
                <Skeleton className="h-8 w-24 rounded-full bg-emerald-100" />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-16 rounded-xl bg-slate-50" />
                <Skeleton className="h-16 rounded-xl bg-slate-50" />
            </div>
            <div className="space-y-3">
                <Skeleton className="h-12 rounded-lg bg-slate-50 border border-slate-100" />
                <Skeleton className="h-12 rounded-lg bg-slate-50 border border-slate-100" />
                <Skeleton className="h-32 rounded-lg bg-gradient-to-br from-white to-blue-50/50 border border-[#044866]/10" />
            </div>
        </div>
    )
}
