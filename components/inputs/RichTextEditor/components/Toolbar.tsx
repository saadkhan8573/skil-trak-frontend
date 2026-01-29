"use client"

import { Editor } from "@tiptap/react"
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    Bold,
    ChevronDown,
    Code,
    Highlighter,
    Image as ImageIcon,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Quote,
    Redo,
    Strikethrough,
    Underline as UnderlineIcon,
    Undo,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "../../../buttons/Button/Button"
import { Typography } from "../../../Typography/Typography"
import { cn } from "@utils"

interface ToolbarProps {
    editor: Editor | null
    onImageUpload: () => void
    isUploading: boolean
}

export const Toolbar = ({ editor, onImageUpload, isUploading }: ToolbarProps) => {
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
