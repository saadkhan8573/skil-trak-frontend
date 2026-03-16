import { PageTitle } from '@components'
import { useContextBar } from '@hooks'
import { AdminLayout } from '@layouts'
import { CBListingProfile, ListingProfileDetails } from '@partials/common'
import { CommonApi } from '@queries'
import { NextPageWithLayout } from '@types'
import { useRouter } from 'next/router'
import { ReactElement, useEffect } from 'react'

const IndustryListingDetails: NextPageWithLayout = () => {
    const contextBar = useContextBar()
    const router = useRouter()
    const id = router.query.id

    const { data, isSuccess, isLoading, refetch } =
        CommonApi.FindWorkplace.useIndustryListingProfileDetails(id, {
            skip: !id,
        })

    // useEffect(() => {
    //     if (isSuccess) {
    //         contextBar.show(false)
    //         contextBar.setContent(<CBListingProfile industry={data} />)
    //     }

    //     return () => {
    //         contextBar.setContent(null)
    //         contextBar.hide()
    //     }
    // }, [data])

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
