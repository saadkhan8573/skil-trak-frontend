"use client"

import React from 'react'

interface RichTextEditorProps {
  value?: string
  onChange?: (value: string) => void
  label?: string
  placeholder?: string
  className?: string
  error?: string
}

export const RichTextEditor = ({
  value,
  onChange,
  label,
  placeholder,
  className,
  error,
}: RichTextEditorProps) => {
  return (
    <div>RichTextEditor</div>
  )
}