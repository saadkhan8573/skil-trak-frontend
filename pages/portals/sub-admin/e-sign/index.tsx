import { ReactElement } from 'react'

import { SubAdminLayout } from '@layouts'
import { SubadminESign } from '@partials/sub-admin'
import { NextPageWithLayout, PermissionType } from '@types'
import { withPermission } from '@components'

const ESign: NextPageWithLayout = () => {
    return <SubadminESign />
}
ESign.getLayout = (page: ReactElement) => {
    return (
        <SubAdminLayout pageTitle={{ title: 'E-Sign' }}>{page}</SubAdminLayout>
    )
}

export default withPermission(ESign, {
    permissions: [PermissionType.SIGN_DOCUMENTS],
})
