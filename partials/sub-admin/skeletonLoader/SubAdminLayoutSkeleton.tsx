'use client'

import { Skeleton } from '@components/ui/skeleton'

export function TopBarSkeleton() {
    return (
        <div suppressHydrationWarning suppressHydrationWarning className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
            <div suppressHydrationWarning className="flex items-center gap-4">
                {/* Logo Placeholder */}
                <Skeleton className="h-8 w-8 rounded bg-slate-200" />
                <Skeleton className="h-5 w-32 bg-slate-200" />
            </div>
            <div suppressHydrationWarning className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-full bg-slate-200" />
            </div>
        </div>
    )
}

export function SubAdminNavbarSkeleton() {
    return (
        <div suppressHydrationWarning suppressHydrationWarning className="flex justify-between items-center mb-2 px-2 lg:px-8 pt-4">
            <div suppressHydrationWarning className="flex gap-x-2 w-full overflow-hidden">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div suppressHydrationWarning
                        key={i}
                        className="flex items-center gap-x-2 px-3 py-2 bg-white rounded-md border border-slate-100 min-w-30"
                    >
                        <Skeleton className="h-4 w-4 rounded bg-slate-200" />
                        <Skeleton className="h-3 w-16 bg-slate-200" />
                    </div>
                ))}
            </div>
            <div suppressHydrationWarning className="flex gap-x-2 items-center shrink-0 ml-4">
                <Skeleton className="h-8 w-8 rounded-lg bg-slate-200" />
            </div>
        </div>
    )
}

export function RightSidebarSkeleton() {
    return (
        <div suppressHydrationWarning suppressHydrationWarning className="h-full border-l border-gray-300 bg-white p-4 w-[320px] shrink-0 flex flex-col gap-y-6 overflow-hidden">
            {/* Profile Header */}
            <div suppressHydrationWarning className="flex flex-col items-center pt-4">
                <Skeleton className="w-25 h-25 rounded-full mb-3" />
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-3 w-48" />
            </div>

            {/* User Details */}
            <div suppressHydrationWarning className="flex flex-col gap-y-2 w-full">
                <div suppressHydrationWarning className="flex gap-x-2">
                    <div suppressHydrationWarning className="flex-1 p-2 bg-gray-50 rounded border border-gray-100">
                        <Skeleton className="h-2 w-16 mb-2" />
                        <Skeleton className="h-3 w-full" />
                    </div>
                    <div suppressHydrationWarning className="flex-1 p-2 bg-gray-50 rounded border border-gray-100">
                        <Skeleton className="h-2 w-16 mb-2" />
                        <Skeleton className="h-3 w-full" />
                    </div>
                </div>
                <div suppressHydrationWarning className="p-2 bg-gray-50 rounded border border-gray-100">
                    <Skeleton className="h-2 w-16 mb-2" />
                    <Skeleton className="h-3 w-full" />
                </div>
            </div>

            {/* Todo Section */}
            <div suppressHydrationWarning className="flex flex-col gap-y-3 w-full flex-1">
                <div suppressHydrationWarning className="flex justify-between items-center mt-2">
                    <Skeleton className="h-4 w-20" />
                    {/* <Skeleton className="h-3 w-10" /> */}
                </div>

                <div suppressHydrationWarning className="flex flex-col gap-y-3 overflow-hidden">
                    {[1, 2, 3].map((i) => (
                        <div suppressHydrationWarning
                            key={i}
                            className="border border-slate-100 rounded-md p-3 space-y-3"
                        >
                            <Skeleton className="h-4 w-24" />
                            <div suppressHydrationWarning className="space-y-2">
                                <div suppressHydrationWarning className="flex justify-between items-center p-2 bg-gray-50 rounded border border-gray-100">
                                    <div suppressHydrationWarning className="space-y-1">
                                        <Skeleton className="h-3 w-20" />
                                        <Skeleton className="h-2 w-24" />
                                    </div>
                                    <Skeleton className="h-4 w-4 rounded-full" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export function DashboardSkeleton() {
    return (
        <div suppressHydrationWarning suppressHydrationWarning className="px-2 lg:px-8 pb-8 flex flex-col gap-y-6">
            {/* Page Header */}
            <div suppressHydrationWarning className="flex justify-between items-center mb-2">
                <Skeleton className="h-8 w-32 rounded-md" />
                <Skeleton className="h-9 w-32 rounded-md" />{' '}
                {/* Global Search Button */}
            </div>

            {/* Main Grid */}
            <div suppressHydrationWarning className="flex flex-col gap-y-6">
                <div suppressHydrationWarning className="flex gap-x-6 w-full items-start">
                    {/* Left Column: Stats Grid */}
                    <div suppressHydrationWarning className="w-1/2 grid grid-cols-2 gap-x-4 gap-y-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div suppressHydrationWarning
                                key={i}
                                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden"
                            >
                                <div suppressHydrationWarning className="absolute top-4 right-4">
                                    <div suppressHydrationWarning className="flex flex-col items-end gap-1">
                                        <Skeleton className="h-8 w-12" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                                <div suppressHydrationWarning className="mt-auto">
                                    <Skeleton className="h-10 w-10 rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Column: Chart */}
                    <div suppressHydrationWarning className="w-1/2">
                        <div suppressHydrationWarning className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-112.5">
                            <Skeleton className="h-6 w-40 mb-8" />
                            <div suppressHydrationWarning className="flex items-center justify-center h-75">
                                <Skeleton className="w-64 h-64 rounded-full" />
                            </div>
                            <div suppressHydrationWarning className="flex justify-center gap-4 mt-4">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Map/Courses */}
                <div suppressHydrationWarning className="w-full h-125 flex gap-x-4">
                    <div suppressHydrationWarning className="w-2/5 h-full bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                        <div suppressHydrationWarning className="flex justify-between items-center mb-6">
                            <div suppressHydrationWarning className="flex items-center gap-2">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                        <div suppressHydrationWarning className="space-y-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div suppressHydrationWarning
                                    key={i}
                                    className="p-3 border border-slate-100 rounded-lg flex justify-between"
                                >
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-4 w-8" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div suppressHydrationWarning className="w-3/5 h-full bg-slate-200 rounded-xl animate-pulse">
                        {/* Map Placeholder */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export function SubAdminLayoutSkeleton() {
    return (
        <div suppressHydrationWarning suppressHydrationWarning className="flex flex-col h-screen w-full bg-slate-50 overflow-hidden">
            {/* Top Bar */}
            <TopBarSkeleton />

            {/* Viewport Area */}
            <div suppressHydrationWarning className="flex flex-1 overflow-hidden h-full">
                {/* Main Content Area (Scrollable) */}
                <div suppressHydrationWarning className="flex-1 flex flex-col h-full overflow-y-auto remove-scrollbar">
                    <SubAdminNavbarSkeleton />
                    <DashboardSkeleton />
                </div>

                {/* Right Sidebar (Fixed) */}
                <RightSidebarSkeleton />
            </div>
        </div>
    )
}
