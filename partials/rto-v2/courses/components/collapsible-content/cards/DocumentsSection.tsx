'use client'

import { useEffect, useState } from 'react'
import { FileCheck, Sparkles } from 'lucide-react'
import { DocumentItem } from './DocumentItem'
import { ShowErrorNotifications } from '@components'
import { useNotification } from '@hooks'
import { RtoV2Api } from '@queries'

// ============================================================================
// Types & Constants
// ============================================================================

export enum RtoFileTitle {
    PLACEMENT_AGREEMENT = 'placementAgreement',
    LOGBOOK = 'logBook',
    FACILITY_CHECKLIST = 'facilityChecklist',
}

interface DocumentConfig {
    label: string
    description: string
    fileType: string
    multiple: boolean
    Icon: typeof FileCheck
    apiTitle: RtoFileTitle
}

interface UploadedFileStatus {
    isUploaded: boolean
    files: any[]
}

interface DocumentsSectionProps {
    course: any
}

// ============================================================================
// Document Configurations
// ============================================================================

const DOCUMENT_CONFIGS: DocumentConfig[] = [
    {
        label: 'Facility Checklist',
        description: 'Facility-Checklist.docx',
        fileType: '.docx',
        multiple: true,
        Icon: FileCheck,
        apiTitle: RtoFileTitle.FACILITY_CHECKLIST,
    },
    {
        label: 'Placement Agreement',
        description: 'Placement-Agreement-Template.docx',
        fileType: '.docx',
        multiple: true,
        Icon: FileCheck,
        apiTitle: RtoFileTitle.PLACEMENT_AGREEMENT,
    },
    {
        label: 'Logbook',
        description: 'Upload logbooks (.docx only)',
        fileType: '.docx',
        multiple: true,
        Icon: Sparkles,
        apiTitle: RtoFileTitle.LOGBOOK,
    },
]

// ============================================================================
// Main Component
// ============================================================================

