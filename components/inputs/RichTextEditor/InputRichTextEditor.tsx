import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import dynamic from 'next/dynamic'
import { htmltotext } from '@utils'

const RichTextEditor = dynamic(
    () => import('./RichTextEditor').then((mod) => mod.RichTextEditor),
    {
        ssr: false,
        loading: () => (
            <div className="h-50 w-full bg-gray-50 animate-pulse rounded-md border" />
        ),
    }
)

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