'use client'

import {
    DecoratorNode,
    DOMConversionMap,
    DOMConversionOutput,
    DOMExportOutput,
    EditorConfig,
    LexicalEditor,
    LexicalNode,
    NodeKey,
    SerializedLexicalNode,
    Spread,
    CLICK_COMMAND,
    COMMAND_PRIORITY_LOW,
    $getNodeByKey,
} from 'lexical'
import React, {
    Suspense,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { mergeRegister } from '@lexical/utils'
import {
    AlignLeft,
    AlignCenter,
    AlignRight,
    Upload,
    RefreshCw,
    Type,
    Check,
    X,
} from 'lucide-react'
import { AdminApi } from '@queries'
import { useNotification } from '@hooks'
import { isServerImageUrl } from '../constants'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../ui/tooltip'

export type ImageAlignment = 'left' | 'right' | 'center' | 'full' | undefined

export interface ImagePayload {
    altText: string
    caption?: LexicalEditor
    height?: number | string
    key?: NodeKey
    maxWidth?: number
    showCaption?: boolean
    src: string
    width?: number | string
    captionsEnabled?: boolean
    alignment?: ImageAlignment
}

function convertImageElement(domNode: Node): null | DOMConversionOutput {
    if (domNode instanceof HTMLImageElement) {
        const { alt: altText, src, width, height } = domNode
        const node = $createImageNode({ altText, height, src, width })
        return { node }
    }
    return null
}

export type SerializedImageNode = Spread<
    {
        altText: string
        caption: SerializedLexicalNode
        height?: number | string
        maxWidth: number
        showCaption: boolean
        src: string
        width?: number | string
        alignment?: ImageAlignment
    },
    SerializedLexicalNode
>

export function $isImageNode(
    node: LexicalNode | null | undefined
): node is ImageNode {
    return node instanceof ImageNode
}

// Enhanced Image Component with selection and alignment
function ImageComponent({
    src,
    altText,
    width,
    height,
    maxWidth,
    nodeKey,
    alignment,
}: any) {
    const [editor] = useLexicalComposerContext()
    const [isSelected, setSelected, clearSelection] =
        useLexicalNodeSelection(nodeKey)
    const [isHovered, setIsHovered] = useState(false)
    const [isEditingAlt, setIsEditingAlt] = useState(false)
    const [tempAltText, setTempAltText] = useState(altText)
    const imageRef = useRef<HTMLImageElement | null>(null)
    const [uploadImage, { isLoading: isUploadingToServer }] =
        AdminApi.Blogs.uploadImage()
    const {
        notification: { success, error },
    } = useNotification()

    const isUploading = src.startsWith('data:') || src.startsWith('blob:')
    const isExternal = !isServerImageUrl(src) && !isUploading

    const onAlignmentChange = useCallback(
        (newAlignment: ImageAlignment) => {
            editor.update(() => {
                const node = $getNodeByKey(nodeKey)
                if ($isImageNode(node)) {
                    node.setAlignment(newAlignment)
                }
            })
        },
        [editor, nodeKey]
    )

    const onResize = useCallback(
        (newWidth: string) => {
            editor.update(() => {
                const node = $getNodeByKey(nodeKey)
                if ($isImageNode(node)) {
                    node.setWidthAndHeight(newWidth, 'auto' as any)
                }
            })
        },
        [editor, nodeKey]
    )

    const onUploadToServer = useCallback(async () => {
        let fileToUpload: File | null = null

        // Phase 1: Try Direct Fetch (CORS)
        try {
            const response = await fetch(src, { mode: 'cors' })
            if (response.ok) {
                const blob = await response.blob()
                fileToUpload = blobToFile(blob, src)
            }
        } catch (err) {
            console.warn(
                'ImageNode: ⚠️ Phase 1 (Direct Fetch) failed due to CORS.'
            )
        }

        // Phase 2: Deep Fallback - Transient CORS Test
        // We create a NEW image object to test CORS without breaking the main preview
        if (!fileToUpload) {
            console.warn(
                'ImageNode: 🔄 Trying Phase 2 (Transient CORS Test)...'
            )
            try {
                const testImg = new Image()
                testImg.crossOrigin = 'anonymous' // Test if they allow CORS
                testImg.src = src

                await new Promise((resolve, reject) => {
                    testImg.onload = resolve
                    testImg.onerror = () =>
                        reject(new Error('CORS blocked or Load failed'))
                    // Timeout after 5s
                    setTimeout(() => reject(new Error('Timeout')), 5000)
                })

                const canvas = document.createElement('canvas')
                canvas.width = testImg.naturalWidth
                canvas.height = testImg.naturalHeight
                const ctx = canvas.getContext('2d')

                if (ctx) {
                    ctx.drawImage(testImg, 0, 0)
                    const blob = await new Promise<Blob | null>((resolve) => {
                        try {
                            canvas.toBlob(resolve, 'image/png')
                        } catch (e) {
                            resolve(null) // Tainted canvas
                        }
                    })

                    if (blob) {
                        fileToUpload = blobToFile(blob, src)
                    }
                }
            } catch (canvasErr) {
                console.warn(
                    'ImageNode: ⚠️ Phase 2 (Direct Capture) failed. Source does not allow mirroring.',
                    canvasErr
                )
            }
        }

        // Phase 3: Deep Proxy Fallback (Server-Side Fetch)
        if (!fileToUpload) {
            try {
                // Use our new local proxy
                const response = await fetch(
                    `/api/proxy-image?url=${encodeURIComponent(src)}`
                )
                if (response.ok) {
                    const blob = await response.blob()
                    fileToUpload = blobToFile(blob, src)
                } else {
                    console.warn(
                        'ImageNode: ⚠️ Phase 3 (Proxy) failed.',
                        response.statusText
                    )
                }
            } catch (proxyErr) {
                console.warn('ImageNode: ⚠️ Phase 3 (Proxy) failed.', proxyErr)
            }
        }

        // Phase 4: Ultimate Fallback - Manual Modal (if everything else failed)
        if (!fileToUpload) {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = 'image/*'
            input.onchange = async () => {
                const f = input.files?.[0] || null
                if (f) {
                    await proceed(f)
                }
            }
            input.click()
            return
        }

        // Proceed with upload for whichever file we got
        await proceed(fileToUpload)

        function blobToFile(blob: Blob, url: string): File {
            const inferredExt = blob.type.split('/')[1] || 'png'
            const fileNameFromUrl = (url.split('/').pop() || 'image')
                .split('?')[0]
                .split('#')[0]
            const safeName = fileNameFromUrl.includes('.')
                ? fileNameFromUrl
                : `${fileNameFromUrl}.${inferredExt}`
            return new File([blob], safeName, {
                type: blob.type || 'image/png',
            })
        }

        async function proceed(file: File) {
            if (file.size > 5 * 1024 * 1024) {
                error({
                    title: 'Image size must be less than 5MB',
                    description: 'Please upload an image smaller than 5MB',
                })
                return
            }

            const formData = new FormData()
            formData.append('file', file)

            try {
                const res: any = await uploadImage(formData)
                if (res?.data?.url) {
                    editor.update(() => {
                        const node = $getNodeByKey(nodeKey)
                        if ($isImageNode(node)) {
                            node.setSrc(res.data.url)
                        }
                    })
                    success({
                        title: 'Image uploaded successfully',
                        description: 'The image has been uploaded successfully',
                    })
                }
            } catch (e) {
                console.error('Upload failed', e)
                error({
                    title: 'Image upload failed',
                    description: 'The image has not been uploaded',
                })
            }
        }
    }, [src, nodeKey, editor, uploadImage])

    const onAltTextChange = useCallback(
        (text: string) => {
            editor.update(() => {
                const node = $getNodeByKey(nodeKey)
                if ($isImageNode(node)) {
                    node.setAltText(text)
                }
            })
        },
        [editor, nodeKey]
    )

    const handleAltSubmit = (e: React.MouseEvent) => {
        e.stopPropagation()
        onAltTextChange(tempAltText)
        setIsEditingAlt(false)
    }

    const handleAltCancel = (e: React.MouseEvent) => {
        e.stopPropagation()
        setTempAltText(altText)
        setIsEditingAlt(false)
    }

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(
                CLICK_COMMAND,
                (payload) => {
                    const event = payload
                    if (event.target === imageRef.current) {
                        if (!event.shiftKey) {
                            clearSelection()
                        }
                        setSelected(!isSelected)
                        return true
                    }
                    return false
                },
                COMMAND_PRIORITY_LOW
            )
        )
    }, [editor, isSelected, nodeKey, setSelected, clearSelection])

    const getAlignmentStyles = () => {
        switch (alignment) {
            case 'left':
                return {
                    float: 'left' as const,
                    marginRight: '20px',
                    marginBottom: '10px',
                }
            case 'right':
                return {
                    float: 'right' as const,
                    marginLeft: '20px',
                    marginBottom: '10px',
                }
            case 'center':
                return {
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginBottom: '10px',
                }
            case 'full':
                return { display: 'block', width: '100%', marginBottom: '10px' }
            default:
                return {
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginBottom: '10px',
                }
        }
    }

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: 'relative',
                display:
                    alignment === 'center' ||
                    alignment === 'full' ||
                    (typeof width === 'string' && width.endsWith('%'))
                        ? 'block'
                        : 'inline-block',
                clear: 'both',
                width:
                    typeof width === 'string' && width.endsWith('%')
                        ? width
                        : 'auto',
                ...getAlignmentStyles(),
            }}
        >
            <div
                style={{
                    position: 'relative',
                    outline: isSelected ? '3px solid #3b82f6' : 'none',
                    borderRadius: '4px',
                    transition: 'outline 0.2s',
                    lineHeight: 0,
                }}
            >
                <img
                    ref={imageRef}
                    src={src}
                    alt={altText}
                    style={{
                        maxWidth: '100%',
                        width: width === 'inherit' ? 'auto' : width,
                        height: height === 'inherit' ? 'auto' : height,
                        opacity: isUploading ? 0.5 : 1,
                        cursor: 'pointer',
                        display: 'block',
                    }}
                />

                {isSelected && !isUploading && isEditingAlt && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-xl p-1 flex items-center gap-1 z-20 animate-in fade-in zoom-in duration-200 whitespace-nowrap min-w-max">
                        <input
                            type="text"
                            value={tempAltText}
                            onChange={(e) => setTempAltText(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs border rounded px-2 py-1 outline-none focus:border-blue-500 min-w-37.5"
                            placeholder="Alt text"
                            autoFocus
                        />
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={handleAltSubmit}
                                    className="p-1.5 rounded hover:bg-green-100 text-green-600 transition-colors"
                                >
                                    <Check size={14} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Save Alt Text</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={handleAltCancel}
                                    className="p-1.5 rounded hover:bg-red-100 text-red-600 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Cancel</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                )}

                {isSelected && !isUploading && !isEditingAlt && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-xl p-1 flex items-center gap-1 z-20 animate-in fade-in zoom-in duration-200 whitespace-nowrap min-w-max">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onAlignmentChange('left')
                                    }}
                                    className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${alignment === 'left' ? 'text-primary bg-primary/10' : 'text-gray-600'}`}
                                >
                                    <AlignLeft size={16} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Align Left</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onAlignmentChange('center')
                                    }}
                                    className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${alignment === 'center' ? 'text-primary bg-primary/10' : 'text-gray-600'}`}
                                >
                                    <AlignCenter size={16} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Align Center</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onAlignmentChange('right')
                                    }}
                                    className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${alignment === 'right' ? 'text-primary bg-primary/10' : 'text-gray-600'}`}
                                >
                                    <AlignRight size={16} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Align Right</p>
                            </TooltipContent>
                        </Tooltip>
                        <div className="w-px h-6 bg-gray-200 mx-0.5" />
                        <div className="flex items-center gap-0.5 px-0.5">
                            {(['25%', '50%', '75%', '100%'] as const).map(
                                (size) => (
                                    <button
                                        key={size}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onResize(size)
                                        }}
                                        className={`px-1.5 py-1 rounded text-[10px] font-bold transition-colors hover:bg-gray-100 ${width === size ? 'text-primary bg-primary/10' : 'text-gray-500'}`}
                                    >
                                        {size}
                                    </button>
                                )
                            )}
                        </div>

                        <div className="w-px h-6 bg-gray-200 mx-0.5" />
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setTempAltText(altText)
                                        setIsEditingAlt(true)
                                    }}
                                    className={`p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-600`}
                                >
                                    <Type size={16} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Edit Alt Text</p>
                            </TooltipContent>
                        </Tooltip>

                        {isExternal && (
                            <>
                                <div className="w-px h-6 bg-gray-200 mx-0.5" />
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onUploadToServer()
                                            }}
                                            className={`p-1.5 rounded transition-colors flex items-center gap-1 px-2 mx-1 shadow-sm ${isUploadingToServer ? 'bg-gray-100 text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                            disabled={isUploadingToServer}
                                        >
                                            {isUploadingToServer ? (
                                                <RefreshCw
                                                    size={14}
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                <Upload size={14} />
                                            )}
                                            <span className="text-[10px] font-bold">
                                                {isUploadingToServer
                                                    ? 'Uploading...'
                                                    : 'Upload to Server'}
                                            </span>
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>
                                            Upload this external image to your
                                            server
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </>
                        )}
                    </div>
                )}
            </div>

            {isUploading && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        zIndex: 10,
                    }}
                >
                    Uploading...
                </div>
            )}
        </div>
    )
}

