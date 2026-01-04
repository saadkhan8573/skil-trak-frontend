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
import { Document, Page } from 'react-pdf'

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
            <DialogContent className="!max-w-3xl p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="w-full bg-primaryNew p-6 text-white sm:text-left">
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

                <div className=" bg-[#F8FAFB] border-b border-[#E2E8F0] px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-lg px-3 py-1.5 shadow-sm">
                            <span className="text-xs text-gray-400 font-medium">
                                Page
                            </span>
                            <span className="text-sm font-bold text-primaryNew">
                                {currentPage}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">
                                of {totalPages}
                            </span>
                        </div>
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel={'noreferrer'}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-info hover:text-info-dark transition-colors px-3 py-1.5 rounded-lg hover:bg-info/5"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-10l-4-4m0 0l-4 4m4-4v12"
                                />
                            </svg>
                            Download
                        </a>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            className="inline-flex items-center justify-center w-9 h-9 text-gray-500 hover:text-primaryNew bg-white border border-[#E2E8F0] rounded-lg shadow-sm hover:border-primaryNew/30 hover:bg-primaryNew/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
                            onClick={previousPage}
                            disabled={currentPage <= 1}
                            title="Previous Page"
                        >
                            <FaChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        <button
                            onClick={nextPage}
                            className="inline-flex items-center justify-center w-9 h-9 text-gray-500 hover:text-primaryNew bg-white border border-[#E2E8F0] rounded-lg shadow-sm hover:border-primaryNew/30 hover:bg-primaryNew/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
                            disabled={currentPage >= totalPages}
                            title="Next Page"
                        >
                            <FaChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="min-w-[595px] h-auto relative z-[9999]">
                    <div>
                        <div className="max-h-[55vh] overflow-auto custom-scrollbar">
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
