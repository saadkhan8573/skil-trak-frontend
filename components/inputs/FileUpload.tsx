import { useEffect, useState } from 'react'
import { FileDrop } from 'react-file-drop'

// Icons

// components
import { PdfViewer, Typography, VideoPreview } from '@components'
import { HelpText, RequiredStar, Tooltip } from './components'

import { FileData } from '@types'
import {
    FileFormat,
    getFileExtensionByUrl,
    getMimeTypes,
    SupportedDocumentFormats,
    SupportedImageFormats,
    SupportedVideoFormats,
} from '@utils'
import { useFormContext } from 'react-hook-form'
import { IoMdDocument } from 'react-icons/io'
import { InputProps } from './InputPropType'

export const FileMimeTypes = {
    video: SupportedVideoFormats,
    image: SupportedImageFormats,
    documents: SupportedDocumentFormats,
}

const AcceptMimeTypes = [...Object.values(FileMimeTypes)] as const

export const isFileTypeAcceptable = (types: string[]) => {
    return types.some((t) =>
        AcceptMimeTypes.some((mimeType) => mimeType.includes(t))
    )
}

export const isFileTypeSelectable = (fileType: string, types: string[]) => {
    const includesFileType = types.some((t) => fileType.includes(t))
    const isValidType = types.some((t) => {
        return t === 'document' || t === 'video' || t === 'image'
    })
    return includesFileType || isValidType
}

export type FileUploadProps = InputProps & {
    acceptTypes?: (typeof AcceptMimeTypes)[number][]
}

