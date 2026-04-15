import { useEffect, useState } from 'react'
import { FileDrop } from 'react-file-drop'

// Icons

// components
import { Typography } from '@components'
import {
    HelpText,
    InputErrorMessage,
    RequiredStar,
    Tooltip,
} from '../components/inputs/components'

import { InputProps } from '@components/inputs/InputPropType'
import {
    getMethodsForInput,
    getMimeTypes,
    SupportedDocumentFormats,
    SupportedImageFormats,
    SupportedVideoFormats,
} from '@utils'
import { useFormContext } from 'react-hook-form'

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
    component?: any
    multiple?: boolean
    limit?: number
    maximumFileSize?: any
    showError?: boolean
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
    limit,

    required,
    disabled,
    loading,
    component,
    multiple,
    maximumFileSize,
    showError = true,
}: FileUploadProps) => {
    const formContext = useFormContext()

    const [values, setValues] = useState<File[] | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const [fileList, setFileList] = useState<File[] | null>(null)
    const [fileObject, setFileObject] = useState<string | null>(null)
    const [invalidSelection, setInvalidSelection] = useState(false)

    const [dragging, setDragging] = useState(false)

    const handleRemove = () => {
        if (fileObject) URL.revokeObjectURL(fileObject)
        setFile(null)
        setFileObject(null)
        setInvalidSelection(false)
        formContext.setValue(name, null)
        if (required) {
            formContext.setError(name, {
                type: 'manual',
                message: 'File is required!',
            })
        }
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
            formContext.setValue(name, [...values])
            formContext.setError(name, {
                type: 'manual',
                message: '',
            })
        }
    }, [values])

    // Uploading Media
    const handleChange = (event: any, isDragging: boolean) => {
        setDragging(false)

        // Getting file Data
        const fileData: any = isDragging ? event : event.target.files

        // formContext.setValue(name, [...fileData])

        // for multiple files upload
        if (multiple) {
            let multipleFiles = []
            for (let key in fileData) {
                typeof fileData[key] === 'object' &&
                    multipleFiles.push(fileData[key])
            }
            limit && fileData.length <= limit
                ? fileData && onChange && onChange(multipleFiles)
                : alert('Limit Exceed')
            setFileList(multipleFiles)
        } else {
            setFile(fileData[0])
            if (fileObject) URL.revokeObjectURL(fileObject)
            setFileObject(URL.createObjectURL(fileData[0]))
            onChange && onChange(fileData[0])
        }

        // if (formContext && event.target) {
        // 	formContext.setValue(name, values);
        // }

        const reader: any = new FileReader()
        if (reader) {
            reader.onload = () => {
                if (reader.readyState === 2) {
                    // fileData && onChange && onChange(fileData)
                    // Sending file data to field
                    // onChange({
                    //     name: fileData.name,
                    //     type: fileData.type,
                    //     extension: getFileExtension(fileData),
                    //     data: reader.result.toString(),
                    // } as FileData)
                    // fileUpload(name, reader.result.toString());
                }
            }
        }

        // setting file data to state to preview the Data
        if (acceptTypes && !multiple) {
            if (
                isFileTypeAcceptable(acceptTypes) &&
                isFileTypeSelectable(fileData[0].type, acceptTypes)
            ) {
                setInvalidSelection(false)
                setFile(fileData[0])
                if (fileObject) URL.revokeObjectURL(fileObject)
                setFileObject(URL.createObjectURL(fileData[0]))
            } else {
                setInvalidSelection(true)
            }
        }
        // else {
        //     setInvalidSelection(false)
        //     setFile(fileData[0])
        //     setFileObject(URL.createObjectURL(fileData[0]))
        // }

        // reader.readAsDataURL(fileData)

        // when user upload the file and after removing upload same file so its does upload
        // for that purpose removed the value
        !isDragging && (event.target.value = '')
    }

    const Components = component

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
                <Components
                    file={file}
                    fileList={fileList}
                    name={name}
                    dragging={dragging}
                    fileObject={fileObject}
                    handleRemove={handleRemove}
                    invalidSelection={invalidSelection}
                />
                <input
                    type="file"
                    id={`file_id_${name}`}
                    // name={name}
                    className="hidden"
                    {...getMethodsForInput(
                        name,
                        formContext,
                        rules,
                        (e: any) => {
                            ;[...e.target.files]?.forEach((e: any) => {
                                setValues([e])
                            })
                            // setValues(e.target.files)
                            handleChange(e, false)
                        },
                        onBlur
                    )}
                    {...(formContext ? formContext.register(name) : { name })}
                    // onChange={(e: any) => {
                    //     ;[...e.target.files]?.forEach((e: any) => {
                    //         setValues([e])
                    //     })
                    //     // setValues(e.target.files)
                    //     handleChange(e, false)
                    //     // onChange && onChange(e);
                    // }}
                    {...(acceptTypes
                        ? { accept: getMimeTypes(acceptTypes) }
                        : {})}
                    {...(multiple ? { multiple } : {})}
                />
                {/* <Controller
					control={formContext.control}
					name={name}
					render={({
						// field: { onChange, onBlur, value, name, ref },
						field,
						fieldState: {isTouched, isDirty, error },
						formState,
					}) => (
						<input
							ref={field.ref}
							type="file"
							id={`file_id_${name}`}
							name={field.name}
							className="hidden"
							onChange={(e: any) => {
								handleChange(e, false);
								field.onChange(e);
							}}
							onBlur={(e: any) => {
								field.onBlur();
								onBlur && onBlur();
							}}
							{...(acceptTypes
								? { accept: getMimeTypes(acceptTypes) }
								: {})}
						/>
					)}
				/> */}
            </FileDrop>

            <HelpText text={helpText} />
            {showError ? <InputErrorMessage name={name} /> : null}
        </div>
    )
}
