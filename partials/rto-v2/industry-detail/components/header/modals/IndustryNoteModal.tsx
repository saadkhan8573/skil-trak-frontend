import { CreateNote } from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { ScrollArea } from '@components/ui/scroll-area'
import { UserCog } from 'lucide-react'

interface IndustryNoteModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    industryUserId: number
}

export function IndustryNoteModal({
    open,
    industryUserId,
    onOpenChange,
}: IndustryNoteModalProps) {
    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="gap-0! space-y-0! max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-0 [&>button]:text-white">
                    <DialogHeader className="bg-linear-to-r from-[#044866] to-[#0D5468] px-4 py-3">
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                                <UserCog className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-white font-bold">
                                    Add Note
                                </DialogTitle>
                            </div>
                        </div>
                    </DialogHeader>

                    <DialogDescription>
                        <ScrollArea className="max-h-[80vh] overflow-auto custom-scrollbar">
                            <CreateNote
                                onCancel={onOpenChange}
                                receiverId={industryUserId}
                            />
                        </ScrollArea>
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        </>
    )
}
