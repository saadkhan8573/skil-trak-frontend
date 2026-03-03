import { Button, ShowErrorNotifications } from '@components'
import { useNotification } from '@hooks'
import { RtoV2Api, SubAdminApi } from '@queries'
import { AssessmentEvidenceFolder, Student } from '@types'
import { Upload } from 'lucide-react'
import React, { useMemo, useRef } from 'react'
import { folderResponse } from '@utils'

export const UploadDocument = ({
    folder,
    student,
}: {
    folder: AssessmentEvidenceFolder
    student: Student
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploadDocument, uploadDocumentResult] =
        RtoV2Api.StudentDocuments.uploadStudentDocumentFile()

    const [uploadOtherDocs, uploadOtherDocsResult] =
        SubAdminApi.AssessmentEvidence.uploadOtherDocs()

    const { notification } = useNotification()

    const response = useMemo(() => {
        return folderResponse(folder.studentResponse)
    }, [folder?.studentResponse])

    const handleButtonClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0]
        if (file) {
            const formData = new FormData()
            formData.append('file', file)

            const isOtherDoc = folder?.isOtherDoc

            const res: any = isOtherDoc
                ? await uploadOtherDocs({
                      studentId: Number(student?.id),
                      body: formData,
                      folderId: folder?.id ?? 0,
                  })
                : await uploadDocument({
                      stdId: Number(student?.id),
                      folderId: folder?.id ?? 0,
                      responseId: response?.id!,
                      body: formData,
                  })

            if (res?.data) {
                notification.success({
                    title: 'Document Uploaded',
                    description: 'Document Uploaded Successfully',
                })
            }
        }
    }

    const isLoading =
        uploadDocumentResult.isLoading || uploadOtherDocsResult.isLoading

    return (
        <>
            <ShowErrorNotifications result={uploadDocumentResult} />
            <ShowErrorNotifications result={uploadOtherDocsResult} />
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept="*/*"
            />
            <Button
                onClick={handleButtonClick}
                className="py-1! rounded-sm!"
                variant="primaryNew"
                loading={isLoading}
                disabled={isLoading}
            >
                <Upload className="w-4 h-4 mr-2" />
                Add File
            </Button>
        </>
    )
}
