import { StudentAiSearchDetail } from '@components'
import { SubAdminLayout } from '@layouts'
import { ReactElement } from 'react'

const StudentAiSearchDetailPage = () => {
    return (
        <div className="p-4">
            <StudentAiSearchDetail />
        </div>
    )
}

StudentAiSearchDetailPage.getLayout = (page: ReactElement) => {
    return <SubAdminLayout pageTitle={{ title: 'Student Ai Search Detail' }}>{page}</SubAdminLayout>
}

export default StudentAiSearchDetailPage
