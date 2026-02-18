import React from 'react'
import { CommonApi } from '@queries'
import {
    AssessmentEvidenceDetailType,
    AssessmentEvidenceFolder,
    Rto,
} from '@types'
import { DocumentView } from './DocumentView'
import { LoadingAnimation, NoData, Button } from '@components'
import { ChevronLeft } from 'lucide-react'

interface PreviewAsSignerTemplateProps {
    rto: Rto
    userIds: any
    template: any
    folder: AssessmentEvidenceDetailType | AssessmentEvidenceFolder | null
    goBack: () => void
}

export const PreviewAsSignerTemplate = ({
    rto,
    folder,
    goBack,
    userIds,
    template,
}: PreviewAsSignerTemplateProps) => {
    const { data: pdfBytes, isLoading, isError, isSuccess } =
        CommonApi.ESign.usePreviewAsSignerTemplate(
            {
                templateId: Number(template?.id),
                users: Object.values(userIds).join(','),
                userId: Number(rto?.user?.id),
            },
            {
                skip: !template?.id || !rto?.user?.id,
            }
        )

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
                <Button
                    variant="action"
                    Icon={ChevronLeft}
                    onClick={goBack}
                    text="Back to Selection"
                    mini={false}
                />
                <div className="text-right">
                    <p className="text-sm font-bold text-gray-700">
                        Previewing Template: {template?.name}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">
                        RTO: {rto?.user?.name}
                    </p>
                </div>
            </div>

            {isError && (
                <div className="py-10">
                    <NoData text="Failed to load preview. Please try again." isError />
                </div>
            )}

            {isLoading ? (
                <div className="py-20">
                    <LoadingAnimation />
                </div>
            ) : pdfBytes ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <DocumentView file={{ data: pdfBytes }} />
                </div>
            ) : (
                isSuccess && (
                    <div className="py-10">
                        <NoData text="No preview data available for this template." />
                    </div>
                )
            )}
        </div>
    )
}
