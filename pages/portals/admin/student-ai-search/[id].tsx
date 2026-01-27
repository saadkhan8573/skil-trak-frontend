import { AdminLayout, RtoLayoutV2 } from '@layouts'
import { ReactElement, useEffect } from 'react'
import { StudentAiSearchDetail } from '@components'
import { useNavbar } from '@hooks'

const StudentAiSearchDetailPage = () => {
    const navbar = useNavbar()

    useEffect(() => {
        navbar.setTitle("Student Detail")
    }, [])

    return (
        <div className="p-4">
            <StudentAiSearchDetail />
        </div>
    )
}

StudentAiSearchDetailPage.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default StudentAiSearchDetailPage
