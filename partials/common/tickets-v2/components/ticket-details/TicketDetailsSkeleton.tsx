import { Skeleton } from '@components/ui/skeleton'

export const TicketDetailsSkeleton = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-6">
            <div className="w-full mx-auto px-4 sm:px-6">
                {/* Back Button Skeleton */}
                <div className="bg-white border rounded-xl p-4 mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-x-2">
                        <Skeleton className="h-4 w-24 rounded bg-gray-200" />
                        <div className="flex flex-col gap-1">
                            <Skeleton className="size-1 rounded-lg bg-gray-200" />
                            <Skeleton className="size-1 rounded-lg bg-gray-200" />
                        </div>
                        <Skeleton className="h-8 w-32 rounded-lg bg-gray-200" />
                    </div>
                    <Skeleton className="h-8 w-32 rounded-lg bg-gray-200" />
                </div>

                {/* Profile Header Skeleton */}
                <div className="bg-white rounded-xl shadow-lg mb-5 overflow-hidden border border-gray-200">
                    <div className="h-2 bg-gradient-to-r from-[#044866] via-[#F7A619] to-[#0D5468]"></div>

                    <div className="p-6">
                        <div className="flex items-start gap-4 mb-6">
                            {/* Avatar Skeleton */}
                            <Skeleton className="w-16 h-16 rounded-full" />
                            <div className="flex-1">
                                {/* Name Skeleton */}
                                <Skeleton className="h-8 w-48 mb-2" />
                                {/* ID Skeleton */}
                                <Skeleton className="h-4 w-32 mb-3" />
                                {/* Badges Skeleton */}
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                    <Skeleton className="h-6 w-24 rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* Contact Info Grid Skeleton */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <Skeleton className="w-4 h-4 rounded" />
                                <div className="flex-1">
                                    <Skeleton className="h-3 w-16 mb-2" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <Skeleton className="w-4 h-4 rounded" />
                                <div className="flex-1">
                                    <Skeleton className="h-3 w-16 mb-2" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <Skeleton className="w-4 h-4 rounded" />
                                <div className="flex-1">
                                    <Skeleton className="h-3 w-16 mb-2" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            </div>
                        </div>

                        {/* Info Grid Skeleton */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="p-4 bg-[#044866]/5 rounded-lg border border-[#044866]/20">
                                <div className="flex items-center gap-2 mb-2">
                                    <Skeleton className="w-4 h-4 rounded" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                                <Skeleton className="h-5 w-32" />
                            </div>

                            <div className="p-4 bg-[#0D5468]/5 rounded-lg border border-[#0D5468]/20">
                                <div className="flex items-center gap-2 mb-2">
                                    <Skeleton className="w-4 h-4 rounded" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                                <Skeleton className="h-5 w-28" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="bg-white rounded-lg shadow-md border border-gray-200 p-4"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <Skeleton className="w-10 h-10 rounded-lg" />
                                <Skeleton className="w-6 h-6 rounded" />
                            </div>
                            <Skeleton className="h-8 w-16 mb-2" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    ))}
                </div>

                {/* Performance Metrics Skeleton */}
                <div className="bg-white rounded-xl shadow-lg mb-5 border border-gray-200">
                    <div className="p-5">
                        <Skeleton className="h-6 w-40 mb-4" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <Skeleton className="h-4 w-32 mb-3" />
                                <Skeleton className="h-7 w-20 mb-2" />
                                <Skeleton className="h-3 w-full" />
                            </div>

                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <Skeleton className="h-4 w-28 mb-3" />
                                <Skeleton className="h-7 w-24 mb-2" />
                                <Skeleton className="h-3 w-full" />
                            </div>

                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <Skeleton className="h-4 w-36 mb-3" />
                                <Skeleton className="h-7 w-16 mb-2" />
                                <Skeleton className="h-3 w-full" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Assigned Tickets Section Skeleton */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                    <div className="p-5 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-6 w-36" />
                            <Skeleton className="h-8 w-20 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
