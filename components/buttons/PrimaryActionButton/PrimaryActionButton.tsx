import { LottieAnimation } from '@components/LottieAnimation'
import Link from 'next/link'
import { PermissionType } from '@types'

// components
import { Typography } from '@components'
import { PulseLoader } from 'react-spinners'

export interface PrimaryActionButtonProps {
    id?: string
    title: string
    badge?: { text: number; loading: boolean }
    image?: string
    animation: any
    shadow?: boolean
    description: string
    link: string | undefined
    permissions?: PermissionType[]
}

export const PrimaryActionButton = ({
    id,
    link,
    title,
    image,
    animation,
    description,
    shadow = true,
    badge,
}: PrimaryActionButtonProps) => {
    return (
        <Link
            href={`${link}` || '/under-construction'}
            className={`border flex justify-between items-center gap-x-1 md:gap-x-5 py-1 px-4 rounded-lg w-full cursor-pointer bg-white hover:bg-gray-50`}
            id={id}>

            <div className="flex-grow">
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-gray-400 text-xs whitespace-nowrap">
                    {description}
                </p>
            </div>
            <div className="relative">
                {image ? (
                    <img className="h-16" src={image} alt="Info" />
                ) : animation ? (
                    <div>
                        <LottieAnimation
                            animation={animation}
                            height={80}
                        />
                    </div>
                ) : (
                    <></>
                )}
                {badge && (
                    <div className="absolute top-0 right-0 bg-red-500 px-1 text-[11px] ml-2 font-medium min-w-[20px] flex items-center justify-center rounded transition-all duration-500">
                        <Typography variant={'xs'} color={'text-white'}>
                            {badge.loading ? (
                                <PulseLoader size={3} color={'#ffffff'} />
                            ) : (
                                badge?.text
                            )}
                        </Typography>
                    </div>
                )}
            </div>

        </Link>
    );
}
