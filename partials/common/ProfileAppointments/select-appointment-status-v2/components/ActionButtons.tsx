import { Button } from '@components'

interface ActionButtonsProps {
    onClose: () => void
    isValid: boolean
    isLoading: boolean
}

export function ActionButtons({
    onClose,
    isValid,
    isLoading,
}: ActionButtonsProps) {
    return (
        <div className="flex gap-2 mt-4">
            <Button
                onClick={onClose}
                variant="error"
                outline
                className="flex-1 h-9 text-sm font-semibold border-2 hover:bg-slate-50"
            >
                Cancel
            </Button>
            <Button
                variant="primaryNew"
                submit
                disabled={!isValid || isLoading}
                loading={isLoading}
                className="flex-1 h-9 text-sm font-semibold bg-[#0D5468] hover:bg-[#0D5468]/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg disabled:shadow-none transition-all text-white"
            >
                Save & Confirm
            </Button>
        </div>
    )
}
