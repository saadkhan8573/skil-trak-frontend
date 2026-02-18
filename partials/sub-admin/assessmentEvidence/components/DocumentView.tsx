import { Typography } from '@components'
import { useState } from 'react'
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

export const DocumentView = ({ file }: { file: string | any }) => {
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)

    const nextPage = () => {
        setCurrentPage(currentPage + 1)
    }

    const previousPage = () => {
        setCurrentPage(currentPage - 1)
    }

    // const extension = file?.split('.').pop()
    const extension = 'pdf'
    return (
        <>
            <div className="px-4 flex justify-end gap-x-5">
                <button
                    className={`flex items-center gap-x-1 text-xs font-semibold text-gray-500 hover:text-black disabled:text-gray-300 disabled:cursor-not-allowed`}
                    onClick={() => previousPage()}
                    disabled={currentPage - 1 <= 0}
                >
                    <FaChevronLeft />
                    Previous
                </button>
                <button
                    onClick={() => nextPage()}
                    className={`flex items-center gap-x-1 text-xs font-semibold text-gray-500 hover:text-black disabled:text-gray-300 disabled:cursor-not-allowed`}
                    disabled={currentPage === totalPages}
                >
                    Next
                    <FaChevronRight />
                </button>
            </div>
            <div className="h-[calc(100%-20px)] overflow-auto  remove-scrollbar">
                {extension === 'pdf' ? (
                    <Document
                        file={file}
                        onLoadSuccess={({ numPages }) => {
                            numPages
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
                            Document is not a PDF format, so Please download the
                            file then view the document
                        </Typography>
                    </div>
                )}
            </div>
        </>
    )
}
