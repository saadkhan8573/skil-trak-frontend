import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@components/ui/dialog'
import { Button } from '@components'
import { RtoV2Api } from '@queries'
import { useNotification } from '@hooks'
import { Loader2, AlertTriangle, Trash2 } from 'lucide-react'
import { useEffect } from 'react'

interface CancelInitiatedEsignModalProps {
    isOpen: boolean
    onClose: () => void
    industryId: number
    sectorId: number
    sectorName: string
    esignData: any
}

export function CancelInitiatedEsignModal({
    isOpen,
    onClose,
    industryId,
    sectorId,
    sectorName,
    esignData,
}: CancelInitiatedEsignModalProps) {
    const { notification } = useNotification()

    const [cancelEsign, { isLoading, isSuccess }] =
        RtoV2Api.Industries.cancelIndustryInitiatedESign()

    const handleCancel = async () => {
        try {
            await cancelEsign(esignData?.id).unwrap()
        } catch (error) {
            console.error('Failed to cancel e-sign:', error)
        }
    }

    useEffect(() => {
        if (isSuccess) {
            notification.success({
                title: 'E-sign Cancelled',
                description: `Initiated e-sign for ${sectorName} has been successfully cancelled.`,
            })
            onClose()
        }
    }, [isSuccess])

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden bg-white/95 backdrop-blur-xl rounded-[28px] border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]">
                {/* Header Section with Red Aesthetic */}
                <div className="relative h-32 bg-linear-to-br from-rose-500 via-red-500 to-red-600 overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 -left-4 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-0 -right-4 w-24 h-24 bg-red-300 rounded-full blur-2xl" />
                    </div>

                    <div className="relative h-full flex flex-col items-center justify-center text-white px-6 text-center">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-2 shadow-inner border border-white/30">
                            <AlertTriangle className="w-7 h-7 text-white drop-shadow-sm" />
                        </div>
                        <DialogTitle className="text-xl font-extrabold tracking-tight drop-shadow-md text-white">
                            Cancel E-sign Initiation
                        </DialogTitle>
                    </div>
                </div>

                <div className="p-8">
                    <DialogDescription className="text-slate-600 leading-relaxed mb-10 text-center">
                        Confirm cancellation for{' '}
                        <span className="font-extrabold text-[#1A2332] underline decoration-rose-500/30 decoration-4 underline-offset-2">
                            {sectorName}
                        </span>
                        ?<br />
                        <span className="text-sm mt-3 inline-block opacity-80">
                            The current signing process will be permanently
                            terminated. This action cannot be undone.
                        </span>
                    </DialogDescription>

                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            className="h-13 rounded-2xl border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            No, Keep it
                        </Button>
                        <Button
                            onClick={handleCancel}
                            disabled={isLoading}
                            className="h-13 rounded-2xl bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-xl shadow-red-500/25 font-bold transition-all hover:scale-[1.02] active:scale-[0.98] border-none flex items-center justify-center"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Trash2 className="w-5 h-5" />
                                    <span>Confirm</span>
                                </div>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
