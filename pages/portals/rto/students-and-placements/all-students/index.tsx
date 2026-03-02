import { RtoLayoutV2 } from '@layouts'
import { RtoAllStudents } from '@partials'
import { Users } from 'lucide-react'
import { ReactElement } from 'react'

const AllStudentsPage = () => {
    return <RtoAllStudents />
}

AllStudentsPage.getLayout = (page: ReactElement) => {
    return (
        <RtoLayoutV2
            titleProps={{
                Icon: Users,
                title: 'All Students',
                description: 'Manage all your students',
            }}
        >
            {page}
        </RtoLayoutV2>
    )
}

export default AllStudentsPage
