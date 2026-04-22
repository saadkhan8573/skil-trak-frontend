import { AdminLayout } from '@layouts'
import { SectorClusters } from '@partials'
import { NextPageWithLayout } from '@types'
import { ReactElement } from 'react'

const AddCluster: NextPageWithLayout = () => {
    return <SectorClusters />
}
AddCluster.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default AddCluster
