import { RtoLayoutV2 } from '@layouts'
import { ActionRequiredHeader } from '@partials/rto-v2/components'
import { NonContactableStudents } from '@partials/rto/student'
import { UserX } from 'lucide-react'
import { ReactElement } from 'react'

export const NonContactablePage = () => {
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
                <NonContactableStudents />
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
