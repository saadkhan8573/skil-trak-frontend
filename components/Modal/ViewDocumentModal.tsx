'use client'

import { Typography } from '@components'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { Student } from '@types'
import { AlertTriangle, Download, FileCheck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

interface ViewDocumentModalProps {
    open: boolean
    fileUrl: string
    onOpenChange: (open: boolean) => void
    title?: string
    subtitle?: string
    student?: Student | null
}

export function ViewDocumentModal({
    open,
    fileUrl,
    onOpenChange,
    title = 'Document Preview',
    subtitle = 'Document Review',
    student,
}: ViewDocumentModalProps) {
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [pdfDoc, setPdfDoc] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const renderTaskRef = useRef<any>(null)
    const [mounted, setMounted] = useState<boolean>(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (open && fileUrl) {
            loadPdf()
        } else {
            setPdfDoc(null)
            setTotalPages(0)
            setCurrentPage(1)
        }
    }, [open, fileUrl])

    const loadPdf = async () => {
        setLoading(true)
        setError(null)
        try {
            const pdfjsLib = await import('pdfjs-dist')
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

            const loadingTask = pdfjsLib.getDocument(fileUrl)
            const pdf = await loadingTask.promise
            setPdfDoc(pdf)
            setTotalPages(pdf.numPages)
            setCurrentPage(1)
        } catch (err: any) {
            setError(err.message || 'Failed to load PDF')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!pdfDoc || !canvasRef.current) return

        const renderPage = async () => {
            if (renderTaskRef.current) {
                renderTaskRef.current.cancel()
            }

            try {
                const page = await pdfDoc.getPage(currentPage)
                const viewport = page.getViewport({ scale: 1.2 })
                const canvas = canvasRef.current!
                const context = canvas.getContext('2d')

                if (!context) return

                canvas.height = viewport.height
                canvas.width = viewport.width

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                }

                const renderTask = page.render(renderContext)
                renderTaskRef.current = renderTask
                await renderTask.promise
            } catch (error: any) {}
        }

        renderPage()
    }, [pdfDoc, currentPage])

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
            <DialogContent className="max-w-4xl! p-0 overflow-hidden border-none shadow-2xl max-h-[90vh] flex flex-col [&>button:last-child]:text-white [&>button:last-child]:opacity-100">
                <DialogHeader className="w-full bg-primaryNew px-6 py-3 text-white sm:text-left">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-inner">
                            <FileCheck className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-xl font-bold tracking-tight text-white mb-0.5">
                                {title}
                            </DialogTitle>
                            <p className="text-white/80 text-xs font-medium uppercase tracking-wider">
                                {subtitle}
                            </p>
                            {student?.user?.name && (
                                <span className="block text-white/60 text-[10px] font-normal normal-case mt-0.5">
                                    Student: {student.user.name}
                                </span>
                            )}
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
                            <Download className="w-4 h-4" />
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

                <div className="flex-1 overflow-y-auto overflow-x-auto bg-gray-100/50 relative z-9999 flex justify-center p-4">
                    {mounted && !error ? (
                        <div>
                            {loading && (
                                <div className="min-h-40 flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-8 h-8 border-4 border-[#044866] border-t-transparent rounded-full animate-spin" />
                                        <p className="text-[#044866] font-semibold animate-pulse">
                                            Loading Document...
                                        </p>
                                    </div>
                                </div>
                            )}
                            <canvas
                                ref={canvasRef}
                                className={loading ? 'hidden' : 'block'}
                            />
                        </div>
                    ) : (
                        <div className="h-auto flex flex-col items-center justify-center px-8 text-center bg-slate-50">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                                Preview Unavailable
                            </h3>
                            <p className="text-slate-600 mb-6 max-w-md">
                                {error?.includes('fetch') ||
                                error?.includes('Network')
                                    ? "We couldn't load the preview for this document due to browser security restrictions."
                                    : 'This document cannot be previewed directly.'}
                                <br />
                                Please download the file to view it.
                            </p>
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-[#044866] text-white rounded-lg hover:bg-[#03364d] transition-colors font-medium"
                            >
                                <Download className="w-4 h-4" />
                                Download Document
                            </a>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
