import { AdminLayout, SubAdminLayout } from '@layouts'
import { PlacementRequestDetail } from '@partials'
import React, { ReactElement } from 'react'

const PlacementRequestDetailPage = () => {
    return <PlacementRequestDetail />
}

PlacementRequestDetailPage.getLayout = (page: ReactElement) => {
    return (
        <SubAdminLayout pageTitle={{ title: 'Workplace Detail' }}>
            {page}
        </SubAdminLayout>
    )
}

export default PlacementRequestDetailPage
