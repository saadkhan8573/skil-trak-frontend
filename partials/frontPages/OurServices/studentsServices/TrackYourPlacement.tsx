import { Typography } from '@components'
import Image from 'next/image'

export const TrackYourPlacement = () => {
    return (
        <>
            <div
                style={{
                    backgroundImage:
                        'url(/images/site/services/student-services/mobile/track-your-placement-mobile-app.png)',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                }}
                className="bg-[#F7A619]/80 flex flex-col md:flex-row items-center justify-between gap-y-6 rounded-xl max-w-7xl mx-auto md:px-10 px-4 py-4 md:py-8 my-20"
            >
                <div className="">
                    <Typography variant="h4" color={'text-primaryNew'} center>
                        TRACK YOUR Placement WITH SKILTRAK
                    </Typography>
                    <Typography variant="body" color={'text-primaryNew'} center>
                        We have made it easier for you. Take SkilTrak wherever
                        you go. Our Apps are user-friendly and designed to make
                        the placement experience hassle-free for you.
                    </Typography>
                </div>
                <div className="bg-[#616161] w-px h-32 mx-10 md:block hidden"></div>
                <div className="space-y-4">
                    <Typography variant="body" color={'text-white'} center>
                        Download the SkilTrak App
                    </Typography>
                    <div className="flex justify-center items-center gap-x-1.5 w-full">
                        <div className="w-28">
                            <Image
                                width={100}
                                height={100}
                                sizes="100vw"
                                alt="Skiltrak App"
                                className="object-contain bg-white"
                                style={{ width: 'auto', height: 'auto' }}
                                src={'/images/skiltrak_IOS.svg'}
                            />
                        </div>
                        <div className="w-28">
                            <Image
                                width={100}
                                height={100}
                                sizes="100vw"
                                alt="Skiltrak App"
                                className="object-contain bg-white"
                                style={{ width: 'auto', height: 'auto' }}
                                src={'/images/skiltrak_IOS.svg'}
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-x-4 mt-8 md:mt-6">
                        <a
                            className="cursor-pointer"
                            href="#"
                            rel={'noreferrer'}
                            target="_blank"
                        >
                            <div>
                                <Image
                                    src={'/images/google-play-button.svg'}
                                    alt="Skiltrak App"
                                    width={148}
                                    height={47}
                                    style={{ width: 'auto', height: 'auto' }}
                                />
                            </div>
                        </a>
                        <a
                            className="cursor-pointer"
                            href="https://apps.apple.com/pk/app/skiltrak/id6479631404"
                            rel={'noreferrer'}
                            target="_blank"
                        >
                            <div>
                                <Image
                                    src={'/images/download-btn.svg'}
                                    alt="Skiltrak App"
                                    width={148}
                                    height={47}
                                    style={{ width: 'auto', height: 'auto' }}
                                />
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}
