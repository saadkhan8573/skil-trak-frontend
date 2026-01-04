import { ReactElement } from 'react'
//Layouts
import { SubAdminLayout } from '@layouts'
import { NextPageWithLayout } from '@types'

//components
import { LoadingAnimation, TechnicalError } from '@components'
// queries

import {
    RtoCoordinatorsIndustries,
    SubadminIndustries,
    SubAdminUpdatedIndustries,
} from '@partials/sub-admin/Industries'
//query
import { SubAdminApi } from '@queries'

type Props = {}

const Industries: NextPageWithLayout = (props: Props) => {
    const profile = SubAdminApi.SubAdmin.useProfile()

    return (
        <>
            <div>
                {profile?.isError && <TechnicalError />}
                {profile.isLoading ? (
                    <LoadingAnimation />
                ) : profile?.isSuccess ? (
                    profile?.data?.isAssociatedWithRto ? (
                        <RtoCoordinatorsIndustries />
                    ) : (
                        <SubAdminUpdatedIndustries />
                    )
                ) : null}
            </div>
        </>
    )
}
Industries.getLayout = (page: ReactElement) => {
    return (
        <SubAdminLayout pageTitle={{ title: 'Industries' }}>
            {page}
        </SubAdminLayout>
    )
}

export default Industries
