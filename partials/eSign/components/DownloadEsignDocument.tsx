import { Button } from '@components'
import { isBrowser } from '@utils'
import { ArrowDown } from 'lucide-react'
import { useRouter } from 'next/router'

const VariantOptions = [
    'primary',
    'secondary',
    'info',
    'error',
    'action',
    'dark',
    'success',
    'primaryNew',
] as const

export const DownloadEsignDocument = ({
    text,
    docId,
    variant,
}: {
    text?: string
    docId?: number
    variant?: (typeof VariantOptions)[number]
}) => {
    const router = useRouter()

    return (
        <Button
            variant={variant || 'dark'}
            text={text || 'Download Documnet'}
            Icon={ArrowDown}
            onClick={() => {
                if (isBrowser()) {
                    window.open(
                        `${process.env.NEXT_PUBLIC_END_POINT
                        }/esign/document/${docId || router.query?.id
                        }/download`
                    )
                }
            }}
        />
    )
}
