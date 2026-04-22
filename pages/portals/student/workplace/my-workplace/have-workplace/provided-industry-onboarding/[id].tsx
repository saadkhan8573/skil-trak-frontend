import { ReactElement } from 'react'

import { StudentLayout } from '@layouts'
import { NextPageWithLayout } from '@types'
import { useRouter } from 'next/router'
import { IndustryOnboardingFlow } from '@partials/industry-onboarding/IndustryOnboardingFlow'

// query

const ProvidedIndustryOnboardingPage: NextPageWithLayout = () => {
    const router = useRouter()
    const industryId = router.query?.id
    return <IndustryOnboardingFlow id={industryId} />
}
ProvidedIndustryOnboardingPage.getLayout = (page: ReactElement) => {
    return (
        <StudentLayout pageTitle={{ title: 'Industry Onboarding' }}>
            {page}
        </StudentLayout>
    )
}

export default ProvidedIndustryOnboardingPage
