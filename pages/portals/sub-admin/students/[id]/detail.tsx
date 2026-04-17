import { ReactElement } from 'react'

//Layouts
import { SubAdminLayout } from '@layouts'
import { RtoStudentDetail } from '@partials'
import { NextPageWithLayout, PermissionType } from '@types'
import { withPermission } from '@components'

const StudentsProfileDetail: NextPageWithLayout = () => {
    return <RtoStudentDetail />
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
