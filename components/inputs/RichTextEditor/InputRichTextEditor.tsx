import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import dynamic from 'next/dynamic'
import { htmltotext } from '@utils'
import { InputErrorMessage } from '../components'

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
    showError?: boolean
    label?: string
    placeholder?: string
    rules?: any
    className?: string
    onChange?: (value: any) => void
    height?: string
    showHtmlToggle?: boolean
}

export const inputRichTextEditorErrorMessage = (value: unknown): boolean => {
    if (typeof value !== 'string') return false;
    return htmltotext(value)?.trim().length > 1;
}

export const InputRichTextEditor = ({
    name,
    label,
    placeholder,
    rules,
    className,
    onChange,
    showError = true,
    height,
    showHtmlToggle = false,
}: InputRichTextEditorProps) => {
    const {
        control,
        formState: { errors },
    } = useFormContext()
    const error = errors[name]?.message as string

    return (
        <>
            <Controller
                name={name}
                control={control as any}
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
                        className={className}
                        height={height}
                        showHtmlToggle={showHtmlToggle}
                    />
                )
                }
            />
            {showError && <InputErrorMessage name={name} />}
        </>
    )
}