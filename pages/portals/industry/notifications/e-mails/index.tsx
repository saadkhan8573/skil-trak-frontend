import { ReactElement } from 'react'
// Layouts
import { IndustryLayout } from '@layouts'
// Types
import { MailsListing } from '@partials/common/MailsListing'
import { NextPageWithLayout } from '@types'

const IndustryEmailsNotifications: NextPageWithLayout = () => {
    return <MailsListing />
}

IndustryEmailsNotifications.getLayout = (page: ReactElement) => {
    return (
        <IndustryLayout pageTitle={{ title: 'Notifications' }}>
            {page}
        </IndustryLayout>
    )
}

export default IndustryEmailsNotifications
