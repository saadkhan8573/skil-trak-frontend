"use client"

import React, { useEffect, useState, useRef } from "react"
import { useEditor, EditorContent, Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import Highlight from "@tiptap/extension-highlight"
import Placeholder from "@tiptap/extension-placeholder"
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Quote,
    Undo,
    Redo,
    Link as LinkIcon,
    Image as ImageIcon,
    Code,
    Highlighter,
    ChevronDown,
} from "lucide-react"

import { Button, Typography } from "@components"
import { cn } from "@utils"
import { Label } from "@components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@components/ui/popover"
import { adminApi } from "@queries/portals/admin/admin.query"
import { useNotification } from "@hooks"
import * as pmState from "@tiptap/pm/state"

// Custom Image Extension with Width and Alignment support
const CustomImage = Image.extend({
    selectable: true,
    draggable: true,

    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: "100%",
                renderHTML: attributes => ({
                    width: attributes.width,
                }),
            },
            alignment: {
                default: 'center',
                renderHTML: attributes => ({
                    alignment: attributes.alignment,
                })
            },
            autoUploadAttempted: {
                default: false,
                parseHTML: element => element.hasAttribute('data-auto-upload-attempted'),
                renderHTML: attributes => {
                    if (attributes.autoUploadAttempted) {
                        return { 'data-auto-upload-attempted': 'true' }
                    }
                    return {}
                }
            }
        }
    },
    renderHTML({ HTMLAttributes }) {
        const { width, alignment, autoUploadAttempted, ...rest } = HTMLAttributes
        const style = [
            `width: ${width || "100%"}`,
            "height: auto",
            "display: block",
            "margin-bottom: 1rem",
            "cursor: pointer"
        ]

        if (alignment === 'center') {
            style.push("margin-left: auto", "margin-right: auto")
        } else if (alignment === 'left') {
            style.push("float: left", "margin-right: 1.5rem")
        } else if (alignment === 'right') {
            style.push("float: right", "margin-left: 1.5rem")
        }

        return ['img', { ...rest, style: style.join('; ') }]
    },
    addKeyboardShortcuts() {
        return {
            Enter: () => {
                const { state } = this.editor
                const { selection } = state
                const isImageSelected = selection && (selection as any).node && (selection as any).node.type.name === 'image'

                if (isImageSelected) {
                    return this.editor.commands.createParagraphNear()
                }
                return false
            },
        }
    }
})

const SERVER_IMAGE_PREFIXES = [
    'https://skiltrak-dev.s3.ap-southeast-2.amazonaws.com/',
    'https://skiltrak-dev.s3.amazonaws.com/',
    'https://skiltrak-prod.s3.ap-southeast-2.amazonaws.com/',
    'https://skiltrak-prod.s3.amazonaws.com/',
]

const isServerImageUrl = (url: string) => {
    if (!url) return false
    // Also check if it contains skiltrak and s3 for broader coverage
    const isInternal = SERVER_IMAGE_PREFIXES.some((prefix) => url.startsWith(prefix)) ||
        (url.includes('skiltrak') && url.includes('s3'))
    return isInternal
}


interface RichTextEditorProps {
    value?: string
    onChange?: (value: string) => void
    label?: string
    placeholder?: string
    className?: string
    error?: string
}

