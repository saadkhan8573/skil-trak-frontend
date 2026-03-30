'use client'
import { Button } from '@components'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@components/ui/dialog'
import { ArrowRight } from 'lucide-react'

interface ApproveIndustryEligibilityModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onProceed?: () => void
}

export const ApproveIndustryEligibilityModal = ({
    open,
    onOpenChange,
    onProceed,
}: ApproveIndustryEligibilityModalProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Approve Industry Eligibility</DialogTitle>
                    <DialogDescription className="pt-2 text-gray-600">
                        You will be redirected to the Industry Profile detail
                        page. You will need to approve the courses there, and
                        then your workplace will proceed.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-4 space-x-4 sm:gap-0">
                    <Button
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        className="border border-gray-300 shadow-sm"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="success"
                        onClick={() => {
                            onProceed?.()
                            onOpenChange(false)
                        }}
                        className="gap-2"
                    >
                        Proceed
                        <ArrowRight size={16} />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
