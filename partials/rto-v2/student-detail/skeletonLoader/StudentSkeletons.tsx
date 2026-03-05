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
                                            className="h-11.5 w-36.25 rounded-xl"
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

export function WorkplaceOverviewCardSkeleton() {
    return (
        <div className="rounded-xl border-2 border-gray-400 bg-white overflow-hidden space-y-0">
            {/* QuickActions Header Skeleton */}
            <div className="bg-[#044866] px-5 py-3 flex items-center justify-between gap-4">
                {/* Left: index badge + title */}
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
                        <Skeleton className="w-7 h-7 rounded-full bg-white/30" />
                    </div>
                    <div className="space-y-1">
                        <Skeleton className="h-4 w-36 bg-white/20 rounded" />
                        <Skeleton className="h-2.5 w-28 bg-white/15 rounded" />
                    </div>
                </div>
                {/* Right: 3 action buttons */}
                <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-36 bg-white/20 rounded-lg" />
                    <Skeleton className="h-9 w-36 bg-amber-400/40 rounded-lg" />
                    <Skeleton className="h-9 w-40 bg-white/20 rounded-lg" />
                </div>
            </div>

            {/* WorkplaceStatuses Skeleton */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200/60">
                {/* Top row: status badge + right meta */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-28 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-lg" />
                    </div>
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-6 w-36 rounded-lg" />
                        <Skeleton className="h-6 w-24 rounded-lg" />
                    </div>
                </div>
                {/* Progress bar */}
                <div className="relative pb-1">
                    <Skeleton className="absolute top-3 left-0 right-0 h-1 rounded-full" />
                    {/* Step dots with labels */}
                    <div className="relative flex justify-between">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center"
                                style={{ width: `${100 / 6}%` }}
                            >
                                <Skeleton className="w-6 h-6 rounded-xl" />
                                <div className="mt-3 space-y-1 flex flex-col items-center">
                                    <Skeleton className="h-2.5 w-14 rounded" />
                                    <Skeleton className="h-2 w-10 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* WorkplaceBio Skeleton */}
            <div className="bg-white">
                {/* 2-column layout */}
                <div className="p-5 border-b border-slate-200/60">
                    <div className="grid lg:grid-cols-2 gap-5">
                        {/* Left: WorkplaceIndustryInfo */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-12 h-12 rounded-xl" />
                                <div className="space-y-1.5 flex-1">
                                    <Skeleton className="h-5 w-48" />
                                    <Skeleton className="h-3.5 w-32" />
                                </div>
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="p-2.5 rounded-lg border border-slate-100 space-y-1"
                                    >
                                        <Skeleton className="h-2.5 w-16" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                ))}
                            </div>
                            {/* Supervisor */}
                            <div className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100">
                                <Skeleton className="w-9 h-9 rounded-full" />
                                <div className="space-y-1">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>
                        </div>

                        {/* Right: Map + Approval Card */}
                        <div className="flex flex-col gap-2">
                            {/* Map view */}
                            <Skeleton className="h-32 w-full rounded-xl" />
                            {/* Approval card */}
                            <div className="flex-1 rounded-xl border border-slate-100 p-3 space-y-3">
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                </div>
                                <Skeleton className="h-8 w-full rounded-lg" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-9 flex-1 rounded-lg" />
                                    <Skeleton className="h-9 flex-1 rounded-lg" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* About section */}
                <div className="px-5 py-3 border-b border-slate-200/60 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                    <Skeleton className="h-3 w-4/6" />
                </div>

                {/* Compliance checks */}
                <div className="px-5 py-3 flex gap-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-8 flex-1 rounded-lg" />
                    ))}
                </div>
            </div>
        </div>
    )
}

export function StudentOverviewSkeleton() {
    return (
        <div className="space-y-3">
            <WorkplaceOverviewCardSkeleton />
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

export function CourseProgressSkeleton() {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200/60 shadow-md p-1.5 animate-pulse">
            <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1">
                    <Skeleton className="w-5 h-5 rounded-md" />
                    <div className="space-y-1">
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-2 w-48" />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Date Range Skeleton */}
                    <div className="flex items-center gap-2 px-2 py-1 bg-slate-50/80 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-1">
                            <Skeleton className="w-4 h-4 rounded" />
                            <div className="space-y-1">
                                <Skeleton className="h-2 w-8" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>
                        <div className="w-px h-6 bg-slate-200"></div>
                        <div className="flex items-center gap-1 text-right">
                            <div className="space-y-1">
                                <Skeleton className="h-2 w-8 ml-auto" />
                                <Skeleton className="h-3 w-16 ml-auto" />
                            </div>
                            <Skeleton className="w-4 h-4 rounded" />
                        </div>
                    </div>

                    {/* Edit Button Skeleton */}
                    <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
            </div>

            {/* Main Progress Card Skeleton */}
            <div className="bg-slate-50/50 rounded-lg p-1.5 border border-slate-100/50">
                <div className="flex items-start justify-between mb-2">
                    <div className="space-y-1.5">
                        <Skeleton className="h-2.5 w-24" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                    <div className="text-right space-y-1">
                        <Skeleton className="h-6 w-12 ml-auto" />
                        <Skeleton className="h-2 w-10 ml-auto" />
                    </div>
                </div>

                {/* Progress Bar Skeleton */}
                <Skeleton className="h-1.5 w-full rounded-full mb-2" />

                {/* Stats Row Skeleton */}
                <div className="grid grid-cols-3 gap-1">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="bg-white/50 rounded-md p-1 border border-slate-100"
                        >
                            <div className="flex items-center gap-0.5 mb-1">
                                <Skeleton className="w-3 h-3 rounded" />
                                <Skeleton className="h-2 w-8" />
                            </div>
                            <Skeleton className="h-3.5 w-10 mb-0.5" />
                            <Skeleton className="h-2 w-6" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
