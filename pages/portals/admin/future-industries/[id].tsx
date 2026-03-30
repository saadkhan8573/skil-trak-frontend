import { PageTitle } from '@components'
import { AdminLayout } from '@layouts'
import { ListingProfileDetails } from '@partials/common'
import { CommonApi } from '@queries'
import { NextPageWithLayout } from '@types'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'

const IndustryListingDetails: NextPageWithLayout = () => {
    const router = useRouter()
    const id = router.query.id

    const { data, isLoading, refetch } =
        CommonApi.FindWorkplace.useIndustryListingProfileDetails(id, {
            skip: !id,
        })

    return (
        <div className="p-5">
            <PageTitle title="Industry Listing Details" backTitle="Back" />
            <div className="mt-8">
                <ListingProfileDetails
                    industry={data}
                    onSetIndustryData={() => refetch()}
                    isLoading={isLoading}
                />
            </div>
        </div>
    )
}

IndustryListingDetails.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}
export default IndustryListingDetails
