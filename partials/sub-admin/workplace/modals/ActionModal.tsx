import { Button, Typography, Portal } from '@components'

export const ActionModalType = {
    primary: 'text-orange-500',
    secondary: 'text-slate-500',
    info: 'text-indigo-500',
    error: 'text-red-500',
    action: 'action',
    dark: 'text-slate-700',
    success: 'text-green-500',
}

export const ActionModal = ({
    title,
    subtitle,
    Icon,
    confirmText,
    variant = 'primary',
    onCancel,
    onConfirm,
    loading,
}: {
    title?: string
    subtitle?: string
    confirmText?: string
    Icon?: any
    variant?: any
    onCancel: () => void
    onConfirm?: Function
    loading?: boolean
}) => {
    return (
        <Portal zIndex={40}>
            <div className="bg-[#00000050] w-full h-screen flex items-center justify-center fixed top-0 left-0 z-40">
                <div className="bg-white modal-animation rounded-2xl flex flex-col items-center gap-y-6 shadow-xl min-w-[450px] max-w-lg px-16 py-4">
                    <div className="flex flex-col gap-y-2 justify-center items-center">
                        {Icon && (
                            <div
                                className={`${(ActionModalType as any)[variant]
                                    }`}
                            >
                                <Icon size={48} />
                            </div>
                        )}
                        <Typography variant={'title'}>
                            {title || 'Are You Sure'}
                        </Typography>
                        <Typography variant={'label'} center>
                            {subtitle || 'Are You Sure'}
                        </Typography>
                    </div>

                    <div className="flex gap-x-4 items-center">
                        <Button
                            text="Cancel"
                            variant="secondary"
                            onClick={() => {
                                onCancel && onCancel()
                            }}
                        />
                        <Button
                            text={confirmText || 'Confirm'}
                            variant={variant}
                            disabled={loading}
                            onClick={() => {
                                onConfirm ? onConfirm() : onCancel()
                            }}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>
        </Portal>
    )
}
