import React, { useEffect, useMemo, useState } from 'react'
import { Button, Badge, ShowErrorNotifications } from '@components'
import { useUploadFolderDocsMutation, SubAdminApi } from '@queries'
import {
    AlertCircle,
    CheckCircle2,
    FileText,
    Folder,
    Upload,
} from 'lucide-react'
import { useNotification } from '@hooks'

type Props = {
    data: {
        assessmentEvidence: any[]
        otherDocs: any[]
    }
    workplaceRequest: any
}

type NormalizedDoc = {
    id: number
    name: string
    required: boolean
    uploadedFiles: any[]
    isUploaded: boolean
    isCustom: boolean
}

export const UploadIndustryRequiredDocs = ({
    data,
    workplaceRequest,
}: Props) => {
    console.log('workplaceRequest', workplaceRequest)
    const { notification } = useNotification()
    const [uploadingKey, setUploadingKey] = useState<string | null>(null)

    const [uploadEvidence, uploadEvidenceResult] = useUploadFolderDocsMutation()

    const [uploadOtherDoc, uploadOtherDocResult] =
        SubAdminApi.AssessmentEvidence.uploadOtherDocs()

    /* ---------------- success toast ---------------- */
    useEffect(() => {
        if (uploadEvidenceResult.isSuccess || uploadOtherDocResult.isSuccess) {
            notification.success({
                title: 'Document Uploaded',
                description: 'The document has been successfully uploaded.',
            })
        }
    }, [uploadEvidenceResult.isSuccess, uploadOtherDocResult.isSuccess])

    /* ---------------- normalize docs ---------------- */
    const documents: NormalizedDoc[] = useMemo(() => {
        const normalDocs =
            data?.assessmentEvidence?.map((doc) => {
                const files = doc?.studentResponse?.[0]?.files || []
                return {
                    id: doc?.id,
                    name: doc.name,
                    required: doc.isMandatory,
                    uploadedFiles: files,
                    isUploaded: files.length > 0,
                    isCustom: false,
                }
            }) || []

        const customDocs =
            data?.otherDocs?.map((doc) => {
                const files = doc?.studentResponse?.[0]?.files || []
                return {
                    id: doc.id,
                    name: doc.name,
                    required: doc.isRequired,
                    uploadedFiles: files,
                    isUploaded: files.length > 0,
                    isCustom: true,
                }
            }) || []

        return [...normalDocs, ...customDocs]
    }, [data])

    /* ---------------- completion check ---------------- */
    const allRequiredUploaded = documents
        .filter((d) => d.required)
        .every((d) => d.isUploaded)

    /* ---------------- upload handler ---------------- */
    const handleUpload = async (
        doc: NormalizedDoc,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)

        try {
            setUploadingKey(doc.name)

            if (doc.isCustom) {
                await uploadOtherDoc({
                    folderId: doc?.id,
                    body: formData,
                    studentId: workplaceRequest?.student?.id,
                }).unwrap()
            } else {
                await uploadEvidence({
                    id: doc.id,
                    body: formData,
                }).unwrap()
            }
        } catch (err) {
            console.error('Upload failed', err)
        } finally {
            setUploadingKey(null)
            e.target.value = ''
        }
    }

    return (
        <>
            <ShowErrorNotifications result={uploadEvidenceResult} />
            <ShowErrorNotifications result={uploadOtherDocResult} />

            <div className="bg-linear-to-br from-[#044866] via-[#0D5468] to-[#044866] rounded-lg p-4 my-5">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-5 h-5 bg-[#F7A619]/30 rounded flex items-center justify-center">
                            <Folder className="h-3 w-3 text-[#F7A619]" />
                        </div>

                        <h4 className="text-sm font-medium text-white">
                            Industry Required Documents
                        </h4>

                        {allRequiredUploaded ? (
                            <Badge
                                variant="success"
                                Icon={CheckCircle2}
                                text="Completed"
                                size="xs"
                            />
                        ) : (
                            <Badge
                                variant="error"
                                Icon={AlertCircle}
                                text="Required"
                                size="xs"
                            />
                        )}
                    </div>

                    {/* Documents */}
                    <div className="grid lg:grid-cols-3 gap-2">
                        {documents.map((doc) => {
                            const isUploading = uploadingKey === doc.name

                            return (
                                <div
                                    key={doc.name}
                                    className={`bg-white/5 rounded-lg p-2 border ${
                                        doc.isUploaded
                                            ? 'border-green-500/30'
                                            : 'border-red-500/30'
                                    }`}
                                >
                                    {/* Title */}
                                    <div className="flex justify-between mb-1">
                                        <div className="flex items-center gap-1.5">
                                            <Folder
                                                className={`h-3.5 w-3.5 ${
                                                    doc.isUploaded
                                                        ? 'text-green-400'
                                                        : 'text-red-300'
                                                }`}
                                            />
                                            <span className="text-xs text-white">
                                                {doc.name}
                                            </span>
                                            {doc.required && (
                                                <span className="text-red-400">
                                                    *
                                                </span>
                                            )}
                                        </div>

                                        {doc.isUploaded ? (
                                            <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                                        ) : (
                                            <AlertCircle className="h-3.5 w-3.5 text-red-300" />
                                        )}
                                    </div>

                                    {/* Uploaded files */}
                                    {doc?.uploadedFiles?.map((file, i) => {
                                        const getFileUrl = (url: any) => {
                                            const ext = url
                                                .split('.')
                                                .pop()
                                                .split('?')[0]
                                                .toLowerCase()
                                            if (ext === 'pdf') return url // PDFs can open directly
                                            // Other files (docx, pptx, xlsx) → open via Google Docs Viewer
                                            return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
                                        }
                                        return (
                                            <div
                                                key={i}
                                                className="flex gap-1.5 bg-white/10 p-1.5 rounded mb-1"
                                            >
                                                <FileText className="h-3 w-3 text-white/60" />
                                                <a
                                                    href={getFileUrl(file.file)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-white truncate underline hover:text-gray-300"
                                                >
                                                    uploaded_{file.id}.
                                                    {
                                                        file.file
                                                            .split('.')
                                                            .pop()
                                                            .split('?')[0]
                                                    }
                                                </a>
                                            </div>
                                        )
                                    })}

                                    {/* Upload */}
                                    <label>
                                        <input
                                            type="file"
                                            hidden
                                            disabled={
                                                doc.isUploaded || isUploading
                                            }
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                            onChange={(e) =>
                                                handleUpload(doc, e)
                                            }
                                        />

                                        <Button
                                            variant={
                                                doc.isUploaded
                                                    ? 'success'
                                                    : 'secondary'
                                            }
                                            className="w-full mt-1 text-xs"
                                            disabled={
                                                doc.isUploaded || isUploading
                                            }
                                            loading={isUploading}
                                            onClick={(e) => {
                                                const input = e.currentTarget
                                                    .previousElementSibling as HTMLInputElement
                                                input?.click()
                                            }}
                                        >
                                            <Upload className="h-3 w-3 mr-1" />
                                            {doc.isUploaded
                                                ? 'Uploaded'
                                                : isUploading
                                                  ? 'Uploading...'
                                                  : 'Upload'}
                                        </Button>
                                    </label>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}
