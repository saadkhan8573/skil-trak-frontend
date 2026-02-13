/** @type {import('next').NextConfig} */

const nextConfig = {
    // reactStrictMode: true,
    env: {
        googleDirectionApi: 'AIzaSyB3Q7z-z5t-MYrBqXaqk7E24cxjaXABJdk',
        mapBoxApi: process.env.NEXT_PUBLIC_GOOGLE_DIRECTION_API || '',
        mapBoxApi: process.env.NEXT_PUBLIC_MAPBOX_API || '',
        cloudflareSiteKey: process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY || '',
        cloudflareSecretKey: process.env.CLOUDFLARE_SECRET_KEY || '',
        //cloudflareSecretKey: "0x4AAAAAAA73mQWvz8YzYY5jlZW3U1jCtv4"
    },
    async rewrites() {
        return {
            beforeFiles: [
                // These rewrites are checked after headers/redirects
                // and before all files including _next/public files which
                // allows overriding page files
                {
                    source: '/blogs/:slug/:id',
                    destination: '/blogs/:slug',
                },
                {
                    source: '/blogs/skiltrak-opening-doors-for-disability-course-students-with-specialized',
                    destination:
                        '/blogs/find-the-best-disability-course-placement-in-australia',
                },
                {
                    source: '/blogs/commercial-cookery-work-placements-skiltrak-opening-doors-for-culinary',
                    destination:
                        '/blogs/how-to-find-commercial-cookery-work-placements-in-australia',
                },
                {
                    source: '/blogs/the-advantages-of-outsourcing-placement-services-for-a-training-organi',
                    destination:
                        '/blogs/how-registered-training-organisations-rtos-can-ensure-compliance-durin',
                },
            ],
        }
    },
    images: {
        unoptimized: true,
        domains: [
            'skiltrak.org',
            'placeimg.com',
            'picsum.photos',
            'loremflickr.com',
            'skiltrak.com.au',
            'www.skiltrak.com.au',
            'images.unsplash.com',
            'hivedinn.s3.amazonaws.com',
            'skiltrak-dev.s3.amazonaws.com',
            'skiltrak-dev.s3.ap-southeast-2.amazonaws.com',
        ],
    },
    output: 'standalone',
    serverExternalPackages: [
        '@zoomus/websdk',
        'pdfjs-dist',
        'xlsx',
        'exceljs',
        'jspdf',
        'canvas',
    ],
    // compress: true,
    outputFileTracingExcludes: {
        '*': ['node_modules/canvas/**/*'],
    },
}
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
    openAnalyzer: false,
})
module.exports = withBundleAnalyzer(nextConfig)
// module.exports = nextConfig
