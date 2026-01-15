import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@components/ui'
import { InsuranceDocuments } from '@partials/rto/insuranceDocuments/InsuranceDocuments'
import { User } from '@types'
import React from 'react'

export const RtoInsuranceDocModal = ({
    rtoUser,
    open,
    onOpenChange,
}: {
    rtoUser: User
    open: boolean
    onOpenChange: (open: boolean) => void
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-center text-slate-900">
                        RTO Insurance Document
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-6">
                    <InsuranceDocuments
                        rtoUser={rtoUser?.id}
                        studentProfile
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