export function DocumentsSection({ course }: DocumentsSectionProps) {
    const [loadingType, setLoadingType] = useState<string | null>(null)
    const { notification } = useNotification()

    // API hooks
    const [addDocument, addDocumentResult] =
        RtoV2Api.Courses.useAddCourseDocument()
    const [updateAgreementFile, updateAgreementResult] =
        RtoV2Api.Courses.useUpdateAgreementFile()
    const [updateLogbookFile, updateLogbookResult] =
        RtoV2Api.Courses.useUpdateLogbookFile()
    const [updateFacilityChecklist, updateFacilityChecklistResult] =
        RtoV2Api.Courses.useUpdateFacilityChecklist()

    // ============================================================================
    // Success Notifications
    // ============================================================================

    useEffect(() => {
        if (addDocumentResult.isSuccess) {
            notification.success({
                title: 'Document uploaded',
                description: 'Document uploaded successfully',
            })
        }
    }, [addDocumentResult.isSuccess])

    useEffect(() => {
        if (updateAgreementResult.isSuccess) {
            notification.success({
                title: 'Agreement updated',
                description: 'Agreement updated successfully',
            })
        }
    }, [updateAgreementResult.isSuccess])

    useEffect(() => {
        if (updateLogbookResult.isSuccess) {
            notification.success({
                title: 'Logbook updated',
                description: 'Logbook updated successfully',
            })
        }
    }, [updateLogbookResult.isSuccess])

    useEffect(() => {
        if (updateFacilityChecklistResult.isSuccess) {
            notification.success({
                title: 'Facility Checklist updated',
                description: 'Facility Checklist updated successfully',
            })
        }
    }, [updateFacilityChecklistResult.isSuccess])

    // ============================================================================
    // Computed Values
    // ============================================================================

    const uploadedStatus = getUploadedStatus(course)

    // ============================================================================
    // Handlers
    // ============================================================================

    const handleUpload = async (
        files: FileList,
        config: DocumentConfig,
        fileId?: string
    ): Promise<void> => {
        setLoadingType(config.apiTitle)

        try {
            const formData = buildFormData(files, config, course?.id)
            const isAlreadyUploaded =
                uploadedStatus?.[config.apiTitle]?.isUploaded

            if (!isAlreadyUploaded) {
                await performInitialUpload(
                    formData,
                    config.apiTitle,
                    addDocument
                )
            } else {
                await performUpdate(formData, config.apiTitle, fileId, {
                    updateLogbookFile,
                    updateAgreementFile,
                    updateFacilityChecklist,
                })
            }
        } catch (error) {
            console.error(`Error uploading ${config.apiTitle}:`, error)
        } finally {
            setLoadingType(null)
        }
    }

    const handleEdit = (files: FileList, config: DocumentConfig): void => {
        const fileToUpdate = course.rtoCourseFiles?.find(
            (file: any) => file.title === config.apiTitle
        )
        handleUpload(files, config, fileToUpdate?.id)
    }

    // ============================================================================
    // Render
    // ============================================================================

    return (
        <>
            <ShowErrorNotifications
                result={
                    addDocumentResult ||
                    updateAgreementResult ||
                    updateLogbookResult ||
                    updateFacilityChecklistResult
                }
            />
            <div className="grid grid-cols-3 gap-4 w-full">
                {DOCUMENT_CONFIGS.map((config) => {
                    const status = uploadedStatus?.[config.apiTitle]

                    return (
                        <DocumentItem
                            key={config.apiTitle}
                            title={config.label}
                            description={config.description}
                            fileType={config.fileType}
                            multiple={config.multiple}
                            Icon={config.Icon}
                            isUploading={loadingType === config.apiTitle}
                            isUploaded={status?.isUploaded ?? false}
                            uploadedFiles={status?.files ?? []}
                            onUpload={(files: FileList) =>
                                handleUpload(files, config)
                            }
                            onEdit={(files: FileList) =>
                                handleEdit(files, config)
                            }
                        />
                    )
                })}
            </div>
        </>
    )
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Extracts uploaded file status from course data
 */
function getUploadedStatus(course: any): Record<string, UploadedFileStatus> {
    return (
        course?.rtoCourseFiles?.reduce((acc: any, file: any) => {
            acc[file.title] = {
                isUploaded: Boolean(file.files?.length),
                files: file.files || [],
            }
            return acc
        }, {}) ?? {}
    )
}

/**
 * Builds FormData object for file upload
 */
function buildFormData(
    files: FileList,
    config: DocumentConfig,
    courseId?: string
): FormData {
    const formData = new FormData()

    if (config.multiple) {
        Array.from(files).forEach((file) => formData.append('file', file))
    } else {
        formData.append('file', files[0])
    }

    if (courseId) {
        formData.append('course', courseId)
    }

    return formData
}

/**
 * Performs initial document upload
 */
async function performInitialUpload(
    formData: FormData,
    title: RtoFileTitle,
    addDocument: any
): Promise<void> {
    await addDocument({
        body: formData,
        params: { title },
    }).unwrap()
}

/**
 * Performs document update based on file type
 */
async function performUpdate(
    formData: FormData,
    fileType: RtoFileTitle,
    fileId: string | undefined,
    updateMethods: {
        updateLogbookFile: any
        updateAgreementFile: any
        updateFacilityChecklist: any
    }
): Promise<void> {
    const { updateLogbookFile, updateAgreementFile, updateFacilityChecklist } =
        updateMethods

    switch (fileType) {
        case RtoFileTitle.LOGBOOK:
            await updateLogbookFile({ body: formData, id: fileId }).unwrap()
            break
        case RtoFileTitle.PLACEMENT_AGREEMENT:
            await updateAgreementFile({ body: formData, id: fileId }).unwrap()
            break
        case RtoFileTitle.FACILITY_CHECKLIST:
            await updateFacilityChecklist({
                body: formData,
                id: fileId,
            }).unwrap()
            break
        default:
            throw new Error(`Unknown file type: ${fileType}`)
    }
}
