import {
    Badge,
    Button,
    StudentJobId,
    Switch,
    Tooltip,
    Typography,
    useWorldwideStudentDataRestriction,
    WorldwideStudentDataRestriction,
} from '@components'
import {
    FillEsignFieldsModal,
    SubmitDocumentModal,
} from '@partials/common/StudentProfileDetail/modals'
import { CommonApi } from '@queries'
import {
    AssessmentEvidenceDetailType,
    AssessmentEvidenceFolder,
    Rto,
} from '@types'
import { EsignDocumentStatus, maskText } from '@utils'
import { FileSignature, PenTool, Send, XCircle } from 'lucide-react'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import {
    RequestResign,
    ResendMailModal,
} from '../../../../../sub-admin/assessmentEvidence/modal'
import { CancelESignModal } from '../modal'
import { UserRoles } from '@constants'
import { useAppSelector } from '@redux'

export const InitiatedESignCard = ({
    document,
    courseId,
    rto,
    folder,
    onEsignRefetch,
}: {
    onEsignRefetch: () => void
    document: any
    courseId: number
    rto: Rto
    folder: AssessmentEvidenceDetailType | AssessmentEvidenceFolder | null
}) => {
    console.log({ rto })
    const [modal, setModal] = useState<any>(null)
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
    const [currentDocIndex, setCurrentDocIndex] = useState(0)
    const [toggleReminderEmail] = CommonApi.ESign.useToggleReminderEmail()

    const rtoUserId = useAppSelector((state) => state.rto.rtoDetail?.user?.id)
    const { hasPermission } = useWorldwideStudentDataRestriction({
        userId: rtoUserId,
    })

    const selectedDocument = useMemo(() => {
        if (document && document.length > 0) {
            // Ensure index is within bounds
            const index = Math.min(currentDocIndex, document.length - 1)
            return document[index]
        }
        return null
    }, [document, currentDocIndex])

    // Reset index if document array changes significantly
    useEffect(() => {
        if (!document || document.length === 0) {
            setCurrentDocIndex(0)
        } else if (currentDocIndex >= document.length) {
            setCurrentDocIndex(0)
        }
    }, [document?.length])

    const onModalCancel = () => {
        onEsignRefetch()
        setModal(null)
    }

    const onRequestResign = (signer: any) => {
        setModal(
            <RequestResign
                onCancel={onModalCancel}
                eSign={{
                    ...signer,
                    template: selectedDocument?.template,
                    document: selectedDocument?.id,
                }}
            />
        )
    }

    const onResendMailClicked = (signerId: number) => {
        setModal(
            <ResendMailModal
                onCancel={onModalCancel}
                documentId={selectedDocument?.id}
                signerId={signerId}
            />
        )
    }

    const fillDocumentFields = (signerId: number) => {
        setModal(
            <FillEsignFieldsModal
                documentId={selectedDocument?.id}
                onCancel={onModalCancel}
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
                        onModalCancel()
                    }
                }}
            />
        )
    }

    const handleNext = () => {
        if (document && currentDocIndex < document.length - 1) {
            setCurrentDocIndex((prev) => prev + 1)
        }
    }

    const handlePrev = () => {
        if (currentDocIndex > 0) {
            setCurrentDocIndex((prev) => prev - 1)
        }
    }

    if (!selectedDocument) return null

    return (
        <>
            {modal}
            <div className="bg-gray-100 border rounded-xl p-5 border-slate-200 shadow-sm space-y-4">
                {/* Document Header Controls (Pagination) */}
                {document && document.length > 1 && (
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-2">
                        <Typography variant="small" className="text-gray-500">
                            Document {currentDocIndex + 1} of {document.length}
                        </Typography>
                        <div className="flex gap-x-2 items-center">
                            <Button
                                text="Previous"
                                variant="primaryNew"
                                onClick={handlePrev}
                                disabled={currentDocIndex === 0}
                                mini
                            />
                            <Button
                                text="Next"
                                variant="primaryNew"
                                onClick={handleNext}
                                disabled={
                                    currentDocIndex === document.length - 1
                                }
                                mini
                            />
                            <div className="relative group">
                                <Button
                                    mini
                                    Icon={XCircle}
                                    variant="error"
                                    className="ml-2 w-8! h-8!"
                                    iconSize={18}
                                    onClick={() => setIsCancelModalOpen(true)}
                                />
                                <Tooltip>Cancel E-Sign</Tooltip>
                            </div>
                        </div>
                    </div>
                )}

                {(!document || document.length <= 1) && (
                    <div className="flex justify-end mb-2">
                        <div className="relative group">
                            <Button
                                mini
                                Icon={XCircle}
                                variant="error"
                                className="w-8! h-8!"
                                iconSize={18}
                                onClick={() => setIsCancelModalOpen(true)}
                            />
                            <Tooltip>Cancel E-Sign</Tooltip>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-y-6 ">
                    {selectedDocument?.signers?.map(
                        (signer: any, index: number) => {
                            const AllResponse =
                                signer?.document?.template?.tabs?.find(
                                    (t: any) => t?.type === 'date'
                                )?.responses

                            const signResponse = AllResponse?.reduce(
                                (latest: any, current: any) =>
                                    new Date(current?.createdAt) >
                                    new Date(latest?.createdAt)
                                        ? current
                                        : latest,
                                AllResponse?.[0]
                            )

                            return (
                                <div
                                    key={signer.id || index}
                                    className={
                                        index > 0
                                            ? 'pt-6 border-t border-gray-300'
                                            : ''
                                    }
                                >
                                    <div className="flex gap-x-5">
                                        {/* Left Column: User Info */}
                                        <div className="flex flex-col gap-y-1 min-w-[200px]">
                                            <div>
                                                <Badge
                                                    text={
                                                        signer?.user?.role ||
                                                        'NA'
                                                    }
                                                    variant="info"
                                                    className="capitalize"
                                                />
                                            </div>
                                            <div>
                                                <Typography
                                                    variant="small"
                                                    semibold
                                                >
                                                    {!hasPermission &&
                                                    signer?.user?.role ===
                                                        UserRoles.STUDENT ? (
                                                        <StudentJobId
                                                            studentJobId={
                                                                signer?.user
                                                                    ?.student
                                                                    ?.studentMaskedId
                                                            }
                                                        />
                                                    ) : (
                                                        signer?.user?.name ||
                                                        'NA'
                                                    )}
                                                </Typography>
                                            </div>
                                            <div>
                                                <Typography
                                                    variant="xs"
                                                    className="text-gray-400"
                                                >
                                                    {maskText(
                                                        signer?.user?.email
                                                    ) || 'NA'}
                                                </Typography>
                                            </div>
                                        </div>

                                        {/* Right Column: 8 Grid Items */}
                                        <div className="flex flex-col gap-y-4 flex-1">
                                            {/* Row 1 */}
                                            <div className="grid grid-cols-4 gap-4 border-b border-gray-100 pb-4">
                                                {/* 1. Document Status */}
                                                <div className="border-r border-gray-100 pr-4">
                                                    <Typography
                                                        variant="label"
                                                        className="text-gray-400 mb-1"
                                                    >
                                                        Document Status
                                                    </Typography>
                                                    <Typography
                                                        variant="muted"
                                                        className={
                                                            signer?.status ===
                                                            EsignDocumentStatus.SIGNED
                                                                ? 'text-green-600 font-semibold uppercase'
                                                                : 'text-orange-600 font-semibold uppercase'
                                                        }
                                                    >
                                                        {signer?.status || 'NA'}
                                                    </Typography>
                                                </div>

                                                {/* 2. Finish Date */}
                                                <div className="border-r border-gray-100 pr-4">
                                                    <Typography
                                                        variant="label"
                                                        className="text-gray-400 mb-1"
                                                    >
                                                        Finish Date
                                                    </Typography>
                                                    <Typography
                                                        variant="muted"
                                                        semibold
                                                    >
                                                        {signer?.status ===
                                                        EsignDocumentStatus.SIGNED
                                                            ? moment(
                                                                  signer?.updatedAt
                                                              ).format(
                                                                  'DD MMM, YYYY'
                                                              )
                                                            : 'Not Submitted'}
                                                    </Typography>
                                                </div>

                                                {/* 3. Resign Document */}
                                                <div className="border-r border-gray-100 pr-4">
                                                    <Typography
                                                        variant="label"
                                                        className="text-gray-400 mb-1"
                                                    >
                                                        Resign Document
                                                    </Typography>
                                                    <button
                                                        onClick={() => {
                                                            if (
                                                                signer?.status ===
                                                                EsignDocumentStatus.SIGNED
                                                            ) {
                                                                onRequestResign(
                                                                    signer
                                                                )
                                                            }
                                                        }}
                                                        disabled={
                                                            signer?.status !==
                                                            EsignDocumentStatus.SIGNED
                                                        }
                                                        className={`transition-colors ${
                                                            signer?.status ===
                                                            EsignDocumentStatus.SIGNED
                                                                ? 'text-blue-600 hover:text-blue-700 cursor-pointer'
                                                                : 'text-gray-300 cursor-not-allowed'
                                                        }`}
                                                    >
                                                        <FileSignature className="w-5 h-5" />
                                                    </button>
                                                    <Tooltip>
                                                        {signer?.status ===
                                                        EsignDocumentStatus.SIGNED
                                                            ? 'Request Resign'
                                                            : 'Document not signed yet'}
                                                    </Tooltip>
                                                </div>

                                                {/* 4. Resend Email */}
                                                <div className="relative group">
                                                    <Typography
                                                        variant="label"
                                                        className="text-gray-400 mb-1"
                                                    >
                                                        Resend Email
                                                    </Typography>
                                                    <button
                                                        onClick={() => {
                                                            if (
                                                                signer?.status !==
                                                                EsignDocumentStatus.SIGNED
                                                            ) {
                                                                onResendMailClicked(
                                                                    signer?.user
                                                                        ?.id
                                                                )
                                                            }
                                                        }}
                                                        disabled={
                                                            signer?.status ===
                                                            EsignDocumentStatus.SIGNED
                                                        }
                                                        className={`transition-colors ${
                                                            signer?.status !==
                                                            EsignDocumentStatus.SIGNED
                                                                ? 'text-blue-600 hover:text-blue-700 cursor-pointer'
                                                                : 'text-gray-300 cursor-not-allowed'
                                                        }`}
                                                    >
                                                        <Send className="w-5 h-5" />
                                                    </button>
                                                    <Tooltip>
                                                        {signer?.status !==
                                                        EsignDocumentStatus.SIGNED
                                                            ? 'Resend Email'
                                                            : 'Document Signed'}
                                                    </Tooltip>
                                                </div>
                                            </div>

                                            {/* Row 2 */}
                                            <div className="grid grid-cols-4 gap-4">
                                                {/* 5. Reminder */}
                                                <div className="border-r border-gray-100 pr-4">
                                                    <Typography
                                                        variant="label"
                                                        className="text-gray-400 mb-1"
                                                    >
                                                        Reminder
                                                    </Typography>
                                                    <Switch
                                                        name={`reminder-${signer.id}`}
                                                        customStyleClass={
                                                            'profileSwitch'
                                                        }
                                                        onChange={() =>
                                                            toggleReminderEmail(
                                                                signer?.id
                                                            )
                                                        }
                                                        defaultChecked={
                                                            signer?.isReminderEnabled
                                                        }
                                                        value={
                                                            signer?.isReminderEnabled
                                                        }
                                                    />
                                                </div>

                                                {/* 6. Sign Status */}
                                                <div className="border-r border-gray-100 pr-4">
                                                    <Typography
                                                        variant="label"
                                                        className="text-gray-400 mb-1"
                                                    >
                                                        Sign Status
                                                    </Typography>
                                                    <Typography
                                                        variant="muted"
                                                        className={
                                                            signResponse?.id
                                                                ? 'text-green-600'
                                                                : 'text-orange-600'
                                                        }
                                                        semibold
                                                    >
                                                        {signResponse?.id
                                                            ? 'Signed'
                                                            : 'Pending'}
                                                    </Typography>
                                                </div>

                                                {/* 7. Sign Date */}
                                                <div className="border-r border-gray-100 pr-4">
                                                    <Typography
                                                        variant="label"
                                                        className="text-gray-400 mb-1"
                                                    >
                                                        Sign Date
                                                    </Typography>
                                                    <Typography
                                                        variant="muted"
                                                        semibold
                                                    >
                                                        {signResponse?.id
                                                            ? moment(
                                                                  signResponse?.data ||
                                                                      signer?.updatedAt
                                                              ).format(
                                                                  'DD MMM, YYYY'
                                                              )
                                                            : 'Not Signed'}
                                                    </Typography>
                                                </div>

                                                {/* 8. Edit/Submit Document */}
                                                <WorldwideStudentDataRestriction
                                                    anotherUserId={rtoUserId!}
                                                    fallbackOptions={{
                                                        height: '20px',
                                                        width: '140px',
                                                    }}
                                                >
                                                    <div className="relative group">
                                                        <Typography
                                                            variant="label"
                                                            className="text-gray-400 mb-1"
                                                        >
                                                            Edit/Submit Document
                                                        </Typography>
                                                        <button
                                                            onClick={() =>
                                                                onSubmitDocClicked(
                                                                    signer?.user
                                                                        ?.id
                                                                )
                                                            }
                                                            // Condition matching logic of original component for enabling/disabling or styling
                                                            className={`transition-colors text-blue-600 hover:text-blue-700 cursor-pointer`}
                                                        >
                                                            <PenTool className="w-5 h-5" />
                                                        </button>
                                                        <Tooltip>
                                                            {signResponse?.id &&
                                                            signer?.status !==
                                                                EsignDocumentStatus.SIGNED
                                                                ? 'Submit Document'
                                                                : 'Unavailable'}
                                                        </Tooltip>
                                                    </div>
                                                </WorldwideStudentDataRestriction>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    )}
                </div>
            </div>
            <CancelESignModal
                open={isCancelModalOpen}
                onOpenChange={(open) => {
                    setIsCancelModalOpen(open)
                    if (!open) onEsignRefetch()
                }}
                eSign={selectedDocument}
            />
        </>
    )
}
