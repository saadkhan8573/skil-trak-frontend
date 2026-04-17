import { ReactElement } from 'react'

//Layouts
import { SubAdminLayout } from '@layouts'
import { NextPageWithLayout, PermissionType } from '@types'
import { StudentProfileDetail } from '@partials/common'
import { useAdminLocalAccess } from '@hooks'
import { withPermission } from '@components'

const StudentsProfileDetail: NextPageWithLayout = () => {
    useAdminLocalAccess()
    return (
        <div>
            <StudentProfileDetail />
        </div>
    )
}
StudentsProfileDetail.getLayout = (page: ReactElement) => {
    return (
        <SubAdminLayout pageTitle={{ title: 'Student Profile' }}>
            {page}
        </SubAdminLayout>
    )
}

export default withPermission(StudentsProfileDetail, {
    permissions: [PermissionType.CAN_VIEW_STUDENT_DETAIL],
})
