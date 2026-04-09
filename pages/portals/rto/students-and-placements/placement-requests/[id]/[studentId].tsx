import { withPermission } from '@components/Permissions/hooks'
import { RtoLayoutV2 } from '@layouts'
import { PlacementRequestDetail } from '@partials'
import { PermissionType } from '@types'
import React, { ReactElement } from 'react'

const PlacementRequestDetailPage = () => {
    return <PlacementRequestDetail />
}

PlacementRequestDetailPage.getLayout = (page: ReactElement) => {
    return <RtoLayoutV2 childrenClasses="!p-0 !md:p-0">{page}</RtoLayoutV2>
}

const ProtectedPlacementRequestDetailPage = withPermission(
    PlacementRequestDetailPage,
    {
        permissions: PermissionType.VIEW_PLACEMENT_PROFILE,
        redirectUrl: (query: any) =>
            `/portals/rto/students-and-placements/all-students/${query.studentId}/detail`,
    }
)

// Fail-safe: Explicitly re-assign the layout to the protected component
ProtectedPlacementRequestDetailPage.getLayout =
    PlacementRequestDetailPage.getLayout

export default ProtectedPlacementRequestDetailPage
