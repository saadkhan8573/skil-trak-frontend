import { ReactElement } from 'react'
import { SubAdminLayout } from '@layouts'
import { NextPageWithLayout, PermissionType } from '@types'
import { CreateAppointments } from '@partials/sub-admin'
import { withPermission } from '@components'

const CreateAppointment: NextPageWithLayout = () => {
    return <CreateAppointments />
}
CreateAppointment.getLayout = (page: ReactElement) => {
    return (
        <SubAdminLayout
            pageTitle={{
                title: 'Create Appointment',
                backTitle: 'Appointments',
            }}
        >
            {page}
        </SubAdminLayout>
    )
}

export default withPermission(CreateAppointment, {
    permissions: [PermissionType.MANAGE_APPOINTMENTS],
})
