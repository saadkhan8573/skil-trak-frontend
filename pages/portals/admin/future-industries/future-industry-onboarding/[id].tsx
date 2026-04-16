import { AdminLayout } from '@layouts'
import { IndustryOnboardingFlow } from '@partials/industry-onboarding/IndustryOnboardingFlow'
import { NextPageWithLayout } from '@types'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'

const FutureIndustryOnboardingPage: NextPageWithLayout = () => {
    const router = useRouter()
    const industryId = router.query?.id

    return (
        <>
            {/* <ShowErrorNotifications result={registerResult} /> */}
            <IndustryOnboardingFlow id={industryId} />
        </>
    )
}

FutureIndustryOnboardingPage.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default FutureIndustryOnboardingPage
