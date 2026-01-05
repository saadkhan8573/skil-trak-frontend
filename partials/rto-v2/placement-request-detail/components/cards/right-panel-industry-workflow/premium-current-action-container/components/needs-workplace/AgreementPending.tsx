import { Button } from '@components'
import { FileSignature } from 'lucide-react'
import { StatusWrapper } from '../StatusWrapper'
import { AgreementModal } from '@partials/rto-v2/placement-request-detail/modal'

export const AgreementPending = ({
    workplace,
    student,
    showAgreementDialog,
    setShowAgreementDialog,
    requestStatusChange,
}: any) => {
    const handleConfirm = () => {
        requestStatusChange('Agreement Signed')
        setShowAgreementDialog(false)
    }

    return (
        <StatusWrapper>
            <div className="p-4 bg-indigo-50 border rounded-xl">
                <p className="font-medium">Agreement Pending</p>
            </div>

            <Button onClick={() => setShowAgreementDialog(true)}>
                <FileSignature className="mr-2 h-4 w-4" />
                Generate Agreement
            </Button>

            {showAgreementDialog && (
                <AgreementModal
                    open
                    workplace={workplace}
                    student={student}
                    onClose={() => setShowAgreementDialog(false)}
                    onConfirm={handleConfirm}
                />
            )}
        </StatusWrapper>
    )
}
