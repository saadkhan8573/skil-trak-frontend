import { CoordinatorDetail } from '@partials'
import { RtoLayoutV2 } from '@layouts'
import { NextPageWithLayout } from '@types'
import { User } from 'lucide-react'
import { ReactElement } from 'react'

const Detail: NextPageWithLayout = () => {
    return <CoordinatorDetail />
}

Detail.getLayout = (page: ReactElement) => {
    return (
        <RtoLayoutV2
            titleProps={{
                Icon: User,
                title: 'Team Member Detail',
                description: 'View and manage team member details',
            }}
        >
            {page}
        </RtoLayoutV2>
    )
}

export default Detail
