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
} from 'lexical';
import React, { Suspense } from 'react';

export interface ImagePayload {
    altText: string;
    caption?: LexicalEditor;
    height?: number;
    key?: NodeKey;
    maxWidth?: number;
    showCaption?: boolean;
    src: string;
    width?: number;
    captionsEnabled?: boolean;
}

function convertImageElement(domNode: Node): null | DOMConversionOutput {
    if (domNode instanceof HTMLImageElement) {
        const { alt: altText, src, width, height } = domNode;
        const node = $createImageNode({ altText, height, src, width });
        return { node };
    }
    return null;
}

export type SerializedImageNode = Spread<
    {
        altText: string;
        caption: SerializedLexicalNode;
        height?: number;
        maxWidth: number;
        showCaption: boolean;
        src: string;
        width?: number;
    },
    SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<React.ReactNode> {
    __src: string;
    __altText: string;
    __width: 'inherit' | number;
    __height: 'inherit' | number;
    __maxWidth: number;
    __showCaption: boolean;
    __caption: LexicalEditor;
    // Captions cannot yet be used within editor cells (T60447069)
    __captionsEnabled: boolean;

    static getType(): string {
        return 'image';
    }

    createDOM(config: EditorConfig): HTMLElement {
        const span = document.createElement('span');
        const theme = config.theme;
        const className = theme.image;
        if (className !== undefined) {
            span.className = className;
        }
        return span;
    }

    updateDOM(): false {
        return false;
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
            node.__key,
        );
    }

    static importJSON(serializedNode: SerializedImageNode): ImageNode {
        const { altText, height, width, maxWidth, src, showCaption } =
            serializedNode;
        const node = $createImageNode({
            altText,
            height,
            maxWidth,
            showCaption,
            src,
            width,
        });
        return node;
    }

    exportDOM(): DOMExportOutput {
        const element = document.createElement('img');
        element.setAttribute('src', this.__src);
        element.setAttribute('alt', this.__altText);
        element.setAttribute('width', this.__width.toString());
        element.setAttribute('height', this.__height.toString());
        return { element };
    }

    static importDOM(): DOMConversionMap | null {
        return {
            img: (node: Node) => ({
                conversion: convertImageElement,
                priority: 0,
            }),
        };
    }

    constructor(
        src: string,
        altText: string,
        maxWidth: number,
        width?: 'inherit' | number,
        height?: 'inherit' | number,
        showCaption?: boolean,
        caption?: LexicalEditor,
        captionsEnabled?: boolean,
        key?: NodeKey,
    ) {
        super(key);
        this.__src = src;
        this.__altText = altText;
        this.__maxWidth = maxWidth;
        this.__width = width || 'inherit';
        this.__height = height || 'inherit';
        this.__showCaption = showCaption || false;
        this.__caption = caption || ({} as LexicalEditor); // Simplified for now
        this.__captionsEnabled = captionsEnabled || false;
    }

    exportJSON(): SerializedImageNode {
        return {
            altText: this.getAltText(),
            caption: this.__caption.toJSON ? this.__caption.toJSON() : ({} as any),
            height: this.__height === 'inherit' ? 0 : this.__height,
            maxWidth: this.__maxWidth,
            showCaption: this.__showCaption,
            src: this.getSrc(),
            type: 'image',
            version: 1,
            width: this.__width === 'inherit' ? 0 : this.__width,
        };
    }

    setWidthAndHeight(
        width: 'inherit' | number,
        height: 'inherit' | number,
    ): void {
        const writable = this.getWritable();
        writable.__width = width;
        writable.__height = height;
    }

    setShowCaption(showCaption: boolean): void {
        const writable = this.getWritable();
        writable.__showCaption = showCaption;
    }

    getSrc(): string {
        return this.__src;
    }

    getAltText(): string {
        return this.__altText;
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
                />
            </Suspense>
        );
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
        key,
    );
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
    return node instanceof ImageNode;
}

// Simple Image Component for now
function ImageComponent({ src, altText, width, height, maxWidth }: any) {
    const isUploading = src.startsWith('data:') || src.startsWith('blob:');

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
                src={src}
                alt={altText}
                style={{
                    maxWidth: '100%',
                    width: width === 'inherit' ? 'auto' : width,
                    height: height === 'inherit' ? 'auto' : height,
                    opacity: isUploading ? 0.5 : 1,
                }}
            />
            {isUploading && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px'
                }}>
                    Uploading...
                </div>
            )}
        </div>
    );
}
