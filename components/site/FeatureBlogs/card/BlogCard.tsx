import { Typography } from '@components/Typography'
import { ellipsisText, HtmlToPlainText } from '@utils'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import { MediaQueries } from '@constants'

export const BlogCard = ({ blog }: { blog: any }) => {
    const isMobile = useMediaQuery(MediaQueries.Mobile)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <div className="shadow-site rounded-xl p-2.5 bg-white">
            <div className="h-48 w-full rounded-2xl overflow-hidden">
                <Link href={`/blogs/${blog?.slug}`}>
                    <Image
                        src={blog?.featuredImage}
                        alt="blog-card"
                        width={0}
                        height={0}
                        sizes="100vw 100vh"
                        className="w-full h-full object-cover"
                    />
                </Link>
            </div>

            {/*  */}
            <div className="p-1.5 mt-4 flex flex-col gap-y-4">
                <Link href={`/blogs/${blog?.slug}`}>
                    <Typography color="text-[#3E3232]" medium>
                        {blog?.title}
                    </Typography>
                </Link>
                <div className="h-12">
                    <Typography variant="label" color={'text-[#3E323280]'}>
                        {mounted && isMobile
                            ? ellipsisText(HtmlToPlainText(blog?.content), 45)
                            : ellipsisText(HtmlToPlainText(blog?.content), 77)}
                    </Typography>
                </div>
            </div>

            {/*  */}
            <div className="bg-[#F5F5F5] px-4 py-3 rounded-xl">
                <Typography variant="label" medium color="text-[#3E3232]">
                    {moment(blog?.updatedAt, [moment.ISO_8601, 'YYYY-MM-DD', 'MM-DD-YYYY', 'DD-MM-YYYY']).format('MMMM DD, YYYY')}
                </Typography>
                <Typography variant="small" color="text-[#3E323280]">
                    Published by {blog?.author}
                </Typography>
            </div>
        </div>
    )
}