export class ImageNode extends DecoratorNode<React.ReactNode> {
    __src: string
    __altText: string
    __width: 'inherit' | number | string
    __height: 'inherit' | number | string
    __maxWidth: number
    __showCaption: boolean
    __caption: LexicalEditor
    __alignment: ImageAlignment
    // Captions cannot yet be used within editor cells (T60447069)
    __captionsEnabled: boolean

    static getType(): string {
        return 'image'
    }

    createDOM(config: EditorConfig): HTMLElement {
        const span = document.createElement('span')
        const theme = config.theme
        const className = theme.image
        if (className !== undefined) {
            span.className = className
        }
        return span
    }

    updateDOM(): false {
        return false
    }

    static clone(node: ImageNode): ImageNode {
        return new ImageNode(
            node.__src,
            node.__altText,
            node.__maxWidth,
            node.__width,
            node.__height,
            node.__showCaption,
            node.__caption,
            node.__captionsEnabled,
            node.__alignment,
            node.__key
        )
    }

    static importJSON(serializedNode: SerializedImageNode): ImageNode {
        const {
            altText,
            height,
            width,
            maxWidth,
            src,
            showCaption,
            alignment,
        } = serializedNode
        const node = $createImageNode({
            altText,
            height,
            maxWidth,
            showCaption,
            src,
            width,
            alignment,
        })
        return node
    }

