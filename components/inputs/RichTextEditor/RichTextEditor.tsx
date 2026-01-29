"use client"

import Highlight from "@tiptap/extension-highlight"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useEffect, useRef, useState } from "react"

import { Button } from "../../buttons/Button/Button"
import { Label } from "@components/ui/label"
import { useNotification } from "@hooks"
import { adminApi } from "@queries/portals/admin/admin.query"
import { cn } from "@utils"

// Modularized imports
import { Toolbar } from "./components/Toolbar"
import { CustomImage } from "./extensions/CustomImage"
import { isServerImageUrl } from "./constants"
import "./styles.css"

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
    const { notification } = useNotification()
    const [uploadImage, uploadImageResult] = adminApi.useUploadImageMutation()
    const editorWrapperRef = useRef<HTMLDivElement>(null)
    const autoUploadingRef = useRef<boolean>(false)
    const [isAutoUploading, setIsAutoUploading] = useState(false)

    const uploadImageToServer = async (file: File) => {
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res: any = await uploadImage(formData)
            if (res?.data?.url) {
                return res.data.url
            }
            return null
        } catch (err) {
            return null
        }
    }

    const computeImageOverlays = () => {
        if (!editor || !editorWrapperRef.current) return

        const view = editor.view
        const wrapper = editorWrapperRef.current
        const wrapperRect = wrapper.getBoundingClientRect()

        let overlay: HTMLDivElement | null = wrapper.querySelector('.tiptap-image-upload-overlays')

        if (!overlay) {
            overlay = document.createElement('div')
            overlay.className = 'tiptap-image-upload-overlays'
            overlay.style.position = 'absolute'
            overlay.style.top = '0'
            overlay.style.left = '0'
            overlay.style.right = '0'
            overlay.style.bottom = '0'
            overlay.style.pointerEvents = 'none'
            wrapper.appendChild(overlay)
        }

        overlay.innerHTML = ''

        editor.state.doc.descendants((node, pos) => {
            if (node.type.name === 'image') {
                const src = node.attrs.src || ''
                if (isServerImageUrl(src)) return

                const dom = view.nodeDOM(pos) as HTMLElement
                if (!dom) return

                const imgRect = dom.getBoundingClientRect()
                if (imgRect.width === 0 || imgRect.height === 0) return

                const top = imgRect.top - wrapperRect.top + 4
                const right = wrapperRect.right - imgRect.right + 4

                const button = document.createElement('button')
                button.type = 'button'
                button.textContent = 'Upload'
                button.className = 'tiptap-image-upload-float'
                button.style.position = 'absolute'
                button.style.top = `${Math.max(top, 0)}px`
                button.style.right = `${Math.max(right, 0)}px`
                button.style.zIndex = '30'
                button.style.background = '#2563eb'
                button.style.color = '#ffffff'
                button.style.borderRadius = '4px'
                button.style.padding = '2px 8px'
                button.style.fontSize = '10px'
                button.style.fontWeight = '600'
                button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
                button.style.cursor = 'pointer'
                button.style.pointerEvents = 'auto'

                button.onclick = async (e) => {
                    e.preventDefault()
                    e.stopPropagation()

                    let fileToUpload: File | null = null
                    try {
                        const response = await fetch(src, { mode: 'cors' })
                        if (!response.ok) throw new Error('Fetch failed')
                        const blob = await response.blob()
                        fileToUpload = new File([blob], 'image.png', { type: blob.type })
                    } catch (err) {
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = 'image/*'
                        input.onchange = () => {
                            const f = input.files?.[0] || null
                            if (f) {
                                fileToUpload = f
                                void proceed()
                            }
                        }
                        input.click()
                        return
                    }

                    await proceed()

                    async function proceed() {
                        if (!fileToUpload) return
                        const uploadedUrl = await uploadImageToServer(fileToUpload)
                        if (uploadedUrl) {
                            editor?.view.dispatch(
                                editor.state.tr.setNodeMarkup(pos, undefined, {
                                    ...node.attrs,
                                    src: uploadedUrl,
                                })
                            )
                            computeImageOverlays()
                        }
                    }
                }

                overlay?.appendChild(button)
            }
        })
    }

    const autoUploadExternalImages = async () => {
        if (autoUploadingRef.current || !editor) return

        const externalImages: { pos: number, src: string, node: any }[] = []
        editor.state.doc.descendants((node, pos) => {
            if (node.type.name === 'image') {
                const src = node.attrs.src || ''
                if (!isServerImageUrl(src) && !node.attrs.autoUploadAttempted) {
                    externalImages.push({ pos, src, node })
                }
            }
        })

        if (externalImages.length === 0) return

        autoUploadingRef.current = true
        setIsAutoUploading(true)
        try {
            for (const { pos, src, node } of externalImages) {
                let currentPos = -1
                editor.state.doc.descendants((n, p) => {
                    if (n === node) {
                        currentPos = p
                        return false
                    }
                })

                const targetPos = currentPos !== -1 ? currentPos : pos

                editor.view.dispatch(
                    editor.state.tr.setNodeMarkup(targetPos, undefined, {
                        ...node.attrs,
                        autoUploadAttempted: true,
                    })
                )

                try {
                    const response = await fetch(src)
                    if (!response.ok) throw new Error('Fetch failed')
                    const blob = await response.blob()

                    if (blob.size > 5 * 1024 * 1024) continue

                    const fileName = (src.split('/').pop() || 'image').split('?')[0] || 'image.png'
                    const file = new File([blob], fileName, { type: blob.type })
                    const uploadedUrl = await uploadImageToServer(file)

                    if (uploadedUrl) {
                        let finalPos = -1
                        editor.state.doc.descendants((n, p) => {
                            if (n === node || (n.type.name === 'image' && n.attrs.src === src)) {
                                finalPos = p
                                return false
                            }
                        })

                        const actualFinalPos = finalPos !== -1 ? finalPos : targetPos

                        editor.view.dispatch(
                            editor.state.tr.setNodeMarkup(actualFinalPos, undefined, {
                                ...node.attrs,
                                src: uploadedUrl,
                                autoUploadAttempted: true,
                            })
                        )
                    }
                } catch (err) {
                    console.error("Auto-upload failed for image:", src, err)
                    continue
                }
            }
        } finally {
            autoUploadingRef.current = false
            setIsAutoUploading(false)
            computeImageOverlays()
        }
    }

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-primaryNew underline decoration-primaryNew underline-offset-4 cursor-pointer",
                },
            }),
            CustomImage.configure({
                HTMLAttributes: {
                    class: "rounded-md max-w-full h-auto cursor-pointer",
                },
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Highlight.configure({
                multicolor: true,
            }),
            Placeholder.configure({
                placeholder: placeholder || "Write something amazing...",
            }),
        ],
        content: value,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML())
            setTimeout(() => {
                computeImageOverlays()
                void autoUploadExternalImages()
            }, 0)
        },
        editorProps: {
            attributes: {
                class: cn(
                    "prose prose-sm dark:prose-invert max-w-none focus:outline-none RichTextEditor-ProseMirror",
                    "prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0",
                    "prose-headings:font-bold prose-headings:text-foreground",
                    "prose-a:text-primaryNew prose-a:underline",
                    className
                ),
            },
            handlePaste: (view, event) => {
                const items = Array.from(event.clipboardData?.items || [])
                for (const item of items) {
                    if (item.type.indexOf("image") === 0) {
                        const file = item.getAsFile()
                        if (file) {
                            const reader = new FileReader()
                            reader.onload = async (e) => {
                                const base64 = e.target?.result as string
                                editor?.chain().focus().setImage({ src: base64 }).run()
                                setTimeout(() => computeImageOverlays(), 10)
                            }
                            reader.readAsDataURL(file)
                            return true
                        }
                    }
                }
                return false
            },
        },
    })

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || "")
            setTimeout(() => computeImageOverlays(), 100)
        }
    }, [value, editor])

    const handleImageUpload = () => {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = "image/*"
        input.onchange = async () => {
            const file = input.files?.[0]
            if (file) {
                const url = await uploadImageToServer(file)
                if (url) {
                    editor?.chain().focus().setImage({ src: url }).run()
                } else {
                    const reader = new FileReader()
                    reader.onload = (e) => {
                        const base64 = e.target?.result as string
                        editor?.chain().focus().setImage({ src: base64 }).run()
                        setTimeout(() => computeImageOverlays(), 10)
                    }
                    reader.readAsDataURL(file)
                }
            }
        }
        input.click()
    }

    return (
        <div className="flex flex-col gap-1 w-full animate-in fade-in duration-500">
            {isAutoUploading && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-md mb-1 animate-pulse">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="text-[10px] font-medium text-blue-700">Uploading external images to server...</span>
                </div>
            )}
            {label && <Label className="text-sm font-medium mb-1">{label}</Label>}
            <div
                ref={editorWrapperRef}
                className={cn(
                    "relative min-h-[300px] max-h-[500px] w-full rounded-md border border-input bg-background overflow-y-auto custom-scrollbar flex flex-col",
                    "focus-within:ring-2 focus-within:ring-ring/50 focus-within:border-ring transition-all",
                    error && "border-destructive focus-within:ring-destructive/50"
                )}
            >
                <Toolbar
                    editor={editor}
                    onImageUpload={handleImageUpload}
                    isUploading={!!uploadImageResult?.isLoading}
                />
                <EditorContent editor={editor} />
            </div>
            {error && <p className="text-xs font-medium text-destructive mt-1">{error}</p>}
        </div>
    )
}
