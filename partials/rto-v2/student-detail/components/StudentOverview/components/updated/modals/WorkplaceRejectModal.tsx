import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@components/ui/dialog'
import { Button, TextArea } from '@components'
import { AlertTriangle, X } from 'lucide-react'
import { SubAdminApi } from '@queries'
import { WpAppRequEnum } from '@partials/rto/wpApprovalReq/enum'
import { useNotification } from '@hooks'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

interface WorkplaceRejectModalProps {
    isOpen: boolean
    onClose: () => void
    id?: number
}

export function WorkplaceRejectModal({
    isOpen,
    onClose,
    id,
}: WorkplaceRejectModalProps) {
    const { notification } = useNotification()
    const [changeStatus, { isLoading }] =
        SubAdminApi.Workplace.updateWpIndustryStatus()

    const validationSchema = Yup.object({
        comment: Yup.string().required('Reason for rejection is required!'),
    })

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'all',
        defaultValues: {
            comment: '',
        },
    })

    const handleConfirm = async (values: any) => {
        if (!id) return

        try {
            const res: any = await changeStatus({
                id: id,
                status: WpAppRequEnum.DECLINED,
                ...values,
            })

            if (res?.data) {
                notification.success({
                    title: 'Declined',
                    description: 'Placement declined successfully.',
                })
                onClose()
                methods.reset()
            }
        } catch (error) {
            notification.error({
                title: 'Error',
                description: 'Failed to decline placement.',
            })
        }
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={() => {
                onClose()
                methods.reset()
            }}
        >
            <DialogContent className="max-w-lg p-0 overflow-hidden border-none rounded-2xl">
                <DialogHeader className="relative bg-linear-to-r from-orange-500 to-orange-600 px-6 py-4 rounded-t-2xl overflow-hidden space-y-0">
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
                    <div className="relative flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <X className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                            <DialogTitle className="text-xl font-bold text-white">
                                Reject Placement Request
                            </DialogTitle>
                            <p className="text-orange-100 text-sm mt-0.5">
                                This action requires confirmation
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(handleConfirm)}>
                        <div className="px-6 space-y-4">
                            <div className="bg-linear-to-br from-amber-50 to-orange-50 border-l-4 border-orange-400 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-orange-400 flex items-center justify-center shrink-0">
                                        <AlertTriangle className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-orange-900 mb-1">
                                            Important Notice
                                        </h4>
                                        <p className="text-xs text-orange-800 leading-relaxed">
                                            By rejecting this placement request:
                                        </p>
                                        <ul className="mt-2 space-y-1 text-xs text-orange-800">
                                            <li className="flex items-start gap-2">
                                                <span className="text-orange-500 mt-0.5">
                                                    •
                                                </span>
                                                <span>
                                                    Both{' '}
                                                    <strong>
                                                        industry and student
                                                    </strong>{' '}
                                                    will be notified via email
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-orange-500 mt-0.5">
                                                    •
                                                </span>
                                                <span>
                                                    The request will be marked
                                                    as <strong>rejected</strong>
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-orange-500 mt-0.5">
                                                    •
                                                </span>
                                                <span>
                                                    This action{' '}
                                                    <strong>
                                                        cannot be undone
                                                    </strong>
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <TextArea
                                    label={'Reason for Rejection'}
                                    name={'comment'}
                                    placeholder="Please provide a reason for rejecting this placement request..."
                                    rows={4}
                                    required
                                />
                                <p className="mt-1.5 text-xs text-slate-500">
                                    This comment will be included in the
                                    notification emails sent to all parties.
                                </p>
                            </div>
                        </div>

                        <DialogFooter className="px-6 py-4 bg-slate-50 rounded-b-2xl flex items-center justify-end gap-2 border-t border-slate-200">
                            <Button
                                outline
                                onClick={onClose}
                                disabled={isLoading}
                                className="px-4 py-2 text-sm border-slate-300 hover:bg-slate-100"
                            >
                                Cancel
                            </Button>
                            <Button
                                submit
                                disabled={isLoading}
                                className={`px-4 py-2 text-sm bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${isLoading ? 'cursor-wait' : ''}`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                        Rejecting...
                                    </>
                                ) : (
                                    <>
                                        <X className="w-4 h-4 mr-2" />
                                        Confirm Rejection
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}
