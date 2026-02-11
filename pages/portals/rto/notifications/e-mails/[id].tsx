import { RtoLayout, RtoLayoutV2 } from '@layouts'
import { MailDetail } from '@partials/common/MailsListing'
import React, { ReactElement } from 'react'
import { BiEnvelope } from 'react-icons/bi'

const MailDetailPage = () => {
    return <MailDetail />
}

MailDetailPage.getLayout = (page: ReactElement) => {
    return (
        <RtoLayout
            pageTitle={{ title: 'Email Detail' }}
        >
            {page}
        </RtoLayout>
    )
}

export default MailDetailPage
