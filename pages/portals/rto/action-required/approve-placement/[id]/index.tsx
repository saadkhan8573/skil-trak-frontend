import { RtoLayoutV2 } from '@layouts'
import { CheckSquare } from 'lucide-react'
import React, { ReactElement } from 'react'
import { PlacementApprovalDetail } from '@partials'

const ApprovePlacementDetailPage = () => {
    return <PlacementApprovalDetail />
}

ApprovePlacementDetailPage.getLayout = (page: ReactElement) => {
    return (
        <RtoLayoutV2
            titleProps={{
                title: 'Detail',
                Icon: CheckSquare,
                description: 'Placement Approval Detail',
            }}
            childrenClasses="!p-0 !md:p-0"
        >
            {page}
        </RtoLayoutV2>
    )
}

export default ApprovePlacementDetailPage
