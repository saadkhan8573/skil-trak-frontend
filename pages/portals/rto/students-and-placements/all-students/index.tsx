import { withPermission } from '@components'
import { RtoLayoutV2 } from '@layouts'
import { RtoAllStudents } from '@partials'
import { PermissionType } from '@types'
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

export default withPermission(AllStudentsPage, {
    permissions: [PermissionType.ALL_STUDENTS],
})
