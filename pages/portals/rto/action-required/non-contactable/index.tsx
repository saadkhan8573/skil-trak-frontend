import { RtoLayoutV2 } from '@layouts'
import { ActionRequiredHeader } from '@partials/rto-v2/components'
import { NonContactableStudents } from '@partials/rto/student'
import { UserX, Clock, UserCheck } from 'lucide-react'
import { ReactElement } from 'react'
import { ConfigTabs } from '@components/ConfigTabs/ConfigTabs'

const ActiveNonContactable = () => <NonContactableStudents />
const ExpiredNonContactable = () => <NonContactableStudents params={`expired:${true}`} />

export const NonContactablePage = () => {
    const tabsConfig = [
        {
            value: 'active',
            label: 'Active Non Contactable',
            icon: UserCheck,
            component: ActiveNonContactable,
        },
        {
            value: 'expired',
            label: 'Expired Non Contactable',
            icon: Clock,
            component: ExpiredNonContactable,
        },
    ]

    return (
        <div>
            <ActionRequiredHeader
                icon={UserX}
                title="Non-Contactable Students"
                description="List of students marked as non-contactable"
                gradientFrom="red-500"
                gradientTo="red-700"
                iconGradient="from-red-500 to-red-700"
            />
            <div className="mt-5">
                <ConfigTabs tabs={tabsConfig} />
            </div>
        </div>
    )
}

NonContactablePage.getLayout = (page: ReactElement) => {
    return (
        <RtoLayoutV2
            titleProps={{
                Icon: UserX,
                title: 'Non-Contactable Students',
                description: 'List of students marked as non-contactable',
            }}
        >
            {page}
        </RtoLayoutV2>
    )
}

export default NonContactablePage
