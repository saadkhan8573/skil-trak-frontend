// Dynamic loader for CustomImage extension
export const loadCustomImage = async () => {
    const { default: Image } = await import('@tiptap/extension-image')

    return Image.extend({
        selectable: true,
        draggable: true,

        addAttributes() {
            return {
                ...this.parent?.(),
                width: {
                    default: '100%',
                    renderHTML: (attributes) => ({
                        width: attributes.width,
                    }),
                },
                alignment: {
                    default: 'center',
                    renderHTML: (attributes) => ({
                        alignment: attributes.alignment,
                    }),
                },
                autoUploadAttempted: {
                    default: false,
                    parseHTML: (element) =>
                        element.hasAttribute('data-auto-upload-attempted'),
                    renderHTML: (attributes) => {
                        if (attributes.autoUploadAttempted) {
                            return { 'data-auto-upload-attempted': 'true' }
                        }
                        return {}
                    },
                },
            }
        },

        renderHTML({ HTMLAttributes }) {
            const { width, alignment, autoUploadAttempted, ...rest } =
                HTMLAttributes
            const style = [
                `width: ${width || '100%'}`,
                'height: auto',
                'display: block',
                'margin-bottom: 1rem',
                'cursor: pointer',
            ]

            if (alignment === 'center') {
                style.push('margin-left: auto', 'margin-right: auto')
            } else if (alignment === 'left') {
                style.push('float: left', 'margin-right: 1.5rem')
            } else if (alignment === 'right') {
                style.push('float: right', 'margin-left: 1.5rem')
            }

            return ['img', { ...rest, style: style.join('; ') }]
        },

        addKeyboardShortcuts() {
            return {
                Enter: () => {
                    const { state } = this.editor
                    const { selection } = state
                    const isImageSelected =
                        selection &&
                        (selection as any).node &&
                        (selection as any).node.type.name === 'image'

                    if (isImageSelected) {
                        return this.editor.commands.createParagraphNear()
                    }
                    return false
                },
            }
        },
    })
}
