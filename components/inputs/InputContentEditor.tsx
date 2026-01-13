import { Modifier } from 'draft-js'
import dynamic from 'next/dynamic'
import { EditorProps } from 'react-draft-wysiwyg'
import { Controller, useFormContext } from 'react-hook-form'
const Editor = dynamic<EditorProps>(
    () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
    {
        ssr: false,
    }
)

const htmlToDraft =
    typeof window === 'object' && require('html-to-draftjs').default

import { InputErrorMessage } from '@components/inputs/components'
import { Typography } from '@components/Typography'
import { htmltotext } from '@utils'
import {
    ContentState,
    EditorState,
    convertFromHTML,
    convertToRaw,
} from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

// Add the utility functions here or import them
const stripBackgroundColors = (html: any) => {
    if (!html) return html

    let cleanedHtml = html.replace(/background-color:\s*[^;]+;?/gi, '')
    cleanedHtml = cleanedHtml.replace(
        /background:\s*[^;]*(?:rgb|rgba|#|hsl|hsla|[a-z]+)[^;]*;?/gi,
        ''
    )
    cleanedHtml = cleanedHtml.replace(/style="\s*"/gi, '')
    cleanedHtml = cleanedHtml.replace(/style=''\s*/gi, '')

    return cleanedHtml
}
export const draftToHtmlText = (draftText: EditorState) => {
    let content = ''
    if (draftText) {
        content = draftToHtml(convertToRaw(draftText?.getCurrentContent()))
        content = stripBackgroundColors(content)
    }
    return content
}

export const htmlToDraftText = (content: string) => {
    if (content) {
        const cleanedContent = stripBackgroundColors(content)
        const blocksFromHTML = convertFromHTML(cleanedContent)
        // const blocksFromHTML = convertFromHTML(content)

        return EditorState.createWithContent(
            ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap
            )
        )
    }
    return null
}

export const inputEditorErrorMessage = (value: EditorState) => {
    const content = draftToHtmlText(value)
    if (htmltotext(content)?.length > 1) {
        return true
    }
    return false
}

export const InputContentEditor = ({
    name,
    label,
    content,
    onChange,
    height,
    showError = true,
}: {
    name: string
    label?: string
    content?: any
    onChange?: any
    height?: string
    showError?: boolean
}) => {
    const methods = useFormContext()

    const error = methods?.formState?.errors?.[name]?.message

    // Handle paste to clean background colors
    // const handlePastedText = (
    //     text: string,
    //     html: string,
    //     editorState: EditorState,
    //     onChange: (editorState: EditorState) => void
    // ) => {
    //     if (html) {
    //         const cleanedHtml = stripBackgroundColors(html)
    //         const blocksFromHTML = convertFromHTML(cleanedHtml)
    //         const contentState = ContentState.createFromBlockArray(
    //             blocksFromHTML.contentBlocks,
    //             blocksFromHTML.entityMap
    //         )
    //         const newEditorState = EditorState.push(
    //             editorState,
    //             contentState,
    //             'insert-fragment'
    //         )
    //         onChange(newEditorState)
    //         return true // Indicate that we handled the paste
    //     }
    //     return false // Let the editor handle the paste normally
    // }
    const handlePastedText = (
        text: string,
        html: string,
        editorState: EditorState,
        onChange: (editorState: EditorState) => void
    ) => {
        if (html) {
            const cleanedHtml = stripBackgroundColors(html)
            const blocksFromHTML = convertFromHTML(cleanedHtml)
            const contentState = editorState.getCurrentContent()

            const fragment = ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap
            )

            const newContent = Modifier.replaceWithFragment(
                contentState,
                editorState.getSelection(),
                fragment.getBlockMap()
            )

            const newEditorState = EditorState.push(
                editorState,
                newContent,
                'insert-fragment'
            )

            onChange(
                EditorState.forceSelection(
                    newEditorState,
                    newContent.getSelectionAfter()
                )
            )

            return true
        }

        return false
    }

    return (
        <div className='relative z-10'>
            <Typography variant={'label'}>{label}</Typography>
            <Controller
                name={name}
                control={methods?.control}
                render={({ field }) => {
                    return (
                        <Editor
                            editorStyle={{
                                padding: '0px 10px 10px',
                                height: '200px',
                            }}
                            spellCheck
                            toolbar={{
                                options: [
                                    'inline',
                                    'blockType',
                                    'fontSize',
                                    'list',
                                    'textAlign',
                                    'history',
                                ],
                                inline: { inDropdown: true },
                                list: { inDropdown: true },
                                textAlign: { inDropdown: true },
                                link: { inDropdown: true },
                                history: { inDropdown: true },
                            }}
                            editorState={field?.value}
                            wrapperClassName={`border ${error ? 'border-error' : ''
                                } rounded-md ${height ? height : 'h-64'
                                } overflow-auto`}
                            editorClassName="!overflow-auto custom-scrollbar !h-[calc(100%-60px)]"
                            onEditorStateChange={(e: any) => {
                                field.onChange(e)
                                if (onChange) {
                                    onChange(e)
                                }
                            }}
                            handlePastedText={handlePastedText}
                        />
                    )
                }}
            />
            {showError ? <InputErrorMessage name={name} /> : null}
        </div>
    )
}
