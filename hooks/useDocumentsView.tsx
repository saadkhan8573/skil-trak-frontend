import { ViewDocumentModal, ViewImageModal, VideoPlayModal } from '@components'
import React, { ReactElement, useState } from 'react'

export const DocumentsView = () => {
    const [modal, setModal] = useState<ReactElement | null>(null)

    const onFileClicked = (file: any) => {
        const fileExtension = file?.extension?.toLowerCase()
        const isImage = [
            'jpg',
            'jpeg',
            'png',
            'jfif',
            'heiv',
            'JPG',
            'webp',
            'heic',
        ].includes(fileExtension)
        const isPdf = ['pdf', 'document', 'msword'].includes(fileExtension)
        const isVideo = [
            'mp4',
            'mkv',
            'avi',
            'mpeg',
            'quicktime',
            'mov',
            'octet-stream',
        ].includes(fileExtension)

        if (isImage) {
            setModal(
                <ViewImageModal
                    open={true}
                    onOpenChange={(open) => !open && setModal(null)}
                    fileUrl={file?.file}
                    title={file?.filename || 'Image Preview'}
                />
            )
        } else if (isPdf) {
            setModal(
                <ViewDocumentModal
                    open={true}
                    onOpenChange={(open) => !open && setModal(null)}
                    fileUrl={file?.file}
                    title={file?.filename || 'Document Preview'}
                />
            )
        } else if (isVideo) {
            setModal(
                <VideoPlayModal
                    url={file?.file}
                    downloadUrl={file?.file}
                    onCancelButtonClick={() => {
                        setModal(null)
                    }}
                />
            )
        }
    }
    return {
        onFileClicked,
        documentsViewModal: modal,
    }
}
