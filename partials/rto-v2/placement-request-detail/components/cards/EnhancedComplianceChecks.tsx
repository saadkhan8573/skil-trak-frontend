import { Badge, Card, NoData } from '@components'
import { RtoV2Api } from '@queries'
import { AssessmentEvidenceFolder } from '@types'
import { folderResponse } from '@utils'
import { motion } from 'framer-motion'
import { Shield, CheckCircle2, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

export const EnhancedComplianceChecks = () => {
    const router = useRouter()
    const wpId = router.query.id as string

    const { data, isLoading, isError } =
        RtoV2Api.PlacementRequests.useStudentPlacementCompliance(wpId, {
            skip: !wpId,
        })

    const complianceItems = useMemo(() => {
        if (!data) return []

        const assessment =
            data?.assessmentEvidence?.map((doc: AssessmentEvidenceFolder) => {
                const response = folderResponse(doc?.studentResponse)

                const files = response?.files || []
                return {
                    id: `ae-${doc.id}`,
                    name: doc.name,
                    required: doc.isMandatory,
                    isUploaded: files.length > 0,
                    filesCount: files.length,
                    fileStatus: response?.status ?? "pending"
                }
            }) || []

        const other =
            data?.otherDocs?.map((doc: any) => {
                const response = folderResponse(doc?.studentResponse)
                const files = response?.files || []
                return {
                    id: `od-${doc.id}`,
                    name: doc.name,
                    required: doc.isRequired,
                    isUploaded: files.length > 0,
                    filesCount: files.length,
                    fileStatus: response?.status ?? "pending"
                }
            }) || []

        return [...assessment, ...other]
    }, [data])



    return (
        <Card noPadding className="border-0 shadow-xl overflow-hidden">
            <div className="bg-linear-to-r from-emerald-600 to-teal-600 px-5 py-4">
                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-2.5">
                        <Shield className="h-5 w-5" />
                        <h3 className="font-semibold">Compliance Checks</h3>
                    </div>

                    {complianceItems.length > 0 && (
                        <Badge
                            text={
                                complianceItems.filter((item) => item.required).every((item) => item.fileStatus === 'approved')
                                    ? 'Completed'
                                    : complianceItems.filter((item) => item.required).every((item) => item.isUploaded)
                                        ? 'Uploaded'
                                        : 'Pending'
                            }
                            className={
                                complianceItems.filter((item) => item.required).every((item) => item.fileStatus === 'approved')
                                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                    : complianceItems.filter((item) => item.required).every((item) => item.isUploaded)
                                        ? 'bg-blue-100 text-blue-700 border-blue-200'
                                        : 'bg-amber-100 text-amber-700 border-amber-200'
                            }
                        />
                    )}
                </div>
            </div>

            {isError && <NoData isError />}

            {isLoading ? (
                <div className="p-6">Loading...</div>
            ) : complianceItems.length > 0 ? (
                <div className="p-6">
                    <div className="space-y-3">
                        {complianceItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center justify-between p-4 bg-linear-to-br from-slate-50 to-slate-100/50 rounded-xl border border-slate-200 hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`p-2 rounded-lg ${item.isUploaded
                                            ? 'bg-emerald-100'
                                            : 'bg-amber-100'
                                            }`}
                                    >
                                        {item.isUploaded ? (
                                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                        ) : (
                                            <AlertCircle className="h-5 w-5 text-amber-600" />
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-slate-900 font-medium">
                                            {item.name}
                                            {item.required && (
                                                <span className="text-red-500 ml-1">
                                                    *
                                                </span>
                                            )}
                                        </p>

                                        <p className="text-slate-500 text-xs mt-0.5">
                                            {item.isUploaded
                                                ? `${item.filesCount} file(s) uploaded`
                                                : 'No document uploaded'}
                                        </p>
                                    </div>
                                </div>

                                <Badge
                                    text={
                                        item.fileStatus === 'approved'
                                            ? 'Approved'
                                            : item.isUploaded
                                                ? 'Uploaded'
                                                : 'Pending'
                                    }
                                    className={
                                        item.fileStatus === 'approved'
                                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                            : item.isUploaded
                                                ? 'bg-blue-100 text-blue-700 border-blue-200'
                                                : 'bg-amber-100 text-amber-700 border-amber-200'
                                    }
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            ) : (
                !isError && <NoData text="No compliance checks found" />
            )}
        </Card>
    )
}
