import { GlobalModal } from '@components/Modal/GlobalModal'
import { Button, Typography } from '@components'
import { TextArea } from '@components/inputs/TextArea'
import { Pause, Ban, StopCircle, AlertCircle } from 'lucide-react'
import { MdCancel } from 'react-icons/md'

interface QuickActionsModalProps {
    open: boolean
    onClose: () => void
    selectedAction: string
    reason: string
    onReasonChange: (reason: string) => void
}

export function QuickActionsModal({
    open,
    onClose,
    selectedAction,
    reason,
    onReasonChange,
}: QuickActionsModalProps) {
    if (!open) return null

    const getIcon = () => {
        if (selectedAction === 'On Hold') return Pause
        if (selectedAction === 'Cancelled') return Ban
        if (selectedAction === 'Terminated') return StopCircle
        return Pause
    }

    const getDescription = () => {
        if (selectedAction === 'On Hold')
            return 'Temporarily pause this placement. It can be resumed later.'
        if (selectedAction === 'Cancelled')
            return 'Cancel this placement request. This action cannot be undone.'
        if (selectedAction === 'Terminated')
            return 'Terminate this active placement. This action cannot be undone.'
        return ''
    }

    const getWarningMessage = () => {
        if (selectedAction === 'On Hold')
            return 'The placement will be paused but can be reactivated anytime.'
        if (selectedAction === 'Cancelled')
            return 'Once cancelled, this placement request cannot be reactivated.'
        if (selectedAction === 'Terminated')
            return 'Once terminated, this placement cannot be reactivated. All data will be archived.'
        return ''
    }

    const Icon = getIcon()
    const isWarning = selectedAction !== 'On Hold'

    return (
        <GlobalModal onCancel={onClose} className="sm:max-w-[500px]">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4 pb-4 border-b">
                    <div>
                        <Typography
                            variant="h3"
                            className="text-amber-600 text-xl flex items-center gap-2"
                        >
                            <Icon className="h-5 w-5" />
                            {selectedAction} Placement
                        </Typography>
                        <Typography
                            variant="small"
                            className="text-gray-600 mt-1"
                        >
                            {getDescription()}
                        </Typography>
                    </div>
                    <MdCancel
                        onClick={onClose}
                        className="transition-all duration-500 text-gray-400 hover:text-black text-3xl cursor-pointer hover:rotate-90"
                    />
                </div>

                <div className="space-y-4 py-4">
                    <div
                        className={`p-4 border rounded-lg ${
                            selectedAction === 'On Hold'
                                ? 'bg-amber-50 border-amber-200'
                                : 'bg-red-50 border-red-200'
                        }`}
                    >
                        <div className="flex items-start gap-2">
                            <AlertCircle
                                className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                                    selectedAction === 'On Hold'
                                        ? 'text-amber-600'
                                        : 'text-red-400'
                                }`}
                            />
                            <div>
                                <Typography
                                    variant="label"
                                    className={`font-medium text-sm ${
                                        selectedAction === 'On Hold'
                                            ? 'text-amber-900'
                                            : 'text-red-900'
                                    }`}
                                >
                                    {selectedAction === 'On Hold'
                                        ? 'Note'
                                        : 'Warning'}
                                </Typography>
                                <Typography
                                    variant="small"
                                    className={`mt-1 ${
                                        selectedAction === 'On Hold'
                                            ? 'text-amber-700'
                                            : 'text-red-700'
                                    }`}
                                >
                                    {getWarningMessage()}
                                </Typography>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Typography
                            variant="label"
                            className="text-sm font-medium"
                        >
                            Reason *
                        </Typography>
                        <TextArea
                            name="quickActionReason"
                            placeholder={`Why are you marking this placement as ${selectedAction.toLowerCase()}?`}
                            className="mt-2"
                            rows={5}
                            value={reason}
                            onChange={(e: any) =>
                                onReasonChange(e.target.value)
                            }
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                    <Button
                        variant="secondary"
                        onClick={() => {
                            onClose()
                            onReasonChange('')
                        }}
                        text="Cancel"
                    />
                    <Button
                        variant={isWarning ? 'error' : 'primaryNew'}
                        // onClick={onConfirm}
                        Icon={Icon}
                        text={`Confirm ${selectedAction}`}
                    />
                </div>
            </div>
        </GlobalModal>
    )
}
