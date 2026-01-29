import { StarRating, Typography } from '@components'
import Image from 'next/image'

export const FindWorkplaces = ({ item, onClick }: any) => {
    const photoUrl = item?.photos && item?.photos[0]?.getUrl()
    return (
        <>
            <div className="rounded-md hover:shadow-lg bg-white -hover:translate-y-3 border border-solid flex gap-x-1 mb-2">
                <div>
                    <Image
                        className="h-32 w-60"
                        src={photoUrl || '/images/empty_image.png'}
                        width={100}
                        height={100}
                        alt="image"
                    />
                </div>
                <div
                    onClick={() => {
                        onClick && onClick()
                    }}
                    className="p-2 w-full cursor-pointer flex flex-col"
                >
                    <div>
                        <Typography variant="muted" color={'text-gray-600'}>
                            {item?.name || 'N/A'}
                        </Typography>
                    </div>
                    <div className="flex items-center gap-x-2 whitespace-nowrap">
                        <div className="pt-1">
                            <Typography variant="muted" color="text-gray-600">
                                {item?.rating || 'N/A'}
                            </Typography>
                        </div>

                        <StarRating
                            count={5}
                            value={item?.rating}
                            edit={false}
                            size={17}
                        />
                        <Typography variant="muted" color="text-gray-600">
                            ({item.user_ratings_total || 'N/A'})
                        </Typography>
                    </div>
                    <div>
                        <Typography variant="muted" color={'text-gray-600'}>
                            {item?.vicinity || 'N/A'}
                        </Typography>
                    </div>
                    <div>
                        <Typography variant="muted" color={'text-gray-600'}>
                            {item?.formatted_phone_number ||
                                item?.international_phone_number ||
                                'N/A'}
                        </Typography>
                    </div>
                    <div>
                        <a
                            className="text-xs text-blue-500"
                            href={item?.website || '#'}
                            target="_blank"
                            onClick={(e) => {
                                e.stopPropagation()
                            }}
                        >
                            visit website
                        </a>
                    </div>
                    <div>
                        <Typography variant="muted" color={'text-gray-600'}>
                            {item?.opening_hours?.open_now ? (
                                <span className="text-green-400 text-xs">
                                    Open
                                </span>
                            ) : (
                                <span className="text-red-400 text-xs">
                                    Closed
                                </span>
                            )}
                        </Typography>
                    </div>
                </div>
                <div className="p-2 w-1/6 flex items-end justify-end">
                    <a
                        target="_blank"
                        className="text-xs text-blue-500"
                        href={item?.url}
                    >
                        view
                    </a>
                </div>
            </div>
        </>
    )
}
