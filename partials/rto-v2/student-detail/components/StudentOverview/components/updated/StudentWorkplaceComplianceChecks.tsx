import { Badge, NoData, SkeletonLoader } from '@components'
import { RtoV2Api } from '@queries'
import { useAppSelector } from '@redux/hooks'
import { AssessmentEvidenceFolder } from '@types'
import { folderResponse } from '@utils'
import { motion } from 'framer-motion'
import { Shield, CheckCircle2, AlertCircle, FileText } from 'lucide-react'
import { useMemo } from 'react'

const ComplianceSkeleton = () => (
    <div className="relative overflow-hidden rounded-lg bg-white border border-slate-200 shadow-sm p-2">
        <div className="flex items-center gap-2 mb-4">
            <SkeletonLoader
                width="w-10"
                height="h-10"
                className="rounded-xl shrink-0"
            />
            <div className="space-y-2 flex-1">
                <SkeletonLoader width="w-32" height="h-4" />
                <SkeletonLoader width="w-48" height="h-3" />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                    key={i}
                    className="flex items-center gap-2 p-2 bg-slate-50/50 rounded-xl border border-slate-100"
                >
                    <SkeletonLoader
                        width="w-8"
                        height="h-8"
                        className="rounded-lg shrink-0"
                    />
                    <div className="space-y-1.5 flex-1 overflow-hidden">
                        <SkeletonLoader width="w-3/4" height="h-3" />
                        <SkeletonLoader width="w-1/2" height="h-2" />
                    </div>
                </div>
            ))}
        </div>
    </div>
)

export const StudentWorkplaceComplianceChecks = () => {
    const { selectedWorkplace } = useAppSelector((state) => state?.student)
    const wpId = selectedWorkplace?.id?.toString()

    const { data, isLoading, isError } =
        RtoV2Api.PlacementRequests.useStudentPlacementCompliance(wpId || '', {
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
                    icon: FileText,
                    required: doc.isMandatory,
                    isUploaded: files.length > 0,
                    filesCount: files.length,
                    fileStatus: response?.status ?? 'pending',
                }
            }) || []

        const other =
            data?.otherDocs?.map((doc: any) => {
                const response = folderResponse(doc?.studentResponse)
                const files = response?.files || []
                return {
                    id: `od-${doc.id}`,
                    name: doc.name,
                    icon: Shield,
                    required: doc.isRequired,
                    isUploaded: files.length > 0,
                    filesCount: files.length,
                    fileStatus: 'approved',
                    isOtherDoc: true,
                }
            }) || []

        return [...assessment, ...other]
    }, [data])

    const isAllApproved = useMemo(() => {
        if (complianceItems.length === 0) return false
        return complianceItems
            .filter((item) => item.required)
            .every((item) => item.fileStatus === 'approved')
    }, [complianceItems])

    if (isError) return <NoData isError />
    if (isLoading) return <ComplianceSkeleton />

    return (
        <div className="relative overflow-hidden rounded-lg bg-linear-to-br from-emerald-50 to-white border border-emerald-200 shadow-sm p-2 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 mb-2">
                <div
                    className={`w-10 h-10 rounded-xl bg-linear-to-br flex items-center justify-center shadow-lg transition-all duration-500 ${isAllApproved ? 'from-emerald-500 to-emerald-600' : 'from-amber-400 to-amber-500'}`}
                >
                    <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-900">
                        {isAllApproved
                            ? 'Compliance Verified'
                            : 'Compliance Pending'}
                    </h3>
                    <p className="text-[10px] text-slate-500">
                        {isAllApproved
                            ? 'All requirements met and approved'
                            : 'Required documents pending approval'}
                    </p>
                </div>
                {isAllApproved && (
                    <div className="ml-auto">
                        <Badge
                            text="Completed"
                            className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px]"
                        />
                    </div>
                )}
            </div>
            {!wpId ||
                (complianceItems.length === 0 && (
                    <div className="relative overflow-hidden rounded-lg bg-linear-to-br from-emerald-50 to-white border border-emerald-200 shadow-sm p-4 text-center">
                        <Shield className="w-8 h-8 text-emerald-200 mx-auto mb-2" />
                        <p className="text-xs text-slate-500 font-medium">
                            No compliance checks found for this workplace
                        </p>
                    </div>
                ))}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {complianceItems.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-2 p-2 bg-white rounded-xl border border-emerald-100 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 cursor-pointer group/doc"
                    >
                        <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm shrink-0 transition-all duration-300 group-hover/doc:scale-110 ${item.isUploaded ? 'bg-emerald-100' : 'bg-amber-100'}`}
                        >
                            {item.isUploaded ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                                <AlertCircle className="w-4 h-4 text-amber-600" />
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold text-slate-900 truncate flex items-center gap-1">
                                {item.name}
                                {item.required && (
                                    <span className="text-red-500">*</span>
                                )}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span
                                    className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                                        item.fileStatus === 'approved'
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : item.isUploaded
                                              ? 'bg-blue-50 text-blue-600'
                                              : 'bg-amber-50 text-amber-600'
                                    }`}
                                >
                                    {item.fileStatus === 'approved'
                                        ? 'Approved'
                                        : item.isUploaded
                                          ? 'Uploaded'
                                          : 'Pending'}
                                </span>
                                <span className="text-[9px] text-slate-300">
                                    •
                                </span>
                                <p className="text-[9px] font-medium text-slate-500">
                                    {item.isUploaded
                                        ? `${item.filesCount} docs`
                                        : 'No file'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
