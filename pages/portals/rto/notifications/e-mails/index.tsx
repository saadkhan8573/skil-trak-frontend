import { ReactElement } from 'react'
// Layouts
import { RtoLayout } from '@layouts'
// Types
import { RtoEmails } from '@partials'
import { NextPageWithLayout } from '@types'

const RtoEmailsNotifications: NextPageWithLayout = () => {
    return <RtoEmails />
}

RtoEmailsNotifications.getLayout = (page: ReactElement) => {
    return (
        <RtoLayout pageTitle={{ title: 'Notifications' }}>
            {page}
        </RtoLayout>
    )
}

export default RtoEmailsNotifications
