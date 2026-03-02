import { Button, NoData } from '@components'
import moment from 'moment'
import { RtoV2Api } from '@queries'
import { motion } from 'framer-motion'
import { PlacementRequirementsSkeleton } from '../../../../skeletonLoader'
import { useAppSelector } from '@redux/hooks'
import {
    CheckCheck,
    CheckCircle,
    CheckCircle2,
    Clock,
    FileText,
    Shield,
} from 'lucide-react'
import { getCourseById } from './data'

interface PlacementRequirementsProps {
    workplaceId: any
}

export function PlacementRequirements({
    workplaceId,
}: PlacementRequirementsProps) {
    const { selectedCourse } = useAppSelector((state) => state.student)
    const selectedCourseId = selectedCourse?.id
    const [confirmTasks, confirmTasksResult] =
        RtoV2Api.PlacementRequests.useConfirmHighlightedTask()

    const highlightedAndRtoReq =
        RtoV2Api.PlacementRequests.useIndustryPlacementHighlightedTasks(
            workplaceId?.id,
            {
                skip: !workplaceId?.id,
            }
        )

    const data = highlightedAndRtoReq?.data
    const differenceConfig = data?.courseConfigurationDetail?.difference
    const isConfirmed = differenceConfig?.isConfirmed

    const course = workplaceId?.courses?.find(
        (c: any) => c.id === selectedCourseId
    )

    if (!course) return null

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-lg shadow-slate-200/50 overflow-hidden hover:shadow-xl transition-all">
            {/* Header */}
            <div className="bg-linear-to-r from-[#044866] via-[#0D5468] to-[#044866] px-5 py-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
                <div className="relative flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg">
                        <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold text-sm">
                            Placement Requirements
                        </h3>
                        <p className="text-white/70 text-xs">
                            Essential criteria for this placement
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
                {highlightedAndRtoReq?.isLoading ? (
                    <PlacementRequirementsSkeleton />
                ) : (
                    <>
                        {/* Course Info Card */}
                        <div className="group relative overflow-hidden rounded-xl bg-linear-to-br from-blue-50 via-white to-blue-50 border border-blue-200 p-4 shadow-sm hover:shadow-lg transition-all duration-300">
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                            <div className="relative">
                                <h4 className="text-sm font-bold text-slate-900 mb-0.5">
                                    {course.code} -{' '}
                                    {course.name || course.title}
                                </h4>
                                <p className="text-xs text-slate-600">
                                    {course.level
                                        ? `Australian Qualification Framework Level ${course.level}`
                                        : 'Australian Qualification Framework Level'}
                                </p>
                            </div>
                        </div>

                        {/* Minimum Hours Card */}
                        <div className="group relative overflow-hidden rounded-xl bg-linear-to-br from-emerald-50 via-white to-emerald-50 border border-emerald-200 p-4 shadow-sm hover:shadow-lg transition-all duration-300">
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                            <div className="relative flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-emerald-900 mb-0.5">
                                        Minimum Placement Hours
                                    </p>
                                    <p className="text-2xl font-bold text-emerald-600">
                                        {course.hours || '120'} hours
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Workplace Requirements */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-7 h-7 rounded-lg bg-linear-to-br from-[#044866] to-[#0D5468] flex items-center justify-center shadow-lg shadow-[#044866]/30">
                                    <Shield className="w-3.5 h-3.5 text-white" />
                                </div>
                                <h5 className="text-xs font-bold text-slate-900">
                                    Workplace Requirements:
                                </h5>
                            </div>

                            <div className="space-y-2.5">
                                {data?.difference?.length ? (
                                    <>
                                        {isConfirmed ? (
                                            <div className="text-[10px] bg-emerald-50 text-emerald-800 px-4 py-3 rounded-lg border border-emerald-200 mb-3">
                                                <div className="flex items-center gap-2">
                                                    <CheckCheck className="h-3 w-3 text-emerald-600" />

                                                    <span className="font-medium">
                                                        Confirmed with Workplace
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between mt-1">
                                                    <div className="flex items-center gap-1">
                                                        <p className="text-slate-500 font-medium">
                                                            Confirmed by :
                                                        </p>
                                                        <span className="text-slate-600">
                                                            {differenceConfig
                                                                ?.confirmedBy
                                                                ?.name ?? '---'}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-1 items-center">
                                                        <span className="text-slate-400">
                                                            Date:
                                                        </span>

                                                        <p className="text-slate-600">
                                                            {moment(
                                                                differenceConfig?.updatedAt
                                                            ).format(
                                                                'DD MMM YYYY'
                                                            ) ?? '---'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <Button
                                                variant="primary"
                                                className="w-full h-8 mb-3 border-violet-300 text-violet-600 hover:bg-violet-600 hover:text-white text-xs"
                                                Icon={CheckCircle2}
                                                text="Confirm with Workplace"
                                                loading={
                                                    confirmTasksResult.isLoading
                                                }
                                                disabled={
                                                    confirmTasksResult.isLoading
                                                }
                                                onClick={() =>
                                                    confirmTasks(
                                                        differenceConfig.id
                                                    )
                                                }
                                            />
                                        )}
                                        {data?.difference?.map(
                                            (req: string, index: number) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{
                                                        opacity: 0,
                                                        x: -10,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    transition={{
                                                        delay: index * 0.05,
                                                    }}
                                                    className="group/req relative overflow-hidden rounded-lg bg-linear-to-br from-slate-50 via-white to-slate-50 border border-slate-200 p-3.5 shadow-sm hover:shadow-md hover:border-[#044866]/30 transition-all duration-300 cursor-pointer"
                                                >
                                                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent translate-x-[-200%] group-hover/req:translate-x-[200%] transition-transform duration-1000"></div>

                                                    <div className="relative flex items-start gap-2.5">
                                                        <div className="w-6 h-6 rounded-lg bg-linear-to-br from-[#044866] to-[#0D5468] flex items-center justify-center shrink-0 shadow-lg group-hover/req:scale-110 group-hover/req:rotate-6 transition-all duration-300">
                                                            <CheckCircle className="w-3.5 h-3.5 text-white" />
                                                        </div>
                                                        <p className="text-xs text-slate-700 leading-relaxed group-hover/req:text-slate-900 transition-colors flex-1">
                                                            {req}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )
                                        )}
                                    </>
                                ) : (
                                    <NoData text="No Extra Requirements Found" />
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