    exportDOM(): DOMExportOutput {
        const element = document.createElement('img')
        element.setAttribute('src', this.__src)
        element.setAttribute('alt', this.__altText)

        // Handle width and height
        const width = this.__width
        const height = this.__height

        if (typeof width === 'number') {
            element.setAttribute('width', width.toString())
        } else if (typeof width === 'string') {
            element.style.width = width
        }

        if (typeof height === 'number') {
            element.setAttribute('height', height.toString())
        } else if (typeof height === 'string' && height !== 'inherit') {
            element.style.height = height
        }

        // Handle alignment styles
        const alignment = this.__alignment
        if (alignment === 'left') {
            element.style.float = 'left'
            element.style.marginRight = '20px'
            element.style.marginBottom = '10px'
        } else if (alignment === 'right') {
            element.style.float = 'right'
            element.style.marginLeft = '20px'
            element.style.marginBottom = '10px'
        } else if (alignment === 'center') {
            element.style.display = 'block'
            element.style.marginLeft = 'auto'
            element.style.marginRight = 'auto'
            element.style.marginBottom = '10px'
        } else if (alignment === 'full') {
            element.style.display = 'block'
            element.style.width = '100%'
            element.style.marginBottom = '10px'
        }

        return { element }
    }

    static importDOM(): DOMConversionMap | null {
        return {
            img: (node: Node) => ({
                conversion: convertImageElement,
                priority: 0,
            }),
        }
    }

