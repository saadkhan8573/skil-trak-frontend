import { CoordinatorDetail } from '@partials'
import { RtoLayoutV2 } from '@layouts'
import { NextPageWithLayout, PermissionType } from '@types'
import { User } from 'lucide-react'
import { ReactElement } from 'react'
import { withPermission } from '@components'

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

export default withPermission(Detail, {
    permissions: [PermissionType.TEAM_MANAGEMENT],
})
