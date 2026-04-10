import { RtoLayoutV2 } from '@layouts'
import { ActionRequiredHeader } from '@partials/rto-v2/components'
import { IncompleteSubmissionStudent } from '@partials/rto/student'
import { FileWarning } from 'lucide-react'
import { ReactElement } from 'react'

export const IncompleteSubmissionPage = () => {
    return (
        <div>
            <ActionRequiredHeader
                icon={FileWarning}
                title="Incomplete Submissions"
                description="List of students with incomplete submissions"
                gradientFrom="orange-500"
                gradientTo="orange-700"
                iconGradient="from-orange-500 to-orange-700"
            />
            <div className="mt-5">
                <IncompleteSubmissionStudent />
            </div>
        </div>
    )
}

IncompleteSubmissionPage.getLayout = (page: ReactElement) => {
    return (
        <RtoLayoutV2
            titleProps={{
                Icon: FileWarning,
                title: 'Incomplete Submissions',
                description: 'List of students with incomplete submissions',
            }}
        >
            {page}
        </RtoLayoutV2>
    )
}

export default IncompleteSubmissionPage
