import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@components/ui/dialog'
import {
    Button,
    Typography,
    ShowErrorNotifications,
    ViewDocumentModal,
    ViewImageModal,
} from '@components'
import Image from 'next/image'
import { X, FileText, CheckCircle2 } from 'lucide-react'
import { SubAdminApi } from '@queries'
import { useNotification } from '@hooks'
import { AssessmentToolsType, Rto } from '@types'
import { useState } from 'react'
import { getFileExtensionByUrl } from '@utils'

interface LogbookNotReleasedModalProps {
    isOpen: boolean
    onClose: () => void
    selectedWorkplaceId: number
    rto: Rto
}

export function LogbookNotReleasedModal({
    isOpen,
    onClose,
    selectedWorkplaceId,
    rto,
}: LogbookNotReleasedModalProps) {
    const { notification } = useNotification()

    const [viewFileData, setViewFileData] = useState<{
        url: string
        title: string
    } | null>(null)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [isImageViewModalOpen, setIsImageViewModalOpen] = useState(false)

    const [releaseLogbook, releaseLogbookResult] =
        SubAdminApi.Student.releaseStudentLogbook()

    const onReleaseLogbook = async () => {
        const res: any = await releaseLogbook(selectedWorkplaceId)

        if (res?.data) {
            notification.success({
                title: 'Logbook Released',
                description: 'Logbook Released Successfully',
            })
            onClose()
        }
    }

    const onViewFile = (tool: AssessmentToolsType) => {
        const fileUrl = tool?.file.replaceAll('{"', '').replaceAll('"}', '')

        const extension = getFileExtensionByUrl(fileUrl)
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(
            extension || ''
        )
        const isPdf = extension === 'pdf'

        setViewFileData({
            url: fileUrl,
            title: tool.title,
        })

        if (isPdf) {
            setIsViewModalOpen(true)
        } else if (isImage) {
            setIsImageViewModalOpen(true)
        } else {
            window.open(fileUrl, '_blank')
        }
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent
                    showCloseButton={false}
                    className="max-w-3xl! p-0 overflow-hidden border-none rounded-2xl shadow-2xl max-h-[90vh] flex flex-col"
                >
                    <DialogHeader className="sr-only">
                        <DialogTitle>Logbook Release Pending</DialogTitle>
                        <DialogDescription>
                            Reminder that the logbook has not yet been released
                            for this student.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {/* Compact Header Bar */}
                        <div className="relative py-2.5 bg-primaryNew flex items-center justify-center overflow-hidden">
                            <div className="w-11 h-11 rounded-md bg-white/20 backdrop-blur-md flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] border border-white/30">
                                <Image
                                    alt=""
                                    width={24}
                                    height={24}
                                    src="/images/students/schedule.png"
                                    className="drop-shadow-lg"
                                />
                            </div>
                        </div>

                        <div className="px-8 pb-4 pt-6 space-y-4 bg-white">
                            <ShowErrorNotifications
                                result={releaseLogbookResult}
                            />

                            <div className="text-center space-y-2">
                                <Typography
                                    semibold
                                    className="text-xl text-slate-900 tracking-tight"
                                >
                                    Logbook Release Pending
                                </Typography>
                                <div className="flex items-center justify-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-100/50 w-fit mx-auto">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                                        Required
                                    </span>
                                </div>
                            </div>

                            <div className="relative group p-5 rounded-2xl bg-borderNew/30 border border-slate-100 transition-all hover:bg-amber-50/10 hover:border-amber-100/50">
                                <Typography center>
                                    <span className="text-[15px] leading-relaxed text-slate-600">
                                        The logbook has not yet been released.
                                        However, the student’s placement has
                                        already started. This message will
                                        remain until the logbook is released.
                                    </span>
                                </Typography>
                            </div>

                            {/* Assessment Tools List */}
                            <div className="space-y-3">
                                <Typography
                                    semibold
                                    className="text-slate-900 text-sm px-1"
                                >
                                    Assessment Tools
                                </Typography>
                                {rto?.assessmentTools?.map(
                                    (
                                        assessmentTool: AssessmentToolsType,
                                        index
                                    ) => (
                                        <div
                                            key={index}
                                            className="group bg-slate-50 hover:bg-slate-100/80 rounded-xl flex justify-between items-center px-4 py-3.5 border border-slate-100 transition-all hover:border-primaryNew/30"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <div className="p-1.5 rounded-lg bg-white shadow-sm border border-slate-200 text-primaryNew group-hover:text-primaryNew-dark transition-colors">
                                                    <FileText className="w-3.5 h-3.5" />
                                                </div>
                                                <Typography
                                                    variant="small"
                                                    medium
                                                    className="text-slate-700 font-semibold text-xs leading-tight line-clamp-1"
                                                >
                                                    {assessmentTool?.title}
                                                </Typography>
                                            </div>
                                            <Button
                                                variant="primaryNew"
                                                className="h-7 px-3 text-[10px] font-bold border-slate-200 hover:bg-white hover:text-primaryNew hover:border-primaryNew transition-all shrink-0"
                                                onClick={() =>
                                                    onViewFile(assessmentTool)
                                                }
                                            >
                                                View
                                            </Button>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-6 bg-white border-t border-slate-100">
                        <Button
                            onClick={onReleaseLogbook}
                            loading={releaseLogbookResult?.isLoading}
                            disabled={releaseLogbookResult?.isLoading}
                            fullWidth
                            fullHeight
                            variant="primaryNew"
                            Icon={CheckCircle2}
                        >
                            Release LOGBOOK
                        </Button>

                        <Button
                            variant="secondary"
                            fullHeight
                            onClick={onClose}
                            fullWidth
                        >
                            Close
                        </Button>
                    </div>

                    <button
                        onClick={onClose}
                        className="cursor-pointer absolute top-4 right-4 p-2 rounded-full bg-black/5 hover:bg-black/10 text-white transition-all backdrop-blur-md z-20"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </DialogContent>
            </Dialog>

            <ViewDocumentModal
                open={isViewModalOpen}
                onOpenChange={setIsViewModalOpen}
                fileUrl={viewFileData?.url || ''}
                title={viewFileData?.title}
            />
            <ViewImageModal
                open={isImageViewModalOpen}
                onOpenChange={setIsImageViewModalOpen}
                fileUrl={viewFileData?.url || ''}
                title={viewFileData?.title}
            />
        </>
    )
}
