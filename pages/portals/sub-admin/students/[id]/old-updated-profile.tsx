import { ReactElement } from 'react'

//Layouts
import { SubAdminLayout } from '@layouts'
import { NextPageWithLayout } from '@types'
import { StudentProfileDetail } from '@partials/common'
import { useAdminLocalAccess } from '@hooks'

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

export default StudentsProfileDetail
