import { SkeletonLoader } from '@components'

export const ProfileViewContextBarSkeleton = () => {
    return (
        <div>
            <div className="flex justify-between items-start">
                <SkeletonLoader
                    width="w-20"
                    height="h-20"
                    className="rounded-full"
                />
                <SkeletonLoader
                    width="w-8"
                    height="h-8"
                    className="rounded-full"
                />
            </div>

            {/* User */}
            <div className="mt-4">
                <SkeletonLoader width="w-48" height="h-5" className="mb-2" />
                <SkeletonLoader width="w-32" height="h-3" />
            </div>

            {/* RtoDetails */}
            <div className="py-5 border-b border-secondary-dark">
                <SkeletonLoader width="w-24" height="h-4" className="mb-3" />
                <div className="flex gap-2 mb-2">
                    <SkeletonLoader
                        width="w-full"
                        height="h-14"
                        className="rounded-md"
                    />
                    <SkeletonLoader
                        width="w-full"
                        height="h-14"
                        className="rounded-md"
                    />
                </div>
                <SkeletonLoader
                    width="w-full"
                    height="h-14"
                    className="rounded-md mb-2"
                />
                <SkeletonLoader
                    width="w-full"
                    height="h-20"
                    className="rounded-md"
                />
            </div>

            {/* RtoPackage */}
            <div className="py-5 border-b border-secondary-dark">
                <SkeletonLoader width="w-24" height="h-4" className="mb-3" />
                <div className="flex gap-2">
                    <SkeletonLoader
                        width="w-full"
                        height="h-14"
                        className="rounded-md"
                    />
                    <SkeletonLoader
                        width="w-full"
                        height="h-14"
                        className="rounded-md"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-5">
                <SkeletonLoader
                    width="w-full"
                    height="h-10"
                    className="rounded-md"
                />
                <SkeletonLoader
                    width="w-full"
                    height="h-10"
                    className="rounded-md"
                />
            </div>
            <div className="flex gap-2 mt-2">
                <SkeletonLoader
                    width="w-full"
                    height="h-10"
                    className="rounded-md"
                />
                <SkeletonLoader
                    width="w-full"
                    height="h-10"
                    className="rounded-md"
                />
            </div>

            {/* Other details */}
            <div className="flex flex-col gap-y-4 mt-6">
                {[1, 2, 3].map((i) => (
                    <div key={i}>
                        <SkeletonLoader
                            width="w-32"
                            height="h-4"
                            className="mb-2"
                        />
                        <SkeletonLoader
                            width="w-full"
                            height="h-12"
                            className="rounded-md mb-2"
                        />
                        <SkeletonLoader
                            width="w-full"
                            height="h-12"
                            className="rounded-md"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
