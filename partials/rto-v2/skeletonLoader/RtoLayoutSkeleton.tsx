import { Skeleton } from '@components/ui/skeleton'

export function SidebarSkeleton() {
    return (
        <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-white border-r border-slate-100 overflow-hidden">
            {/* Logo Area */}
            <div className="p-4 border-b border-slate-50">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-2xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 px-4 py-3 space-y-8">
                {[1, 2, 3, 4, 5].map((section) => (
                    <div key={section} className="space-y-3">
                        <Skeleton className="h-3 w-20 ml-1" />
                        <div className="space-y-2">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-3 p-2"
                                >
                                    <Skeleton className="h-8 w-8 rounded-xl" />
                                    <Skeleton className="h-4 flex-1 rounded-md" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-50">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-3 rounded-full" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-3 w-10" />
                </div>
            </div>
        </aside>
    )
}

export function NavbarSkeleton() {
    return (
        <header className="w-full flex items-center justify-between gap-3 px-4 md:px-6 py-3 border-b border-slate-100 bg-white/50 backdrop-blur-sm">
            <div className="hidden lg:block">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-6 w-48" />
                </div>
            </div>
            <div className="md:hidden">
                <Skeleton className="h-9 w-9 rounded-lg" />
            </div>

            <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-32 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="flex items-center gap-2 px-2 py-1">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-24 hidden md:block" />
                </div>
            </div>
        </header>
    )
}

export function ListingSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-32 rounded-lg" />
                    <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
                <Skeleton className="h-10 w-64 rounded-lg" />
            </div>

            <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                <div className="bg-slate-50/50 p-4 border-b border-slate-100 hidden md:flex justify-between">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-4 w-24" />
                    ))}
                </div>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className="p-4 border-b border-slate-50 last:border-0 flex items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-3 flex-1">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                        <div className="hidden md:flex flex-1 justify-around gap-4">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export function CardsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-start">
                        <Skeleton className="h-12 w-12 rounded-2xl bg-slate-50" />
                        <Skeleton className="h-6 w-12 rounded-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-7 w-16" />
                    </div>
                    <div className="pt-2">
                        <Skeleton className="h-2 w-full rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export function RtoLayoutSkeleton() {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            {/* Sidebar Skeleton */}
            <SidebarSkeleton />

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Navbar Skeleton */}
                <NavbarSkeleton />

                {/* Content Section */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 mx-auto w-full">
                    <div className="space-y-8">
                        {/* Page Header Area */}
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-64" />
                            <Skeleton className="h-4 w-full max-w-md" />
                        </div>

                        {/* Cards Section */}
                        <CardsSkeleton />

                        {/* Listing Section */}
                        <ListingSkeleton />
                    </div>
                </main>
            </div>
        </div>
    )
}
