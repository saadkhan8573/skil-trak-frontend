import { CheckCircle2 } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    Button,
} from '@components/ui'

interface IndustryDetailConfirmationModalProps {
    showAbnDialog: boolean
    setShowAbnDialog: (open: boolean) => void
    abnResult: {
        abn: string
        status: string
        businessName: string
        legalName: string
        address?: string
        postcode?: string
        state?: string
    } | null
    error?: any
    handleConfirmABN: () => void
}

export const IndustryDetailConfirmationModal = ({
    showAbnDialog,
    setShowAbnDialog,
    abnResult,
    error,
    handleConfirmABN,
}: IndustryDetailConfirmationModalProps) => {
    return (
        <Dialog open={showAbnDialog} onOpenChange={setShowAbnDialog}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {abnResult ? (
                            <>
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                Business Details Found
                            </>
                        ) : error ? (
                            <>
                                <CheckCircle2 className="h-5 w-5 text-red-500" />
                                Verification Error
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="h-5 w-5 text-red-500" />
                                No Details Found
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        {abnResult
                            ? 'Please confirm the details below are correct.'
                            : error
                              ? 'We encountered an error while verifying this ABN. Please check for typos or try again later.'
                              : 'We couldn’t find any business details for this ABN. Please check the ABN and try again or proceed manually.'}
                    </DialogDescription>
                </DialogHeader>

                {abnResult ? (
                    <div className="space-y-4 py-4">
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">ABN:</span>
                                <span className="font-medium">
                                    {abnResult.abn}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Status:</span>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {abnResult.status}
                                </span>
                            </div>
                        </div>

                        <div className="border-t pt-3 space-y-3">
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-xs text-gray-600 mb-1">
                                            Trading Name (will be used):
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                            {abnResult.legalName ||
                                                abnResult.businessName}
                                        </p>
                                    </div>
                                    {(abnResult as any).since && (
                                        <div className="pt-2 border-t border-blue-200">
                                            <p className="text-xs text-gray-600 mb-1">
                                                Registered Since:
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                {(abnResult as any).since}
                                            </p>
                                        </div>
                                    )}
                                    {(abnResult as any).area && (
                                        <div className="pt-2 border-t border-blue-200">
                                            <p className="text-xs text-gray-600 mb-1">
                                                Location:
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                {(abnResult as any).area}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                        <div className="bg-red-50 p-3 rounded-full">
                            <CheckCircle2 className="h-8 w-8 text-red-500" />
                        </div>
                        {error && (
                            <p className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-md border border-red-100 max-w-[300px]">
                                {(error as any)?.data?.message ||
                                    (error as any)?.message ||
                                    'An unexpected error occurred.'}
                            </p>
                        )}
                        <p className="text-sm text-gray-600 max-w-[250px]">
                            {error
                                ? 'Please try again or enter the details manually.'
                                : 'Try checking the ABN for any typos or enter the business name manually.'}
                        </p>
                    </div>
                )}

                <DialogFooter className="flex gap-2 sm:gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAbnDialog(false)}
                        className="flex-1"
                    >
                        {abnResult ? 'Edit ABN' : 'Back'}
                    </Button>
                    {abnResult && (
                        <Button
                            type="button"
                            onClick={handleConfirmABN}
                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                        >
                            {abnResult ? 'Confirm' : 'Proceed Manually'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
