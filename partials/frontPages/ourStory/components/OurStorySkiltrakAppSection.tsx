import { Typography } from '@components'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const OurStorySkiltrakAppSection = () => {
    return (
        <div className="gradient-bg-app-section overflow-hidden">
            <div className="mx-auto max-w-7xl ">
                <div className="flex items-center justify-between gap-8 flex-col md:flex-row">
                    <div>
                        <div className="flex flex-col gap-0.5 whitespace-nowrap mt-8 md:mt-0">
                            <Typography variant="h2">Skiltrak App</Typography>
                            <Typography variant="label" italic>
                                Exclusive access for students:
                            </Typography>
                            <Typography variant="label" bold italic>
                                Download Skiltrak App now!
                            </Typography>
                        </div>
                        <div className="flex items-center gap-x-4 mt-8 md:mt-6">
                            <Link className="cursor-pointer" href="#">
                                <div>
                                    <Image
                                        src={'/images/google-play-button.svg'}
                                        alt="Skiltrak App"
                                        width={106}
                                        height={34}
                                        style={{ height: 'auto' }}
                                    />
                                </div>
                            </Link>
                            <Link
                                className="cursor-pointer"
                                href="https://apps.apple.com/pk/app/skiltrak/id6479631404"
                            >
                                <div>
                                    <Image
                                        src={'/images/download-btn.svg'}
                                        alt="Skiltrak App"
                                        width={106}
                                        height={34}
                                        style={{ height: 'auto' }}
                                    />
                                </div>
                            </Link>
                        </div>

                        <div className="flex flex-col md:items-start items-center gap-1.5 w-full mt-8">
                            <div className="flex md:justify-start justify-center items-center gap-x-1.5 w-full">
                                <div className="w-36">
                                    <Image
                                        src={'/images/skiltrak_IOS.svg'}
                                        alt="Skiltrak App"
                                        width={206}
                                        height={206}
                                        sizes="100vw"
                                        className="object-contain"
                                    />
                                </div>
                                <div className="w-36">
                                    <Image
                                        src={'/images/scan-qr-code-text.svg'}
                                        alt="Skiltrak App"
                                        width={204}
                                        height={110}
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:mt-16 mt-20 ">
                        <Image
                            src={'/images/our-story/mobile-screens.png'}
                            alt="Twitter"
                            width={535}
                            height={572}
                            className="hidden md:block"
                            style={{ height: 'auto' }}
                        />
                        <Image
                            src={'/images/our-story/mobile-screens.png'}
                            alt="Twitter"
                            width={535}
                            height={572}
                            className="block md:hidden"
                            style={{ height: 'auto' }}
                        />
                    </div>
                    <div>
                        <Typography variant="body" italic>
                            Follow us
                        </Typography>
                        <div className="flex items-center gap-x-2.5 mt-2">
                            <a
                                href="https://www.linkedin.com/company/skiltrak/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Image
                                    src={'/images/our-story/linkedin-icon.svg'}
                                    alt="Twitter"
                                    width={32}
                                    height={32}
                                />
                            </a>

                            <a
                                href="https://www.facebook.com/skiltrak.com.au"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Image
                                    src={'/images/our-story/fb-icon.svg'}
                                    alt="Facebook"
                                    width={32}
                                    height={32}
                                />
                            </a>
                            <a
                                href="https://www.instagram.com/skiltrak/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Image
                                    src={'/images/our-story/insta-icon.svg'}
                                    alt="Instagram"
                                    width={32}
                                    height={32}
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
