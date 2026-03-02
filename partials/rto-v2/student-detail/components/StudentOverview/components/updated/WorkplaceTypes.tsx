import { Badge, NoData, SkeletonLoader } from '@components'
import { RtoV2Api } from '@queries'
import { useAppSelector } from '@redux/hooks'
import { Building2, CheckCircle, MapPin } from 'lucide-react'

export function WorkplaceTypesSkeleton() {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-lg shadow-slate-200/50 overflow-hidden">
            {/* Header Skeleton */}
            <div className="bg-slate-100 px-5 py-3 relative overflow-hidden">
                <div className="flex items-center gap-2.5">
                    <SkeletonLoader
                        width="w-8"
                        height="h-8"
                        className="rounded-lg"
                    />
                    <div className="flex-1 space-y-2">
                        <SkeletonLoader width="w-28" height="h-4" />
                        <SkeletonLoader width="w-48" height="h-3" />
                    </div>
                </div>
            </div>

            {/* Workplace Types Grid Skeleton */}
            <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-100 bg-slate-50/50"
                        >
                            <SkeletonLoader
                                width="w-7"
                                height="h-7"
                                className="rounded-lg shrink-0"
                            />
                            <div className="flex-1">
                                <SkeletonLoader width="w-full" height="h-4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export function WorkplaceTypes() {
    const { selectedCourse } = useAppSelector((state) => state?.student)
    const { rtoDetail } = useAppSelector((state) => state?.rto)

    const { data: courseWpTypesData, isLoading } =
        RtoV2Api.Courses.useRtoCourseWpTypes(
            { cId: selectedCourse?.id, id: rtoDetail?.id },
            {
                skip: !selectedCourse?.id || !rtoDetail?.id,
            }
        )

    if (isLoading) {
        return <WorkplaceTypesSkeleton />
    }

    const workplaceTypes = courseWpTypesData || []

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-lg shadow-slate-200/50 overflow-hidden hover:shadow-xl transition-all">
            {/* Header */}
            <div className="bg-linear-to-r from-[#044866] via-[#0D5468] to-[#044866] px-5 py-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
                <div className="relative flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg">
                        <Building2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold text-sm flex items-center gap-1.5">
                            Workplace Types
                            {workplaceTypes.length > 0 && (
                                <Badge className="bg-white/20 text-white border-0 text-xs px-2 py-0.5">
                                    {workplaceTypes.length}
                                </Badge>
                            )}
                        </h3>
                        <p className="text-white/70 text-xs">
                            Eligible placement settings for this course
                        </p>
                    </div>
                </div>
            </div>

            {/* Workplace Types Grid */}
            <div className="p-5">
                {workplaceTypes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                        {workplaceTypes.map((type: any, index: number) => (
                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-lg bg-linear-to-br from-slate-50 via-white to-slate-50 border border-slate-200 p-3 shadow-sm hover:shadow-lg hover:border-[#044866]/30 transition-all duration-300 cursor-pointer"
                            >
                                {/* Animated background on hover */}
                                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

                                <div className="relative flex items-start gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-linear-to-br from-[#044866] to-[#0D5468] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shrink-0">
                                        <MapPin className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-900 font-medium leading-snug">
                                            {type?.workplaceType?.name || '---'}
                                        </p>
                                    </div>
                                    <CheckCircle className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <NoData text="No Workplace Types Found" />
                )}
            </div>
        </div>
    )
}
