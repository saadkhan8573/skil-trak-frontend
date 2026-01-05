import { Badge, Card } from '@components'
import { RtoV2Api } from '@queries'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import { useRouter } from 'next/router'
export const EnhancedComplianceChecks = () => {
    const router = useRouter()
    const wpId = router.query.id as string
    const { data } = RtoV2Api.PlacementRequests.useStudentPlacementCompliance(
        wpId,
        {
            skip: !wpId,
        }
    )
    return (
        <Card noPadding className="border-0 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4">
                <div className="flex items-center gap-2.5 text-white">
                    <Shield className="h-5 w-5" />
                    <h3 className="font-semibold">Compliance Checks</h3>
                </div>
            </div>

            <div className="p-6">
                <div className="space-y-3">
                    {data
                        ?.filter((check: any) => check?.isRequired)
                        ?.map((check: any, index: any) => {
                            const Icon = check.icon
                            return (
                                <motion.div
                                    key={index}
                                    initial={{
                                        opacity: 0,
                                        x: -20,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                    }}
                                    transition={{
                                        delay: index * 0.1,
                                    }}
                                    className="flex items-center justify-between p-4 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl border border-slate-200 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        {/* <div
                                        className={`p-2 rounded-lg ${
                                            check.status === 'verified'
                                                ? 'bg-emerald-100'
                                                : 'bg-amber-100'
                                        }`}
                                    >
                                        <Icon
                                            className={`h-5 w-5 ${check.color}`}
                                        />
                                    </div> */}
                                        <div>
                                            <p className="text-slate-900 font-medium">
                                                {check?.name}
                                            </p>
                                            {/* <p className="text-slate-600 text-xs mt-0.5">
                                            Expiry: {check.expiry}
                                        </p> */}
                                        </div>
                                    </div>
                                    {/* <Badge
                                    text={
                                        check.status === 'verified'
                                            ? 'Verified'
                                            : 'Pending'
                                    }
                                    className={
                                        check.status === 'verified'
                                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                            : 'bg-amber-100 text-amber-700 border-amber-200'
                                    }
                                /> */}
                                </motion.div>
                            )
                        })}
                </div>
            </div>
        </Card>
    )
}
