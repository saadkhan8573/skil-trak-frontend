import { Badge, Button, Card } from '@components'
import { Checkbox as UICheckbox } from '@components/ui/checkbox'
import { RtoV2Api } from '@queries'
import { motion } from 'framer-motion'
import { Eye, GraduationCap, Info } from 'lucide-react'
import { useRouter } from 'next/router'
export const EnhancedPlacementProgramCard = ({
    toggleRequirement,
}: any) => {
    const router = useRouter()
    const wpId = router.query.id
    const { data } =
        RtoV2Api.PlacementRequests.useStudentPlacementCoursePrograms(wpId, {
            skip: !wpId,
        })
    return (
        <Card noPadding className="border-0 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#0D5468] to-[#044866] px-5 py-4">
                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-2.5">
                        <GraduationCap className="h-5 w-5" />
                        <h3 className="font-semibold">
                            Placement Streams (Blocks)
                        </h3>
                    </div>
                    <Badge
                        text={`${data?.hours ?? '---'}`}
                        className="bg-white/20 text-white border-0"
                    />
                </div>
            </div>

            <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <Info className="h-4 w-4 text-blue-600" />
                    {/* <p className="text-blue-900 text-sm">
                        Select one or multiple requirements for this request
                    </p> */}
                    <p className="text-blue-900 text-sm">Coming soon...!</p>
                </div>

                <div className="space-y-3 blur-xs">
                    {data?.map((req: any) => {
                        const progress = (0 / req?.hours) * 100
                        return (
                            <motion.div
                                key={req.id}
                                whileHover={{ scale: 1.01 }}
                                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                                    req?.isActive
                                        ? 'border-[#044866] bg-gradient-to-br from-[#044866]/5 to-[#044866]/10 shadow-md'
                                        : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-sm'
                                }`}
                                onClick={() => toggleRequirement(req.id)}
                            >
                                <div className="flex items-start gap-3 mb-3">
                                    <UICheckbox
                                        checked={req?.isActive}
                                        className="mt-1"
                                        // onClick={(e: any) =>
                                        //     e.stopPropagation()
                                        // }
                                        onCheckedChange={() =>
                                            toggleRequirement(req.id)
                                        }
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-slate-900 font-semibold">
                                                {req?.title}
                                            </p>
                                            <Badge
                                                outline
                                                text={`0 / ${req?.hours}`}
                                                className={`text-xs px-2 py-0.5 ${
                                                    req?.isActive
                                                        ? 'border-[#044866] text-[#044866] bg-[#044866]/5'
                                                        : 'border-slate-300 text-slate-600'
                                                }`}
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-600">
                                                    Progress
                                                </span>
                                                <span className="font-medium text-slate-700">
                                                    {Math.round(progress)}%
                                                </span>
                                            </div>
                                            <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{
                                                        width: 0,
                                                    }}
                                                    animate={{
                                                        width: `${progress}%`,
                                                    }}
                                                    transition={{
                                                        duration: 0.8,
                                                        ease: 'easeOut',
                                                    }}
                                                    className={`h-full rounded-full ${
                                                        progress === 100
                                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                                                            : progress >= 50
                                                            ? 'bg-gradient-to-r from-[#044866] to-[#0D5468]'
                                                            : 'bg-gradient-to-r from-amber-400 to-amber-500'
                                                    }`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* <Button
                    outline
                    variant="primaryNew"
                    className="w-full border-2 border-[#044866]/20 text-[#044866] hover:bg-[#044866]/5 hover:border-[#044866]/40 h-10"
                    onClick={() => setShowPlacementReqDialog(true)}
                    text="Add Placement Requirements"
                /> */}
                {/* <Button
                    outline
                    variant="secondary"
                    Icon={Eye}
                    text="View Full Requirements"
                /> */}
            </div>
        </Card>
    )
}
