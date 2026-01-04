import { AdminLayout } from '@layouts'
import { PlacementRequestDetail } from '@partials'
import React, { ReactElement } from 'react'

const PlacementRequestDetailPage = () => {
    return <PlacementRequestDetail />
}

PlacementRequestDetailPage.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default PlacementRequestDetailPage
