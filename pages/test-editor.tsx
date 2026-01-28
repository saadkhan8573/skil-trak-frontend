import React, { useEffect } from 'react'
import { RichTextEditor } from '@components/inputs/RichTextEditor'
import { AdminLayout } from '@layouts'
import { ReactElement, useState } from 'react'

const TestEditorPage = () => {
    const [content, setContent] = useState('<h1>Hello Shadcn Editor!</h1><p>This is a <strong>full functional</strong> editor with TipTap.</p>')

    const [mount, setMount] = useState(false)

    useEffect(() => {
        if (!mount) {
            setMount(true)
        }
    }, [mount])

    if (!mount) {
        return <></>
    }


    return (
        <div className="p-10 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Editor Preview</h1>

            <RichTextEditor
                label="Content Editor"
                value={content}
                onChange={setContent}
                placeholder="Type your content here..."
            />

            <div className="mt-10 p-4 border rounded bg-muted/20">
                <h2 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">HTML Output</h2>
                <pre dangerouslySetInnerHTML={{
                    __html: content
                }} className="break-all text-xs bg-muted p-4 rounded overflow-auto border">
                </pre>
                <span className='break-all'>{content}</span>
            </div>
        </div>
    )
}



export default TestEditorPage