export const FileUpload = ({
    id,
    name,
    label,

    acceptTypes,

    helpText,
    tooltip,

    value,
    rules,
    onChange,
    onBlur,

    required,
    disabled,
    loading,
}: FileUploadProps) => {
    const formContext = useFormContext()

    const [values, setValues] = useState<File[] | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const [fileObject, setFileObject] = useState<string | null>(null)
    const [invalidSelection, setInvalidSelection] = useState(false)

    const [dragging, setDragging] = useState(false)

    const handleRemove = () => {
        if (fileObject) URL.revokeObjectURL(fileObject)
        setFile(null)
        setFileObject(null)
        setInvalidSelection(false)
    }

    useEffect(() => {
        return () => {
            if (fileObject) {
                URL.revokeObjectURL(fileObject)
            }
        }
    }, [fileObject])

    useEffect(() => {
        if (formContext && values) {
            formContext.setValue(name, values)
        }
    }, [values])

    // Uploading Media
    const handleChange = (event: any, isDragging: boolean) => {
        setDragging(false)

        // Getting file Data
        const fileData: File = event[0] || event.target.files[0]

        const reader: any = new FileReader()
        if (reader) {
            reader.onload = () => {
                if (reader.readyState === 2) {
                    onChange &&
                        onChange({
                            name: fileData.name,
                            type: fileData.type,
                            // extension: getFileExtension(file),
                            data: reader.result.toString(),
                        } as FileData)
                }
            }
        }

        // setting file data to state to preview the Data
        if (acceptTypes) {
            if (
                isFileTypeAcceptable(acceptTypes) &&
                isFileTypeSelectable(fileData.type, acceptTypes)
            ) {
                setInvalidSelection(false)
                setFile(fileData)
                if (fileObject) URL.revokeObjectURL(fileObject)
                setFileObject(URL.createObjectURL(fileData))
            } else {
                setInvalidSelection(true)
            }
        } else {
            setInvalidSelection(false)
            setFile(fileData)
            if (fileObject) URL.revokeObjectURL(fileObject)
            setFileObject(URL.createObjectURL(fileData))
        }

        reader.readAsDataURL(fileData)

        // when user upload the file and after removing upload same file so its does upload
        // for that purpose removed the value
        !isDragging && (event.target.value = '')
    }

    return (
        <div className="w-full">
            {label && (
                <div className="flex justify-between items-center">
                    <div>
                        <Typography variant={'label'}>{label}</Typography>
                        {required && <RequiredStar />}
                    </div>
                    {tooltip && <Tooltip text={tooltip} />}
                </div>
            )}

            {/* FileDrop For Drag file */}
            <FileDrop
                onDragOver={() => {
                    setDragging(true)
                }}
                onDragLeave={() => {
                    setDragging(false)
                }}
                onDrop={(event) => handleChange(event, true)}
            >
                <div
                    className={`w-full h-40 border border-dashed  rounded-lg overflow-hidden ${
                        dragging
                            ? 'bg-primary-light flex justify-center items-center border-primary border-2'
                            : invalidSelection
                            ? 'bg-error-light flex justify-center items-center border-error border-2'
                            : 'bg-secondary border-gray'
                    }`}
                >
                    {dragging ? (
                        // Showing text on Drop File
                        <Typography variant={'small'} color={'text-primary'}>
                            Drop Here
                        </Typography>
                    ) : file && file.name && file.type ? (
                        <div className="relative w-full h-full">
                            {/* Video Preview */}
                            {FileMimeTypes.video.includes(file.type) && (
                                // Preview Video
                                <div className="bg-black h-full">
                                    <div className="h-[70%]">
                                        <VideoPreview url={fileObject} />
                                    </div>
                                </div>
                            )}

                            {/* PDF Preview */}
                            {FileMimeTypes.documents.includes(file.type) && (
                                <div className="flex justify-center items-center w-full h-full">
                                    {fileObject && FileFormat.isPdf(file) ? (
                                        <div className="w-full h-full">
                                            <PdfViewer file={fileObject} />
                                        </div>
                                    ) : (
                                        <IoMdDocument className="text-5xl text-gray" />
                                    )}
                                </div>
                            )}

                            {/* Image Preview */}
                            {FileMimeTypes.image.includes(file.type) && (
                                <div
                                    className="w-full h-full bg-center bg-no-repeat bg-contain"
                                    style={{
                                        backgroundImage: `url(${
                                            fileObject || ''
                                        })`,
                                    }}
                                ></div>
                            )}

                            {/* Showing details after uploading media */}
                            <div
                                className={`absolute bottom-0 pt-1 pb-2 w-full flex flex-col justify-between px-4 bg-gradient-to-b from-[#00000000] to-black`}
                            >
                                <Typography
                                    variant="subtitle"
                                    color="text-white"
                                >
                                    {file && file.name.length > 15
                                        ? `${file.name.substring(0, 15)}...`
                                        : file.name}
                                </Typography>

                                <div className="flex gap-x-3.5">
                                    <Typography
                                        variant="small"
                                        color={'text-primary'}
                                    >
                                        <label
                                            htmlFor={`file_id_${name}`}
                                            className="cursor-pointer"
                                        >
                                            Change
                                        </label>
                                    </Typography>
                                    <Typography
                                        variant="small"
                                        color={'text-error'}
                                    >
                                        <span
                                            className="cursor-pointer"
                                            onClick={handleRemove}
                                        >
                                            Remove
                                        </span>
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div
                            className={`w-full h-full flex justify-center items-center flex-col`}
                        >
                            {invalidSelection && (
                                <Typography
                                    variant={'muted'}
                                    color={'text-error'}
                                >
                                    Invalid File
                                </Typography>
                            )}
                            <Typography variant={'small'} color={'text-muted'}>
                                Drop File Here
                            </Typography>
                            <Typography variant={'small'} color={'text-muted'}>
                                Or
                            </Typography>
                            <Typography variant={'small'} color={'text-link'}>
                                <label
                                    htmlFor={`file_id_${name}`}
                                    className="cursor-pointer hover:underline"
                                >
                                    Browse
                                </label>
                            </Typography>
                        </div>
                    )}
                </div>

                <input
                    type="file"
                    id={`file_id_${name}`}
                    // name={name}
                    className="hidden"
                    {...(formContext ? formContext.register(name) : { name })}
                    onChange={(e: any) => {
                        setValues(e.target.files)
                        handleChange(e, false)
                        // onChange && onChange(e);
                    }}
                    {...(acceptTypes
                        ? { accept: getMimeTypes(acceptTypes) }
                        : {})}
                />
            </FileDrop>

            <HelpText text={helpText} />
        </div>
    )
}
