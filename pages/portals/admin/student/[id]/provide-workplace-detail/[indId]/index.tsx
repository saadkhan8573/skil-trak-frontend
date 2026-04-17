import { ReactElement } from 'react'

import { AdminLayout } from '@layouts'
import { NextPageWithLayout } from '@types'
import { useRouter } from 'next/router'
import { IndustryOnboardingFlow } from '@partials/industry-onboarding/IndustryOnboardingFlow'

// query

const ProvidedIndustryOnboardingPage: NextPageWithLayout = () => {
    const router = useRouter()
    const industryId = router.query?.indId
    return (
        <>
            <IndustryOnboardingFlow id={industryId} />
        </>
    )
}
ProvidedIndustryOnboardingPage.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default ProvidedIndustryOnboardingPage
