import { ReactElement } from 'react'

import { IndustryLayout } from '@layouts'
import { IndustryUpdatedDashboard } from '@partials/industry'
import { NextPageWithLayout } from '@types'

const IndustryDashboard: NextPageWithLayout = () => {
    return <IndustryUpdatedDashboard />
}

IndustryDashboard.getLayout = (page: ReactElement) => {
    return <IndustryLayout>{page}</IndustryLayout>
}

export default IndustryDashboard
