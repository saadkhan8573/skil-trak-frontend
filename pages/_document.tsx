import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'
export default function Document() {
    return (
        <Html lang="en">
            <Head>
                {process.env.NEXT_PUBLIC_NODE_ENV !== 'local' && (
                    <Script
                        id="sa-dynamic-optimization"
                        src="data:text/javascript;base64,dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoInNjcmlwdCIpO3NjcmlwdC5zZXRBdHRyaWJ1dGUoIm5vd3Byb2NrZXQiLCAiIik7c2NyaXB0LnNldEF0dHJpYnV0ZSgibml0cm8tZXhjbHVkZSIsICIiKTtzY3JpcHQuc3JjID0gImh0dHBzOi8vZGFzaGJvYXJkLnNlYXJjaGF0bGFzLmNvbS9zY3JpcHRzL2R5bmFtaWNfb3B0aW1pemF0aW9uLmpzIjtzY3JpcHQuZGF0YXNldC51dWlkID0gImQ4NTQwMDEzLTYwY2ItNDNkNi1hYTY0LTE4YWEzNjBiNzIzMCI7c2NyaXB0LmlkID0gInNhLWR5bmFtaWMtb3B0aW1pemF0aW9uLWxvYWRlciI7ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpOw=="
                        strategy="afterInteractive"
                        data-uuid="d8540013-60cb-43d6-aa64-18aa360b7230"
                    />
                )}
                <meta
                    name="google-site-verification"
                    content="GTslJTTqv87p3WbfdzlrmIId4pMc1vNepwDTHaOWpbc"
                />
            </Head>
            <body suppressHydrationWarning>
                <Main />
                <div id="portal" />
                <NextScript />
            </body>
        </Html>
    )
}
