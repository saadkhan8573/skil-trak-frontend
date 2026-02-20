import { Badge, Button, Card, NoData, ViewDocumentModal, ViewImageModal } from '@components'
import { Skeleton } from '@components/ui/skeleton'
import { RtoV2Api } from '@queries'
import { RootState } from '@redux/store'
import { ellipsisText } from '@utils'
import {
    CheckCircle2,
    ClipboardCheck,
    ExternalLink,
    FileText,
} from 'lucide-react'
import { useState } from 'react'
import { useSelector } from 'react-redux'

export const SkiltrakChecklistDetail = ({
    courseId,
    industryUserId,
    industryName,
}: {
    industryName: string
    courseId: number
    industryUserId: number
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

    const getSkiltrakCourseChecklist =
        RtoV2Api.ApprovalRequest.getSkiltrakCourseChecklist(
            {
                industryUserId,
                courseId,
            },
            {
                skip: !industryUserId || !courseId,
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

    const colors = getColorClasses('blue')

    const file =
        getSkiltrakCourseChecklist?.data?.file?.file ||
        getSkiltrakCourseChecklist?.data?.file

    const extension = file
        ? file?.split('.')?.pop()?.split('?')?.[0]
        : undefined

    const signer = getSkiltrakCourseChecklist?.data?.document?.signers?.[0]

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
                                className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                            >
                                <ClipboardCheck
                                    className={`w-5 h-5 ${colors.text}`}
                                />
                            </div>
                            <div className="flex-1">
                                <div className="text-slate-900 mb-2">
                                    SkilTrak Facility Checklist
                                </div>
                                <Badge
                                    Icon={CheckCircle2}
                                    text={
                                        signer?.status === 'signed' || file
                                            ? 'Signed & Complete'
                                            : 'Pending'
                                    }
                                    className={colors.badge}
                                ></Badge>
                            </div>
                        </div>
                    </div>
                </div>

                {getSkiltrakCourseChecklist?.isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-16 w-full rounded-lg bg-slate-50" />
                        <Skeleton className="h-20 w-full rounded-xl bg-slate-50" />
                    </div>
                ) : getSkiltrakCourseChecklist?.data ? (
                    <div className="space-y-4">
                        <div
                            className={`${colors.bg} p-4 rounded-lg border ${colors.border} mt-4`}
                        >
                            <div className="grid md:grid-cols-3 gap-3 text-sm">
                                <div>
                                    <div className="text-xs text-slate-600 mb-1">
                                        Signed By
                                    </div>
                                    <div className={colors.text}>
                                        {signer?.user?.name || industryName}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {file && (
                            <div className="mt-4 p-5 bg-gradient-to-br from-slate-50 to-white rounded-xl border-2 border-slate-200 hover:border-[#044866]/30 hover:shadow-md transition-all group">
                                <div className="flex items-center justify-between gap-4 flex-wrap">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                            <FileText className="w-6 h-6 text-slate-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm text-slate-900 truncate mb-1">
                                                {ellipsisText(file, 35)}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span className="px-2 py-0.5 uppercase bg-red-100 text-red-700 rounded">
                                                    {extension}
                                                </span>
                                                <span>
                                                    Available for review
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <Button
                                            onClick={() =>
                                                handleViewFile(
                                                    file,
                                                    'SkilTrak Facility Checklist'
                                                )
                                            }
                                            outline
                                            variant="primaryNew"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                            View
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : getSkiltrakCourseChecklist?.isSuccess ? (
                    <NoData text="No Checklist found" />
                ) : null}
            </Card>
        </>
    )
}
