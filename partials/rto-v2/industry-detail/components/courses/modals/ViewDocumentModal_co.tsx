import { Typography } from '@components'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { FileCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
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

interface ViewDocumentModalProps {
    open: boolean
    fileUrl: string
    onOpenChange: (open: boolean) => void
}

export function ViewDocumentModal({
    open,
    fileUrl,
    onOpenChange,
}: ViewDocumentModalProps) {
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [mounted, setMounted] = useState<boolean>(false)

    useEffect(() => {
        setMounted(true)
    }, [])

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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-none! w-[1000px]!">
                <DialogHeader>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-inner">
                            <FileCheck className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-xl font-bold tracking-tight text-white mb-0.5">
                                Document Preview
                            </DialogTitle>
                            <p className="text-white/80 text-xs font-medium uppercase tracking-wider">
                                Facility Checklist Review
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="min-w-[595px] h-auto relative z-9999">
                    <div>
                        <div className="px-4 flex justify-between">
                            <div>
                                <div>
                                    <a
                                        href={fileUrl}
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
                            {mounted ? (
                                <Document
                                    file={fileUrl}
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
                                        format. Please download the file and
                                        view it in the appropriate application.
                                        <br /> If you need any help please
                                        contact us at:{' '}
                                        <span className="font-bold text-red-500 underline">
                                            tech@skiltrak.com.au
                                        </span>
                                    </Typography>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
