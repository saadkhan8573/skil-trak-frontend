import { ReactElement, useEffect } from 'react'
// Layouts
import { SubAdminLayout } from '@layouts'
// Types
import { NextPageWithLayout, PermissionType } from '@types'

// Components
import {
    Button,
    RtoContextBarData,
    SidebarCalendar,
    withPermission,
} from '@components'
// Hooks
import { useContextBar } from '@hooks'
import { MailsListing } from '@partials/common/MailsListing'

const Notifications: NextPageWithLayout = () => {
    const { setContent } = useContextBar()

    useEffect(() => {
        setContent(
            <>
                <Button variant={'dark'} text={'My Schedule'} />
                <SidebarCalendar />
                <RtoContextBarData />
            </>
        )
    }, [setContent])

    return <MailsListing />
}

Notifications.getLayout = (page: ReactElement) => {
    return (
        <SubAdminLayout pageTitle={{ title: 'Mails' }}>{page}</SubAdminLayout>
    )
}

export default withPermission(Notifications, {
    permissions: [PermissionType.MANAGE_EMAILS],
})
