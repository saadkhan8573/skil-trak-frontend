import { RtoLayoutV2 } from '@layouts'
import { RtoWpApprovalPlacements } from '@partials'
import { Users } from 'lucide-react'
import React, { ReactElement } from 'react'

const ApprovePlacementsPage = () => {
    return <RtoWpApprovalPlacements />
}

ApprovePlacementsPage.getLayout = (page: ReactElement) => {
    return <RtoLayoutV2 titleProps={{
        title: "Approve Placements",
        description: "Approve placements for students",
        Icon: Users
    }}>{page}</RtoLayoutV2>
}

export default ApprovePlacementsPage
