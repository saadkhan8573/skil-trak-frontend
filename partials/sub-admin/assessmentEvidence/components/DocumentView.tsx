import { Button, Typography } from '@components'
import { useState, useMemo } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { getFileExtensionByUrl } from '@utils'

// Dynamically import Document and Page with SSR disabled to prevent
// pdfjs-dist from loading in Node.js (causes DOMMatrix is not defined)
const Document = dynamic(
    () => import('react-pdf').then((mod) => ({ default: mod.Document })),
    { ssr: false }
)
const Page = dynamic(
    () => import('react-pdf').then((mod) => ({ default: mod.Page })),
    { ssr: false }
)

export const DocumentView = ({ file }: { file: string | any }) => {
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    const previousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const { extension, isImage, isPdf, imageUrl } = useMemo(() => {
        let ext = ''
        let isImg = false
        let isP = false
        let url = ''

        if (typeof file === 'string') {
            ext = getFileExtensionByUrl(file) || ''
            url = file
        } else if (file?.data) {
            // If it's binary data (e.g. from PreviewAsSignerTemplate)
            // We assume it's a PDF for now since that's what the current flow provides
            // but we can check if it's an image or PDF if we had MIME type info.
            // For now, we'll keep the existing assumption or check the first bytes if needed.
            ext = 'pdf'
        }

        isImg = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(
            ext?.toLowerCase()
        )
        isP = ext?.toLowerCase() === 'pdf'

        return { extension: ext, isImage: isImg, isPdf: isP, imageUrl: url }
    }, [file])

    return (
        <div className="h-full flex flex-col">
            <div className="px-4 flex justify-end gap-x-2 pb-2">
                <Button
                    mini
                    Icon={FaChevronLeft}
                    variant="action"
                    onClick={() => previousPage()}
                    disabled={currentPage <= 1}
                    title="Previous"
                />
                <div className="flex items-center px-2">
                    <Typography variant="xs" semibold>
                        {currentPage} / {totalPages || 1}
                    </Typography>
                </div>
                <Button
                    mini
                    Icon={FaChevronRight}
                    variant="action"
                    onClick={() => nextPage()}
                    disabled={currentPage >= totalPages && totalPages > 0}
                    title="Next"
                />
            </div>
            <div className="flex-1 overflow-auto remove-scrollbar flex justify-center bg-gray-50 rounded-lg border border-gray-100 p-4">
                {isPdf || typeof file !== 'string' ? (
                    <Document
                        file={file}
                        onLoadSuccess={({ numPages }) => {
                            setTotalPages(numPages)
                        }}
                        loading={
                            <div className="min-w-[595px] min-h-[842px] flex items-center justify-center">
                                <p className="text-center font-semibold text-gray-500">
                                    Loading PDF...
                                </p>
                            </div>
                        }
                    >
                        <Page
                            pageNumber={currentPage}
                            renderAnnotationLayer={false}
                            renderTextLayer={false}
                        />
                    </Document>
                ) : isImage ? (
                    <div className="relative w-full h-full min-h-[500px]">
                        <Image
                            src={imageUrl}
                            alt="Document Preview"
                            fill
                            className="object-contain"
                            unoptimized
                        />
                    </div>
                ) : (
                    <div className="p-10 text-center">
                        <Typography>
                            This document format is not supported for preview.
                            <br />
                            Please download the file to view it.
                        </Typography>
                        {typeof file === 'string' && (
                            <Button
                                className="mt-4"
                                text="Download File"
                                onClick={() => window.open(file, '_blank')}
                                variant="info"
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
