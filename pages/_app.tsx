import { NextPageWithLayout } from '@types'
import type { AppProps } from 'next/app'
import '../styles/animations.css'
import '../styles/globals.css'
import '../styles/site.css'
import '../styles/rich-text.css'

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

import { ContextReducer } from '@components'

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
    const getLayout = Component.getLayout ?? ((page) => page)

    return (
        <ContextReducer>
            {getLayout(<Component {...pageProps} />)}
        </ContextReducer>
    )
}

export default MyApp
