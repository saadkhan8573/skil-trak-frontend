import { ReactElement } from 'react'

//Layouts
import { SubAdminLayout } from '@layouts'
import { NextPageWithLayout } from '@types'

import { StudentProfile } from '@partials/student/pages'
import { useAdminLocalAccess } from '@hooks'

const StudentsProfile: NextPageWithLayout = () => {
    useAdminLocalAccess()
    return <StudentProfile />
}
StudentsProfile.getLayout = (page: ReactElement) => {
    return <SubAdminLayout>{page}</SubAdminLayout>
}

export default StudentsProfile
