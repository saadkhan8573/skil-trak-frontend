import { Skeleton } from '@components/ui/skeleton'

export function StudentTopBarSkeleton() {
    return (
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm sticky top-0 z-50">
            <div className="w-full mx-auto px-[13.25px] sm:px-[19.87px] lg:px-[26.5px] py-[13.25px]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[9.94px]">
                        <Skeleton className="w-[33.12px] h-[33.12px] rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                    <div className="flex items-center gap-[9.94px]">
                        <div className="text-right space-y-1">
                            <Skeleton className="h-3 w-20 ml-auto" />
                            <Skeleton className="h-4 w-32 ml-auto" />
                        </div>
                        <Skeleton className="w-10 h-10 rounded-full" />
                    </div>
                </div>
            </div>
        </header>
    )
}

export function StudentProfileHeaderSkeleton() {
    return (
        <div className="relative">
            <div className="relative bg-slate-100 p-0.5 rounded-xl shadow-2xl">
                <div className="bg-white rounded-xl overflow-hidden space-y-2.5">
                    {/* Status Banner Skeleton */}
                    <Skeleton className="h-1.5 w-full" />

                    {/* Top Section */}
                    <div className="bg-slate-50/50 px-3 py-2">
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 xl:gap-2">
                            {/* Left: Avatar + Name + Badges */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2.5">
                                {/* Avatar */}
                                <Skeleton className="w-14 h-14 rounded-full shrink-0 ring-4 ring-white shadow-md order-1 mb-2 sm:mb-0 sm:order-0" />

                                {/* Name & Badges */}
                                <div className="space-y-2 text-center sm:text-left order-2 sm:order-0 w-full sm:w-auto flex flex-col items-center sm:items-start">
                                    {/* Name */}
                                    <Skeleton className="h-7 w-48 rounded-md" />

                                    {/* Badges */}
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                                        {[1, 2, 3].map((i) => (
                                            <Skeleton
                                                key={i}
                                                className="h-6 w-24 rounded-full"
                                            />
                                        ))}
                                    </div>

                                    {/* Address Pill */}
                                    <div className="flex justify-center sm:justify-start pt-1">
                                        <Skeleton className="h-6 w-64 rounded-full" />
                                    </div>
                                </div>
                            </div>

                            {/* Right: Actions */}
                            <div className="flex flex-col items-center xl:items-end gap-2.5 mt-4 xl:mt-0 w-full xl:w-auto order-3">
                                {/* Quick Actions */}
                                <div className="flex gap-2.5 w-full sm:w-auto justify-center xl:justify-end">
                                    <Skeleton className="h-10 w-24 rounded-lg" />
                                    <Skeleton className="h-10 w-24 rounded-lg" />
                                </div>

                                {/* Status Switches (Priority, Contact, Flagged) */}
                                <div className="flex flex-wrap justify-center xl:justify-end gap-2 w-full sm:w-auto">
                                    {[1, 2, 3].map((i) => (
                                        <Skeleton
                                            key={i}
                                            className="h-[46px] w-[145px] rounded-xl"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="space-y-4 px-3 pb-3 pt-2">
                        <StudentQuickInfoSkeleton />
                        <StudentTimelineSkeleton />
                    </div>
                </div>
            </div>
        </div>
    )
}

export function StudentQuickInfoSkeleton() {
    return (
        <div className="grid grid-cols-3 gap-2.5">
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="rounded-xl border border-slate-100 p-3.5 space-y-3"
                >
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                </div>
            ))}
        </div>
    )
}

export function StudentTimelineSkeleton() {
    return (
        <div className="rounded-lg border border-slate-100 p-3.5 mt-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-9 h-9 rounded-lg" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-64" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
                <Skeleton className="h-10 w-32 rounded" />
            </div>
        </div>
    )
}

export function StudentOverviewSkeleton() {
    return (
        <div className="space-y-6">
            {/* Course Overview */}
            <Skeleton className="h-48 w-full rounded-xl" />

            {/* Placement Request */}
            <Skeleton className="h-32 w-full rounded-xl" />

            {/* Two Column Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-64 w-full rounded-xl" />
            </div>
        </div>
    )
}

export function WorkplaceTabSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100">
                <Skeleton className="h-6 w-48" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-32 rounded-md" />
                    <Skeleton className="h-10 w-10 rounded-md" />
                </div>
            </div>
            <div className="grid gap-3">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="p-4 bg-white border border-slate-100 rounded-xl space-y-4"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                                <Skeleton className="w-12 h-12 rounded-lg" />
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-48" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>
                            <Skeleton className="h-6 w-24 rounded-full" />
                        </div>
                        <div className="flex gap-8 border-t border-slate-50 pt-4">
                            <div className="space-y-1">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <div className="space-y-1">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <div className="space-y-1">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function StudentDocumentsTabSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100">
                <Skeleton className="h-6 w-48" />
                <div className="flex gap-3">
                    <Skeleton className="h-10 w-40 rounded-lg" />
                    <Skeleton className="h-10 w-24 rounded-lg" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className="p-4 bg-white border border-slate-100 rounded-xl space-y-4"
                    >
                        <div className="flex justify-between items-center">
                            <Skeleton className="w-10 h-10 rounded-lg" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                        <Skeleton className="h-5 w-3/4" />
                        <div className="flex justify-between items-center border-t border-slate-50 pt-4">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function CommunicationsSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-16 w-full rounded-xl" />
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-64 rounded-lg" />
            </div>
            <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="p-4 bg-white border border-slate-100 rounded-xl flex gap-4"
                    >
                        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between">
                                <Skeleton className="h-5 w-48" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function ScheduleTabSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                        <Skeleton className="w-11 h-11 rounded-2xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                    </div>
                    <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
                <div className="grid grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-20 rounded-xl" />
                    ))}
                </div>
                <Skeleton className="h-24 w-full rounded-xl" />
            </div>

            {/* Split Progress */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <Skeleton className="h-6 w-48" />
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-48 rounded-xl" />
                    <Skeleton className="h-48 rounded-xl" />
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                <Skeleton className="h-12 w-full rounded-xl" />
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="p-4 bg-white border border-slate-100 rounded-xl flex justify-between items-center"
                        >
                            <div className="flex gap-4">
                                <Skeleton className="w-12 h-12 rounded-lg" />
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-48" />
                                    <Skeleton className="h-4 w-64" />
                                </div>
                            </div>
                            <Skeleton className="h-6 w-24 rounded-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export function AppointmentCardSkeleton() {
    return (
        <div className="p-4 bg-white border border-slate-100 rounded-xl flex justify-between items-center shadow-sm">
            <div className="flex gap-4 items-center flex-1">
                <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                <div className="space-y-2 flex-1">
                    <div className="flex justify-between">
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                    <div className="flex gap-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
            </div>
            <div className="ml-4">
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>
        </div>
    )
}

export function DocumentCardSkeleton() {
    return (
        <div className="p-4 bg-white border border-slate-100 rounded-xl space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-5 w-3/4" />
            <div className="flex justify-between items-center border-t border-slate-50 pt-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
        </div>
    )
}

export function TicketsTabSkeleton() {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
                <div className="flex gap-4">
                    <Skeleton className="w-11 h-11 rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-72 rounded-lg" />
                    <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
            </div>
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="p-4 bg-white border border-slate-100 rounded-2xl space-y-4"
                    >
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <Skeleton className="h-4 w-20 rounded-full" />
                                    <Skeleton className="h-4 w-20 rounded-full" />
                                </div>
                                <Skeleton className="h-6 w-96" />
                            </div>
                            <Skeleton className="h-8 w-24 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <div className="flex justify-between items-center border-t border-slate-50 pt-4">
                            <div className="flex gap-4">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function AppointmentsTabSkeleton() {
    return (
        <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
            </div>

            {/* Header */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-40 rounded-lg" />
            </div>

            {/* List Section */}
            <div className="space-y-4">
                {[1, 2].map((i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton className="h-6 w-32" />
                        <div className="space-y-2">
                            {[1, 2].map((j) => (
                                <div
                                    key={j}
                                    className="p-4 bg-white border border-slate-100 rounded-xl flex justify-between items-center"
                                >
                                    <div className="flex gap-4 items-center">
                                        <Skeleton className="w-12 h-12 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-5 w-48" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Skeleton className="h-8 w-24 rounded-full" />
                                        <Skeleton className="h-10 w-10 rounded-lg" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function PlacementRequirementsSkeleton() {
    return (
        <div className="space-y-3">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <div className="space-y-2.5 pt-4">
                <Skeleton className="h-6 w-32" />
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))}
            </div>
        </div>
    )
}
