import { ReactElement } from 'react'

import { SubAdminLayout } from '@layouts'
import { SubadminESign } from '@partials/sub-admin'
import { NextPageWithLayout, PermissionType } from '@types'
import { withPermission } from '@components'

type Props = {}

const ESignnn: NextPageWithLayout = () => {
    return <SubadminESign />
}
ESignnn.getLayout = (page: ReactElement) => {
    return (
        <SubAdminLayout pageTitle={{ title: 'E-Sign' }}>{page}</SubAdminLayout>
    )
}

export default withPermission(ESignnn, {
    permissions: [PermissionType.SIGN_DOCUMENTS],
})
