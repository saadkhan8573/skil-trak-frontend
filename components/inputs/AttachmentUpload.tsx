import { Button } from '@components/ui/button'
import { Label } from '@components/ui/label'
import { cn } from '@utils'
import { Paperclip, X } from 'lucide-react'
import React, { useRef } from 'react'
import { useFormContext } from 'react-hook-form'

interface AttachmentUploadProps {
    name: string
    label?: string
    multiple?: boolean
    accept?: string
    className?: string
}

export const AttachmentUpload = ({
    name,
    label = 'Attachments',
    multiple = true,
    accept,
    className,
}: AttachmentUploadProps) => {
    const { register, watch, setValue } = useFormContext()
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Watch the field for changes to display the list
    const files = watch(name)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || [])
        if (newFiles.length === 0) return

        if (multiple) {
            // Append new files to existing ones
            const currentFiles = Array.isArray(files) ? files : Array.from(files || [])
            setValue(name, [...currentFiles, ...newFiles], { shouldDirty: true, shouldValidate: true })
        } else {
            // Replace
            setValue(name, newFiles, { shouldDirty: true, shouldValidate: true })
        }

        // Reset input so same file can be selected again if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const removeFile = (indexToRemove: number) => {
        const currentFiles = Array.isArray(files) ? files : Array.from(files || [])
        const updatedFiles = currentFiles.filter((_, index) => index !== indexToRemove)
        setValue(name, updatedFiles, { shouldDirty: true, shouldValidate: true })
    }

    // Helper to format file size
    const formatBytes = (bytes: number, decimals = 2) => {
        if (!+bytes) return '0 Bytes'
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }

    return (
        <div className={cn("grid gap-2", className)}>
            {label && <Label>{label}</Label>}

            <div
                className="border-2 border-dashed rounded-lg p-6 transition-colors hover:bg-muted/50 cursor-pointer flex flex-col items-center justify-center gap-2 text-center"
                onClick={() => fileInputRef.current?.click()}
            >
                <div className="p-3 bg-muted rounded-full">
                    <Paperclip className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="text-sm font-medium">
                    Click to attach files
                </div>
                <div className="text-xs text-muted-foreground">
                    {accept ? `Accepted formats: ${accept}` : 'All files accepted'}
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple={multiple}
                    accept={accept}
                    onChange={handleFileChange}
                />
            </div>

            {/* File List */}
            {files && files.length > 0 && (
                <div className="grid gap-2 mt-2">
                    {Array.from(files).map((file: any, index: number) => (
                        <div key={`${file.name}-${index}`} className="flex items-center justify-between p-3 bg-card rounded-md border shadow-sm animate-in fade-in slide-in-from-top-1">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="p-2 bg-primary/10 rounded-md">
                                    <Paperclip className="w-4 h-4 text-primary" />
                                </div>
                                <div className="grid gap-0.5 text-left">
                                    <span className="text-sm font-medium truncate max-w-[200px] sm:max-w-[300px]">
                                        {file.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatBytes(file.size)}
                                    </span>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors relative z-10"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    removeFile(index)
                                }}
                            >
                                <X className="w-4 h-4" />
                                <span className="sr-only">Remove file</span>
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
