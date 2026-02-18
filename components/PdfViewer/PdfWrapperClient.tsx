'use client'
// ------------------------
import { LoadingSpinner } from '@components/inputs/components'
import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`

export const PdfWrapper = ({
    file,
    width,
}: {
    file: string
    width?: number
}) => {
    const [totalPages, setTotalPages] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)

    function onDocumentLoadSuccess({ numPages }: { numPages: any }) {
        setTotalPages(numPages)
    }

    return (
        <div>
            <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<LoadingSpinner loading />}
            >
                <Page pageNumber={pageNumber} {...(width ? { width } : {})} />
            </Document>
        </div>
    )
}
