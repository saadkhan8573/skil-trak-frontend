// Icons
import { MdCancel } from 'react-icons/md'

// components

import dynamic from 'next/dynamic'
import { useState } from 'react'
const ReactPlayer = dynamic<any>(() => import('react-player'), { ssr: false })
// import ReactPlayer from 'react-player'

// Icons
import { BsFillPlayCircleFill } from 'react-icons/bs'

// utills
import { isBrowser } from '@utils'
import { AuthorizedUserComponent } from '@components/AuthorizedUserComponent'
import { UserRoles } from '@constants'
import { Portal } from '@components/Portal'

interface VideoPlayModalProps {
    url: string
    onCancelButtonClick?: () => void
    downloadUrl: string
}

export const VideoPlayModal = ({
    downloadUrl,
    url,
    onCancelButtonClick,
}: VideoPlayModalProps) => {
    const [video, setVideo] = useState({
        url: null,
        pip: false,
        playing: true,
        controls: true,
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

    const onReady = () => {
        setVideo((preVal) => ({
            ...preVal,
            light: false,
        }))
    }

    return (
        <Portal>
            <div className="bg-[#00000050] w-full h-screen flex items-start justify-center fixed top-0 left-0 z-40 overflow-scroll py-16">
                <div className="bg-white rounded-2xl flex flex-col justify-between shadow-md min-w-[450px] overflow-hidden">
                    <div className="px-2 py-1 flex justify-end items-center">
                        {/* <div>
                        <Typography variant={'title'}>{title}</Typography>
                        <Typography variant={'subtitle'} color={'text-muted'}>
                            {subtitle}
                        </Typography>
                    </div> */}
                        <MdCancel
                            onClick={onCancelButtonClick}
                            className="transition-all duration-300 text-gray-400 hover:text-black text-2xl cursor-pointer"
                        />
                    </div>

                    <AuthorizedUserComponent
                        excludeRoles={[UserRoles.OBSERVER]}
                    >
                        <div>
                            <a
                                href={downloadUrl}
                                className="text-sm font-semibold text-info"
                            >
                                Download
                            </a>
                        </div>
                    </AuthorizedUserComponent>

                    <div className="w-full relative">
                        {isBrowser() && (
                            <div>
                                <ReactPlayer
                                    onReady={onReady}
                                    src={url}
                                    playing
                                    config={{
                                        file: {
                                            attributes: {
                                                controlsList: 'nodownload',
                                            },
                                        },
                                    } as any}
                                    controls
                                    playIcon={
                                        <div className="w-full h-full flex justify-center items-center relative">
                                            <BsFillPlayCircleFill className="text-4xl text-white absolute top-12 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                        </div>
                                    }
                                />
                            </div>
                        )}
                    </div>

                    {/* <div className="flex justify-end items-end gap-x-4 px-4 py-2">
                    <Button variant={'secondary'} onClick={onCancelButtonClick}>
                        {'Cancel'}
                    </Button>
                </div> */}
                </div>
            </div>
        </Portal>
    )
}
