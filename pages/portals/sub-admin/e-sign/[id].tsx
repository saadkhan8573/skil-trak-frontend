import { withPermission } from '@components'
import { SubAdminLayout } from '@layouts'
import { ViewDocumentAndSign } from '@partials/eSign/ViewDocumentAndSign'
import { NextPageWithLayout, PermissionType } from '@types'
import { ReactElement } from 'react'

const ESignDetail: NextPageWithLayout = () => {
    return (
        <div>
            <ViewDocumentAndSign />
        </div>
    )
}

ESignDetail.getLayout = (page: ReactElement) => {
    return (
        <SubAdminLayout pageTitle={{ title: 'E-Sign Detail' }}>
            {page}
        </SubAdminLayout>
    )
}

export default withPermission(ESignDetail, {
    permissions: [PermissionType.SIGN_DOCUMENTS],
})
