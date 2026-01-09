import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { CommonApi } from '@queries'
import { useNotification } from '@hooks'
import { Button, ShowErrorNotifications } from '@components'
import { AlertCircle, Send } from 'lucide-react'

interface ConfirmBulkInitiateModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    industryUserId: number
    templateIds: number[]
}

export function ConfirmBulkInitiateModal({
    open,
    onOpenChange,
    industryUserId,
    templateIds,
}: ConfirmBulkInitiateModalProps) {
    const { notification } = useNotification()
    const [bulkInitiate, bulkInitiateResult] = CommonApi.ESign.bulkInitiateIndustryESign()

    const onConfirm = async () => {
        if (!templateIds.length) return

        try {
            const res: any = await bulkInitiate({
                industryUserId,
                templateIds,
            }).unwrap()

            if (res) {
                notification.success({
                    title: 'Bulk Esign Initiated',
                    description: `${templateIds.length} Esign(s) Initiated Successfully`,
                })
                onOpenChange(false)
            }
        } catch (error) {
            // Error handled by ShowErrorNotifications
        }
    }

    const count = templateIds.length
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] overflow-hidden rounded-2xl border-none p-0 shadow-2xl">
                <ShowErrorNotifications result={bulkInitiateResult} />
                <div className="bg-amber-50 p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-slate-800">
                                Confirm Bulk Send
                            </DialogTitle>
                        </DialogHeader>
                    </div>
                </div>

                <div className="p-6">
                    <DialogDescription className="text-slate-600 text-sm leading-relaxed">
                        You are about to initiate <span className="font-bold text-[#044866]">{count}</span> e-sign {count === 1 ? 'document' : 'documents'}.
                        This will send automated email notifications to the assigned signers.
                        Are you sure you want to proceed?
                    </DialogDescription>
                </div>

                <DialogFooter className="p-6 bg-slate-50 flex items-center gap-3 sm:justify-end">
                    <Button
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        disabled={bulkInitiateResult.isLoading}
                        className="bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primaryNew"
                        onClick={onConfirm}
                        loading={bulkInitiateResult.isLoading}
                        disabled={bulkInitiateResult.isLoading}
                        className="bg-gradient-to-r from-[#044866] to-[#0D5468] text-white shadow-lg shadow-[#044866]/20"
                        Icon={Send}
                    >
                        Initiate Now
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
