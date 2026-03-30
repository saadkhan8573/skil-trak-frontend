'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    REDO_COMMAND,
    UNDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    $getSelection,
    $isRangeSelection,
    $createParagraphNode,
    $getRoot,
    $insertNodes,
    $getNodeByKey,
    $isNodeSelection,
    ElementFormatType,
} from 'lexical'
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils'
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
    $isListNode,
    ListNode,
} from '@lexical/list'
import {
    $createHeadingNode,
    $createQuoteNode,
    $isHeadingNode,
    HeadingTagType,
} from '@lexical/rich-text'
import { $isLinkNode, TOGGLE_LINK_COMMAND, LinkNode } from '@lexical/link'
import { INSERT_TABLE_COMMAND } from '@lexical/table'
import { $setBlocksType } from '@lexical/selection'
import {
    Bold,
    Italic,
    Underline,
    Undo,
    Redo,
    List,
    ListOrdered,
    Type,
    Image as ImageIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    ChevronDown,
    Link,
    Table,
} from 'lucide-react'
import { INSERT_IMAGE_COMMAND } from '../plugins/ImagePlugin'
import { $createImageNode, $isImageNode } from '../nodes/ImageNode'
import { AdminApi } from '@queries'
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui/tooltip'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'

const LowPriority = 1


const blockTypeToBlockName = {
    bullet: 'Bulleted List',
    check: 'Check List',
    code: 'Code Block',
    h1: 'Heading 1',
    h2: 'Heading 2',
    h3: 'Heading 3',
    h4: 'Heading 4',
    h5: 'Heading 5',
    h6: 'Heading 6',
    number: 'Numbered List',
    paragraph: 'Normal',
    quote: 'Quote',
}

const BlockOptionsContent = ({
    editor,
    blockType,
    close,
}: {
    editor: any
    blockType: string
    close: () => void
}) => {
    const formatParagraph = () => {
        if (blockType !== 'paragraph') {
            editor.update(() => {
                const selection = $getSelection()
                if ($isRangeSelection(selection)) {
                    $setBlocksType(selection, () => $createParagraphNode())
                }
            })
        }
        close()
    }

    const formatHeading = (headingSize: HeadingTagType) => {
        if (blockType !== headingSize) {
            editor.update(() => {
                const selection = $getSelection()
                if ($isRangeSelection(selection)) {
                    $setBlocksType(selection, () =>
                        $createHeadingNode(headingSize)
                    )
                }
            })
        }
        close()
    }

    return (
        <div className="py-1">
            <button
                type="button"
                onClick={formatParagraph}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 text-sm ${blockType === 'paragraph' ? 'bg-primary/5 text-primary font-semibold' : ''}`}
            >
                Normal
            </button>
            {(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const).map((tag) => (
                <button
                    type="button"
                    key={tag}
                    onClick={() => formatHeading(tag)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 text-sm ${blockType === tag ? 'bg-primary/5 text-primary font-semibold' : ''}`}
                >
                    {blockTypeToBlockName[tag]}
                </button>
            ))}
        </div>
    )
}


