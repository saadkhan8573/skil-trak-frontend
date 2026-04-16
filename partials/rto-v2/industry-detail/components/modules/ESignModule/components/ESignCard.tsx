import {
    Badge,
    Card,
    Permissions,
    Typography,
    ViewDocumentModal,
} from '@components'
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui/tooltip'
import { EsignDocumentStatus, maskText } from '@utils'
import {
    FileSignature,
    Send,
    User,
    Clock,
    CheckCircle2,
    Eye,
    PenTool,
    XCircle,
} from 'lucide-react'
import moment from 'moment'
import { useState } from 'react'
import {
    ResendMailModal,
    RequestResign,
} from '@partials/sub-admin/assessmentEvidence/modal'
import {
    FillEsignFieldsModal,
    SubmitDocumentModal,
} from '@partials/common/StudentProfileDetail/modals'
import { CancelESignModal } from '@partials/rto-v2/student-detail/components/StudentAssessmentDocuments/modal'
import { PermissionType } from '@types'

export function ESignCard({
    document,
    onRefetch,
}: {
    document: any
    onRefetch: () => void
}) {
    const [modal, setModal] = useState<any>(null)
    const [showUsers, setShowUsers] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)

    const onRequestResign = (signer: any) => {
        setModal(
            <RequestResign
                onCancel={() => {
                    setModal(null)
                    onRefetch()
                }}
                eSign={{
                    ...signer,
                    template: document.template,
                    document: document.id,
                }}
            />
        )
    }

    const onResendMailClicked = (signerId: number) => {
        setModal(
            <ResendMailModal
                onCancel={() => {
                    setModal(null)
                    onRefetch()
                }}
                documentId={document.id}
                signerId={signerId}
            />
        )
    }

    const fillDocumentFields = (signerId: number) => {
        setModal(
            <FillEsignFieldsModal
                documentId={document.id}
                onCancel={() => {
                    setModal(null)
                    onRefetch()
                }}
                signerId={signerId}
            />
        )
    }

    const onSubmitDocClicked = (signerId: number) => {
        setModal(
            <SubmitDocumentModal
                onCancel={(isOpen?: boolean) => {
                    if (isOpen) {
                        fillDocumentFields(signerId)
                    } else {
                        setModal(null)
                        onRefetch()
                    }
                }}
            />
        )
    }

    return (
        <>
            {modal}
            {previewUrl && (
                <ViewDocumentModal
                    open={!!previewUrl}
                    fileUrl={previewUrl}
                    onOpenChange={(open) => !open && setPreviewUrl(null)}
                />
            )}
            <Card className="p-0 border-[#E2E8F0] hover:shadow-lg transition-all duration-300 overflow-hidden bg-white">
                <div className="p-4 flex items-center gap-4">
                    {/* Left: Icon */}
                    <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                            document.status === EsignDocumentStatus.SIGNED
                                ? 'bg-gradient-to-br from-[#10B981] to-[#059669]'
                                : 'bg-gradient-to-br from-[#044866] to-[#0D5468]'
                        }`}
                    >
                        <FileSignature className="w-5 h-5 text-white" />
                    </div>

                    {/* Middle: Doc Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm text-[#1A2332] truncate">
                                {document.template?.name || 'E-Sign Document'}
                            </h4>
                            {document.status === EsignDocumentStatus.SIGNED ? (
                                <Badge
                                    variant="success"
                                    className="text-[10px] px-1.5 py-0 h-4 uppercase"
                                >
                                    Signed
                                </Badge>
                            ) : (
                                <Badge
                                    variant="warning"
                                    className="text-[10px] px-1.5 py-0 h-4 uppercase"
                                >
                                    {document.status || 'Pending'}
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-[11px] text-[#64748B]">
                                <Clock className="w-3.5 h-3.5" />
                                {moment(document.createdAt).format(
                                    'DD MMM, YYYY'
                                )}
                            </div>
                            {document.initiatedBy && (
                                <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] border-l border-[#E2E8F0] pl-3">
                                    <User className="w-3.5 h-3.5" />
                                    <span className="font-semibold text-gray-400">
                                        Initiated By:
                                    </span>
                                    <span className="truncate max-w-[120px] font-medium text-[#1A2332]">
                                        {document.initiatedBy.name}
                                    </span>
                                </div>
                            )}
                            {document.status === EsignDocumentStatus.SIGNED && (
                                <div className="flex items-center gap-1 text-[11px] text-[#10B981] font-medium border-l border-[#E2E8F0] pl-3">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Completed
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions & Toggle */}
                    <div className="flex items-center gap-3">
                        {document?.template?.file && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() =>
                                            setPreviewUrl(
                                                document?.template?.file
                                            )
                                        }
                                        className="p-2.5 rounded-lg hover:bg-gray-100 text-[#64748B] hover:text-[#044866] transition-all duration-200"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Preview Document
                                </TooltipContent>
                            </Tooltip>
                        )}
                        <Permissions
                            permission={[
                                PermissionType.CAN_PERFORM_INDUSTRY_ACTIONS,
                            ]}
                        >
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() =>
                                            setIsCancelModalOpen(true)
                                        }
                                        className="p-2.5 rounded-lg hover:bg-red-50 text-[#64748B] hover:text-red-600 transition-all duration-200"
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>Cancel E-Sign</TooltipContent>
                            </Tooltip>
                        </Permissions>
                        {document.signers?.length > 0 && (
                            <button
                                onClick={() => setShowUsers(!showUsers)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-all duration-200 ${
                                    showUsers
                                        ? 'bg-[#044866] text-white'
                                        : 'bg-[#044866]/5 text-[#044866] hover:bg-[#044866]/10'
                                }`}
                            >
                                {showUsers ? 'Hide Signers' : 'View Signers'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Detailed Signers View */}
                {showUsers && (
                    <div className="border-t border-[#E2E8F0] bg-[#F8FAFB] divide-y divide-[#E2E8F0]">
                        {document.signers?.map((signer: any, idx: number) => (
                            <div key={idx} className="p-4 bg-white/50">
                                <div className="flex items-start gap-4">
                                    {/* Signer Identity */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge
                                                variant="info"
                                                className="text-[9px] uppercase font-bold py-0 h-3.5"
                                            >
                                                {signer.user?.role || 'Signer'}
                                            </Badge>
                                            <h5 className="font-bold text-xs text-[#1A2332]">
                                                {signer.user?.name || 'Unknown'}
                                            </h5>
                                        </div>
                                        <p className="text-[10px] text-[#64748B]">
                                            {maskText(
                                                signer.user?.email || ''
                                            ) || 'No Email'}
                                        </p>
                                    </div>

                                    {/* Signer Status */}
                                    <div className="flex flex-col items-center min-w-[80px]">
                                        <span className="text-[9px] text-gray-400 uppercase font-bold mb-1">
                                            Status
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {signer.status ===
                                            EsignDocumentStatus.SIGNED ? (
                                                <div className="flex items-center gap-1 text-[#10B981] font-bold text-[10px]">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    {EsignDocumentStatus.SIGNED}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-orange-500 font-bold text-[10px]">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    PENDING
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Sign Date */}
                                    <div className="flex flex-col items-center min-w-[100px] border-l border-[#E2E8F0] pl-4">
                                        <span className="text-[9px] text-gray-400 uppercase font-bold mb-1">
                                            Sign Date
                                        </span>
                                        <span className="text-[10px] font-semibold text-[#1A2332]">
                                            {signer.status ===
                                            EsignDocumentStatus.SIGNED
                                                ? moment(
                                                      signer.updatedAt
                                                  ).format('DD MMM, YYYY')
                                                : '---'}
                                        </span>
                                    </div>

                                    {/* Individual Actions */}
                                    <div className="flex items-center gap-2 border-l border-[#E2E8F0] pl-4">
                                        {signer.status ===
                                        EsignDocumentStatus.SIGNED ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        onClick={() =>
                                                            onRequestResign(
                                                                signer
                                                            )
                                                        }
                                                        className="p-2 rounded-md hover:bg-red-50 text-[#64748B] hover:text-red-500 transition-all border border-transparent hover:border-red-100"
                                                    >
                                                        <FileSignature className="w-4 h-4" />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Request Re-sign
                                                </TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                            onClick={() =>
                                                                onResendMailClicked(
                                                                    signer.user
                                                                        ?.id
                                                                )
                                                            }
                                                            className="p-2 rounded-md hover:bg-blue-50 text-[#64748B] hover:text-[#044866] transition-all border border-transparent hover:border-blue-100"
                                                        >
                                                            <Send className="w-4 h-4" />
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Resend Mail
                                                    </TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                            onClick={() =>
                                                                onSubmitDocClicked(
                                                                    signer.user
                                                                        ?.id
                                                                )
                                                            }
                                                            className="p-2 rounded-md hover:bg-blue-50 text-[#64748B] hover:text-[#044866] transition-all border border-transparent hover:border-blue-100"
                                                        >
                                                            <PenTool className="w-4 h-4" />
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Edit/Submit Document
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
            <CancelESignModal
                open={isCancelModalOpen}
                onOpenChange={(open) => {
                    setIsCancelModalOpen(open)
                    if (!open) onRefetch()
                }}
                eSign={document}
            />
        </>
    )
}
