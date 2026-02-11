import { InputRichTextEditor } from '@components'
import { Typography } from '@components/Typography'

export const BulkEmailEditor = ({
    name,
    label,
    content,
}: {
    name: string
    label?: string
    content?: any
}) => {
    return (
        <div>
            <InputRichTextEditor
                name={name}
                label={label}
                height="h-64"
            />
        </div>
    )
}
