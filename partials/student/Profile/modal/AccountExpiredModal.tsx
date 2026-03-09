import { Dialog, DialogContent, DialogDescription } from '@components/ui/dialog'
import { AlertTriangle } from 'lucide-react'

interface AccountExpiredModalProps {
    open: boolean
}

export function AccountExpiredModal({ open }: AccountExpiredModalProps) {
    return (
        <Dialog open={open}>
            <DialogContent
                className="sm:max-w-md! p-0 overflow-hidden"
                showCloseButton={false}
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <div className="bg-red-500 flex items-center gap-3 px-5 py-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/15 border border-white/25 shrink-0">
                        <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-sm font-semibold text-white leading-snug">
                        Your SkilTrak Account Has Expired
                    </h2>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                    <DialogDescription className="text-sm text-slate-500 leading-relaxed text-center">
                        Your SkilTrak account is currently inactive because your
                        enrollment has expired or been archived. Please contact
                        your Registered Training Organisation (RTO) for further
                        assistance.
                    </DialogDescription>
                </div>
            </DialogContent>
        </Dialog>
    )
}
