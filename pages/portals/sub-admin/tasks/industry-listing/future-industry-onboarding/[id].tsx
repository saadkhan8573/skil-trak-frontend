import { ReactElement } from 'react'
import { useRouter } from 'next/router'
import { SubAdminLayout } from '@layouts'
import { FutureIndustrySignUpForm } from '@partials/common'
import { ShowErrorNotifications } from '@components'
import { CommonApi } from '@queries'
import { useNotification } from '@hooks'
import { NextPageWithLayout } from '@types'
import { UserRoles } from '@constants'
import { IndustryOnboardingFlow } from '@partials/industry-onboarding/IndustryOnboardingFlow'

const FutureIndustryOnboardingPage: NextPageWithLayout = () => {
    const router = useRouter()
    const industryId = router.query?.id
    const { notification } = useNotification()

    return (
        <>
            {/* <ShowErrorNotifications result={registerResult} /> */}
            <IndustryOnboardingFlow id={industryId} />
        </>
    )
}

FutureIndustryOnboardingPage.getLayout = (page: ReactElement) => {
    return <SubAdminLayout>{page}</SubAdminLayout>
}

export default FutureIndustryOnboardingPage
