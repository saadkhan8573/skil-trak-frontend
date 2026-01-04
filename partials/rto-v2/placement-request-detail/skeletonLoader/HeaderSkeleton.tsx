import { Skeleton } from '@components/ui/skeleton'

export function HeaderSkeleton() {
    return (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
            <div className="px-8 py-4">
                <div className="flex items-center justify-between max-w-[1900px] mx-auto">
                    {/* Left Section */}
                    <div className="flex items-center gap-6">
                        <Skeleton className="h-10 w-24 rounded-lg bg-slate-100" />
                        <div className="h-8 w-px bg-gray-200"></div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-8 w-64 bg-[#044866]/10" />
                                <Skeleton className="h-5 w-16 rounded-full bg-blue-50" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-32 bg-slate-100" />
                                <span className="text-gray-300">•</span>
                                <Skeleton className="h-4 w-32 bg-slate-100" />
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-2.5">
                        <Skeleton className="h-9 w-24 rounded-full bg-emerald-50" />
                        <Skeleton className="h-9 w-32 rounded-lg bg-[#044866]/5" />
                        <div className="flex gap-2">
                            <Skeleton className="h-9 w-10 rounded-lg bg-slate-50" />
                            <Skeleton className="h-9 w-10 rounded-lg bg-slate-50" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
