import { RtoLayoutV2 } from '@layouts'
import { ActionRequiredHeader } from '@partials/rto-v2/components'
import { SnoozedStudents } from '@partials/rto/student'
import { Clock } from 'lucide-react'
import { ReactElement } from 'react'

export const SnoozedPage = () => {
    return (
        <div>
            <ActionRequiredHeader
                icon={Clock}
                title="Snoozed Students"
                description="List of students temporarily snoozed for follow up"
                gradientFrom="amber-500"
                gradientTo="yellow-700"
                iconGradient="from-amber-400 to-amber-600"
            />
            <div className="mt-5">
                <SnoozedStudents />
            </div>
        </div>
    )
}

SnoozedPage.getLayout = (page: ReactElement) => {
    return (
        <RtoLayoutV2
            titleProps={{
                Icon: Clock,
                title: 'Snoozed Students',
                description: 'List of students temporarily snoozed',
            }}
        >
            {page}
        </RtoLayoutV2>
    )
}

export default SnoozedPage
