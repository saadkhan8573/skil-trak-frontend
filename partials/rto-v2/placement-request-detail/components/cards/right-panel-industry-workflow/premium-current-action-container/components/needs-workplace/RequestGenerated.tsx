import { Button } from '@components'
import { Sparkles } from 'lucide-react'
import { WPProcessMatchingLoader } from '@partials/common/StudentProfileDetail/components/Workplace/components/IndustryDetail/components/WPProcessMatchingLoader'
import { StatusWrapper } from '../StatusWrapper'

export const RequestGenerated = ({
    workplace,
    autoApplyLoader,
    onReRunAutomation,
}: any) => (
    <StatusWrapper>
        {autoApplyLoader ? (
            <WPProcessMatchingLoader />
        ) : (
            <>
                <div className="p-4 bg-blue-50 border rounded-xl">
                    <p className="font-medium">Workplace Request Created</p>
                    <p className="text-sm">
                        Choose how to find a suitable industry.
                    </p>
                </div>

                {workplace?.workplaceApprovaleRequest?.length === 0 && (
                    <Button variant={'primaryNew'} onClick={onReRunAutomation}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Re-Run Automation
                    </Button>
                )}
            </>
        )}
    </StatusWrapper>
)
