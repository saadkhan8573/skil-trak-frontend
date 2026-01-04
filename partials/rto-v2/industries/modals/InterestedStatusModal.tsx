import { Button, ShowErrorNotifications, Typography } from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { RtoV2Api } from '@redux'
import { useNotification } from 'hooks/useNotification'
import { AlertCircle, CheckCircle2, Heart } from 'lucide-react'
import { useEffect } from 'react'

interface InterestedStatusModalProps {
    isOpen: boolean
    onClose: () => void
    industryId: number
    status: 'interested' | 'notInterested'
    industryName?: string
}

export function InterestedStatusModal({
    isOpen,
    onClose,
    industryId,
    status,
    industryName,
}: InterestedStatusModalProps) {
    const [updateInterestedType, updateResult] =
        RtoV2Api.Industries.updateInterestedType()
    const { notification } = useNotification()

    const isInterested = status === 'interested'

    useEffect(() => {
        if (updateResult.isSuccess) {
            notification.success({
                title: 'Status Updated',
                description: `Industry marked as ${isInterested ? 'Interested' : 'Not Interested'
                    } successfuly.`,
            })
            onClose()
        }
    }, [updateResult.isSuccess, onClose, isInterested])

    const handleConfirm = async () => {
        try {
            await updateInterestedType({
                industryId,
                status,
            }).unwrap()
        } catch (error) {
            console.error('Failed to update interest status:', error)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-none shadow-premium">
                <ShowErrorNotifications result={updateResult} />
                <DialogHeader className="bg-gradient-to-r from-[#044866] to-[#0D5468] p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Heart className="w-24 h-24" />
                    </div>
                    <div className="relative">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            {isInterested ? (
                                <CheckCircle2 className="w-6 h-6 text-success" />
                            ) : (
                                <AlertCircle className="w-6 h-6 text-warning" />
                            )}
                            Update Interest Status
                        </DialogTitle>
                        <DialogDescription className="text-white/80 mt-2">
                            {industryName ? (
                                <>
                                    Confirm the interest status for{' '}
                                    <span className="font-bold text-white">
                                        {industryName}
                                    </span>
                                </>
                            ) : (
                                'Confirm the interest status change'
                            )}
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="p-6 bg-white">
                    <Typography className="text-[#1A2332] text-center mb-6">
                        Are you sure you want to mark this industry as{' '}
                        <span
                            className={`font-bold ${isInterested ? 'text-success' : 'text-warning'
                                }`}
                        >
                            {isInterested ? 'Interested' : 'Not Interested'}
                        </span>
                        ?
                    </Typography>

                    <DialogFooter className="flex flex-row gap-3 sm:justify-center">
                        <Button
                            onClick={onClose}
                            variant="action"
                            className="flex-1 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200"
                            disabled={updateResult.isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            className={`flex-1 text-white shadow-lg hover:shadow-xl transition-all ${isInterested
                                    ? 'bg-gradient-to-r from-success to-success/80'
                                    : 'bg-gradient-to-r from-warning to-warning/80'
                                }`}
                            loading={updateResult.isLoading}
                            disabled={updateResult.isLoading}
                        >
                            {isInterested ? 'Mark Interested' : 'Mark Not Interested'}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
