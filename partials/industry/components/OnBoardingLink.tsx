import { Typography } from '@components'
import { IoIosCheckmark } from 'react-icons/io'
import Image from 'next/image'

type Props = {
    text: any
    onClick: any
    selected: any
    value: any
    animation: any
    vertical: any
}
export const OnBoardingLink = ({
    text,
    onClick,
    selected,
    value,
    animation,
    vertical,
}: Props) => {
    const animationOptions = {
        loop: true,
        autoplay: true,
        animationData: animation,
    }

    const iconClass = `text-2xl ${selected
        ? 'opacity-100 text-white bg-teal-500 rounded-lg'
        : 'opacity-100 text-gray-400 bg-white border rounded-lg '
        } `
    const checkIconClass = vertical ? `absolute top-5 right-4` : `relative`

    return (
        <div
            onClick={() => onClick(value)}
            className={`flex ${vertical
                ? 'flex-col relative justify-center items-center'
                : 'h-16'
                } items-center w-full cursor-pointer border ${selected ? 'border-teal-600' : 'border-transparent'
                } bg-white rounded-lg shadow-md px-14 py-6 `}
        >
            <div>
                <Image
                    src={`${animation}`}
                    alt="Icons"
                    height={40}
                    width={40}
                    className="mb-2.5"
                />
            </div>
            <Typography variant={'subtitle'} color={'info'} center>
                {text}
            </Typography>
            <div className={`${checkIconClass} ${iconClass}`}>
                <IoIosCheckmark />
            </div>
        </div>
    )
}
