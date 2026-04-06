'use client'

import React, { useEffect, useState } from 'react'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { TablePlugin } from '@lexical/react/LexicalTablePlugin'
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table'
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html'
import {
    $getRoot,
    $createParagraphNode,
    $isElementNode,
    $isDecoratorNode,
    EditorState,
} from 'lexical'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListNode, ListItemNode } from '@lexical/list'
import { LinkNode, AutoLinkNode } from '@lexical/link'

import { Toolbar } from './components/Toolbar'
import { ImageNode } from './nodes/ImageNode'
import ImagePlugin from './plugins/ImagePlugin'
import DragDropPastePlugin from './plugins/DragDropPastePlugin'
import ExternalImagePlugin from './plugins/ExternalImagePlugin'
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin'

import { Typography } from '@components'

// Theme for Lexical
const theme = {
    placeholder: 'editor-placeholder',
    paragraph: 'mb-2 text-gray-700',
    quote: 'border-l-4 border-gray-300 pl-4 italic my-4',
    heading: {
        h1: 'text-3xl font-bold mb-4',
        h2: 'text-2xl font-bold mb-3',
        h3: 'text-xl font-bold mb-2',
        h4: 'text-lg font-bold mb-2',
        h5: 'text-base font-bold mb-1',
        h6: 'text-sm font-bold mb-1 uppercase tracking-wider',
    },
    list: {
        nested: {
            listitem: 'list-none',
        },
        ol: 'list-decimal ml-6 mb-4',
        ul: 'list-disc ml-6 mb-4',
        listitem: 'mb-1',
    },
    image: 'editor-image',
    link: 'text-primary underline',
    text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
        strikethrough: 'line-through',
        underlineStrikethrough: 'underline line-through',
    },
    table: 'w-full border-collapse border border-gray-300 my-4',
    tableCell: 'border border-gray-300 p-2 min-w-[75px]',
    tableCellHeader: 'bg-gray-100 font-bold',
}

interface RichTextEditorProps {
    value?: string
    onChange?: (value: string) => void
    label?: string
    placeholder?: string
    className?: string
    height?: string
    showHtmlToggle?: boolean
}

