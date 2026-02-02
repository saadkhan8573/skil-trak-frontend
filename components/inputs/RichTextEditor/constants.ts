export const SERVER_IMAGE_PREFIXES = [
    'https://skiltrak-dev.s3.ap-southeast-2.amazonaws.com/',
    'https://skiltrak-dev.s3.amazonaws.com/',
    'https://skiltrak-prod.s3.ap-southeast-2.amazonaws.com/',
    'https://skiltrak-prod.s3.amazonaws.com/',
]

export const isServerImageUrl = (url: string) => {
    if (!url) return false
    // Check specific prefixes
    if (SERVER_IMAGE_PREFIXES.some((prefix) => url.startsWith(prefix)))
        return true

    // Also check for loose keywords to be safe (e.g. if region changes or using cloudfront)
    return (
        url.includes('skiltrak') &&
        (url.includes('s3') || url.includes('amazonaws'))
    )
}
