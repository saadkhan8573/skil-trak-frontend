import { EmptyData, LoadingAnimation, TechnicalError } from '@components'
import { useAdminLocalAccess, useSubadminProfile } from '@hooks'
import { SubAdminLayout } from '@layouts'
import { IndustryProfileDetail } from '@partials/common'
import { useGetSubAdminIndustryProfileQuery } from '@queries'
import { NextPageWithLayout } from '@types'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'

const IndustryDetail: NextPageWithLayout = () => {
    const router = useRouter()
    const id = router.query?.id

    const industry = useGetSubAdminIndustryProfileQuery(Number(id), {
        skip: id === null || id === undefined,
    })
    const subadmin = useSubadminProfile()
    useAdminLocalAccess()

    return (
        <div>
            {industry.isError && <TechnicalError />}
            {industry.isLoading || industry?.isFetching ? (
                <LoadingAnimation height={'h-[70vh]'} />
            ) : industry.data ? (
                <IndustryProfileDetail
                    isHod={subadmin?.departmentMember?.isHod}
                    industry={industry?.data}
                />
            ) : (
                !industry.isError &&
                industry.isSuccess && (
                    <EmptyData
                        title={'No Industry Found'}
                        description={'No Industry Found on your request'}
                    />
                )
            )}
        </div>
    )
}

IndustryDetail.getLayout = (page: ReactElement) => {
    return <SubAdminLayout>{page}</SubAdminLayout>
}

export default IndustryDetail
