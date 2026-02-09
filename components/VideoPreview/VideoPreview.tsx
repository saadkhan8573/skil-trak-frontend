import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

// Icons
import { BsFillPlayCircleFill } from 'react-icons/bs'

// utills
import { isBrowser } from '@utils'

export const VideoPreview = ({ url }: { url: any }) => {
    const tempUrlSplit = url?.split('https://')
    // const tempUrl = `https://www.${tempUrlSplit[1]}`
    const tempUrl = url
    const [thumbnail, setThumbnail] = useState('')

    const [video, setVideo] = useState({
        url: null,
        pip: false,
        playing: true,
        controls: false,
        light: true,
        volume: 0.8,
        muted: false,
        played: 0,
        loaded: 0,
        duration: null,
        secondsElapsed: null,
        playbackRate: 1.0,
        loop: false,
    })

    useEffect(() => {
        setVideo((preVal) => ({
            ...preVal,
            light: true,
        }))
    }, [url])

    useEffect(() => {
        const getVideoThumbnail = async () => {
            const videoThumbnail: any = await generateVideoThumbnail(tempUrl)
            setThumbnail(videoThumbnail)
        }
        getVideoThumbnail()
    }, [url])

    const generateVideoThumbnail = (file: any) => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas')
            const video = document.createElement('video')
            video.crossOrigin = '*'

            // this is important
            video.autoplay = true
            video.muted = true
            video.src = file

            video.onloadeddata = () => {
                const ctx = canvas.getContext('2d')

                canvas.width = video.videoWidth
                canvas.height = video.videoHeight

                if (ctx)
                    ctx.drawImage(
                        video,
                        0,
                        0,
                        video.videoWidth,
                        video.videoHeight
                    )

                video.pause()
                return resolve(canvas.toDataURL('image/png'))
            }
        })
    }

    const onReady = () => {
        setVideo((preVal) => ({
            ...preVal,
            light: false,
        }))
    }

    return (
        <div className="w-full h-full">
            {isBrowser() && (
                <ReactPlayer
                    onReady={onReady}
                    src={tempUrl}
                    width="100%"
                    height="100%"
                    playing={video.playing}
                    volume={video.volume}
                    config={{
                        file: { attributes: { controlsList: 'nodownload' } },
                    } as any}
                    controls
                    playIcon={
                        <div className="w-full h-full flex justify-center items-center relative">
                            <BsFillPlayCircleFill className="text-4xl text-white absolute top-12 left-1/2 -translate-x-1/2 -translate-y-1/2" />

                            {/* generating thumbnail for video */}
                            {!url?.split('.').includes('youtube') && (
                                <img
                                    className="w-full h-full object-cover"
                                    src={thumbnail}
                                    alt=""
                                />
                            )}
                        </div>
                    }
                    light={video.light}
                />
            )}
        </div>
    )
}