export const RichTextEditor = ({
    value,
    onChange,
    label,
    placeholder,
    className,
    height,
    showHtmlToggle = false,
}: RichTextEditorProps) => {
    const [isMounted, setIsMounted] = useState(false)
    const [viewMode, setViewMode] = useState<'visual' | 'html'>('visual')

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const initialConfig = {
        namespace: 'SkilTrakEditor',
        theme,
        onError: (error: Error) => {},
        nodes: [
            ImageNode,
            HeadingNode,
            QuoteNode,
            ListNode,
            ListItemNode,
            LinkNode,
            AutoLinkNode,
            TableNode,
            TableCellNode,
            TableRowNode,
        ],
    }

    const handleOnChange = (editorState: EditorState, editor: any) => {
        if (viewMode !== 'visual') return // Stop propagation in HTML mode
        editorState.read(() => {
            const htmlString = $generateHtmlFromNodes(editor, null)
            if (onChange) {
                onChange(htmlString)
            }
        })
    }

    if (!isMounted) return null

    return (
        <div className={`w-full ${className || ''}`}>
            <div className="flex justify-between items-center mb-2">
                {label ? (
                    <Typography variant={'label'}>{label}</Typography>
                ) : (
                    <div />
                )}
                {showHtmlToggle && (
                    <div className="flex bg-gray-100 p-0.5 rounded border border-gray-200">
                        <button
                            type="button"
                            onClick={() => setViewMode('visual')}
                            className={`text-xs px-3 py-1 rounded transition-colors ${
                                viewMode === 'visual'
                                    ? 'bg-white shadow-sm text-primary font-medium'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Visual
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('html')}
                            className={`text-xs px-3 py-1 rounded transition-colors ${
                                viewMode === 'html'
                                    ? 'bg-white shadow-sm text-primary font-medium'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Text (HTML)
                        </button>
                    </div>
                )}
            </div>

            <div
                className={`border rounded-md overflow-hidden bg-white ${
                    height ? height : 'min-h-50 max-h-125'
                } flex flex-col border-gray-300 relative`}
            >
                <div
                    className={
                        viewMode === 'visual'
                            ? 'flex flex-col flex-1 h-full min-h-0'
                            : 'hidden'
                    }
                >
                    <LexicalComposer initialConfig={initialConfig}>
                        <Toolbar />
                        <div className="relative flex-1 overflow-auto">
                            <RichTextPlugin
                                contentEditable={
                                    <ContentEditable className="outline-none py-4 px-4 min-h-37.5 prose prose-sm max-w-none" />
                                }
                                placeholder={
                                    <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
                                        {placeholder || 'Start typing...'}
                                    </div>
                                }
                                ErrorBoundary={LexicalErrorBoundary}
                            />
                            <HistoryPlugin />
                            <ListPlugin />
                            <LinkPlugin />
                            <TablePlugin />
                            <ImagePlugin />
                            <DragDropPastePlugin />
                            <ExternalImagePlugin />
                            <FloatingLinkEditorPlugin />
                            <OnChangePlugin onChange={handleOnChange} />

                            {/* Initial Value Plugin */}
                            <InitialValuePlugin
                                value={value}
                                viewMode={viewMode}
                            />
                        </div>
                    </LexicalComposer>
                </div>
                {viewMode === 'html' && (
                    <textarea
                        className="flex-1 w-full h-full min-h-37.5 p-4 font-mono text-sm resize-none outline-none border-t-0"
                        value={value || ''}
                        onChange={(e) => {
                            if (onChange) onChange(e.target.value)
                        }}
                        placeholder="<p>Write your HTML here...</p>"
                    />
                )}
            </div>
        </div>
    )
}

// Helper plugin to set and update HTML value
function InitialValuePlugin({
    value,
    viewMode,
}: {
    value?: string
    viewMode: string
}) {
    const [editor] = useLexicalComposerContext()
    const [isFirstRender, setIsFirstRender] = useState(true)

    useEffect(() => {
        const updateContent = () => {
            editor.update(() => {
                const parser = new DOMParser()
                const dom = parser.parseFromString(value || '', 'text/html')
                const nodes = $generateNodesFromDOM(editor, dom)
                const root = $getRoot()
                root.clear()

                // Wrap text nodes in paragraph if needed to avoid "Only element or decorator nodes" error
                let currentParagraph: any = null

                nodes.forEach((node) => {
                    if ($isElementNode(node) || $isDecoratorNode(node)) {
                        if (currentParagraph) {
                            root.append(currentParagraph)
                            currentParagraph = null
                        }
                        root.append(node)
                    } else {
                        if (!currentParagraph) {
                            currentParagraph = $createParagraphNode()
                        }
                        currentParagraph.append(node)
                    }
                })

                if (currentParagraph) {
                    root.append(currentParagraph)
                }

                // If empty, ensure at least one paragraph
                if (root.isEmpty()) {
                    root.append($createParagraphNode())
                }
            })
        }

        if (isFirstRender) {
            if (value) {
                updateContent()
            }
            setIsFirstRender(false)
        } else {
            // Skip synchronization if we are in HTML mode to avoid messy parsing/loops while typing
            if (viewMode === 'html') return

            editor.read(() => {
                const currentHtml = $generateHtmlFromNodes(editor, null)
                // Treat undefined/null as empty string specifically for the reset case
                const expectedValue = value || ''

                // If the editor is functionally empty (just a paragraph) and we expect empty, don't update
                // (Optional optimization, but let's stick to simple comparison first)

                // We compare against expectedValue (which defaults to '')
                if (currentHtml !== expectedValue) {
                    // Special check: if expectedValue is empty string, but currentHtml is the default empty paragraph,
                    // we might not NEED to update, but updating causes no harm other than a re-render.
                    updateContent()
                }
            })
        }
    }, [editor, value, isFirstRender, viewMode])

    return null
}
