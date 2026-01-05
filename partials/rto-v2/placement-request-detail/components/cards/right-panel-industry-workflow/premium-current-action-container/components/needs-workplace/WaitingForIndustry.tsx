import { AlertCircle, Building2 } from 'lucide-react'
import { Button } from '@components'
import { StatusWrapper } from '../StatusWrapper'

export const WaitingForIndustry = ({
    proofSkipped,
    workplaceType,
    setShowProofUploadDialog,
}: any) => (
    <StatusWrapper>
        <div className="p-4 bg-purple-50 border rounded-xl">
            <div className="flex gap-3">
                <Building2 className="h-5 w-5 text-purple-600" />
                <p className="font-medium">Awaiting Industry Confirmation</p>
            </div>
        </div>

        {proofSkipped && workplaceType === 'provided' && (
            <div className="p-3 bg-amber-50 border rounded-lg flex gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-1" />
                <div className="flex-1">
                    <p className="text-sm font-medium">
                        Proof of Employment Pending
                    </p>
                    <Button
                        outline
                        // size="sm"
                        onClick={() => setShowProofUploadDialog(true)}
                    >
                        Upload
                    </Button>
                </div>
            </div>
        )}
    </StatusWrapper>
)
