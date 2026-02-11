import React from 'react'
import { MdCheckCircle } from 'react-icons/md'
import { Typography } from '@components/Typography'
import dynamic from 'next/dynamic'

// Dynamically import Lottie with no SSR
const Lottie = dynamic(() => import('lottie-react'), {
    ssr: false,
})

interface NotificationMethodButtonProps {
    text: string
    onClick: () => void
    selected: boolean
    value: any
    animation: any
    vertical?: boolean
}
export const NotificationMethodButton = ({
    text,
    onClick,
    selected = false,
    value,
    animation,
    vertical,
}: NotificationMethodButtonProps) => {

    const iconClass = `transition-all duration-300 text-3xl ${selected ? 'text-orange-400' : 'text-gray-200'
        } `
    const checkIconClass = vertical ? `absolute top-2 right-2` : `relative`

    return (
        <div
            onClick={() => onClick()}
            className={`transition-all duration-300 flex ${vertical ? 'flex-col relative' : 'h-16'
                } items-center p-2 shadow-md rounded-lg w-full cursor-pointer border ${selected ? 'border-orange-400' : 'border-gray-100'
                }`}
        >
            <div>
                <Lottie
                    animationData={animation}
                    loop={true}
                    autoplay={true}
                    style={{ height: 90, width: 90 }}
                />
            </div>
            <div className="whitespace-nowrap px-2">
                <Typography variant={'subtitle'} center>
                    {text}
                </Typography>
            </div>
            <div className={`${checkIconClass} ${iconClass}`}>
                <MdCheckCircle />
            </div>
        </div>
    )
}
