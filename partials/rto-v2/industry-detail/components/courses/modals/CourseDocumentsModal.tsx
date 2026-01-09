import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import {
    Badge,
    Button,
    LoadingAnimation,
    NoData,
    ShowErrorNotifications,
    Typography,
} from '@components'
import { CommonApi, IndustryApi } from '@queries'
import { FileCheck2, FileX, Send, FileText, Download } from 'lucide-react'
import { useState } from 'react'
import { useNotification } from '@hooks'
import { DocumentView } from '@partials/sub-admin'
import { removeEmptyValues } from '@utils'
import { ViewDocumentModal } from './ViewDocumentModal'
import { ConfirmBulkInitiateModal } from './ConfirmBulkInitiateModal'
import { AssignCourseModal } from './AssignCourseModal'

interface CourseDocumentsModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    industryId: number
    industryUserId: number
    sectorId: number
    sectorName: string
}

interface Template {
    id: string
    name: string
    file?: string
    status: 'sent' | 'not-sent' | 'signed'
}

interface Sector {
    id: string
    name: string
    templates: Template[]
}

export function CourseDocumentsModal({
    open,
    onOpenChange,
    industryId,
    industryUserId,
    sectorId,
    sectorName,
}: CourseDocumentsModalProps) {
    const { notification } = useNotification()
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
        null
    )
    const [viewDocUrl, setViewDocUrl] = useState<string>('')
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
    const [assignDocUrl, setAssignDocUrl] = useState<string>('')

    const [initiate, initiateResult] = CommonApi.ESign.initiateIndustryESign()

    const esignList = CommonApi.ESign.industryAllEsigns(
        { id: industryId, sectorId },
        {
            skip: !industryId,
            refetchOnMountOrArgChange: true,
        }
    )

    const getStatusIcon = (document: any) => {
        if (document?.initiatedBy) {
            return <Send className="h-4 w-4" style={{ color: '#044866' }} />
        }
        if (document?.status === 'signed' && !document?.initiatedBy) {
            return (
                <FileCheck2 className="h-4 w-4" style={{ color: '#0D5468' }} />
            )
        }
        if (!document) {
            return <FileX className="h-4 w-4" style={{ color: '#F7A619' }} />
        }
    }

    const getStatusBadge = (document: any) => {
        if (document?.initiatedBy) {
            return <Badge variant="primaryNew" text="Sent" />
        }
        if (document?.status === 'signed' && !document?.initiatedBy) {
            return <Badge variant="accent" text="Signed" />
        }
        if (!document) {
            return <Badge variant="primary" text="Not Sent" />
        }
    }

    const onInitiateSign = async (templateId?: number) => {
        const idToInitiate = templateId || Number(selectedTemplate?.id)

        if (!idToInitiate) {
            notification.warning({
                title: 'Template Required',
                description: 'Please select an esign template',
            })
            return
        }

        try {
            const res: any = await initiate({
                industryUserId,
                templateId: idToInitiate,
            }).unwrap()

            if (res) {
                notification.success({
                    title: 'Esign Initiated',
                    description: 'Esign Initiated Successfully',
                })
                onOpenChange(false)
            }
        } catch (error) {
            // Error handled by ShowErrorNotifications
        }
    }

    const allTemplates = esignList?.data?.data || []
    const totalTemplates = allTemplates.length
    const pendingActions = allTemplates.filter(
        (t: any) => !t?.documents?.[0]
    ).length

    // --- DOCUMENTS LIST LOGIC ---
    const getPendingEsign = CommonApi.ESign.getIndustryEsignDocs(
        {
            userId: industryUserId,
            search: `${JSON.stringify(
                removeEmptyValues({
                    sectorId: sectorId, // Directly filter by this sector
                })
            )
                .replaceAll('{', '')
                .replaceAll('}', '')
                .replaceAll('"', '')
                .trim()}`,
        },
        { skip: !industryUserId || !sectorId, refetchOnMountOrArgChange: true }
    )

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <ViewDocumentModal
                open={isViewModalOpen}
                onOpenChange={setIsViewModalOpen}
                fileUrl={viewDocUrl}
            />
            <ConfirmBulkInitiateModal
                open={isConfirmModalOpen}
                onOpenChange={setIsConfirmModalOpen}
                industryUserId={industryUserId}
                templateIds={allTemplates.map((t: any) => Number(t.id))}
            />
            <DialogContent className="sm:max-w-[900px] h-[85vh] p-0 flex flex-col bg-white rounded-2xl border-none shadow-2xl overflow-hidden">
                <ShowErrorNotifications result={initiateResult} />

                {/* Header */}
                <div className="bg-gradient-to-r from-[#044866] to-[#0D5468] p-6 text-white shrink-0">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2 text-white">
                            <FileText className="w-5 h-5 opacity-80" />
                            {sectorName} Documents
                        </DialogTitle>
                        <DialogDescription className="text-teal-100/80">
                            Manage electronic signatures and view course-related
                            documents
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    {/* SECTION 1: Initiate Industry Esign */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-semibold text-[#1A2332]">
                                    Initiate Industry Esign
                                </h3>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    {allTemplates.length} Templates
                                </span>
                            </div>
                            {allTemplates && allTemplates?.length > 0 && (
                                <Button
                                    variant="primaryNew"
                                    className="h-8 text-xs font-bold"
                                    onClick={() => setIsConfirmModalOpen(true)}
                                >
                                    Send All
                                </Button>
                            )}
                        </div>

                        {esignList.isLoading ? (
                            <LoadingAnimation />
                        ) : allTemplates.length > 0 ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {allTemplates.map((template: any) => {
                                        const doc = template?.documents?.[0]
                                        const isSigned =
                                            doc?.status === 'signed' &&
                                            !doc?.initiatedBy
                                        const isSent = doc?.initiatedBy

                                        return (
                                            <div
                                                key={template.id}
                                                className={`relative group rounded-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-white border-2 overflow-hidden cursor-pointer ${
                                                    selectedTemplate?.id ===
                                                    template.id
                                                        ? 'ring-2 ring-offset-2'
                                                        : 'border-slate-300'
                                                }`}
                                                onClick={() =>
                                                    setSelectedTemplate(
                                                        template
                                                    )
                                                }
                                            >
                                                {/* Status Glow Overlay */}
                                                <div
                                                    className={`absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none ${
                                                        isSigned
                                                            ? 'bg-emerald-500'
                                                            : isSent
                                                            ? 'bg-blue-500'
                                                            : 'bg-amber-500'
                                                    }`}
                                                ></div>

                                                {/* Colorful Background Blob */}
                                                <div
                                                    className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl -mr-10 -mt-10 transition-all opacity-40 ${
                                                        isSigned
                                                            ? 'bg-emerald-200'
                                                            : isSent
                                                            ? 'bg-blue-200'
                                                            : 'bg-amber-200'
                                                    }`}
                                                ></div>

                                                {/* Card Content */}
                                                <div
                                                    className={`relative p-3 h-full flex flex-col transition-all duration-300 ${
                                                        isSent || isSigned
                                                            ? 'border-2 border-primaryNew bg-primaryNew-light'
                                                            : 'border-2 border-primary bg-[#F7910F08]'
                                                    }`}
                                                    style={{
                                                        ...(selectedTemplate?.id ===
                                                            template.id &&
                                                            ({
                                                                ringColor:
                                                                    isSent
                                                                        ? '#044866'
                                                                        : isSigned
                                                                        ? '#0D5468'
                                                                        : '#F7A619',
                                                            } as any)),
                                                    }}
                                                >
                                                    {/* Status Badge */}
                                                    <div className="absolute top-3 right-3 scale-90 origin-top-right">
                                                        {getStatusBadge(doc)}
                                                    </div>

                                                    {/* Icon & Title */}
                                                    <div className="flex items-start gap-3 mb-3">
                                                        <div
                                                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md transition-transform duration-300 shrink-0 ${
                                                                isSigned
                                                                    ? 'bg-emerald-600 shadow-emerald-200'
                                                                    : isSent
                                                                    ? 'bg-blue-600 shadow-blue-200'
                                                                    : 'bg-primaryNew shadow-primaryNew'
                                                            } group-hover:scale-110`}
                                                        >
                                                            {getStatusIcon(doc)}
                                                        </div>
                                                        <div className="pr-14 min-w-0">
                                                            <h4
                                                                className="font-bold text-slate-800 text-sm leading-tight mb-1 line-clamp-2"
                                                                title={
                                                                    template.name
                                                                }
                                                            >
                                                                {template.name}
                                                            </h4>
                                                            {doc?.initiatedBy && (
                                                                <span className="text-[11px] whitespace-pre text-gray-500">
                                                                    Ready to
                                                                    resend
                                                                </span>
                                                            )}
                                                            {doc?.status ===
                                                                'signed' && (
                                                                <span className="text-[11px] text-gray-500 whitespace-pre">
                                                                    Process
                                                                    complete
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="mt-auto pt-2">
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {template.file ? (
                                                                <Button
                                                                    variant="secondary"
                                                                    className="w-full h-8 text-[10px] uppercase font-bold text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100 transition-colors"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation()
                                                                        setViewDocUrl(
                                                                            template.file ||
                                                                                ''
                                                                        )
                                                                        setIsViewModalOpen(
                                                                            true
                                                                        )
                                                                    }}
                                                                >
                                                                    Preview
                                                                </Button>
                                                            ) : (
                                                                <div className="w-full"></div>
                                                            )}

                                                            {!doc ? (
                                                                <Button
                                                                    variant="primaryNew"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation()
                                                                        onInitiateSign(
                                                                            Number(
                                                                                template.id
                                                                            )
                                                                        )
                                                                    }}
                                                                    loading={
                                                                        initiateResult.isLoading
                                                                    }
                                                                    disabled={
                                                                        initiateResult.isLoading
                                                                    }
                                                                    className="w-full h-8 text-[10px] uppercase font-bold bg-[#044866] text-white hover:bg-[#0D5468] shadow-sm border-0"
                                                                >
                                                                    Initiate
                                                                </Button>
                                                            ) : isSent ? (
                                                                <Button
                                                                    variant="primaryNew"
                                                                    outline
                                                                    className="w-full h-8 text-[10px] uppercase font-bold border-[#044866] text-[#044866] hover:bg-[#044866]/5"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation()
                                                                        onInitiateSign(
                                                                            Number(
                                                                                template.id
                                                                            )
                                                                        )
                                                                    }}
                                                                    loading={
                                                                        initiateResult.isLoading
                                                                    }
                                                                    disabled={
                                                                        initiateResult.isLoading
                                                                    }
                                                                >
                                                                    Resend
                                                                </Button>
                                                            ) : (
                                                                <div className="w-full h-8 flex items-center justify-center bg-emerald-50 rounded-lg">
                                                                    <FileCheck2 className="w-4 h-4 text-emerald-600" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-200">
                                <FileX className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500 text-sm">
                                    No esign templates available for this
                                    sector.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* SECTION 2: Documents List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                            <h3 className="text-lg font-semibold text-[#1A2332]">
                                Documents List
                            </h3>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {getPendingEsign?.data?.data?.length || 0} Files
                            </span>
                        </div>

                        {getPendingEsign?.isLoading ||
                        getPendingEsign?.isFetching ? (
                            <LoadingAnimation />
                        ) : getPendingEsign?.isError ? (
                            <NoData
                                isError
                                text="There is some Technical issue!"
                            />
                        ) : getPendingEsign?.data?.data &&
                          getPendingEsign?.data?.data?.length > 0 ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {getPendingEsign?.data?.data?.map(
                                    (document: any) => (
                                        <div
                                            key={document?.id}
                                            className="relative group bg-white border border-slate-100 rounded-2xl p-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden border-b-2 border-b-blue-600/30"
                                        >
                                            {/* Assign Button */}
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                <Button
                                                    variant="primaryNew"
                                                    className="h-7 px-3 text-[10px] font-bold bg-[#044866] hover:bg-[#0D5468] text-white shadow-lg border-0"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        const fileUrl =
                                                            document?.file
                                                                ?.replaceAll(
                                                                    '{"',
                                                                    ''
                                                                )
                                                                .replaceAll(
                                                                    '"}',
                                                                    ''
                                                                )
                                                        setAssignDocUrl(
                                                            fileUrl || ''
                                                        )
                                                        setIsAssignModalOpen(
                                                            true
                                                        )
                                                    }}
                                                >
                                                    Assign
                                                </Button>
                                            </div>

                                            <div
                                                className="h-full"
                                                onClick={() => {
                                                    const fileUrl =
                                                        document?.file
                                                            ?.replaceAll(
                                                                '{"',
                                                                ''
                                                            )
                                                            .replaceAll(
                                                                '"}',
                                                                ''
                                                            )
                                                    setViewDocUrl(fileUrl || '')
                                                    setIsViewModalOpen(true)
                                                }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full blur-2xl -mr-12 -mt-12 opacity-30 group-hover:opacity-60 transition-opacity"></div>

                                                <div className="relative flex flex-col items-center text-center gap-3">
                                                    <div className="w-14 h-14 rounded-2xl bg-white shadow-lg shadow-blue-100 border border-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-500">
                                                        <div className="p-2.5 bg-blue-50 rounded-xl">
                                                            <FileText className="w-7 h-7" />
                                                        </div>
                                                    </div>
                                                    <div className="w-full text-center">
                                                        <p
                                                            className="text-[11px] font-bold text-slate-700 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors"
                                                            title={
                                                                document?.file
                                                            }
                                                        >
                                                            {document?.file
                                                                ?.split('/')
                                                                ?.pop()
                                                                ?.split('\\')
                                                                ?.pop()
                                                                ?.replaceAll(
                                                                    '{"',
                                                                    ''
                                                                )
                                                                ?.replaceAll(
                                                                    '"}',
                                                                    ''
                                                                ) || 'Document'}
                                                        </p>
                                                        <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[9px] text-blue-600 font-black uppercase tracking-widest opacity-60 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                                                            <div className="w-1 h-4 bg-blue-500/20 rounded-full"></div>
                                                            <span>
                                                                View Document
                                                            </span>
                                                            <Download className="w-3 h-3 animate-pulse" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-200">
                                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500 text-sm">
                                    No documents found for this sector.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        {esignList?.data?.pagination?.totalResult || 0} total
                        templates • {pendingActions} pending actions
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => onOpenChange(false)}
                            className="bg-white border-slate-200"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primaryNew"
                            onClick={() => onInitiateSign()}
                            loading={initiateResult.isLoading}
                            disabled={
                                !selectedTemplate || initiateResult.isLoading
                            }
                            className="bg-[#044866] hover:bg-[#0D5468] text-white px-8"
                        >
                            Done
                        </Button>
                    </div>
                </div>

                {/* Assign Course Modal */}
                <AssignCourseModal
                    open={isAssignModalOpen}
                    onOpenChange={setIsAssignModalOpen}
                    industryId={industryId}
                    sectorId={sectorId}
                    documentUrl={assignDocUrl}
                />
            </DialogContent>
        </Dialog>
    )
}
