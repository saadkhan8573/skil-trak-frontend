import { Skeleton } from '@components/ui/skeleton'

export function CoursesTabSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="p-4 border border-slate-100 rounded-xl space-y-4"
                    >
                        <Skeleton className="h-32 w-full rounded-lg" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <div className="flex justify-between">
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-8 w-20" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function StudentsTabSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-48" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
            <div className="border border-slate-100 rounded-xl overflow-hidden">
                <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-4 w-24" />
                    ))}
                </div>
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className="p-4 border-b border-slate-50 flex justify-between items-center"
                    >
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export function GenericTabSkeleton() {
    return (
        <div className="space-y-6 px-4 py-2">
            <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="p-4 border border-slate-100 rounded-xl flex gap-4"
                    >
                        <Skeleton className="w-24 h-24 rounded-lg shrink-0" />
                        <div className="flex-1 space-y-3">
                            <Skeleton className="h-5 w-1/3" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function GalleryTabSkeleton() {
    return (
        <div className="space-y-6 px-4">
            {/* Stats Area */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center py-2">
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-32 rounded-lg" />
                    <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-24 rounded-lg" />
                    <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div
                        key={i}
                        className="aspect-square rounded-xl overflow-hidden border border-slate-100 relative bg-white"
                    >
                        <Skeleton className="w-full h-full" />
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-white/10 backdrop-blur-sm">
                            <Skeleton className="h-3 w-3/4 mb-1" />
                            <Skeleton className="h-2 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function DocumentsTabSkeleton() {
    return (
        <div className="space-y-6 px-4">
            {/* Header Area */}
            <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-48 rounded-lg" />
                <Skeleton className="h-10 w-40 rounded-lg" />
            </div>

            {/* Sector Tabs */}
            <div className="flex gap-4 border-b border-slate-100 overflow-hidden pb-1">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-8 w-32 shrink-0" />
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
            </div>

            {/* Documents List */}
            <div className="grid gap-3">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className="p-4 border border-slate-100 rounded-xl flex items-center justify-between bg-white shadow-sm"
                    >
                        <div className="flex items-center gap-4 flex-1">
                            <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-5 w-1/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-10 w-10 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function AppointmentsTabSkeleton() {
    return (
        <div className="space-y-4 px-4 bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-10 w-40 rounded-lg" />
            </div>

            {/* Controls */}
            <div className="p-4 bg-slate-50/50 flex flex-col md:flex-row justify-between gap-4">
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-28 rounded-md" />
                    <Skeleton className="h-10 w-28 rounded-md" />
                </div>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-40" />
                    <div className="flex p-1 bg-white rounded-lg border border-slate-100 gap-1">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-16" />
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="divide-y divide-slate-50">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center"
                    >
                        <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-start">
                                <Skeleton className="h-5 w-1/3" />
                                <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-4 w-28" />
                            </div>
                        </div>
                        <Skeleton className="h-9 w-9 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export function TradingHoursTabSkeleton() {
    return (
        <div className="space-y-5 px-4 py-2">
            {/* Header & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-56" />
                    <Skeleton className="h-4 w-72" />
                </div>
                <div className="flex gap-3">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>

            {/* Days Grid */}
            <div className="grid gap-3">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div
                        key={i}
                        className="p-4 border border-slate-100 rounded-xl bg-white shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6"
                    >
                        <div className="w-32 flex items-center gap-3">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <Skeleton className="h-5 w-20" />
                        </div>
                        <div className="flex-1 flex flex-wrap gap-4">
                            <div className="space-y-1">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-10 w-28 rounded-md" />
                            </div>
                            <div className="space-y-1">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-10 w-28 rounded-md" />
                            </div>
                            <div className="flex items-center gap-2 pt-4">
                                <Skeleton className="h-5 w-8" />
                                <Skeleton className="h-5 w-12 rounded-full" />
                            </div>
                        </div>
                        <Skeleton className="h-10 w-32 rounded-md self-end md:self-center" />
                    </div>
                ))}
            </div>

            {/* Summary */}
            <Skeleton className="h-24 w-full rounded-xl" />

            {/* Save Button */}
            <Skeleton className="h-12 w-full rounded-lg" />
        </div>
    )
}
