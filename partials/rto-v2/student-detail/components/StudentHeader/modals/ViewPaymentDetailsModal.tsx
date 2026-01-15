import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@components/ui/dialog'
import { AdminApi } from '@queries'
import {
    X,
    DollarSign,
    Calendar,
    Mail,
    CreditCard,
    CheckCircle,
    Clock,
    User,
    Wallet,
} from 'lucide-react'
import { Button, LoadingAnimation, NoData } from '@components'

interface ViewPaymentDetailsModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    studentId: number
}

export function ViewPaymentDetailsModal({
    open,
    onOpenChange,
    studentId,
}: ViewPaymentDetailsModalProps) {
    const { data, isLoading, isError } =
        AdminApi.Students.useStudentPaymentDetails(studentId, {
            skip: !studentId,
        })

    const formatDate = (dateString: any) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const formatAmount = (amount: any) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'AUD',
        }).format(amount)
    }

    const getStatusColor = (status: any) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'failed':
                return 'bg-red-100 text-red-800 border-red-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const getStatusIcon = (status: any) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return <CheckCircle className="w-4 h-4" />
            case 'pending':
                return <Clock className="w-4 h-4" />
            default:
                return <Clock className="w-4 h-4" />
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-2xl !p-0 bg-white rounded-2xl shadow-2xl overflow-hidden gap-0 border-none">
                <DialogHeader className="bg-gradient-to-r from-[#044866] to-[#0D5468] p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-white font-bold text-lg">
                                Payment Details
                            </DialogTitle>
                            <p className="text-white/80 text-xs">
                                Transaction information history
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-6">
                    {isLoading && (
                        <div className="flex items-center justify-center py-12">
                            <LoadingAnimation />
                        </div>
                    )}

                    {isError && (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="bg-red-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    <X className="w-8 h-8 text-red-600" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Error Loading Payment
                                </h3>
                                <p className="text-gray-600">
                                    Unable to load payment details. Please try
                                    again.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar px-1">
                        {data && !isLoading && !isError && data.length > 0 ? (
                            data?.map((payment: any, index: number) => (
                                <div key={index} className="space-y-4 border rounded-xl p-4 bg-slate-50/50">
                                    {/* Status and Amount */}
                                    <div className="bg-white border rounded-lg p-4 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <span
                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                                            payment?.status
                                                        )}`}
                                                    >
                                                        {getStatusIcon(
                                                            payment.status
                                                        )}
                                                        <span className="ml-1 capitalize">
                                                            {payment?.status}
                                                        </span>
                                                    </span>
                                                    {payment?.isActive && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                                            Active
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                                    Payment Status
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-gray-900">
                                                    {formatAmount(
                                                        payment?.amount
                                                    )}
                                                </p>
                                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                                    Amount
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-blue-50 p-2 rounded-lg">
                                                    <User className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 text-sm">
                                                        Payment ID
                                                    </h4>
                                                    <p className="text-xs text-gray-600">
                                                        #{payment?.id}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-purple-50 p-2 rounded-lg">
                                                    <CreditCard className="w-4 h-4 text-purple-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 text-sm">
                                                        Intent ID
                                                    </h4>
                                                    <p className="text-xs text-gray-600 font-mono truncate max-w-[150px]" title={payment?.intentId}>
                                                        {payment?.intentId}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-green-50 p-2 rounded-lg">
                                                <Mail className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900 text-sm">
                                                    Email Address
                                                </h4>
                                                <p className="text-xs text-gray-600">
                                                    {payment?.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Timestamps */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-orange-50 p-2 rounded-lg">
                                                    <Calendar className="w-4 h-4 text-orange-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 text-sm">
                                                        Created
                                                    </h4>
                                                    <p className="text-xs text-gray-600">
                                                        {formatDate(
                                                            payment?.createdAt
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-indigo-50 p-2 rounded-lg">
                                                    <Calendar className="w-4 h-4 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 text-sm">
                                                        Last Updated
                                                    </h4>
                                                    <p className="text-xs text-gray-600">
                                                        {formatDate(
                                                            payment?.updatedAt
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            !isLoading && !isError && (
                                <NoData text="No payment details available." />
                            )
                        )}
                    </div>

                    <div className="mt-4 flex justify-end">
                        <Button
                            variant="secondary"
                            outline
                            onClick={() => onOpenChange(false)}
                            className="px-6"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
