import { NextPageWithLayout, PermissionType } from '@types'
import { SubAdminLayout } from '@layouts'
import { TalentPoolStudentProfile } from '@partials/student/talentPool'
import { ReactElement, useEffect } from 'react'
import {
    Card,
    EmptyData,
    LoadingAnimation,
    TechnicalError,
    Typography,
    withPermission,
} from '@components'
import { AdminApi } from '@queries'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { isBrowser } from '@utils'
import { PageHeading } from '@components/headings'

const Profile: NextPageWithLayout = () => {
    const router = useRouter()
    const profileId = router?.query?.id as string
    const { data, isError, isLoading } =
        AdminApi.TalentPool.useGetTalentPoolProfile(profileId, {
            skip: !profileId,
        })

    return (
        <div className="p-5 flex flex-col gap-y-4 mb-32">
            <PageHeading
                title={'Talent Pool Profile'}
                subtitle={'Talent Pool Student Profile'}
            />

            {/* <div className="flex justify-end mb-4">
                <Link
                    href={'/portals/student/talent-pool/industry-request'}
                    className="inline-block bg-[#6971DD] px-4 py-1.5 rounded-md text-sm font-medium text-white"
                >
                    View Industry Request
                </Link>
            </div> */}
            {isError && <TechnicalError />}
            <Card noPadding>
                {isLoading ? (
                    <LoadingAnimation />
                ) : data && Object.keys(data).length > 0 ? (
                    <TalentPoolStudentProfile data={data} />
                ) : (
                    <EmptyData title={'No Data'} description="No Data" />
                )}
            </Card>
        </div>
    )
}

Profile.getLayout = (page: ReactElement) => {
    return <SubAdminLayout>{page}</SubAdminLayout>
}

export default withPermission(Profile, {
    permissions: [PermissionType.TALENT_POOL_ACCESS],
})
