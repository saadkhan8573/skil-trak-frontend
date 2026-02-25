import { AdminLayout } from '@layouts'
import { MarketingListing } from '@partials/admin/marketing'
import React, { ReactElement } from 'react'

const Marketing = () => {
    return <MarketingListing />
}

Marketing.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default Marketing