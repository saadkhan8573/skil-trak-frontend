import { Badge, Button, ViewDocumentModal } from '@components'
import { getFileExtensionByUrl } from '@utils'
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Download,
    Eye,
    FileText,
    User,
} from 'lucide-react'
import moment from 'moment'
import { useState } from 'react'
import { ApproveFile, RejectFile } from '../components'
import { Edit3, RotateCcw, Trash2 } from 'lucide-react'
import { ArchiveDocumentModal, EditDocumentModal } from '../modal'

export const FolderDocumentCard = ({
    doc,
    config,
    studentId,
}: {
    studentId: number
    doc: any
    config: any
}) => {

    const DocStatusIcon = config.icon
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)

    const extension = getFileExtensionByUrl(doc?.file)

    return (
        <>
            <div className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all group">
                <div className="flex items-center gap-4 flex-1">
                    <div className="w-9 h-9 rounded bg-white border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileText className="w-4 h-4 text-[#044866]" />
                    </div>
                    <div className="flex-1">
                        <p className="text-slate-900 mb-1">{doc?.filename}</p>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <span className="px-2 py-0.5 bg-white rounded border border-slate-200">
                                {extension}
                            </span>
                            <span>{doc.size}</span>
                            <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {doc?.uploadedBy?.name}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {moment(doc?.createdAt).format('DD MMM YYYY')}
                            </span>
                            {doc?.actionedBy && (
                                <span className="text-emerald-600 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Action taken by {doc?.actionedBy?.name}
                                </span>
                            )}
                        </div>
                        {doc?.comment && (
                            <div
                                className={`flex items-start gap-2 mt-2 p-2 ${doc?.status === 'rejected'
                                    ? 'bg-red-50 border border-red-200'
                                    : 'bg-green-50 border border-green-200'
                                    } rounded-lg`}
                            >
                                {doc?.status === 'rejected' ? (
                                    <AlertCircle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                                ) : (
                                    <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                )}
                                <p
                                    className={`text-xs ${doc?.status === 'rejected'
                                        ? 'text-red-700'
                                        : 'text-green-700'
                                        }`}
                                >
                                    {doc?.comment}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Badge
                        text={
                            doc.status.charAt(0).toUpperCase() +
                            doc.status.slice(1)
                        }
                        variant={
                            doc.status === 'approved'
                                ? 'success'
                                : doc.status === 'pending'
                                    ? 'warning'
                                    : doc.status === 'rejected'
                                        ? 'error'
                                        : 'info'
                        }
                        Icon={DocStatusIcon}
                    />

                    <Button
                        mini
                        Icon={Eye}
                        variant="action"
                        onClick={() => setIsViewModalOpen(true)}
                    />
                    <Button
                        mini
                        Icon={Edit3}
                        variant="action"
                        onClick={() => setIsEditModalOpen(true)}
                    />
                    <Button
                        mini
                        Icon={Download}
                        onClick={() => {
                            window.open(doc?.file, '_blank')
                        }}
                        variant="action"
                    />
                    <Button
                        mini
                        Icon={doc?.isArchived ? RotateCcw : Trash2}
                        variant="action"
                        className={
                            doc?.isArchived
                                ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                                : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                        }
                        onClick={() => setIsArchiveModalOpen(true)}
                    />

                    {(doc.status === 'uploaded' ||
                        doc.status === 'pending') && (
                            <>
                                <ApproveFile file={doc} studentId={studentId} />
                                <RejectFile file={doc} studentId={studentId} />
                            </>
                        )}
                </div>
            </div>
            <EditDocumentModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                file={doc}
            />
            <ArchiveDocumentModal
                open={isArchiveModalOpen}
                onOpenChange={setIsArchiveModalOpen}
                file={doc}
            />
            <ViewDocumentModal
                open={isViewModalOpen}
                onOpenChange={setIsViewModalOpen}
                fileUrl={doc?.file || ''}
            />
        </>
    )
}
