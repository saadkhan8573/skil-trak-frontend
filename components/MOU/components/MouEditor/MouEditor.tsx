import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@components'

const RichTextEditor = dynamic<any>(
    () => import('@components/inputs/RichTextEditor/RichTextEditor').then((mod) => mod.RichTextEditor),
    {
        ssr: false,
        loading: () => (
            <div className="h-80 w-full bg-gray-50 animate-pulse rounded-md border" />
        ),
    }
)

export const MouEditor = ({
    content,
    saveContent,
    setEditMou,
    setSaveContentButton,
}: any) => {
    const [htmlContent, setHtmlContent] = useState(content || '')

    useEffect(() => {
        if (setSaveContentButton) {
            setSaveContentButton(
                <>
                    <Button
                        onClick={() => {
                            saveContent(htmlContent)
                            setEditMou(false)
                        }}
                        text={'Save'}
                    />
                </>
            )
        }
    }, [
        htmlContent,
        setEditMou,
        saveContent,
        setSaveContentButton,
    ])

    return (
        <div className="bg-white">
            <RichTextEditor
                value={htmlContent}
                onChange={(value: string) => setHtmlContent(value)}
                height="h-80"
            />
        </div>
    )
}
