import { PlacementCall } from '@types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@components/ui/dialog'
import { Button } from '@components/ui/button'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { CommonApi } from '@queries'
import { toast } from 'sonner'
import { useState } from 'react'

interface CompleteCallModalProps {
    call: PlacementCall
    onClose: () => void
}

export function CompleteCallModal({ call, onClose }: CompleteCallModalProps) {
    const [completeCall, { isLoading }] = CommonApi.CallManagement.useCompleteCallMutation()
    const [isSuccess, setIsSuccess] = useState(false)

    const handleComplete = async () => {
        try {
            await completeCall(String(call?.id)).unwrap()
            setIsSuccess(true)
            toast.success('Call marked as complete successfully!')

            // Close modal after a brief delay to show success state
            setTimeout(() => {
                onClose()
            }, 1000)
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to mark call as complete')
        }
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        {isSuccess ? (
                            <>
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                Call Completed
                            </>
                        ) : (
                            <>
                                <AlertCircle className="w-5 h-5 text-blue-600" />
                                Complete Call
                            </>
                        )}
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    {isSuccess ? (
                        <div className="text-center py-6">
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <p className="text-sm text-gray-600">
                                The call has been marked as complete.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Student:</span>
                                    <span className="font-medium">{call?.student?.user?.name || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Phone:</span>
                                    <span className="font-medium">{call?.student?.phone || 'N/A'}</span>
                                </div>
                                {call?.placementCompany && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Company:</span>
                                        <span className="font-medium">{call.placementCompany}</span>
                                    </div>
                                )}
                            </div>

                            <p className="text-sm text-gray-600">
                                Are you sure you want to mark this call as complete? This action will update the call status.
                            </p>
                        </div>
                    )}
                </div>

                {!isSuccess && (
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleComplete}
                            disabled={isLoading}
                            className="bg-[#044866] hover:bg-[#095a7d]"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Completing...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Complete Call
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}
