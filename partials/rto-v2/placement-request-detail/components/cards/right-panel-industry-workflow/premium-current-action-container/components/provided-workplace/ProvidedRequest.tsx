import { Button } from '@components'
import { Building2 } from 'lucide-react'
import { StatusWrapper } from '../StatusWrapper'

export const ProvidedRequest = ({ setShowProvidedWorkplaceDialog }: any) => (
    <StatusWrapper>
        <div className="p-4 bg-blue-50 border rounded-xl">
            <p className="font-medium">Provided Workplace Request Created</p>
        </div>

        <Button onClick={() => setShowProvidedWorkplaceDialog(true)}>
            <Building2 className="mr-2 h-4 w-4" />
            Search Industry
        </Button>
    </StatusWrapper>
)
