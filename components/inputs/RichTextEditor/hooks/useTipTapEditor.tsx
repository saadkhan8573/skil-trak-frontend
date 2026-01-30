import { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import type { Editor } from '@tiptap/react'

interface UseTipTapEditorOptions {
    value?: string
    placeholder?: string
    onChange?: (html: string) => void
    onUpdate?: (editor: any) => void
    className?: string
    onPaste?: (view: any, event: ClipboardEvent) => boolean
}

export const useTipTapEditor = (options: UseTipTapEditorOptions) => {
    const [extensions, setExtensions] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isClient, setIsClient] = useState(false)

    // Detect client-side to avoid SSR issues
    useEffect(() => {
        setIsClient(true)
    }, [])

    // Load all TipTap extensions dynamically (the heavy parts ~490KB)
    useEffect(() => {
        if (!isClient) return

        let isMounted = true

        const loadExtensions = async () => {
            try {
                // Dynamically import only the extensions, not the core hooks
                const [
                    { default: StarterKit },
                    { default: Underline },
                    { default: Link },
                    { default: TextAlign },
                    { default: Highlight },
                    { default: Placeholder },
                    { loadCustomImage },
                ] = await Promise.all([
                    import('@tiptap/starter-kit'),
                    import('@tiptap/extension-underline'),
                    import('@tiptap/extension-link'),
                    import('@tiptap/extension-text-align'),
                    import('@tiptap/extension-highlight'),
                    import('@tiptap/extension-placeholder'),
                    import('../extensions/CustomImage'),
                ])

                if (!isMounted) return

                // Load custom image extension
                const CustomImage = await loadCustomImage()

                if (isMounted) {
                    setExtensions([
                        StarterKit,
                        Underline,
                        Link.configure({
                            openOnClick: false,
                            HTMLAttributes: {
                                class: 'text-primaryNew underline decoration-primaryNew underline-offset-4 cursor-pointer',
                            },
                        }),
                        CustomImage.configure({
                            HTMLAttributes: {
                                class: 'rounded-md max-w-full h-auto cursor-pointer',
                            },
                        }),
                        TextAlign.configure({
                            types: ['heading', 'paragraph'],
                        }),
                        Highlight.configure({
                            multicolor: true,
                        }),
                        Placeholder.configure({
                            placeholder:
                                options.placeholder ||
                                'Write something amazing...',
                        }),
                    ])
                    setIsLoading(false)
                }
            } catch (error) {
                console.error('Failed to load TipTap extensions:', error)
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        loadExtensions()

        return () => {
            isMounted = false
        }
    }, [isClient, options.placeholder])

    // Initialize editor with extensions - useEditor is called at top level
    // Provide minimal valid config until extensions load to avoid schema errors
    const editor = useEditor(
        {
            extensions: extensions.length > 0 ? extensions : [],
            content: extensions.length > 0 ? options.value : '',
            immediatelyRender: false,
            editable: extensions.length > 0,
            onUpdate: extensions.length > 0
                ? ({ editor }) => {
                    options.onChange?.(editor.getHTML())
                    options.onUpdate?.(editor)
                }
                : undefined,
            editorProps: {
                attributes: {
                    class: options.className || '',
                },
                handlePaste: options.onPaste || (() => false),
            },
        },
        [extensions]
    )

    // Update content when value changes
    useEffect(() => {
        if (
            editor &&
            extensions.length > 0 &&
            options.value !== undefined &&
            options.value !== editor.getHTML()
        ) {
            editor.commands.setContent(options.value || '')
        }
    }, [options.value, editor, extensions.length])

    return {
        editor: extensions.length > 0 ? editor : null,
        isLoading: isLoading || !isClient,
        EditorContent
    }
}