const InsertTableDropdown = ({ editor }: { editor: any }) => {
    const [rows, setRows] = useState('3')
    const [cols, setCols] = useState('3')
    const [includeHeaders, setIncludeHeaders] = useState(true)
    const [open, setOpen] = useState(false)

    const insertTable = () => {
        editor.dispatchCommand(INSERT_TABLE_COMMAND, {
            columns: cols,
            rows: rows,
            includeHeaders: includeHeaders
                ? { rows: true, columns: false }
                : false,
        })
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                        <button
                            type="button"
                            className={`p-1.5 rounded hover:bg-gray-200 ${open ? 'bg-primary/10 text-primary' : ''}`}
                        >
                            <Table size={18} />
                        </button>
                    </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Insert Table</p>
                </TooltipContent>
            </Tooltip>
            <PopoverContent
                className="w-64 p-3 shadow-xl border border-gray-200 z-9999"
                align="start"
            >
                <h4 className="font-semibold text-sm mb-2 text-gray-700">
                    Custom Table
                </h4>
                <div className="flex gap-2 mb-3">
                    <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">
                            Rows
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            className="border w-full rounded px-2 py-1 text-sm outline-none focus:border-primary"
                            value={rows}
                            onChange={(e) => setRows(e.target.value)}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">
                            Columns
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            className="border w-full rounded px-2 py-1 text-sm outline-none focus:border-primary"
                            value={cols}
                            onChange={(e) => setCols(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2 mb-4">
                    <input
                        type="checkbox"
                        id="includeHeaders"
                        checked={includeHeaders}
                        onChange={(e) => setIncludeHeaders(e.target.checked)}
                        className="w-3.5 h-3.5 accent-primary cursor-pointer"
                    />
                    <label
                        htmlFor="includeHeaders"
                        className="text-xs text-gray-600 cursor-pointer"
                    >
                        Include Header Row
                    </label>
                </div>
                <button
                    onClick={insertTable}
                    className="w-full bg-primary text-white py-1.5 rounded text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                    Insert Table
                </button>
            </PopoverContent>
        </Popover>
    )
}

export const Toolbar = () => {
    const [editor] = useLexicalComposerContext()
    const [canUndo, setCanUndo] = useState(false)
    const [canRedo, setCanRedo] = useState(false)
    const [isBold, setIsBold] = useState(false)
    const [isItalic, setIsItalic] = useState(false)
    const [isUnderline, setIsUnderline] = useState(false)
    const [isLink, setIsLink] = useState(false)
    const [linkUrl, setLinkUrl] = useState('')
    const [blockType, setBlockType] = useState('paragraph')
    const [showBlockOptions, setShowBlockOptions] = useState(false)
    const [uploadImage] = AdminApi.Blogs.uploadImage()


    const updateToolbar = useCallback(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
            // Update text format
            setIsBold(selection.hasFormat('bold'))
            setIsItalic(selection.hasFormat('italic'))
            setIsUnderline(selection.hasFormat('underline'))

            // Update link
            const node = selection.anchor.getNode()
            const parent = node.getParent()
            if ($isLinkNode(parent)) {
                setIsLink(true)
                setLinkUrl(parent.getURL())
            } else if ($isLinkNode(node)) {
                setIsLink(true)
                setLinkUrl(node.getURL())
            } else {
                setIsLink(false)
                setLinkUrl('')
            }

            // Update block type
            const anchorNode = selection.anchor.getNode()
            const element =
                anchorNode.getKey() === 'root'
                    ? anchorNode
                    : anchorNode.getTopLevelElementOrThrow()
            const elementKey = element.getKey()
            const elementDOM = editor.getElementByKey(elementKey)
            if (elementDOM !== null) {
                if ($isListNode(element)) {
                    const parentList = $getNearestNodeOfType(
                        anchorNode,
                        ListNode
                    )
                    const type = parentList
                        ? parentList.getTag()
                        : element.getTag()
                    setBlockType(type === 'ul' ? 'bullet' : 'number')
                } else {
                    const type = $isHeadingNode(element)
                        ? element.getTag()
                        : element.getType()
                    setBlockType(type)
                }
            }
        } else if ($isNodeSelection(selection)) {
            const nodes = selection.getNodes()
            if (nodes.length === 1 && $isImageNode(nodes[0])) {
                // You could update some state here if needed,
                // e.g., to highlight alignment buttons based on image alignment.
            }
        }
    }, [editor])

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    updateToolbar()
                })
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_payload, newEditor) => {
                    updateToolbar()
                    return false
                },
                LowPriority
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload)
                    return false
                },
                LowPriority
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload)
                    return false
                },
                LowPriority
            )
        )
    }, [editor, updateToolbar])

    const formatBulletList = () => {
        if (blockType !== 'bullet') {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
        }
    }

    const formatNumberedList = () => {
        if (blockType !== 'number') {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
        }
    }

    const onImageUpload = useCallback(() => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.click()

        input.onchange = async () => {
            const file = input.files?.[0]
            if (file) {
                // Show local preview immediately
                const reader = new FileReader()
                reader.onload = async () => {
                    const temporarySrc = reader.result as string
                    let nodeKey: string | null = null

                    editor.update(() => {
                        const imageNode = $createImageNode({
                            altText: file.name,
                            src: temporarySrc,
                        })
                        $insertNodes([imageNode])
                        nodeKey = imageNode.getKey()
                    })

                    if (!nodeKey) return

                    // Start upload
                    const formData = new FormData()
                    formData.append('file', file)
                    try {
                        const res: any = await uploadImage(formData)
                        if (res?.data?.url) {
                            editor.update(() => {
                                const node = $getNodeByKey(nodeKey!)
                                if ($isImageNode(node)) {
                                    node.setSrc(res.data.url)
                                }
                            })
                        } else {
                            editor.update(() => {
                                const node = $getNodeByKey(nodeKey!)
                                if (node) {
                                    node.remove()
                                }
                            })
                        }
                    } catch (e) {
                        console.error('Upload failed', e)
                        editor.update(() => {
                            const node = $getNodeByKey(nodeKey!)
                            if (node) {
                                node.remove()
                            }
                        })
                    }
                }
                reader.readAsDataURL(file)
            }
        }
    }, [editor, uploadImage])

    const insertLink = useCallback(() => {
        const initialUrl = isLink ? linkUrl : 'https://'
        const url = prompt('Enter link URL:', initialUrl)

        if (url === null) return

        if (url === '') {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
        } else {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, url)
        }
    }, [editor, isLink, linkUrl])

    return (
        <div className="flex items-center gap-1 p-2 border-b bg-gray-50 sticky top-0 z-10 flex-wrap">
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        disabled={!canUndo}
                        onClick={() =>
                            editor.dispatchCommand(UNDO_COMMAND, undefined)
                        }
                        className="p-1.5 hover:bg-gray-200 rounded disabled:opacity-30"
                    >
                        <Undo size={18} />
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Undo</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        disabled={!canRedo}
                        onClick={() =>
                            editor.dispatchCommand(REDO_COMMAND, undefined)
                        }
                        className="p-1.5 hover:bg-gray-200 rounded disabled:opacity-30"
                    >
                        <Redo size={18} />
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Redo</p>
                </TooltipContent>
            </Tooltip>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Block Type Popover */}
            <Popover open={showBlockOptions} onOpenChange={setShowBlockOptions}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                            <button
                                type="button"
                                className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-200 text-sm font-medium transition-colors"
                            >
                                <span className="w-24 text-left truncate">
                                    {blockTypeToBlockName[
                                        blockType as keyof typeof blockTypeToBlockName
                                    ] || 'Normal'}
                                </span>
                                <ChevronDown size={14} />
                            </button>
                        </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Text Style</p>
                    </TooltipContent>
                </Tooltip>
                <PopoverContent
                    className="w-48 p-0 shadow-lg border border-gray-200 z-9999"
                    align="start"
                >
                    <BlockOptionsContent
                        editor={editor}
                        blockType={blockType}
                        close={() => setShowBlockOptions(false)}
                    />
                </PopoverContent>
            </Popover>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        onClick={() =>
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
                        }
                        className={`p-1.5 rounded hover:bg-gray-200 ${isBold ? 'bg-primary/10 text-primary' : ''}`}
                    >
                        <Bold size={18} />
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Bold</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        onClick={() =>
                            editor.dispatchCommand(
                                FORMAT_TEXT_COMMAND,
                                'italic'
                            )
                        }
                        className={`p-1.5 rounded hover:bg-gray-200 ${isItalic ? 'bg-primary/10 text-primary' : ''}`}
                    >
                        <Italic size={18} />
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Italic</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        onClick={() =>
                            editor.dispatchCommand(
                                FORMAT_TEXT_COMMAND,
                                'underline'
                            )
                        }
                        className={`p-1.5 rounded hover:bg-gray-200 ${isUnderline ? 'bg-primary/10 text-primary' : ''}`}
                    >
                        <Underline size={18} />
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Underline</p>
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        onClick={insertLink}
                        className={`p-1.5 rounded hover:bg-gray-200 ${isLink ? 'bg-primary/10 text-primary' : ''}`}
                    >
                        <Link size={18} />
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Link</p>
                </TooltipContent>
            </Tooltip>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        onClick={formatBulletList}
                        className={`p-1.5 rounded hover:bg-gray-200 ${blockType === 'bullet' ? 'bg-primary/10 text-primary' : ''}`}
                    >
                        <List size={18} />
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Bullet List</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        onClick={formatNumberedList}
                        className={`p-1.5 rounded hover:bg-gray-200 ${blockType === 'number' ? 'bg-primary/10 text-primary' : ''}`}
                    >
                        <ListOrdered size={18} />
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Numbered List</p>
                </TooltipContent>
            </Tooltip>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        onClick={() =>
                            editor.dispatchCommand(
                                FORMAT_ELEMENT_COMMAND,
                                'left'
                            )
                        }
                        className="p-1.5 rounded hover:bg-gray-200"
                    >
                        <AlignLeft size={18} />
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Align Left</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        onClick={() =>
                            editor.dispatchCommand(
                                FORMAT_ELEMENT_COMMAND,
                                'center'
                            )
                        }
                        className="p-1.5 rounded hover:bg-gray-200"
                    >
                        <AlignCenter size={18} />
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Align Center</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        onClick={() =>
                            editor.dispatchCommand(
                                FORMAT_ELEMENT_COMMAND,
                                'right'
                            )
                        }
                        className="p-1.5 rounded hover:bg-gray-200"
                    >
                        <AlignRight size={18} />
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Align Right</p>
                </TooltipContent>
            </Tooltip>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <InsertTableDropdown editor={editor} />

            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        onClick={onImageUpload}
                        className="p-1.5 rounded hover:bg-gray-200"
                    >
                        <ImageIcon size={18} />
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Insert Image</p>
                </TooltipContent>
            </Tooltip>
        </div>
    )
}
