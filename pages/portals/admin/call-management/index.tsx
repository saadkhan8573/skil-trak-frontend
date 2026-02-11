import { AdminLayout } from '@layouts'
import { AiCallsManagement } from '@partials/common'
import { ReactElement } from 'react'

const CallManagementPage = () => {
    return (
        <AiCallsManagement />
    )
}

CallManagementPage.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default CallManagementPage
