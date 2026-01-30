import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { htmltotext } from '@utils'
import { RichTextEditor } from './ExportRichText'

interface InputRichTextEditorProps {
    name: string
    label?: string
    placeholder?: string
    rules?: any
    className?: string
    onChange?: (value: any) => void
}

export const inputRichTextEditorErrorMessage = (value: string) => {
    if (htmltotext(value)?.length > 1) {
        return true
    }
    return false
}

export const InputRichTextEditor = ({
    name,
    label,
    placeholder,
    rules,
    className,
    onChange,
}: InputRichTextEditorProps) => {
    const {
        control,
        formState: { errors },
    } = useFormContext()
    const error = errors[name]?.message as string

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field: { value, onChange: fieldChange } }) => (
                <RichTextEditor
                    label={label}
                    value={value}
                    onChange={(e: any) => {
                        onChange?.(e)
                        fieldChange(e)
                    }}
                    placeholder={placeholder}
                    error={error}
                    className={className}
                />
            )}
        />
    )
}
