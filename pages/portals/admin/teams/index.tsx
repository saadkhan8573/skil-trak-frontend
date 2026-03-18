import { ReactElement } from 'react'
// Layouts
import { AdminLayout } from '@layouts'
// Types
import { NextPageWithLayout } from '@types'
import { TeamsDashboard } from '@partials/common'

const TeamsPage: NextPageWithLayout = () => {
    return <TeamsDashboard />
}

TeamsPage.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default TeamsPage
