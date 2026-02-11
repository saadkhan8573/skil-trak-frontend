import { Typography } from '@components'
import React from 'react'
import { marked } from 'marked'

const isValidUrl = (url: any) => {
    const urlPattern =
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
    return urlPattern.test(url)
}

const getCleanExternalUrl = (url: string | undefined | null): string => {
    if (!url) return '#'

    // Remove any prefix of the current domain
    const cleanUrl = url.replace(/^(https?:\/\/)?(skiltrak\.com\.au\/)?/, '')

    // Add 'https://' if no protocol is present
    return cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`
}

export const ViewCourseRequestDetailsModal = ({
    description,
    reference,
}: any) => {
    const rawText = description || ''
    const parsedHtml = String(marked.parse(rawText))

    return (
        <div className="flex flex-col gap-y-4 min-w-96 min-h-48">
            <div className="flex justify-center">
                <Typography variant="title">Course Details</Typography>
            </div>
            <div className="">
                <Typography variant="body" semibold>
                    Description:
                </Typography>
                {/* <Typography variant="body">{description ?? 'N/A'}</Typography> */}
                <div className="">
                    <div
                        className="w-full customTailwingStyles-inline-style customTailwingStyles text-xs  !bg-transparent leading-relaxed"
                        dangerouslySetInnerHTML={{
                            __html: parsedHtml || 'No description available',
                        }}
                    />
                </div>
            </div>
            <div className="">
                <Typography variant="body" semibold>
                    Reference:
                </Typography>
                {isValidUrl(reference?.[0]) ? (
                    <a
                        href={getCleanExternalUrl(reference?.[0])}
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {getCleanExternalUrl(reference?.[0]) || 'N/A'}
                    </a>
                ) : (
                    <span>{reference?.[0] ?? 'N/A'}</span>
                )}
            </div>
        </div>
    )
}
