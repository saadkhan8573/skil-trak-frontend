import {
    EmptyData,
    LoadingAnimation,
    Permissions,
    TechnicalError,
} from '@components'
import { AdminLayout } from '@layouts'
import { DynamicPermissionCard } from '@partials'
import { SubadminProfileDetail } from '@partials/admin/sub-admin'
import { AdminApi } from '@queries'
import { NextPageWithLayout, PermissionType } from '@types'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'

const SubadminDetail: NextPageWithLayout = () => {
    const router = useRouter()

    const subadminDetail = AdminApi.SubAdmins.useSubadminProfile(
        Number(router.query.id),
        {
            skip: !router.query?.id,
        }
    )

    return (
        <div className="p-4">
            {subadminDetail.isError ? <TechnicalError /> : null}
            {subadminDetail.isLoading ? (
                <LoadingAnimation height="h-[70vh]" />
            ) : subadminDetail?.data ? (
                <>
                    <SubadminProfileDetail subadmin={subadminDetail?.data} />
                    {/* Dynamic Permissions */}
                    <Permissions
                        permission={[PermissionType.UPDATE_RTO_PERMISSION]}
                    >
                        <DynamicPermissionCard
                            userId={subadminDetail?.data?.user?.id}
                        />
                    </Permissions>
                </>
            ) : subadminDetail.isSuccess ? (
                <EmptyData description="No Subadmin Detail were found!" />
            ) : null}
        </div>
    )
}

SubadminDetail.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default SubadminDetail
