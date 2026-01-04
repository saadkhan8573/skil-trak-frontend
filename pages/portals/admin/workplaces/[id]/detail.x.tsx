import { RtoLayoutV2 } from '@layouts'
import { PlacementRequestDetail } from '@partials'
import React, { ReactElement } from 'react'

const PlacementRequestDetailPage = () => {
    return <PlacementRequestDetail />
}

PlacementRequestDetailPage.getLayout = (page: ReactElement) => {
    return <RtoLayoutV2 childrenClasses="!p-0 !md:p-0">{page}</RtoLayoutV2>
}

export default PlacementRequestDetailPage
