// Icons
import { MdCancel } from 'react-icons/md'

// components
import { useEffect, useState } from 'react'

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
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { Typography } from '@components/Typography'
import {
    AuthorizedUserComponent,
    Button,
    Portal,
    UserCreatedAt,
} from '@components'
import { isBrowser } from '@utils'
import { UserRoles } from '@constants'

interface PdfViewModalProps {
    showDownload?: boolean
    url: string
    onCancelButtonClick?: (value?: boolean) => void
    downloadUrl: string
    extension?: string
    filename: string
    file: any
    showEdit?: boolean
}

export const PdfDocumentView = ({
    filename,
    showEdit = true,
    url,
    onCancelButtonClick,
    downloadUrl,
    file,
    showDownload = true,
    extension,
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
        <Portal>
            <div className="bg-[#00000050] w-full h-screen flex items-start justify-center fixed top-0 left-0 z-50 overflow-scroll py-16">
                <div className="bg-white rounded-2xl flex flex-col justify-between shadow-md min-w-full lg:min-w-[600px] xl:min-w-[844px] overflow-hidden">
                    <div className="px-4 py-3.5 border-b border-secondary-dark flex justify-between items-center">
                        <Typography semibold>
                            <span className="text-[15px]">{filename}</span>
                        </Typography>
                        <div className="flex items-center gap-x-2.5">
                            <AuthorizedUserComponent
                                excludeRoles={[UserRoles.OBSERVER]}
                            >
                                {showEdit ? (
                                    <Button
                                        text="Edit Document"
                                        variant="info"
                                        onClick={() => {
                                            if (onCancelButtonClick) {
                                                onCancelButtonClick(file)
                                            }
                                        }}
                                    />
                                ) : null}
                                {showDownload && (
                                    <Button
                                        text="Download Document"
                                        onClick={() => {
                                            if (isBrowser()) {
                                                window.open(downloadUrl)
                                            }
                                        }}
                                    />
                                )}
                            </AuthorizedUserComponent>
                            <MdCancel
                                onClick={() => {
                                    if (onCancelButtonClick) {
                                        onCancelButtonClick()
                                    }
                                }}
                                className="transition-all duration-300 text-gray-400 hover:text-black text-2xl cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="min-w-full bg-[#F0F0F0] relative">
                        <div className="min-w-full flex flex-col items-center">
                            <div className="w-full px-4 flex justify-between">
                                <div>
                                    <p className="text-sm">
                                        <span className="text-gray-500">
                                            Page
                                        </span>
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
                            {mounted && extension === 'pdf' ? (
                                <div className="shadow rounded-lg overflow-hidden">
                                    {file?.createdAt && (
                                        <div className="flex flex-col items-end">
                                            <Typography variant="small">
                                                File Created At:
                                            </Typography>
                                            <UserCreatedAt
                                                createdAt={file?.createdAt}
                                            />
                                        </div>
                                    )}
                                    <Document
                                        file={url}
                                        onLoadSuccess={({ numPages }) => {
                                            setTotalPages(numPages)
                                        }}
                                        loading={
                                            <div className="min-w-full min-h-[842px]">
                                                <p className="text-center font-semibold text-gray-500 mt-16">
                                                    Loading PDF...
                                                </p>
                                            </div>
                                        }
                                    >
                                        <Page pageNumber={currentPage} />
                                    </Document>
                                </div>
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

                    {/* <div className="flex justify-end items-end gap-x-4 px-4 py-2">
                    <Button variant={'secondary'} onClick={onCancelButtonClick}>
                        {'Cancel'}
                    </Button>
                </div> */}
                </div>
            </div>
        </Portal>
    )
}
