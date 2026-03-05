import {
    Button,
    Card,
    NoData,
    ViewDocumentModal,
    ViewImageModal,
} from '@components'
import { Skeleton } from '@components/ui/skeleton'
import { RtoV2Api } from '@queries'
import { ellipsisText } from '@utils'
import { RootState } from '@redux/store'
import {
    CheckCircle2,
    ClipboardCheck,
    ExternalLink,
    FileText,
    X,
} from 'lucide-react'
import { useState } from 'react'
import { useSelector } from 'react-redux'

export const RtoChecklistDetail = ({
    courseId,
    studentId,
    industryUserId,
}: {
    industryUserId: number
    courseId: number
    studentId: number
}) => {
    const { studentDetail } = useSelector((state: RootState) => state.student)
    const [viewDocument, setViewDocument] = useState<{
        url: string
        title: string
        isOpen: boolean
    }>({
        url: '',
        title: '',
        isOpen: false,
    })

    const [viewImage, setViewImage] = useState<{
        url: string
        title: string
        isOpen: boolean
    }>({
        url: '',
        title: '',
        isOpen: false,
    })

    const getRtoCourseChecklist =
        RtoV2Api.ApprovalRequest.getRtoCourseChecklist(
            { courseId, studentId, industryUserId },
            {
                skip: !courseId || !studentId || !industryUserId,
            }
        )

    const getColorClasses = (color: string) => {
        const colors: Record<
            string,
            { bg: string; text: string; border: string; badge: string }
        > = {
            emerald: {
                bg: 'bg-emerald-50',
                text: 'text-emerald-700',
                border: 'border-emerald-200',
                badge: 'bg-emerald-100 text-emerald-700',
            },
            blue: {
                bg: 'bg-blue-50',
                text: 'text-blue-700',
                border: 'border-blue-200',
                badge: 'bg-blue-100 text-blue-700',
            },
            purple: {
                bg: 'bg-purple-50',
                text: 'text-purple-700',
                border: 'border-purple-200',
                badge: 'bg-purple-100 text-purple-700',
            },
        }
        return colors[color]
    }

    const colors = getColorClasses('purple')

    const file =
        getRtoCourseChecklist?.data?.url ||
        getRtoCourseChecklist?.data?.studentResponse?.[0]?.files?.[0]?.file ||
        getRtoCourseChecklist?.data?.files?.[0]

    const extension = file?.split('.')?.pop()?.split('?')[0]

    const handleViewFile = (fileUrl: string, fileName: string) => {
        const ext = fileUrl?.split('.')?.pop()?.split('?')?.[0]?.toLowerCase()
        if (ext === 'pdf') {
            setViewDocument({
                url: fileUrl,
                title: fileName,
                isOpen: true,
            })
        } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
            setViewImage({
                url: fileUrl,
                title: fileName,
                isOpen: true,
            })
        } else {
            window.open(fileUrl, '_blank')
        }
    }

    return (
        <>
            <ViewDocumentModal
                open={viewDocument.isOpen}
                onOpenChange={(open) =>
                    setViewDocument((prev) => ({ ...prev, isOpen: open }))
                }
                fileUrl={viewDocument.url}
                title={viewDocument.title}
                student={studentDetail}
            />

            <ViewImageModal
                open={viewImage.isOpen}
                onOpenChange={(open) =>
                    setViewImage((prev) => ({ ...prev, isOpen: open }))
                }
                fileUrl={viewImage.url}
                title={viewImage.title}
            />
            <Card
                className={`border-2 ${colors.border} hover:shadow-lg transition-all`}
            >
                <div>
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                            <div
                                className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                            >
                                <ClipboardCheck
                                    className={`w-5 h-5 ${colors.text}`}
                                />
                            </div>
                            <div className="flex-1">
                                <div className="text-slate-900 mb-2">
                                    RTO Facility Checklist
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    {getRtoCourseChecklist?.isLoading ? (
                        <div className="space-y-4">
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3"
                                    >
                                        <Skeleton className="h-4 w-4 rounded-full" />
                                        <Skeleton className="h-4 w-full max-w-87.5" />
                                    </div>
                                ))}
                            </div>
                            <Skeleton className="h-20 w-full rounded-xl bg-slate-50" />
                        </div>
                    ) : getRtoCourseChecklist?.isError ? (
                        <NoData
                            isError
                            simple
                            text="There is some technical issue!"
                        />
                    ) : null}

                    {getRtoCourseChecklist?.data &&
                        getRtoCourseChecklist?.isSuccess && (
                            <div className="space-y-2.5">
                                {[
                                    'Confirmed suitable physical environment',
                                    'Verified access to required client groups',
                                    'Confirmed ability to provide mandated tasks',
                                    'Verified supervision arrangements meet RTO requirements',
                                    'Confirmed understanding of placement expectations',
                                    'Agreed to RTO monitoring processes',
                                ].map((item, itemIndex) => (
                                    <div
                                        key={itemIndex}
                                        className="flex items-start gap-3"
                                    >
                                        <CheckCircle2
                                            className={`w-4 h-4 ${colors.text} mt-0.5 shrink-0`}
                                        />
                                        <span className="text-sm text-slate-700">
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                    {file ? (
                        <div className="mt-4 p-5 bg-linear-to-br from-slate-50 to-white rounded-xl border-2 border-slate-200 hover:border-[#044866]/30 hover:shadow-md transition-all group">
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="w-12 h-12 bg-linear-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                        <FileText className="w-6 h-6 text-slate-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm text-slate-900 truncate mb-1">
                                            {ellipsisText(
                                                getRtoCourseChecklist.data
                                                    ?.title || file,
                                                30
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded">
                                                {extension}
                                            </span>
                                            <span>Available for review</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <Button
                                        outline
                                        variant="primaryNew"
                                        onClick={() =>
                                            handleViewFile(
                                                file,
                                                getRtoCourseChecklist.data
                                                    ?.title ||
                                                    'RTO Facility Checklist'
                                            )
                                        }
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        View
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : getRtoCourseChecklist?.isSuccess ? (
                        <NoData simple text="No RTO Facility Checklist found" />
                    ) : null}
                </div>
            </Card>
        </>
    )
}
