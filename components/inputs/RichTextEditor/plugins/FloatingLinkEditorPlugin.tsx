import {
    $isAutoLinkNode,
    $isLinkNode,
    TOGGLE_LINK_COMMAND,
} from '@lexical/link'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $findMatchingParent, mergeRegister } from '@lexical/utils'
import {
    $getSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_LOW,
    LexicalEditor,
    SELECTION_CHANGE_COMMAND,
} from 'lexical'
import { Edit2, ExternalLink } from 'lucide-react'
import { Dispatch, ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const LowPriority = 1

function FloatingLinkEditor({
    editor,
    isLink,
    setIsLink,
    anchorElem,
}: {
    editor: LexicalEditor
    isLink: boolean
    setIsLink: Dispatch<React.SetStateAction<boolean>>
    anchorElem: HTMLElement
}): ReactElement | null {
    const [linkUrl, setLinkUrl] = useState('')
    const editorRef = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const mouseDownRef = useRef(false)

    const updateLinkEditor = useCallback(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
            const node = selection.anchor.getNode()
            const parent = node.getParent()
            if ($isLinkNode(parent)) {
                setLinkUrl(parent.getURL())
            } else if ($isLinkNode(node)) {
                setLinkUrl(node.getURL())
            } else {
                setLinkUrl('')
            }
        }
    }, [editor])

    useEffect(() => {
        const scrollerElem = anchorElem.parentElement

        const update = () => {
            editor.getEditorState().read(() => {
                updateLinkEditor()
            })
        }

        window.addEventListener('resize', update)
        if (scrollerElem) {
            scrollerElem.addEventListener('scroll', update)
        }

        return () => {
            window.removeEventListener('resize', update)
            if (scrollerElem) {
                scrollerElem.removeEventListener('scroll', update)
            }
        }
    }, [anchorElem, editor, updateLinkEditor])

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    updateLinkEditor()
                })
            }),

            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    updateLinkEditor()
                    return false
                },
                LowPriority
            )
        )
    }, [editor, updateLinkEditor])

    useEffect(() => {
        editor.getEditorState().read(() => {
            updateLinkEditor()
        })
    }, [editor, updateLinkEditor])

    useEffect(() => {
        const positionEditor = () => {
            if (isLink && editorRef.current && linkUrl) {
                const domSelection = window.getSelection()
                if (domSelection && domSelection.rangeCount > 0) {
                    const range = domSelection.getRangeAt(0)
                    const rect = range.getBoundingClientRect()

                    const editorRect = editorRef.current.getBoundingClientRect()
                    const editorHeight = editorRect.height
                    const editorWidth = editorRect.width

                    // Position above the link
                    let top = rect.top - editorHeight - 8 + window.scrollY
                    let left =
                        rect.left +
                        rect.width / 2 -
                        editorWidth / 2 +
                        window.scrollX

                    // Adjust if off screen (left)
                    if (left < 10) {
                        left = 10
                    }

                    // Adjust if off screen (top) - move below
                    if (rect.top - editorHeight - 8 < 0) {
                        top = rect.bottom + 8 + window.scrollY
                    }

                    editorRef.current.style.top = `${top}px`
                    editorRef.current.style.left = `${left}px`
                    editorRef.current.style.opacity = '1'
                    editorRef.current.style.transform = 'translate(0, 0)'
                }
            }
        }

        // Defer positioning to ensure DOM is updated and sizes are correct
        const timeout = setTimeout(positionEditor, 0)

        // Also re-position on scroll/resize (handled by parent effect roughly, but specific positioning needs this)
        window.addEventListener('resize', positionEditor)
        window.addEventListener('scroll', positionEditor)

        return () => {
            clearTimeout(timeout)
            window.removeEventListener('resize', positionEditor)
            window.removeEventListener('scroll', positionEditor)
        }
    }, [editor, isLink, linkUrl])

    const handleEdit = () => {
        const url = prompt('Edit Link URL', linkUrl)
        if (url !== null) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, url)
            // If URL is empty, link is removed, so hide editor
            if (url === '') setIsLink(false)
        }
    }

    if (!isLink || !linkUrl) return null

    return (
        <div
            ref={editorRef}
            className="absolute flex items-center bg-white border border-gray-200 shadow-md rounded-md p-2 gap-2 z-99999 transition-opacity duration-200"
            style={{
                opacity: 0,
                top: 0, // Initial, set by effect
                left: 0,
            }}
        >
            <a
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary underline truncate max-w-50 hover:text-primary/80 flex items-center gap-1"
            >
                <ExternalLink size={14} />
                {linkUrl}
            </a>
            <div className="w-px h-4 bg-gray-200 mx-1"></div>
            <button
                onClick={handleEdit}
                className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors"
                title="Edit Link"
            >
                <Edit2 size={14} />
            </button>
        </div>
    )
}

function useFloatingLinkEditorToolbar(
    editor: LexicalEditor,
    anchorElem: HTMLElement
): ReactElement | null {
    const [activeEditor, setActiveEditor] = useState(editor)
    const [isLink, setIsLink] = useState(false)

    const updateToolbar = useCallback(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
            const node = selection.anchor.getNode()
            const linkParent = $findMatchingParent(node, $isLinkNode)
            const autoLinkParent = $findMatchingParent(node, $isAutoLinkNode)

            // We'll treat both link and autolink the same for this editor
            if (linkParent != null || autoLinkParent != null) {
                setIsLink(true)
            } else {
                setIsLink(false)
            }
        } else {
            setIsLink(false)
        }
    }, [])

    useEffect(() => {
        return editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            (_payload, newEditor) => {
                updateToolbar()
                setActiveEditor(newEditor)
                return false
            },
            COMMAND_PRIORITY_LOW
        )
    }, [editor, updateToolbar])

    // Initial check
    useEffect(() => {
        editor.getEditorState().read(() => {
            updateToolbar()
        })
    }, [editor, updateToolbar])

    return createPortal(
        <FloatingLinkEditor
            editor={activeEditor}
            anchorElem={anchorElem}
            isLink={isLink}
            setIsLink={setIsLink}
        />,
        document.body // Anchor to body to avoid clipping
    )
}

export default function FloatingLinkEditorPlugin({
    anchorElem = document.body,
}: {
    anchorElem?: HTMLElement
}): ReactElement | null {
    const [editor] = useLexicalComposerContext()
    return useFloatingLinkEditorToolbar(editor, anchorElem)
}
