import { Card, StarRating, Typography } from '@components'
import { FaTimes } from 'react-icons/fa'

export const InfoBoxCard = ({ item, selectedBox, setSelectedBox }: any) => {
    const url =
        selectedBox.photos &&
        selectedBox?.photos[0]?.html_attributions?.map((attribution: any) => {
            const anchorTagRegex =
                /<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/i
            const match = attribution.match(anchorTagRegex)
            return match ? match[1] : null
        })
    const urlString = url && url[0]

    return (
        <Card noPadding>
            <div className="relative">
                <FaTimes
                    className="cursor-pointer absolute top-2 right-2"
                    onClick={() => {
                        setSelectedBox(null)
                    }}
                />
                <a className="cursor-pointer" href={urlString} target="_/">
                    <div className="flex flex-col gap-y-2 items-center">
                        {/* <div className='w-full'>
                            <Image
                                className="rounded-lg h-20"
                                src="https://picsum.photos/200/300"
                                width={100}
                                height={80}
                                alt="Workplace"
                            />
                        </div> */}
                        <div className="flex flex-col p-2">
                            <div>
                                <Typography
                                    variant="muted"
                                    color={'text-gray-600'}
                                >
                                    {selectedBox?.name}
                                </Typography>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <div className="pt-1">
                                    <Typography
                                        variant="label"
                                        color="text-gray-600"
                                    >
                                        {selectedBox?.rating || 'N/A'}
                                    </Typography>
                                </div>

                                <StarRating
                                    count={5}
                                    value={selectedBox?.rating}
                                    edit={false}
                                    size={17}
                                />
                                <Typography
                                    variant="muted"
                                    color="text-gray-600"
                                >
                                    ({selectedBox.user_ratings_total || 'N/A'})
                                </Typography>
                            </div>
                            <div>
                                <Typography
                                    variant="muted"
                                    color={'text-gray-600'}
                                >
                                    {selectedBox?.vicinity}
                                </Typography>
                            </div>
                            <div>
                                <Typography
                                    variant="muted"
                                    color={'text-gray-600'}
                                >
                                    {selectedBox?.opening_hours?.open_now ? (
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
                            {/* <div>
                        <Typography variant="label" color={'text-gray-600'}>
                            Dine-in Takeaway Delivery
                        </Typography>
                        </div> */}
                        </div>
                    </div>
                </a>
            </div>
        </Card>
    )
}
