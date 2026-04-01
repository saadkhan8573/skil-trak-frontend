import { ReactElement } from 'react'

// Layouts
import { RtoLayout } from '@layouts'
import { NextPageWithLayout } from '@types'

// Queries
import { ArchivedViewContainer } from '@partials/rto'

type Props = {}

const ViewArchived: NextPageWithLayout = (props: Props) => {
    return <ArchivedViewContainer role={'RTO'} />
}
ViewArchived.getLayout = (page: ReactElement) => {
    return (
        <RtoLayout
            pageTitle={{
                title: 'Assessment Tools',
            }}
        >
            {page}
        </RtoLayout>
    )
}

export default ViewArchived
