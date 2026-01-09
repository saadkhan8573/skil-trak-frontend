import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { LoogbookEditor } from '@components'

interface EditDocumentModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    file: any
}

export function EditDocumentModal({
    open,
    onOpenChange,
    file,
}: EditDocumentModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-[90vw] !w-full !max-h-[95vh] !h-fit !p-0 !overflow-hidden !bg-white !rounded-2xl !border-none !shadow-2xl">
                <div className="flex flex-col h-full overflow-hidden">
                    {/* Header is inside LoogbookEditor, so we focus on the container */}
                    <div className="!w-full overflow-hidden">
                        <LoogbookEditor
                            file={file}
                            onCancel={() => onOpenChange(false)}
                            hideCancelButton={true}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
