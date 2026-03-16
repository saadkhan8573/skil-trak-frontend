import { Card } from '@components'
import { Skeleton } from '@components/ui/skeleton'
import { motion } from 'framer-motion'

export const ListingProfileDetailsSkeleton = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 pb-20"
        >
            {/* Hero Skeleton */}
            <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="relative flex flex-col md:flex-row items-center md:items-end justify-between gap-2">
                    <div className="flex flex-col md:flex-row items-center md:items-center gap-6 w-full md:w-auto">
                        <Skeleton className="w-24 h-24 md:w-28 md:h-28 rounded-2xl" />
                        <div className="flex flex-col items-center md:items-start space-y-3 w-full max-w-xs">
                            <Skeleton className="w-20 h-4" />
                            <Skeleton className="w-full h-8" />
                            <div className="flex gap-4 w-full">
                                <Skeleton className="w-24 h-4" />
                                <Skeleton className="w-24 h-4" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                        <Skeleton className="w-32 h-10 rounded-lg" />
                        <Skeleton className="w-32 h-10 rounded-lg" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-8">
                {/* Row 1 Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    <Card className="lg:col-span-8 p-6 border-none shadow-sm flex flex-col md:flex-row gap-8">
                        <div className="flex-1 space-y-8">
                            <Skeleton className="w-32 h-5" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex gap-3">
                                        <Skeleton className="w-10 h-10 rounded-lg" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="w-16 h-3" />
                                            <Skeleton className="w-full h-4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="md:w-1/4 pt-6 md:pt-0 md:pl-8 md:border-l border-gray-50 flex flex-col space-y-4">
                            <Skeleton className="w-24 h-4" />
                            {[1, 2, 3].map((i) => (
                                <Skeleton
                                    key={i}
                                    className="w-full h-12 rounded-xl"
                                />
                            ))}
                        </div>
                    </Card>

                    <Card className="lg:col-span-4 p-6 border-none shadow-sm flex flex-col justify-center space-y-8">
                        <Skeleton className="w-32 h-5" />
                        <div className="space-y-5">
                            <Skeleton className="w-full h-20 rounded-2xl" />
                            <Skeleton className="w-full h-20 rounded-2xl" />
                        </div>
                    </Card>
                </div>

                {/* Row 2 Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8">
                        <Card
                            noPadding
                            className="border-none shadow-sm min-h-[650px] flex flex-col"
                        >
                            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="w-10 h-10 rounded-lg" />
                                    <div className="space-y-2">
                                        <Skeleton className="w-32 h-5" />
                                        <Skeleton className="w-48 h-3" />
                                    </div>
                                </div>
                                <Skeleton className="w-20 h-8 rounded-full" />
                            </div>
                            <div className="p-6 space-y-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <Skeleton
                                        key={i}
                                        className="w-full h-24 rounded-2xl"
                                    />
                                ))}
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <Card className="p-6 border-none shadow-sm min-h-[400px] flex flex-col space-y-6">
                            <Skeleton className="w-32 h-5" />
                            <Skeleton className="w-full h-full rounded-xl" />
                        </Card>
                        <Skeleton className="w-full h-24 rounded-2xl" />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
