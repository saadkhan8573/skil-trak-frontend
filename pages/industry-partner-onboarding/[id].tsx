import { IndustryOnboardingFlow } from '@partials/industry-onboarding/IndustryOnboardingFlow'
import { NextPageWithLayout } from '@types'
import { useRouter } from 'next/router'

const IndustryPartnerOnboarding: NextPageWithLayout = () => {
    const { query } = useRouter()
    return <IndustryOnboardingFlow id={query.id} />
}

export default IndustryPartnerOnboarding
