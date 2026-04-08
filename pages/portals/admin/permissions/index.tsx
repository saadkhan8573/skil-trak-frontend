import { useContextBar, useNavbar } from '@hooks'
import { AdminLayout } from '@layouts'
import { PermissionList } from '@partials/admin'
import { NextPageWithLayout } from '@types'
import { ReactElement, useEffect } from 'react'

const PermissionsPage: NextPageWithLayout = () => {
    const navBar = useNavbar()
    const contextBar = useContextBar()

    useEffect(() => {
        navBar.setTitle('Permissions Management')
        contextBar.hide()

        return () => {
            navBar.setTitle('')
        }
    }, [])

    return (
        <div className="p-4">
            <PermissionList />
        </div>
    )
}

PermissionsPage.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default PermissionsPage
