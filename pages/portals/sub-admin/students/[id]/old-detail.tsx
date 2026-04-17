import { ReactElement } from 'react'

//Layouts
import { SubAdminLayout } from '@layouts'
import { NextPageWithLayout, PermissionType } from '@types'

import { StudentProfile } from '@partials/student/pages'
import { useAdminLocalAccess } from '@hooks'
import { withPermission } from '@components'

const StudentsProfile: NextPageWithLayout = () => {
    useAdminLocalAccess()
    return <StudentProfile />
}
StudentsProfile.getLayout = (page: ReactElement) => {
    return <SubAdminLayout>{page}</SubAdminLayout>
}

export default withPermission(StudentsProfile, {
    permissions: [PermissionType.CAN_VIEW_STUDENT_DETAIL],
})