const Toolbar = ({ editor, onImageUpload, isUploading }: {
    editor: Editor | null,
    onImageUpload: () => void,
    isUploading: boolean
}) => {
    if (!editor) return null

    const headings = [
        { label: "Paragraph", level: 0 },
        { label: "Heading 1", level: 1 },
        { label: "Heading 2", level: 2 },
        { label: "Heading 3", level: 3 },
        { label: "Heading 4", level: 4 },
        { label: "Heading 5", level: 5 },
        { label: "Heading 6", level: 6 },
    ]

    const [isHeadingOpen, setIsHeadingOpen] = useState(false)
    const headingMenuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (headingMenuRef.current && !headingMenuRef.current.contains(event.target as Node)) {
                setIsHeadingOpen(false)
            }
        }
        if (isHeadingOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isHeadingOpen])

    const getCurrentHeading = () => {
        for (let i = 1; i <= 6; i++) {
            if (editor.isActive("heading", { level: i })) return `Heading ${i}`
        }
        return "Paragraph"
    }

    const addLink = () => {
        const url = window.prompt("URL")
        if (url) {
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
        }
    }

    // Strictly show image options only when an image node is selected
    const isImageActive = (editor.state.selection as any).node?.type.name === 'image'

    return (
        <div className="border-b bg-muted/50 p-1 flex flex-col gap-1 sticky top-0 z-20 backdrop-blur-sm">
            <div className="flex flex-wrap gap-1">
                <div className="flex items-center gap-1 border-r pr-1 mr-1 relative" ref={headingMenuRef}>
                    <button
                        type="button"
                        onClick={() => setIsHeadingOpen(!isHeadingOpen)}
                        className="flex items-center gap-2 !px-2 !h-7 text-[10px] 2xl:text-[11px] font-medium border rounded-md bg-transparent hover:bg-gray-200 transition-colors"
                    >
                        <span className="truncate max-w-[80px]">
                            {getCurrentHeading()}
                        </span>
                        <ChevronDown className={cn("h-3 w-3 opacity-50 transition-transform", isHeadingOpen && "rotate-180")} />
                    </button>

                    {isHeadingOpen && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-[100] p-1 flex flex-col gap-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                            {headings.map((h) => (
                                <button
                                    key={h.level}
                                    type="button"
                                    className={cn(
                                        "flex items-center justify-start w-full px-3 h-8 text-xs font-normal rounded-sm transition-colors",
                                        (h.level === 0 ? !editor.isActive("heading") : editor.isActive("heading", { level: h.level }))
                                            ? "bg-gray-100 text-primaryNew"
                                            : "hover:bg-gray-50 text-foreground"
                                    )}
                                    onClick={() => {
                                        if (h.level === 0) {
                                            editor.chain().focus().setParagraph().run()
                                        } else {
                                            editor.chain().focus().toggleHeading({ level: h.level as any }).run()
                                        }
                                        setIsHeadingOpen(false)
                                    }}
                                >
                                    {h.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1 border-r pr-1 mr-1">
                    <Button
                        variant={editor.isActive("bold") ? "secondary" : "action"}
                        mini
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        title="Bold"
                        Icon={Bold}
                        className="shadow-none border-none bg-transparent hover:bg-gray-200"
                    />
                    <Button
                        variant={editor.isActive("italic") ? "secondary" : "action"}
                        mini
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        title="Italic"
                        Icon={Italic}
                        className="shadow-none border-none bg-transparent hover:bg-gray-200"
                    />
                    <Button
                        variant={editor.isActive("underline") ? "secondary" : "action"}
                        mini
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        title="Underline"
                        Icon={UnderlineIcon}
                        className="shadow-none border-none bg-transparent hover:bg-gray-200"
                    />
                    <Button
                        variant={editor.isActive("strike") ? "secondary" : "action"}
                        mini
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        title="Strike"
                        Icon={Strikethrough}
                        className="shadow-none border-none bg-transparent hover:bg-gray-200"
                    />
                </div>

                <div className="flex items-center gap-1 border-r pr-1 mr-1">
                    <Button
                        variant={editor.isActive("bulletList") ? "secondary" : "action"}
                        mini
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        title="Bullet List"
                        Icon={List}
                        className="shadow-none border-none bg-transparent hover:bg-gray-200"
                    />
                    <Button
                        variant={editor.isActive("orderedList") ? "secondary" : "action"}
                        mini
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        title="Ordered List"
                        Icon={ListOrdered}
                        className="shadow-none border-none bg-transparent hover:bg-gray-200"
                    />
                </div>

                <div className="flex items-center gap-1 border-r pr-1 mr-1">
                    <Button
                        variant={editor.isActive({ textAlign: "left" }) ? "secondary" : "action"}
                        mini
                        onClick={() => editor.chain().focus().setTextAlign("left").run()}
                        title="Align Left"
                        Icon={AlignLeft}
                        className="shadow-none border-none bg-transparent hover:bg-gray-200"
                    />
                    <Button
                        variant={editor.isActive({ textAlign: "center" }) ? "secondary" : "action"}
                        mini
                        onClick={() => editor.chain().focus().setTextAlign("center").run()}
                        title="Align Center"
                        Icon={AlignCenter}
                        className="shadow-none border-none bg-transparent hover:bg-gray-200"
                    />
                    <Button
                        variant={editor.isActive({ textAlign: "right" }) ? "secondary" : "action"}
                        mini
                        onClick={() => editor.chain().focus().setTextAlign("right").run()}
                        title="Align Right"
                        Icon={AlignRight}
                        className="shadow-none border-none bg-transparent hover:bg-gray-200"
                    />
                    <Button
                        variant={editor.isActive({ textAlign: "justify" }) ? "secondary" : "action"}
                        mini
                        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                        title="Align Justify"
                        Icon={AlignJustify}
                        className="shadow-none border-none bg-transparent hover:bg-gray-200"
                    />
                </div>

                <div className="flex items-center gap-1 border-r pr-1 mr-1">
                    <Button
                        variant={editor.isActive("highlight") ? "secondary" : "action"}
                        mini
                        onClick={() => editor.chain().focus().toggleHighlight().run()}
                        title="Highlight"
                        Icon={Highlighter}
                        className="shadow-none border-none bg-transparent hover:bg-gray-200"
                    />
                    <Button
                        variant={editor.isActive("blockquote") ? "secondary" : "action"}
                        mini
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        title="Blockquote"
                        Icon={Quote}
                        className="shadow-none border-none bg-transparent hover:bg-gray-200"
                    />
                    <Button
                        variant={editor.isActive("codeBlock") ? "secondary" : "action"}
                        mini
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        title="Code Block"
                        Icon={Code}
                        className="shadow-none border-none bg-transparent hover:bg-gray-200"
                    />
                </div>

                <div className="flex items-center gap-1 border-r pr-1 mr-1">
                    <Button
                        variant={editor.isActive("link") ? "secondary" : "action"}
                        mini
                        onClick={addLink}
                        title="Add Link"
                        Icon={LinkIcon}
                        className="shadow-none border-none bg-transparent hover:bg-gray-200"
                    />
                    <Button
                        variant="action"
                        mini
                        onClick={onImageUpload}
                        loading={isUploading}
                        title="Add Image"
                        Icon={ImageIcon}
                        className="shadow-none border-none bg-transparent hover:bg-gray-200"
                    />
                </div>

                <div className="flex items-center gap-1 ml-auto">
                    <Button
                        variant="action"
                        mini
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        title="Undo"
                        Icon={Undo}
                        className="shadow-none border-none bg-transparent hover:bg-gray-200"
                    />
                    <Button
                        variant="action"
                        mini
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        title="Redo"
                        Icon={Redo}
                        className="shadow-none border-none bg-transparent hover:bg-gray-200"
                    />
                </div>
            </div>

            {isImageActive && (
                <div className="flex items-center gap-1 w-full p-1 border-t bg-blue-50/50 animate-in fade-in slide-in-from-top-1 duration-200">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mr-2 ml-1">Image Options:</span>
                    <div className="flex items-center gap-1 border-r border-blue-200 pr-1 mr-1">
                        <Button
                            variant={editor.getAttributes("image").alignment === "left" ? "secondary" : "action"}
                            mini
                            onClick={() => editor.chain().focus().updateAttributes("image", { alignment: "left" }).run()}
                            title="Align Left"
                            Icon={AlignLeft}
                        />
                        <Button
                            variant={editor.getAttributes("image").alignment === "center" ? "secondary" : "action"}
                            mini
                            onClick={() => editor.chain().focus().updateAttributes("image", { alignment: "center" }).run()}
                            title="Align Center"
                            Icon={AlignCenter}
                        />
                        <Button
                            variant={editor.getAttributes("image").alignment === "right" ? "secondary" : "action"}
                            mini
                            onClick={() => editor.chain().focus().updateAttributes("image", { alignment: "right" }).run()}
                            title="Align Right"
                            Icon={AlignRight}
                        />
                    </div>
                    <div className="flex items-center gap-1 border-r border-blue-200 pr-1 mr-1">
                        <Typography variant="small" className="text-[10px] text-blue-600/70 mr-1">Size:</Typography>
                        <Button
                            variant={editor.getAttributes("image").width === "25%" ? "secondary" : "action"}
                            text="25%"
                            className="!min-w-[40px] !text-[10px] !h-6"
                            onClick={() => editor.chain().focus().updateAttributes("image", { width: "25%" }).run()}
                        />
                        <Button
                            variant={editor.getAttributes("image").width === "50%" ? "secondary" : "action"}
                            text="50%"
                            className="!min-w-[40px] !text-[10px] !h-6"
                            onClick={() => editor.chain().focus().updateAttributes("image", { width: "50%" }).run()}
                        />
                        <Button
                            variant={editor.getAttributes("image").width === "75%" ? "secondary" : "action"}
                            text="75%"
                            className="!min-w-[40px] !text-[10px] !h-6"
                            onClick={() => editor.chain().focus().updateAttributes("image", { width: "75%" }).run()}
                        />
                        <Button
                            variant={editor.getAttributes("image").width === "100%" ? "secondary" : "action"}
                            text="100%"
                            className="!min-w-[40px] !text-[10px] !h-6"
                            onClick={() => editor.chain().focus().updateAttributes("image", { width: "100%" }).run()}
                        />
                    </div>
                    <Button
                        variant="action"
                        mini
                        text="Edit Alt Text"
                        className="ml-auto !text-[10px] shadow-none bg-transparent hover:bg-blue-100"
                        onClick={() => {
                            const alt = window.prompt("Alt Text", editor.getAttributes("image").alt || "")
                            if (alt !== null) {
                                editor.chain().focus().updateAttributes("image", { alt }).run()
                            }
                        }}
                    />
                </div>
            )}
        </div>
    )
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

                // Get coordinates of the image node
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
                // Find current position of this node (it might have shifted)
                let currentPos = -1
                editor.state.doc.descendants((n, p) => {
                    if (n === node) {
                        currentPos = p
                        return false
                    }
                })

                const targetPos = currentPos !== -1 ? currentPos : pos

                // Mark as attempted in the editor state
                editor.view.dispatch(
                    editor.state.tr.setNodeMarkup(targetPos, undefined, {
                        ...node.attrs,
                        autoUploadAttempted: true,
                    })
                )

                try {
                    // Try fetch without mode:cors first to allow blob/data URLs and simple gets
                    const response = await fetch(src)
                    if (!response.ok) throw new Error('Fetch failed')
                    const blob = await response.blob()

                    if (blob.size > 5 * 1024 * 1024) continue

                    const fileName = (src.split('/').pop() || 'image').split('?')[0] || 'image.png'
                    const file = new File([blob], fileName, { type: blob.type })
                    const uploadedUrl = await uploadImageToServer(file)

                    if (uploadedUrl) {
                        // Re-check position before final update
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
                    "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[200px] p-4",
                    "prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0",
                    "prose-headings:font-bold prose-headings:text-foreground",
                    "prose-a:text-primaryNew prose-a:underline"
                ),
            },
            handlePaste: (view, event) => {
                const { clipboardData } = event
                if (!clipboardData) return false

                // 1. Handle image files from clipboard (e.g. screenshots)
                const items = Array.from(clipboardData.items)
                const imageItem = items.find(item => item.type.startsWith('image'))

                if (imageItem) {
                    const file = imageItem.getAsFile()
                    if (file) {
                        event.preventDefault()
                        void (async () => {
                            const url = await uploadImageToServer(file)
                            if (url) {
                                view.dispatch(view.state.tr.replaceSelectionWith(
                                    view.state.schema.nodes.image.create({ src: url })
                                ))
                            }
                        })()
                        return true
                    }
                }

                // 2. Handle HTML paste that might contain images
                // Tiptap handles this by default, but we want to ensure autoUpload triggers
                // so we don't return true here, let Tiptap proceed.
                // Our onUpdate hook will catch the new images.

                return false
            },

            handleDOMEvents: {

                mousedown: (view, event) => {
                    const target = event.target as HTMLElement
                    if (target && target.nodeName === 'IMG') {
                        const { state } = view
                        const nodePos = view.posAtDOM(target, 0)
                        if (nodePos >= 0) {
                            if (pmState?.NodeSelection) {
                                view.dispatch(state.tr.setSelection(pmState.NodeSelection.create(state.doc, nodePos)))
                                return true
                            }
                        }
                    }
                    return false
                }
            },
            handleClick(view, pos, event) {
                const { state } = view

                // 1. Direct Target Check
                if (event.target instanceof HTMLImageElement) {
                    const nodePos = view.posAtDOM(event.target, 0)
                    if (nodePos >= 0) {
                        if (pmState?.NodeSelection) {
                            view.dispatch(state.tr.setSelection(pmState.NodeSelection.create(state.doc, nodePos)))
                            return true
                        }
                    }
                }

                // 2. Proximity Check (Safe Fallback)
                const maxPos = state.doc.content.size
                const posToCheck = [pos, pos - 1].filter(p => p >= 0 && p <= maxPos)

                for (const p of posToCheck) {
                    const node = state.doc.nodeAt(p)
                    if (node && node.type.name === 'image') {
                        if (pmState?.NodeSelection) {
                            view.dispatch(state.tr.setSelection(pmState.NodeSelection.create(state.doc, p)))
                            return true
                        }
                    }
                }
                return false
            },
        },
    })

    const handleImageUpload = () => {
        if (!editor) return

        const fileInput = document.createElement("input")
        fileInput.type = "file"
        fileInput.accept = "image/*"
        fileInput.click()

        fileInput.onchange = async () => {
            const file = fileInput.files?.[0]
            if (!file) return

            if (file.size > 5 * 1024 * 1024) {
                notification.error({
                    title: "Image too large",
                    description: "Image size must be less than 5MB",
                })
                return
            }

            const formData = new FormData()
            formData.append("file", file)

            try {
                const res: any = await uploadImage(formData)
                if (res?.data?.url) {
                    editor.chain().focus().setImage({ src: res.data.url }).run()
                    notification.success({
                        title: "Success",
                        description: "Image uploaded successfully",
                    })
                } else if (res?.error) {
                    notification.error({
                        title: "Error",
                        description: res.error.data?.message || "Failed to upload image",
                    })
                }
            } catch (err) {
                notification.error({
                    title: "Error",
                    description: "An unexpected error occurred during upload",
                })
            }
        }
    }

    // Update content if value changes externally
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || "")
            setTimeout(() => {
                computeImageOverlays()
                void autoUploadExternalImages()
            }, 0)
        }
    }, [value, editor])

    // Setup observers and listeners
    useEffect(() => {
        if (!editor || !editorWrapperRef.current) return

        const root = editor.view.dom
        const observer = new MutationObserver(() => {
            computeImageOverlays()
            void autoUploadExternalImages()
        })

        observer.observe(root, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src'],
        })

        const onResize = () => computeImageOverlays()
        const onScroll = () => computeImageOverlays()

        window.addEventListener('resize', onResize)
        editorWrapperRef.current.addEventListener('scroll', onScroll, true)

        // Initial check
        setTimeout(() => {
            computeImageOverlays()
            void autoUploadExternalImages()
        }, 500)

        return () => {
            observer.disconnect()
            window.removeEventListener('resize', onResize)
            editorWrapperRef.current?.removeEventListener('scroll', onScroll, true)
        }
    }, [editor])


    return (
        <div className={cn("space-y-2", className)}>
            {(uploadImageResult?.isLoading || isAutoUploading) && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[1000] animate-fade-in">
                    <div className="bg-primaryNew rounded-lg shadow-lg border border-gray-200 px-6 py-4 flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span className="font-medium text-white">
                            Uploading image...
                        </span>
                    </div>
                </div>
            )}
            {label && <Label className="text-sm font-medium">{label}</Label>}
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
            {error && <p className="text-xs font-medium text-destructive">{error}</p>}

            <style jsx global>{`
                .ProseMirror {
                    outline: none;
                }
                .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #adb5bd;
                    pointer-events: none;
                    height: 0;
                }
                /* Typography Styles */
                .ProseMirror h1 {
                    font-size: 2.25rem;
                    line-height: 2.5rem;
                    font-weight: 800;
                    margin-top: 1.5rem;
                    margin-bottom: 1rem;
                }
                .ProseMirror h2 {
                    font-size: 1.875rem;
                    line-height: 2.25rem;
                    font-weight: 700;
                    margin-top: 1.25rem;
                    margin-bottom: 0.75rem;
                }
                .ProseMirror h3 {
                    font-size: 1.5rem;
                    line-height: 2rem;
                    font-weight: 700;
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                }
                .ProseMirror h4 {
                    font-size: 1.25rem;
                    line-height: 1.75rem;
                    font-weight: 600;
                    margin-top: 0.75rem;
                    margin-bottom: 0.5rem;
                }
                .ProseMirror h5 {
                    font-size: 1.125rem;
                    line-height: 1.75rem;
                    font-weight: 600;
                    margin-top: 0.5rem;
                    margin-bottom: 0.25rem;
                }
                .ProseMirror h6 {
                    font-size: 1rem;
                    line-height: 1.5rem;
                    font-weight: 600;
                    margin-top: 0.5rem;
                    margin-bottom: 0.25rem;
                }
                .ProseMirror ul {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                    margin-top: 0.5rem;
                    margin-bottom: 0.5rem;
                }
                .ProseMirror ol {
                    list-style-type: decimal;
                    padding-left: 1.5rem;
                    margin-top: 0.5rem;
                    margin-bottom: 0.5rem;
                }
                .ProseMirror blockquote {
                    border-left: 4px solid #e5e7eb;
                    padding-left: 1rem;
                    font-style: italic;
                    color: #4b5563;
                    margin-top: 1rem;
                    margin-bottom: 1rem;
                }
                .ProseMirror pre {
                    background: #1f2937;
                    color: #f3f4f6;
                    padding: 0.75rem 1rem;
                    border-radius: 0.375rem;
                    font-family: monospace;
                    margin-top: 1rem;
                    margin-bottom: 1rem;
                }
                .ProseMirror mark {
                    background-color: #fef08a;
                    padding: 0 0.2rem;
                    border-radius: 0.125rem;
                }
                .ProseMirror img {
                    transition: all 0.2s ease-in-out;
                    cursor: pointer;
                    position: relative;
                    max-width: 100%;
                    pointer-events: auto !important;
                    z-index: 10;
                    display: block;
                }
                .ProseMirror img.ProseMirror-selectednode {
                    outline: 2px solid #2563eb;
                    outline-offset: 2px;
                    z-index: 20;
                }
            `}</style>
        </div>
    )
}
