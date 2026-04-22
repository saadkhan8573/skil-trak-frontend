/** @type {import('next').NextConfig} */

const nextConfig = {
    // reactStrictMode: true,
    env: {
        googleDirectionApi: process.env.NEXT_PUBLIC_GOOGLE_DIRECTION_API || '',
        mapBoxApi: process.env.NEXT_PUBLIC_MAPBOX_API || '',
        cloudflareSiteKey: process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY || '',
        cloudflareSecretKey: process.env.CLOUDFLARE_SECRET_KEY || '',
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                ],
            },
        ]
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
        unoptimized: false,
        remotePatterns: [
            { protocol: 'https', hostname: 'skiltrak.org' },
            { protocol: 'https', hostname: 'placeimg.com' },
            { protocol: 'https', hostname: 'picsum.photos' },
            { protocol: 'https', hostname: 'loremflickr.com' },
            { protocol: 'https', hostname: 'skiltrak.com.au' },
            { protocol: 'https', hostname: 'www.skiltrak.com.au' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'hivedinn.s3.amazonaws.com' },
            { protocol: 'https', hostname: 'skiltrak-dev.s3.amazonaws.com' },
            {
                protocol: 'https',
                hostname: 'skiltrak-dev.s3.ap-southeast-2.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: 'skiltrak02.s3.ap-southeast-2.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: 'flagcdn.com',
            },
        ],
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60,
    },
    allowedDevOrigins: ['192.168.1.16'],
    output: 'standalone',
    compiler: {
        styledComponents: true,
    },
    experimental: {
        optimizePackageImports: [
            '@radix-ui/react-*',
            'lodash-es',
            'lucide-react',
        ],
    },
    serverExternalPackages: [
        '@zoomus/websdk',
        'pdfjs-dist',
        'react-pdf',
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
