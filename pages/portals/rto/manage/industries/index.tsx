import { withPermission } from '@components'
import { RtoLayoutV2 } from '@layouts'
import { RtoUpdatedIndustries } from '@partials'
import { PermissionType } from '@types'
import { Building2 } from 'lucide-react'
import { ReactElement } from 'react'

const IndustriesPage = () => {
    return <RtoUpdatedIndustries />
}

IndustriesPage.getLayout = (page: ReactElement) => {
    return (
        <RtoLayoutV2
            titleProps={{
                Icon: Building2,
                title: 'Industries',
                description: 'Manage all your Industries',
            }}
        >
            {page}
        </RtoLayoutV2>
    )
}

export default withPermission(IndustriesPage, {
    permissions: [PermissionType.LIST_ALL_INDUSTRIES],
})
