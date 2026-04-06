import { Typography } from '@components'
import { Upload } from 'lucide-react'
import React, { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import { v4 as uuid } from 'uuid'

export interface FileWithId {
    id: string
    file: File
}

export const FileUpload = ({ label }: { label?: string }) => {
    const formMethods = useFormContext()

    // Handle file upload with unique IDs and validation
    const handleFileUpload = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const files = event.target.files
            if (files && files.length > 0) {
                const currentFiles = formMethods.getValues('fileUpload') || []
                const validFiles: FileWithId[] = []
                const errors: string[] = []

                Array.from(files).forEach((file) => {
                    // Validate file type
                    const allowedTypes = ['.pdf', '.docx']
                    const fileExtension =
                        '.' + file.name.split('.').pop()?.toLowerCase()

                    if (!allowedTypes.includes(fileExtension)) {
                        errors.push(
                            `${file.name}: Only PDF and DOCX files are allowed`
                        )
                        return
                    }

                    // Validate file size (10MB limit)
                    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
                    if (file.size > maxSize) {
                        errors.push(
                            `${file.name}: File size must be less than 10MB`
                        )
                        return
                    }

                    validFiles.push({
                        id: uuid(),
                        file,
                    })
                })

                // Only add valid files
                if (validFiles.length > 0) {
                    formMethods.setValue('fileUpload', [
                        ...currentFiles,
                        ...validFiles,
                    ])
                }
            }
        },
        [formMethods]
    )
    return (
        <div className="space-y-2">
            <Typography variant="small">
                {label || 'Attachments (Optional)'}
            </Typography>

            <div className="relative">
                <input
                    type="file"
                    id="fileUpload"
                    multiple
                    accept=".pdf,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                />
                <label
                    htmlFor="fileUpload"
                    className="flex items-center justify-center gap-2 h-10 px-4 border-2 border-dashed rounded-lg hover:border-primary/50 transition-colors cursor-pointer bg-muted/20"
                >
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                        Upload files
                    </span>
                </label>
            </div>
        </div>
    )
}
