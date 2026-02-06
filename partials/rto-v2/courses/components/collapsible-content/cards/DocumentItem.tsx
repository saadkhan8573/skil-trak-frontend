'use client'

import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, Edit, Eye, Upload, FilePlus, X } from 'lucide-react'
import { Button } from '@components'
import { PuffLoader } from 'react-spinners'

export function DocumentItem({
    title,
    description,
    fileType,
    multiple = false,
    onUpload,
    onEdit,
    isUploaded,
    isUploading,
    uploadedFiles = [],
    Icon,
}: any) {
    const uploadRef = useRef<HTMLInputElement>(null)
    const editRef = useRef<HTMLInputElement>(null)
    const [viewDropdown, setViewDropdown] = useState(false)
    const [pendingFiles, setPendingFiles] = useState<File[]>([])
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setViewDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleView = (fileUrl: string) => {
        const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
            fileUrl
        )}&embedded=true`
        window.open(viewerUrl, '_blank')
    }

    const handleAddFiles = (fileList: FileList | null) => {
        if (!fileList) return
        const newFiles = Array.from(fileList)
        setPendingFiles((prev) => [...prev, ...newFiles])
    }

    const handleRemoveFile = (index: number) => {
        setPendingFiles((prev) => prev.filter((_, i) => i !== index))
    }

    const handleUploadAll = () => {
        if (pendingFiles.length === 0) return

        // Convert File array to FileList-like object
        const dataTransfer = new DataTransfer()
        pendingFiles.forEach((file) => dataTransfer.items.add(file))

        if (isUploaded) {
            onEdit(dataTransfer.files)
        } else {
            onUpload(dataTransfer.files)
        }
        setPendingFiles([])
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
    }

    return (
        <div className="border rounded-xl w-full p-4 bg-gray-50 hover:bg-accent/10 transition">
            <div className="flex gap-2">
                <div className="bg-orange-100 size-8 rounded-md flex items-center justify-center">
                    <Icon size={15} className="text-orange-400" />
                </div>

                <div>
                    <h3 className="font-medium text-sm">{title}</h3>
                    {description && (
                        <p className="text-xs text-gray-500 mt-1">
                            {description}
                        </p>
                    )}

                    {isUploaded ? (
                        <div className="text-xs mt-2">
                            <div className="flex items-center gap-1 text-muted-foreground">
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                                <span className="truncate">
                                    {uploadedFiles.length} file(s) uploaded
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground mt-2">
                            Not uploaded yet
                        </p>
                    )}
                </div>
            </div>

            {/* Pending Files List */}
            {pendingFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                    {pendingFiles.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-white border rounded-lg p-2 text-xs"
                        >
                            <div className="flex-1 truncate">
                                <p className="font-medium truncate">
                                    {file.name}
                                </p>
                                <p className="text-muted-foreground">
                                    {formatFileSize(file.size)}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveFile(index)}
                                className="ml-2 p-1 hover:bg-gray-100 rounded"
                            >
                                <X className="h-4 w-4 text-red-500" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-3 mt-4">
                {!isUploaded ? (
                    <>
                        <input
                            ref={uploadRef}
                            type="file"
                            accept={fileType}
                            multiple={true}
                            onChange={(e) => handleAddFiles(e.target.files)}
                            className="hidden"
                        />

                        {/* Add Files Button */}
                        <Button
                            variant={
                                pendingFiles.length > 0
                                    ? 'secondary'
                                    : 'primaryNew'
                            }
                            className="gap-2 h-8 flex-1"
                            onClick={() => uploadRef.current?.click()}
                            disabled={isUploading}
                            loading={isUploading}
                        >
                            <FilePlus className="h-3.5 w-3.5" />
                            Add Files
                        </Button>

                        {/* Upload All Button - Only show when there are pending files */}
                        {pendingFiles.length > 0 && (
                            <Button
                                className="gap-2 h-8 flex-1"
                                onClick={handleUploadAll}
                                disabled={isUploading}
                                variant='primaryNew'
                            >
                                {isUploading ? (
                                    <PuffLoader size={20} />
                                ) : (
                                    <>
                                        <Upload className="h-3.5 w-3.5" />
                                        Upload ({pendingFiles.length})
                                    </>
                                )}
                            </Button>
                        )}
                    </>
                ) : (
                    <>
                        {/* VIEW BUTTON */}
                        <div className="relative flex-1" ref={dropdownRef}>
                            {uploadedFiles.length === 1 ? (
                                <Button
                                    fullWidth
                                    variant="action"
                                    onClick={() => handleView(uploadedFiles[0])}
                                >
                                    <Eye className="h-3.5 w-3.5" />
                                    View
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="action"
                                        fullWidth
                                        onClick={() =>
                                            setViewDropdown((prev) => !prev)
                                        }
                                    >
                                        <Eye className="h-3.5 w-3.5" />
                                        View
                                    </Button>

                                    {viewDropdown && (
                                        <div className="absolute z-50 mt-1 w-full bg-white border rounded shadow-lg">
                                            {uploadedFiles.map(
                                                (file: string, idx: number) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-xs truncate"
                                                        onClick={() =>
                                                            handleView(file)
                                                        }
                                                    >
                                                        File {idx + 1}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* EDIT BUTTON */}
                        <input
                            ref={editRef}
                            type="file"
                            accept={fileType}
                            multiple={true}
                            onChange={(e) => handleAddFiles(e.target.files)}
                            className="hidden"
                        />
                        <div className="flex flex-1 gap-2">
                            <Button
                                variant="action"
                                onClick={() => editRef.current?.click()}
                                disabled={isUploading}
                                fullWidth
                            >
                                {isUploading ? (
                                    <PuffLoader size={20} />
                                ) : (
                                    <>
                                        <Edit className="h-3.5 w-3.5" />
                                        Edit
                                    </>
                                )}
                            </Button>

                            {/* Upload Button for Edit Mode */}
                            {pendingFiles.length > 0 && (
                                <Button
                                    onClick={handleUploadAll}
                                    disabled={isUploading}
                                    variant='primaryNew'
                                    fullWidth
                                    loading={isUploading}
                                >
                                    {isUploading ? (
                                        <PuffLoader size={20} />
                                    ) : (
                                        <>
                                            <Upload className="h-3.5 w-3.5" />
                                            Upload ({pendingFiles.length})
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
