import { RtoLayoutV2 } from '@layouts'
import { RtoStudentDetail } from '@partials'
import { User } from 'lucide-react'
import { ReactElement } from 'react'

const RtoStudentDetailPage = () => {
    return <RtoStudentDetail />
}

RtoStudentDetailPage.getLayout = (page: ReactElement) => {
    return (
        <RtoLayoutV2
            titleProps={{
                Icon: User,
                title: 'Students',
                description: 'Manage student profiles and placements',
            }}
            childrenClasses="!p-0 !md:p-0"
        >
            {page}
        </RtoLayoutV2>
    )
}

export default RtoStudentDetailPage
