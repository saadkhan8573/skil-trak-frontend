import { useContextBar } from '@hooks'
import { SubAdminLayout } from '@layouts'
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
        <div>
            <ListingProfileDetails
                industry={data}
                onSetIndustryData={() => refetch()}
                isLoading={isLoading}
            />
        </div>
    )
}

IndustryListingDetails.getLayout = (page: ReactElement) => {
    return (
        <SubAdminLayout
            pageTitle={{
                navigateBack: true,
                title: 'Industry Listing Profile Details',
            }}
        >
            {page}
        </SubAdminLayout>
    )
}
export default IndustryListingDetails
