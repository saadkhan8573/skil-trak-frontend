import {
    ImportantDocument,
    Modal,
    PdfViewModal,
    VideoPlayModal,
} from '@components'
import classNames from 'classnames'

// query
import { useNotification } from '@hooks'
import { CommonApi } from '@queries'
import Image from 'next/image'
import { ReactElement, useState, useEffect } from 'react'
export const ImportantDocuments = ({
    sidebar,
    coureseRequirementsLink,
}: {
    coureseRequirementsLink: string
    sidebar?: boolean
}) => {
    const [modal, setModal] = useState<ReactElement | null>(null)
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)
    const [contentUrl, setContentUrl] = useState<any>(null)
    const { notification } = useNotification()

    const documents = CommonApi.Documents.useList()

    const titleClasses = classNames({
        'mb-2': true,
        'text-xs font-medium text-gray-600': sidebar,
        'text-sm font-semibold': !sidebar,
    })

    const containerClasses = classNames({
        'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:flex md:gap-x-4':
            !sidebar,
        'flex flex-col gap-y-2': sidebar,
    })

    const onModalCancel = () => {
        setModal(null)
    }

    const onCancel = () => {
        setModal(null)
    }

    const getDocument = (docType: string) => {
        return documents?.data?.find(
            (document: any) => document?.docType === docType
        )
    }
    const plainText = contentUrl?.replace(/<[^>]+>/g, '')

    // pdf
    const downloadPdf = async () => {
        const text = plainText

        // Create a new jsPDF instance
        const { default: jsPDF } = await import('jspdf')
        const pdf = new jsPDF()

        const maxWidth = 180
        const lineHeight = 8
        // Add text to the PDF
        const splitText = pdf.splitTextToSize(text, maxWidth)
        // pdf.text(splitText, 10, 10)

        let yPos = 10 // Initial y position

        // Add the split text to the PDF with custom line height
        splitText.forEach((line: any) => {
            pdf.text(line, 10, yPos) // Add the line at the specified position

            yPos += lineHeight // Increment yPos for next line
        })

        // Generate a Blob containing the PDF data
        const blob = pdf.output('blob')

        // Create a download link
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.href = url
        link.download = 'important-documents.pdf'

        // Simulate a click on the link to trigger the download
        link.click()
        URL.revokeObjectURL(url)
    }

    const onDocumentView = (docType: string) => {
        const document = getDocument(docType)
        const extension = document?.file?.split('.').reverse()[0]
        setImageUrl(document?.file)
        setContentUrl(document?.content)

        if (document) {
            setModal(
                <Modal
                    title=""
                    subtitle=""
                    onCancelClick={onCancel}
                    onConfirmClick={onCancel}
                    showActions={false}
                >
                    {document?.fileType === 'file' ? (
                        ['jpg', 'jpeg', 'png'].includes(
                            extension.toLowerCase()
                        ) ? (
                            <div className="w-full md:min-w-[650px] max-w-[70vw] max-h-[70vh] md:max-h-[500px] overflow-auto">
                                <a
                                    className="bg-orange-500 px-4 py-2 inline-block cursor-pointer rounded-md text-white"
                                    href={imageUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Download
                                </a>
                                <Image
                                    width={0}
                                    height={0}
                                    sizes="100vw 100vh"
                                    src={document?.file}
                                    alt=""
                                    className="w-full md:w-fit max-h-[480px] mx-auto object-contain mt-3"
                                    blurDataURL={'/images/blur_image.png'}
                                    placeholder="blur"
                                />
                            </div>
                        ) : ['mp4', 'mkv', 'avi', 'mpeg'].includes(
                            extension.toLowerCase()
                        ) ? (
                            <VideoPlayModal
                                downloadUrl={document?.file}
                                url={document?.file}
                                onCancelButtonClick={onCancel}
                            />
                        ) : ['pdf'].includes(extension.toLowerCase()) ? (
                            <PdfViewModal
                                downloadUrl={document?.file}
                                url={document?.file}
                                onCancelButtonClick={onModalCancel}
                            />
                        ) : null
                    ) : (
                        <div className="px-5 min-w-full md:min-w-[600px] max-w-4xl min-h-[40vh] max-h-[70vh] md:max-h-[calc(100vh-250px)] overflow-auto custom-scrollbar">
                            <div
                                className="cursor-pointer bg-orange-500 inline-block px-4 py-2 rounded-md mb-2 text-white "
                                onClick={downloadPdf}
                            >
                                Download
                            </div>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: document?.content,
                                }}
                            />
                        </div>
                    )}
                </Modal>
            )
        } else {
            notification.error({
                title: 'No Document Provided',
                description: 'No Document provided from Admin',
            })
        }
    }

    return (
        <div>
            {modal}
            <p className={titleClasses}>Important Documents</p>
            <div className={containerClasses}>
                <ImportantDocument
                    imageUrl={'/images/documents/workflow.webp'}
                    title={'Work Flow'}
                    detail={sidebar}
                    onClick={() => {
                        onDocumentView('workflow')
                    }}
                />

                <ImportantDocument
                    imageUrl={'/images/documents/requirements.webp'}
                    title={'Course Requirement'}
                    href={coureseRequirementsLink}
                    detail={sidebar}
                />

                <ImportantDocument
                    imageUrl={'/images/documents/induction.webp'}
                    title={'Induction Process'}
                    detail={sidebar}
                    onClick={() => {
                        onDocumentView('inductionProcess')
                    }}
                />

                <ImportantDocument
                    imageUrl={'/images/documents/placement.webp'}
                    title={'Placement Info'}
                    detail={sidebar}
                    onClick={() => {
                        onDocumentView('placementInfo')
                    }}
                />

                <ImportantDocument
                    imageUrl={'/images/documents/legal.webp'}
                    title={'Legal'}
                    detail={sidebar}
                    onClick={() => {
                        onDocumentView('legal')
                    }}
                />
            </div>
        </div>
    )
}
