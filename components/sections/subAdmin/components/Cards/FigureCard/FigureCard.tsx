import Image from 'next/image'
// import CountUp from 'react-countup'

import { Card } from '@components/cards'
import Link from 'next/link'
import { PuffLoader } from 'react-spinners'

type FigureCardProps = {
    imageUrl?: string | undefined
    count: number
    title: string
    loading?: boolean
    link?: string
    Icon?: any
    iconClassName?: string
    onClick?: () => void
}

export const FigureCard = ({
    imageUrl,
    count,
    title,
    loading,
    link,
    onClick,
    iconClassName,
    Icon,
}: FigureCardProps) => {
    return (
        <Link
            href={link || '#'}
            className="w-full"
            onClick={() => {
                if (onClick) {
                    onClick()
                }
            }}>

            <Card>
                <div className="flex justify-between">
                    {Icon && !imageUrl && (
                        <Icon
                            className={`${
                                iconClassName || 'text-gray-400'
                            } `}
                            size={40}
                        />
                    )}
                    {imageUrl && !Icon && (
                        <div className="flex items-center gap-x-2 justify-between">
                            <Image
                                src={imageUrl || ''}
                                alt={title}
                                width={48}
                                height={48}
                            />
                        </div>
                    )}

                    <div className="flex flex-col items-end">
                        {loading ? (
                            <div className="h-[36px]">
                                <PuffLoader size={28} />
                            </div>
                        ) : (
                            <p className="text-3xl font-bold">
                                {/* <CountUp end={count} /> */}
                                {count || 0}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 leading-3 uppercase">
                            {title}
                        </p>
                    </div>
                </div>
            </Card>

        </Link>
    );
}
