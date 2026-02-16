import { SiteLayout } from '@layouts'
import { Entertainment } from '@partials'
import Head from 'next/head'
import { ReactElement } from 'react'

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
