import { RtoApi } from '@queries'
import { useRouter } from 'next/router'
import { SubadminProfileDetail } from '@partials/admin/sub-admin'
import { EmptyData, LoadingAnimation, TechnicalError } from '@components'

export const CoordinatorDetail = () => {
    const router = useRouter()
    const { id } = router.query

    const subadminDetail = RtoApi.Coordinator.useDetail(Number(id), {
        skip: !id,
    })

    return (
        <div>
            {subadminDetail.isError ? <TechnicalError /> : null}
            {subadminDetail.isLoading ? (
                <LoadingAnimation height="h-[70vh]" />
            ) : subadminDetail?.data ? (
                <SubadminProfileDetail subadmin={subadminDetail?.data} />
            ) : subadminDetail.isSuccess ? (
                <EmptyData description="No Subadmin Detail were found!" />
            ) : null}
        </div>
    )
}
