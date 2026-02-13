import { DisplayNotifications } from '@components'
import { Footer4, FooterVIII } from '@components/site'
import { Navbar2 } from '@components/site/navbar'
import TawkMessengerReact from '@tawk.to/tawk-messenger-react'
import Head from 'next/head'
import Script from 'next/script'
import { useRef } from 'react'

export const SiteLayout = ({ children, title }: any) => {
    const tawkMessengerRef = useRef<any>(null)

    const handleMinimize = () => {
        tawkMessengerRef?.current?.minimize()
    }

    return (
        <div>
            <Head>
                <title>{`${title || 'Home'}`}</title>
                <meta name="description" content="SkilTrak" key="desc" />
            </Head>
            <Script
                strategy="afterInteractive"
                src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
                async
            />

            <Navbar2 />
            {/* <div className="absolute z-[99999] top-0 left-0">
                <div className="flex items-center gap-x-5">
                    {' '}
                    <LottieAnimation
                        animation={Animations.Common.Snow}
                        autoplay
                        loop
                        height={500}
                        width={500}
                    />
                    <LottieAnimation
                        animation={Animations.Common.Snow}
                        autoplay
                        loop
                        height={500}
                        width={500}
                    />
                    <LottieAnimation
                        animation={Animations.Common.Snow}
                        autoplay
                        loop
                        height={500}
                        width={500}
                    />
                </div>
            </div> */}
            <DisplayNotifications />
            <main>{children}</main>
            {/* <Footer4 /> */}
            <FooterVIII />
            <div>
                <TawkMessengerReact
                    propertyId={'61b1f52ec82c976b71c091e2'}
                    widgetId={'1fmfibg61'}
                    useRef={tawkMessengerRef}
                    onBeforeLoad={() => { }}
                    onStatusChange={() => { }}
                    onChatMaximized={() => { }}
                    onChatMinimized={() => { }}
                    onChatHidden={() => { }}
                    onChatStarted={() => { }}
                    onChatEnded={() => { }}
                    onPrechatSubmit={() => { }}
                    onOfflineFormSubmit={() => { }}
                    onChatMessageVisitor={() => { }}
                    onChatMessageAgent={() => { }}
                    onChatMessageSystem={() => { }}
                    onAgentJoinChat={() => { }}
                    onAgentLeaveChat={() => { }}
                    onChatUnreadCountChange={() => { }}
                />
            </div>
        </div>
    )
}
