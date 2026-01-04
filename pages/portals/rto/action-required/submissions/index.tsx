import { RtoLayoutV2 } from '@layouts'
import { Submissions } from '@partials'
import { ClipboardList } from 'lucide-react'
import React, { ReactElement } from 'react'

const SubmissionsPage = () => {
    return (
        <div>
            <Submissions />
        </div>
    )
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

export default SubmissionsPage
