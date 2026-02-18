import dynamic from 'next/dynamic'

type PdfWrapperProps = {
    file: string
    width?: number
}

// Dynamically import the actual PDF component with SSR disabled
// This prevents react-pdf (and pdfjs-dist) from being loaded in Node.js
// during build, which would cause "DOMMatrix is not defined" errors.
const PdfWrapperClient = dynamic<PdfWrapperProps>(
    () =>
        import('./PdfWrapperClient').then((mod) => ({
            default: mod.PdfWrapper,
        })),
    { ssr: false }
)

export const PdfWrapper = ({ file, width }: PdfWrapperProps) => {
    return <PdfWrapperClient file={file} width={width} />
}
