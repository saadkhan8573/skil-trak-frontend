import { Modal, ShowErrorNotifications } from '@components'
import dynamic from 'next/dynamic'

const RichTextEditor = dynamic<any>(
    () =>
        import('@components/inputs/RichTextEditor/RichTextEditor').then(
            (mod) => mod.RichTextEditor
        ),
    {
        ssr: false,
        loading: () => (
            <div className="h-60 w-full bg-gray-50 animate-pulse rounded-md border" />
        ),
    }
)
import React, { ReactElement, useEffect, useState } from 'react'

// queries
import { AdminApi } from '@queries'
import { useNotification } from '@hooks'
import { useEditor } from '../hooks'

export const EditorModal = ({
    item,
    loading,
    onCancel,
    onAddDocument,
}: {
    item: any
    loading: boolean
    onCancel: () => void
    onAddDocument: (val: any) => void
}) => {
    const [content, setContent] = useState('')

    const { notification } = useNotification()

    useEffect(() => {
        if (item?.content) {
            setContent(item?.content)
        }
    }, [item])

    const onConfirmClick = () => {
        const formData = new FormData()

        formData.append('content', content),
            formData.append('for', item.role),
            formData.append('fileType', item.type),
            formData.append('docType', item.docType),
            onAddDocument(formData)
        // addDocument(formData)
    }

    return (
        <div>
            <Modal
                title={'Add Content'}
                subtitle={'Add Content'}
                onCancelClick={onCancel}
                loading={loading}
                onConfirmClick={onConfirmClick}
            >
                <div className="max-w-[70vw]">
                    <RichTextEditor
                        value={content}
                        onChange={(value: string) => setContent(value)}
                    />
                </div>
            </Modal>
        </div>
    )
}
