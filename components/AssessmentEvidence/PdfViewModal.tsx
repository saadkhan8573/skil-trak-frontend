// Icons

// components
import { useEffect, useState } from 'react'

import { GlobalModal } from '@components/Modal'
import { Typography } from '@components/Typography'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import dynamic from 'next/dynamic'

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

interface PdfViewModalProps {
    url: string
    onCancelButtonClick?: () => void
    downloadUrl: string
    extension?: string
}

export const PdfViewModal = ({
    url,
    extension,
    downloadUrl,
    onCancelButtonClick,
}: PdfViewModalProps) => {
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [mounted, setMounted] = useState<boolean>(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const nextPage = () => {
        setCurrentPage(currentPage + 1)
    }

    const previousPage = () => {
        setCurrentPage(currentPage - 1)
    }

    return (
        <GlobalModal onCancel={onCancelButtonClick}>
            <div className="min-w-[595px] h-auto relative z-9999">
                <div>
                    <div className="px-4 flex justify-between">
                        <div>
                            <div>
                                <a
                                    href={downloadUrl}
                                    target="_blank"
                                    rel={'noreferrer'}
                                    className="text-sm font-semibold text-info"
                                >
                                    Download
                                </a>
                            </div>
                            <p className="text-sm">
                                <span className="text-gray-500">Page</span>{' '}
                                <span className="font-semibold">
                                    {currentPage}/{totalPages}
                                </span>
                            </p>
                        </div>

                        <div className="flex items-center gap-x-8 text-xs font-semibold">
                            <button
                                className={`flex items-center gap-x-1 text-gray-500 hover:text-black disabled:text-gray-300 disabled:cursor-not-allowed`}
                                onClick={() => previousPage()}
                                disabled={currentPage - 1 <= 0}
                            >
                                <FaChevronLeft />
                                Previous
                            </button>
                            <button
                                onClick={() => nextPage()}
                                className={`flex items-center gap-x-1 text-gray-500 hover:text-black disabled:text-gray-300 disabled:cursor-not-allowed`}
                                disabled={currentPage === totalPages}
                            >
                                Next
                                <FaChevronRight />
                            </button>
                        </div>
                    </div>
                    <div className="max-h-[80vh] overflow-auto custom-scrollbar">
                        {mounted && extension === 'pdf' ? (
                            <Document
                                file={url}
                                onLoadSuccess={({ numPages }) => {
                                    setTotalPages(numPages)
                                }}
                                loading={
                                    <div className="min-w-[595px] min-h-[842px]">
                                        <p className="text-center font-semibold text-gray-500 mt-16">
                                            Loading PDF...
                                        </p>
                                    </div>
                                }
                            >
                                <Page pageNumber={currentPage} />
                            </Document>
                        ) : (
                            <div className="p-2">
                                <Typography>
                                    The document you provided is not in PDF
                                    format. Please download the file and view it
                                    in the appropriate application.
                                    <br /> If you need any help please contact
                                    us at:{' '}
                                    <span className="font-bold text-red-500 underline">
                                        tech@skiltrak.com.au
                                    </span>
                                </Typography>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* <div className="flex justify-end items-end gap-x-4 px-4 py-2">
                    <Button variant={'secondary'} onClick={onCancelButtonClick}>
                        {'Cancel'}
                    </Button>
                </div> */}
        </GlobalModal>
    )
}
