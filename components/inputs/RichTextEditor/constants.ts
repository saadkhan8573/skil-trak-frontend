export const SERVER_IMAGE_PREFIXES = [
    'https://skiltrak-dev.s3.ap-southeast-2.amazonaws.com/',
    'https://skiltrak-dev.s3.amazonaws.com/',
    'https://skiltrak-prod.s3.ap-southeast-2.amazonaws.com/',
    'https://skiltrak-prod.s3.amazonaws.com/',
]

export const isServerImageUrl = (url: string) => {
    if (!url) return false
    // Also check if it contains skiltrak and s3 for broader coverage
    const isInternal =
        SERVER_IMAGE_PREFIXES.some((prefix) => url.startsWith(prefix)) ||
        (url.includes('skiltrak') && url.includes('s3'))
    return isInternal
}