    constructor(
        src: string,
        altText: string,
        maxWidth: number,
        width?: 'inherit' | number | string,
        height?: 'inherit' | number | string,
        showCaption?: boolean,
        caption?: LexicalEditor,
        captionsEnabled?: boolean,
        alignment?: ImageAlignment,
        key?: NodeKey
    ) {
        super(key)
        this.__src = src
        this.__altText = altText
        this.__maxWidth = maxWidth
        this.__width = width || 'inherit'
        this.__height = height || 'inherit'
        this.__showCaption = showCaption || false
        this.__caption = caption || ({} as LexicalEditor) // Simplified for now
        this.__captionsEnabled = captionsEnabled || false
        this.__alignment = alignment || 'center'
    }

    exportJSON(): SerializedImageNode {
        return {
            altText: this.getAltText(),
            caption: this.__caption.toJSON
                ? this.__caption.toJSON()
                : ({} as any),
            height: this.__height === 'inherit' ? 0 : (this.__height as any),
            maxWidth: this.__maxWidth,
            showCaption: this.__showCaption,
            src: this.getSrc(),
            type: 'image',
            version: 1,
            width: this.__width === 'inherit' ? 0 : (this.__width as any),
            alignment: this.__alignment,
        }
    }

    setWidthAndHeight(
        width: 'inherit' | number | string,
        height: 'inherit' | number | string
    ): void {
        const writable = this.getWritable()
        writable.__width = width
        writable.__height = height
    }

