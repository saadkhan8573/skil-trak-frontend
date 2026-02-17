import { Badge, Button } from '@components'
import { useNotification } from '@hooks'
import { StudentApi } from '@queries'
import {
    AlertCircle,
    CheckCircle2,
    ExternalLink,
    FileText,
    Info,
} from 'lucide-react'
import React, { useEffect } from 'react'

export const PrePlacementForm = ({ wpApprovalData }: any) => {
    const { notification } = useNotification()
    const [wpRequestComplete, wpRequestCompleteResult] =
        StudentApi.Workplace.useCompleteWorkplaceApprovalRequest()
    useEffect(() => {
        if (wpRequestCompleteResult.isSuccess) {
            notification.success({
                title: 'Completed',
                description: 'Successfully completed',
            })
        }
    }, [wpRequestCompleteResult.isSuccess])
    const externalForm = {
        title: 'Industry Partner Pre-Placement Form',
        description: `${wpApprovalData?.industry?.user?.name ?? 'NA'} requires all students to complete their pre-placement questionnaire before approval.`,
        url: wpApprovalData?.industry?.placementUrl ?? '',
        required: true,
        isCompleted: wpApprovalData?.isMarkedComplete,
    }
    return (
        <>
            {/* External Form Section - Only shown if external form is required */}
            <div className="bg-linear-to-br from-[#044866] via-[#0D5468] to-[#044866] backdrop-blur-sm rounded-lg p-3 lg:p-2.5 border-t border-white/20">
                <div className="flex items-center gap-2 mb-2 lg:mb-1.5">
                    <div className="w-5 h-5 bg-[#F7A619]/30 rounded-lg flex items-center justify-center">
                        <FileText className="h-3 w-3 text-[#F7A619]" />
                    </div>
                    <h4 className="text-sm font-medium text-white">
                        Industry Partner Pre-Placement Form
                    </h4>
                    {externalForm.required && !externalForm?.isCompleted && (
                        <Badge
                            variant="error"
                            Icon={AlertCircle}
                            text="Required"
                        />
                    )}
                    {externalForm?.isCompleted && (
                        <Badge
                            variant="success"
                            Icon={CheckCircle2}
                            text="Submitted"
                        />
                    )}
                </div>

                <p className="text-xs text-white/70 mb-2 lg:mb-1.5">
                    {externalForm?.description}
                </p>

                <div
                    className={`bg-white/5 rounded-lg p-2.5 lg:p-2 border ${
                        externalForm?.isCompleted
                            ? 'border-green-500/30'
                            : 'border-[#F7A619]/30'
                    }`}
                >
                    <div className="flex items-center justify-between mb-2 lg:mb-1.5">
                        <div className="flex items-center gap-2">
                            <ExternalLink
                                className={`h-4 w-4 ${
                                    externalForm?.isCompleted
                                        ? 'text-green-400'
                                        : 'text-[#F7A619]'
                                }`}
                            />
                            <span className="text-sm font-medium text-white">
                                External Form Submission
                            </span>
                        </div>
                        {externalForm?.isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                        ) : (
                            <AlertCircle className="h-4 w-4 text-red-300" />
                        )}
                    </div>

                    {externalForm?.isCompleted ? (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 lg:p-1.5">
                            <div className="flex items-center gap-2 mb-1">
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                                <span className="text-sm font-medium text-green-200">
                                    Form Submitted Successfully
                                </span>
                            </div>
                            <p className="text-xs text-white/70">
                                You have completed and submitted the external
                                form. You can now proceed with approval.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2 lg:space-y-1.5">
                            <div className="bg-blue-50/10 border border-blue-200/20 rounded-lg p-2 lg:p-1.5">
                                <div className="flex items-start gap-2">
                                    <Info className="h-3.5 w-3.5 text-blue-300 shrink-0 mt-0.5" />
                                    <div className="text-xs text-blue-200">
                                        <p className="font-medium mb-0.5">
                                            Important Instructions
                                        </p>
                                        <p>
                                            Click the button below to open the
                                            external form. After completing and
                                            submitting it, return here and mark
                                            it as complete.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-2">
                                <Button
                                    variant="secondary"
                                    onClick={() =>
                                        window.open(externalForm.url, '_blank')
                                    }
                                >
                                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                                    Open External Form
                                </Button>

                                <Button
                                    variant="success"
                                    onClick={() =>
                                        wpRequestComplete(wpApprovalData?.id)
                                    }
                                    disabled={wpRequestCompleteResult.isLoading}
                                    loading={wpRequestCompleteResult.isLoading}
                                >
                                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                                    Mark as Complete
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
