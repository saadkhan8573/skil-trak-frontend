import { ReactElement, useEffect } from 'react'
// Layouts
import { AdminLayout } from '@layouts'
// Types
import { NextPageWithLayout } from '@types'
import { TeamsDashboard } from '@partials/common'
import { useNavbar } from '@hooks'

const TeamsPage: NextPageWithLayout = () => {
    const navbar = useNavbar()

    useEffect(() => {
        navbar.setTitle('Teams Management')
    }, [])

    return <TeamsDashboard />
}

TeamsPage.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default TeamsPage
