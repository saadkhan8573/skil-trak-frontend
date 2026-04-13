import { ReactElement } from 'react'
import { RtoEmails } from '@partials'
import { RtoLayoutV2 } from '@layouts'
import { BiEnvelope } from 'react-icons/bi'
import { withPermission } from '@components'
import { PermissionType } from '@types'

const MailsPage = () => {
    return <RtoEmails />
}

MailsPage.getLayout = (page: ReactElement) => {
    return (
        <RtoLayoutV2
            titleProps={{
                Icon: BiEnvelope,
                title: 'Emails',
                description: 'Manage all your RTO communications',
            }}
        >
            {page}
        </RtoLayoutV2>
    )
}

export default withPermission(MailsPage, {
    permissions: [PermissionType.MANAGE_EMAILS],
})
