import { ReactElement } from 'react'
import { useRouter } from 'next/router'
import { SubAdminLayout } from '@layouts'
import { FutureIndustrySignUpForm } from '@partials/common'
import { ShowErrorNotifications } from '@components'
import { CommonApi } from '@queries'
import { useNotification } from '@hooks'
import { NextPageWithLayout } from '@types'
import { UserRoles } from '@constants'

const SignUpFutureIndustryPage: NextPageWithLayout = () => {
    const router = useRouter()

    const { notification } = useNotification()

    const [register, registerResult] =
        CommonApi.Industries.useRegisterByFutureIndustry()

    const onSubmit = (values: any) => {
        register({
            ...values,
            role: UserRoles.INDUSTRY,
            sectors: values.sectors.map((s: any) => s.value),
            // courses: values.courses.map((c: any) => c.value),
        }).then((res: any) => {
            if (res?.data) {
                notification.success({
                    title: 'Industry Signed Up',
                    description: 'Industry Signed Up Successfully',
                })
                router.push(
                    `/portals/sub-admin/tasks/industry-listing/future-industry-onboarding/${res?.data?.id}`
                )
            }
        })
    }
    return (
        <>
            <ShowErrorNotifications result={registerResult} />
            <FutureIndustrySignUpForm
                onSubmit={onSubmit}
                result={registerResult}
            />
        </>
    )
}

SignUpFutureIndustryPage.getLayout = (page: ReactElement) => {
    return <SubAdminLayout>{page}</SubAdminLayout>
}

export default SignUpFutureIndustryPage
