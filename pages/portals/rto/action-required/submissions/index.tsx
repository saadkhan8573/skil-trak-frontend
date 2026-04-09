import { ReactElement } from 'react'
import { RtoLayoutV2 } from '@layouts'
import { Submissions } from '@partials'
import { PermissionType } from '@types'
import { ClipboardList } from 'lucide-react'
import { withPermission } from '@components/Permissions/hooks'

const SubmissionsPage = () => {
    return <Submissions />
}
SubmissionsPage.getLayout = (page: ReactElement) => {
    return (
        <RtoLayoutV2
            titleProps={{
                Icon: ClipboardList,
                title: 'Submissions',
                description: 'Review student submissions',
            }}
        >
            {page}
        </RtoLayoutV2>
    )
}

export default withPermission(SubmissionsPage, {
    permissions: PermissionType.SUBMISSIONS,
})
