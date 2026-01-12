import { Button } from '@components'
import { Download, Eye } from 'lucide-react'
import { useState } from 'react'
import { ViewDocumentModal } from './modals'

interface FacilityChecklistActionsProps {
    fileUrl: string
}

export function FacilityChecklistActions({
    fileUrl,
}: FacilityChecklistActionsProps) {

    const [open, setOpen] = useState(false)

    const handleView = (e: React.MouseEvent) => {
        e.stopPropagation()
        setOpen(true)
    }

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation()
        // Create a link element/click it to trigger download or open in new tab
        window.open(fileUrl, '_blank')
    }

    return (
        <>
            <div className="flex items-center gap-2">
                <Button
                    variant="primaryNew"
                    outline
                    className="text-xs h-8 gap-2"
                    onClick={handleView}
                >
                    <Eye className="w-3 h-3" />
                    View Checklist
                </Button>
                <Button
                    variant="primaryNew"
                    outline
                    className="text-xs h-8 gap-2"
                    onClick={handleDownload}
                >
                    <Download className="w-3 h-3" />
                    Download PDF
                </Button>
            </div>
            <ViewDocumentModal
                open={open}
                fileUrl={fileUrl}
                onOpenChange={setOpen}
            />
        </>
    )
}
