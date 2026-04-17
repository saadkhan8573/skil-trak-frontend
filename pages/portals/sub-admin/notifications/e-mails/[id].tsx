import { withPermission } from '@components'
import { SubAdminLayout } from '@layouts'
import { MailDetail } from '@partials/common/MailsListing'
import { NextPageWithLayout, PermissionType } from '@types'
import { ReactElement } from 'react'

const EmailDetail: NextPageWithLayout = () => {
    return <MailDetail />
}

EmailDetail.getLayout = (page: ReactElement) => {
    return (
        <SubAdminLayout pageTitle={{ title: 'Mail Detail' }}>
            {page}
        </SubAdminLayout>
    )
}

export default withPermission(EmailDetail, {
    permissions: [PermissionType.MANAGE_EMAILS],
})
