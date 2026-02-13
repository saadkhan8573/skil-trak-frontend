import React, { ReactElement } from 'react'
import { Entertainment } from '@partials'
import { SiteLayout } from '@layouts'
import Head from 'next/head'

const EntertainmentPage = () => {
    return (
        <>
            <Head>
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <Entertainment />
        </>
    )
}

EntertainmentPage.getLayout = (page: ReactElement) => {
    return <SiteLayout title="Entertainment">{page}</SiteLayout>
}

export default EntertainmentPage
