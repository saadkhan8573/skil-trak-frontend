import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { Button } from '@components'
import { FileText, X } from 'lucide-react'

export const ViewWpRequestNoteModal = ({
    onCancel,
    note,
}: {
    note: string
    onCancel: () => void
}) => {
    return (
        <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent className="w-[95vw] sm:max-w-3xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
                <div className="bg-slate-50/50 px-5 py-3 border-b">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-blue-100 rounded-md flex items-center justify-center">
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <DialogHeader className="text-left gap-0">
                            <DialogTitle className="font-bold text-slate-900 leading-tight">
                                Termination Reason
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500">
                                The detailed reason for this request
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                </div>

                <div className="px-5">
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 relative">
                        <div className="absolute -top-2 left-3 px-1.5 py-0.5 bg-white border border-slate-100 rounded-full text-[11px] font-bold text-slate-400 uppercase tracking-wider shadow-sm">
                            Comment Details
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed italic whitespace-pre-wrap break-all">
                            "{note || 'No additional comments provided.'}"
                        </p>
                    </div>
                </div>

                <div className="px-5 py-2.5 bg-slate-50 border-t flex justify-end">
                    <Button
                        variant="primaryNew"
                        onClick={onCancel}
                        className="h-8 px-4 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-lg"
                    >
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
