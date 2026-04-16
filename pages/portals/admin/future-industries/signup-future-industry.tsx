import { ShowErrorNotifications } from '@components'
import { useNotification } from '@hooks'
import { AdminLayout } from '@layouts'
import { FutureIndustrySignUpForm } from '@partials/common'
import { CommonApi } from '@queries'
import { NextPageWithLayout } from '@types'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'

const SignUpFutureIndustryPage: NextPageWithLayout = () => {
    const router = useRouter()

    const { notification } = useNotification()

    const [register, registerResult] =
        CommonApi.Industries.useRegisterByFutureIndustry()

    const onSubmit = (values: any) => {
        register({
            ...values,
            role: 'industry',
            sectors: values.sectors.map((s: any) => s.value),
            // courses: values.courses.map((c: any) => c.value),
        }).then((res: any) => {
            if (res?.data) {
                notification.success({
                    title: 'Industry Signed Up',
                    description: 'Industry Signed Up Successfully',
                })
                router.push(
                    `/portals/admin/future-industries/future-industry-onboarding/${res?.data?.id}`
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
    return <AdminLayout>{page}</AdminLayout>
}

export default SignUpFutureIndustryPage
