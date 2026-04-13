import { Card, SkeletonLoader } from '@components'

export const RtoProfileSkeleton = () => {
    return (
        <div className="px-2.5 py-5">
            {/* Topbar */}
            <Card noPadding shadowType="profile">
                <div className="flex justify-between items-center py-3 px-3.5">
                    <SkeletonLoader width="w-48" height="h-6" />
                    <div className="flex gap-x-2">
                        <SkeletonLoader width="w-32" height="h-10" />
                        <SkeletonLoader width="w-32" height="h-10" />
                    </div>
                </div>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mt-[18px]">
                {/* Left Column - Counts */}
                <div className="flex flex-col">
                    <div className="grow">
                        <div className="h-full">
                            <div className="mt-[18px] h-[calc(100%-18px)] flex flex-col justify-between">
                                {/* StudentCountCard */}
                                <Card noPadding>
                                    <div className="px-3.5 py-3 flex flex-col gap-y-1 relative">
                                        <div className="absolute -top-5 right-4 w-12 h-12 rounded-lg bg-gray-200 animate-pulse shadow-md" />
                                        <SkeletonLoader
                                            width="w-32"
                                            height="h-3.5"
                                        />
                                        <div className="flex items-center justify-between mt-1">
                                            <SkeletonLoader
                                                width="w-16"
                                                height="h-8"
                                            />
                                            <SkeletonLoader
                                                width="w-24"
                                                height="h-4"
                                            />
                                        </div>
                                    </div>
                                </Card>

                                {/* ProfileCountsCards */}
                                <div className="mt-[18px] grid grid-cols-2 gap-x-3.5 gap-y-[18px]">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                        <div key={i} className="mt-[18px]">
                                            <Card noPadding>
                                                <div className="px-3.5 py-3 flex flex-col gap-y-1 relative h-full min-h-[90px]">
                                                    <div className="absolute -top-5 left-4 w-12 h-12 rounded-lg bg-gray-200 animate-pulse shadow-md" />
                                                    <div className="flex flex-col gap-y-1.5 items-end justify-end grow">
                                                        <SkeletonLoader
                                                            width="w-32"
                                                            height="h-3"
                                                        />
                                                        <SkeletonLoader
                                                            width="w-10"
                                                            height="h-8"
                                                        />
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Progress Chart */}
                <div className="flex flex-col">
                    <div className="flex justify-end mb-1">
                        <SkeletonLoader
                            width="w-36"
                            height="h-4"
                            className="mt-1"
                        />
                    </div>
                    <div className="grow">
                        <Card shadowType="profile" fullHeight>
                            <div className="p-4 flex flex-col h-full gap-4">
                                <SkeletonLoader width="w-32" height="h-10" />
                                <div className="grow flex items-center justify-center">
                                    <SkeletonLoader
                                        width="w-[300px]"
                                        height="h-[300px]"
                                        className="rounded-full"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <SkeletonLoader
                                            key={i}
                                            width="w-full"
                                            height="h-4"
                                        />
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Sector */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-3 mt-5 h-506px">
                <Card fullHeight>
                    <div className="p-4 flex flex-col h-full gap-4">
                        <SkeletonLoader width="w-48" height="h-6" />
                        <div className="flex flex-col gap-3 grow mt-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <SkeletonLoader
                                    key={i}
                                    width="w-full"
                                    height="h-16"
                                    className="rounded-lg"
                                />
                            ))}
                        </div>
                    </div>
                </Card>
                <div className="h-full">
                    <Card fullHeight>
                        <div className="p-4 flex flex-col h-full gap-4">
                            <SkeletonLoader width="w-48" height="h-6" />
                            <SkeletonLoader
                                width="w-full"
                                height="h-full"
                                className="rounded-lg mt-2"
                            />
                        </div>
                    </Card>
                </div>
            </div>

            {/* Insurance Documents */}
            <div className="mt-5 h-420px">
                <Card fullHeight>
                    <div className="p-4 flex flex-col h-full gap-4">
                        <SkeletonLoader width="w-48" height="h-6" />
                        <div className="grid grid-cols-3 gap-4 mt-2">
                            {[1, 2, 3].map((i) => (
                                <SkeletonLoader
                                    key={i}
                                    width="w-full"
                                    height="h-32"
                                    className="rounded-lg"
                                />
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Appointments */}
            <div className="mt-5 h-570px">
                <Card fullHeight>
                    <div className="p-4 flex flex-col h-full gap-4">
                        <div className="flex justify-between items-center">
                            <SkeletonLoader width="w-48" height="h-6" />
                            <SkeletonLoader width="w-32" height="h-10" />
                        </div>
                        <div className="flex flex-col gap-3 grow mt-2">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <SkeletonLoader
                                    key={i}
                                    width="w-full"
                                    height="h-16"
                                    className="rounded-lg"
                                />
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Reports */}
            <div className="mt-5 h-405px">
                <Card fullHeight>
                    <div className="p-4 flex flex-col h-full gap-4">
                        <SkeletonLoader width="w-48" height="h-6" />
                        <div className="flex gap-4 mt-2">
                            <SkeletonLoader width="w-48" height="h-10" />
                            <SkeletonLoader width="w-32" height="h-10" />
                        </div>
                        <div className="flex flex-col gap-3 grow mt-4">
                            {[1, 2, 3, 4].map((i) => (
                                <SkeletonLoader
                                    key={i}
                                    width="w-full"
                                    height="h-16"
                                    className="rounded-lg"
                                />
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Dynamic Permissions */}
            <div className="mt-6 transition-all duration-500">
                <Card
                    className="overflow-hidden border-0 shadow-2xl rounded-xl"
                    noPadding
                >
                    <div className="bg-primaryNew px-4 py-2 relative overflow-hidden min-h-[80px] flex flex-col justify-center gap-2">
                        <SkeletonLoader
                            width="w-48"
                            height="h-6"
                            className="bg-white/30"
                        />
                        <SkeletonLoader
                            width="w-96"
                            height="h-4"
                            className="bg-white/30"
                        />
                    </div>
                    <div className="p-4 bg-gray-50/30">
                        <div className="flex border-b border-gray-200 mb-4 gap-4">
                            {[1, 2, 3].map((i) => (
                                <SkeletonLoader
                                    key={i}
                                    width="w-24"
                                    height="h-8"
                                />
                            ))}
                        </div>
                        <div className="flex flex-col gap-3">
                            {[1, 2, 3, 4].map((i) => (
                                <SkeletonLoader
                                    key={i}
                                    width="w-full"
                                    height="h-16"
                                    className="rounded-lg"
                                />
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