    setShowCaption(showCaption: boolean): void {
        const writable = this.getWritable()
        writable.__showCaption = showCaption
    }

    setAlignment(alignment: ImageAlignment): void {
        const writable = this.getWritable()
        writable.__alignment = alignment
    }

    setSrc(src: string): void {
        const writable = this.getWritable()
        writable.__src = src
    }

    getSrc(): string {
        return this.__src
    }

    setAltText(altText: string): void {
        const writable = this.getWritable()
        writable.__altText = altText
    }

    getAltText(): string {
        return this.__altText
    }

    decorate(): React.ReactNode {
        return (
            <Suspense fallback={null}>
                <ImageComponent
                    src={this.__src}
                    altText={this.__altText}
                    width={this.__width}
                    height={this.__height}
                    maxWidth={this.__maxWidth}
                    nodeKey={this.getKey()}
                    showCaption={this.__showCaption}
                    caption={this.__caption}
                    captionsEnabled={this.__captionsEnabled}
                    alignment={this.__alignment}
                />
            </Suspense>
        )
    }
}

export function $createImageNode({
    altText,
    height,
    maxWidth = 500,
    captionsEnabled,
    src,
    width,
    showCaption,
    caption,
    alignment,
    key,
}: ImagePayload): ImageNode {
    return new ImageNode(
        src,
        altText,
        maxWidth,
        width,
        height,
        showCaption,
        caption,
        captionsEnabled,
        alignment,
        key
    )
}
